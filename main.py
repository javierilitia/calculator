from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Calculator():
    def __init__(self):
        pass
    
    def add(self, num1: float, num2: float) -> float:
        return num1 + num2

    def subtract(self, num1: float, num2: float) -> float:
        return num1 - num2
    
class Operation(BaseModel):
    operation: str
    num1: float
    num2: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
@app.get("/api/v1/about")
def version() -> Response:
    return "Version v0.0.01"
@app.get("/api/v1/add/{num1}/{num2}")
async def add(num1: float, num2: float) -> Response:
    calc = Calculator()
    result = calc.add(num1, num2)
    return {"operation": "addition", "num1": num1, "num2": num2, "result": result}
@app.post("/api/v1/calculator")
async def calculate(operation: Operation) -> Response:
    calc = Calculator()
    if operation.operation == "add":
        result = calc.add(operation.num1, operation.num2)
    elif operation.operation == "subtract":
        result = calc.subtract(operation.num1, operation.num2)
    else:
        raise HTTPException(status_code=400, detail="Invalid operation. Use 'add' or 'subtract'.")
    return {"operation": operation.operation, "num1": operation.num1, "num2": operation.num2, "result": result}