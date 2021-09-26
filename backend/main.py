from fastapi import FastAPI
from models import *
from users import *
from connection import *
from fitnessFunctions import *
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post('/users')
def create_user(item: User):
    name = item.name
    email = item.email
    password = item.password
    weight = item.weight
    height = item.height
    usr = create_new_user(name, email, password, weight, height)
    return usr


@app.post('/users/login')
def login_user(item: User):
    email = item.email
    password = item.password
    usr = login_user_by_email(email, password)
    if usr:
        return usr
    else:
        return {"error": "invalid email or password"}

@app.get('/users/{user_id}')
def get_user(user_id: str):
    usr = get_user_by_id(user_id)
    if usr:
        return usr
    else:
        return {"error": "user not found"}


@app.post('/connection/new')
def new_connection(item: Connection):
    id = item.connection_id
    if id == "":
        return init_new_connection()
    else:
        conn = get_connection(id)
        if conn:
            return conn
        else:
            return init_new_connection()

@app.post('/connection/connect')
def connect_to_connection(item: Connection):
    connection_id = item.connection_id
    user_id = item.user_id
    if connection_id == "":
        return {"error": "connection id is empty"}
    if user_id == "":
        return {"error": "user id is empty"}
    conn = get_connection(connection_id)
    if conn:
        return establish_connection(connection_id, user_id)
    else:
        return {"error": "connection id is invalid"}

@app.get('/connection/{connection_id}')
def get_conn(connection_id: str):
    conn = get_connection(connection_id)
    if conn:
        return conn
    else:
        return {"error": "connection id is invalid"}

@app.post('/connection/operation')
def operation_on_connection(item: Connection):
    connection_id = item.connection_id
    operation = item.operation
    if connection_id == "":
        return {"error": "connection id is empty"}
    if operation == "":
        return {"error": "operation is empty"}
    conn = get_connection(connection_id)
    if conn:
        return update_operation(connection_id, operation)
    else:
        return {"error": "connection id is invalid"}