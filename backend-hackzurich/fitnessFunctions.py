import requests
from db import *
from connection import *
from users import *

FITROCKR_API_KEY = "a3a3b5b4-068d-4800-9328-c94fcaebab74"
FITROCKR_API_URL = "https://api.fitrockr.com/v1/users/{user_id}/activities"
FITROCKER_TENANT = "hackzurich"


def get_activities(user_id):
    url = FITROCKR_API_URL.format(user_id=get_user_by_id(user_id)["fitrockr_id"])
    # print(url)
    querystring = {"startDate":"2021-09-20","endDate":"2021-09-25"}
    headers = {
        "X-Tenant": FITROCKER_TENANT,
        "X-Api-Key": FITROCKR_API_KEY
    }
    r = requests.get(url, headers=headers, params=querystring)
    # print(r.text)
    return r.json()


def update_operation(connection_id, operation):
    connection = get_connection(connection_id)
    user_id = connection["user"]
    new_stats = {
        "caloriesBurned": get_user_by_id(user_id)["caloriesBurned"],
        "distanceTravelled": get_user_by_id(user_id)["distanceTravelled"]
    }
    if operation == "update_fitness_activities":
        update_connection(
            connection_id, "Updating Fitness Activities on the Blockchain")
        existing_activities = get_user_by_id(user_id)["stored_activities"]
        activities = get_activities(user_id)
        new_activities = []
        for activity in activities:
            # print(activity)
            if activity["id"] not in existing_activities:
                new_activities.append(activity)
                existing_activities.append(activity["id"])
        if len(new_activities) > 0:
            update_user_activities(user_id, existing_activities)
            for activity in new_activities:
                # print(activity["calories"])
                # print(activity["distance"])
                if activity["calories"]:
                    new_stats["caloriesBurned"] = new_stats["caloriesBurned"] + int(float((activity["calories"])))
                if activity["distance"] != None:
                    new_stats["distanceTravelled"] = new_stats["distanceTravelled"] + int(float((activity["distance"])))
            update_user_stats(user_id, new_stats)
    update_connection(connection_id, "idle")
    return get_user_by_id(user_id)
