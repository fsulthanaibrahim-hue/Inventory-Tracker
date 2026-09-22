import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()


MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")


if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing from .env")


if not MONGODB_DATABASE:
    raise ValueError("MONGODB_DATABASE is missing from .env")


client = MongoClient(MONGODB_URI)

db = client[MONGODB_DATABASE]


# MongoDB collections
products_collection = db["products"]
users_collection = db["users"]


# Test MongoDB connection
try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection failed:", e)


def ensure_indexes():

    # Product name index
    products_collection.create_index(
        [("name", 1)],
        name="product_name_index"
    )

    # Product user index
    products_collection.create_index(
        [("user_id", 1)],
        name="product_user_index"
    )

    # User email index
    users_collection.create_index(
        [("email", 1)],
        unique=True,
        name="user"
    )

    # User username index
    users_collection.create_index(
        [("username", 1)],
        unique=True,
        name="username_unique_index"
    )


ensure_indexes()


