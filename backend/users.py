from db import *


def create_new_user(name, email, password, weight, height):
    user = users.put({
        "name": name,
        "email": email,
        "password": password,
        "fitrockr_id": "",
        "caloriesBurned": 0,
        "weight": weight,
        "height": height,
        "distanceTravelled": 0,
        "stored_activities": [],
        "artID": "",
        "nft-block": "",
        "assets": []
    })
    return user


def get_user_by_id(user_id):
    user = users.get(user_id)
    if user:
        return user
    return None


def login_user_by_email(email, password):
    user = users.fetch({"email": email})
    print(user.items)
    if user.items == []:
        return None
    if user.items[0]["password"] == password:
        return user.items[0]
    return None


def update_user_activities(user_id, activities):
    print(activities)
    activity_ids = []
    # for activity in activities:
    #     activity_ids.append(activity["id"])
    # user = get_user_by_id(user_id)
    users.update({"stored_activities": activities}, user_id)


def update_user_stats(user_id, new_stats):
    print(new_stats)
    # user = get_user_by_id(user_id)
    users.update(new_stats, user_id)
