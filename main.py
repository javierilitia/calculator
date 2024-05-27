from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
<head>
    <title>Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        #chat-container {
            display: flex;
            flex-direction: row;
            flex: 1;
        }
        #messages {
            flex: 3;
            padding: 10px;
            overflow-y: auto;
            border-right: 1px solid #ddd;
        }
        #users {
            flex: 1;
            padding: 10px;
            border-left: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        #message-form {
            display: flex;
            padding: 10px;
            border-top: 1px solid #ddd;
        }
        #messageText {
            flex: 1;
            padding: 10px;
            font-size: 16px;
        }
        .message {
            display: flex;
            margin: 5px 0;
        }
        .message.received {
            justify-content: flex-start;
        }
        .message.sent {
            justify-content: flex-end;
        }
        .message .content {
            max-width: 70%;
            padding: 10px;
            border-radius: 5px;
        }
        .message.received .content {
            background-color: #e1ffc7;
        }
        .message.sent .content {
            background-color: #dcf8c6;
        }
    </style>
</head>
<body>
    <h1>WebSocket Chat</h1>
    <h2>Your ID: <span id="ws-id"></span></h2>
    <div id="chat-container">
        <div id="messages"></div>
        <div id="users">
            <h3>Connected Users</h3>
            <ul id="user-list"></ul>
        </div>
    </div>
    <form id="message-form" action="" onsubmit="sendMessage(event)">
        <input type="text" id="messageText" autocomplete="off" placeholder="Type a message..."/>
        <button>Send</button>
    </form>
    <script>
        var client_id = prompt("Enter your nickname");
        document.querySelector("#ws-id").textContent = client_id;
        var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
        
        ws.onmessage = function(event) {
            const messages = document.getElementById('messages');
            const message = document.createElement('div');
            message.classList.add('message');
            const content = document.createElement('div');
            content.classList.add('content');
            debugger
            
            if (event.data.startsWith("Connected clients:")) {
                updateUsers(event.data);
            } else {
                const text = event.data;
                if (text.startsWith(`${client_id} says:`)) {
                    message.classList.add('sent');
                } else {
                    message.classList.add('received');
                }
                content.textContent = text;
                message.appendChild(content);
                messages.appendChild(message);
                messages.scrollTop = messages.scrollHeight;
            }
        };
        
        function sendMessage(event) {
            const input = document.getElementById("messageText");
            ws.send(input.value);
            input.value = '';
            event.preventDefault();
        }
        
        function updateUsers(data) {
            debugger
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            const users = data.replace('Connected clients: ', '').split(',');
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user;
                userList.appendChild(li);
            });
        }
    </script>
</body>
</html>
"""


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


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{client_id} says: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(websocket, client_id)