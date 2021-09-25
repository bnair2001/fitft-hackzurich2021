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
    user = users.fetch({"email": email})
    print(user.items)
    if user.items == []:
        return None
    if user.items[0]["password"] == password:
        return user.items[0]
    return None