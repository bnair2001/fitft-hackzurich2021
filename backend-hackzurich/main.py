from fastapi import FastAPI
from models import *
from users import *
from connection import *
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post('/users')
def create_user(item: User):
    name = item.name
    email = item.email
    password = item.password

    usr = create_new_user(name, email, password)
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
        return establish_connection(user_id, connection_id)
    else:
        return {"error": "connection id is invalid"}
