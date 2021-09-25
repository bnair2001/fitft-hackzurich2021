from fastapi import FastAPI
from models import *
from users import *
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

@app.get('/connection/new')
def new_connection():
    return {"message": "new connection"}

@app.post('/connection/connect')
def connect_to_connection(item: Connection):
    connection_id = item.connection_id
    user_id = item.user_id
    connection = connect_to_connection_by_id(connection_id, user_id)
    return connection