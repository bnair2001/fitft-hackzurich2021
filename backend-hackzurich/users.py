from db import *

def create_new_user(name, email, password):
    user = users.put({
        "name": name,
        "email": email,
        "password": password,
        "fitrockr_id": "",
        "assets": []
    })
    return user

def login_user_by_email(email, password):
    user = users.get({"email": email})
    if user == None:
        return None
    if user["password"] == password:
        return user
    return None