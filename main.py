from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # can alter with time
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Home Page"})


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.users: list[str] = []

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.users.append(client_id)
        await self.send_clients_list()

    async def disconnect(self, websocket: WebSocket, client_id: str):
        self.active_connections.remove(websocket)
        self.users.remove(client_id)
        await self.send_clients_list()

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
            
    async def send_clients_list(self):
        clients_list = ",".join(map(str, self.users))
        for connection in self.active_connections:
            await connection.send_text(f"Connected clients: {clients_list}")


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{client_id} says: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(websocket, client_id)