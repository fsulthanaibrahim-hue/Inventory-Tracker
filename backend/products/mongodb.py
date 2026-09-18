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

products_collection = db["products"]


try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection failed:", e)


def ensure_indexes():
    products_collection.create_index(
        [("name", 1)],
        name="product_name_index"
    )