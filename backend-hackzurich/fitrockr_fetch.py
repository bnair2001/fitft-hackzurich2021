import requests
from db import *

FITROCKR_API_KEY = "a3a3b5b4-068d-4800-9328-c94fcaebab74"
FITROCKR_API_URL = "https://api.fitrockr.com/v1/users/{user_id}/activities"
FITROCKER_TENANT = "hackzurich"

def get_activities(user_id):
    return ""