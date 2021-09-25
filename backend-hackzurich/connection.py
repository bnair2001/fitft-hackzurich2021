from db import *


def init_new_connection():
    new_conn = connections.put({
        "state": "idle",
        "connected": False,
        "user": ""
    })
    return new_conn


def get_connection(conn_id):
    return connections.get(conn_id)


def establish_connection(conn_id, user):
    conn = connections.update(conn_id, {
        "state": "idle",
        "connected": True,
        "user": user
    })
    return conn