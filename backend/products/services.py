from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import ReturnDocument

from .mongodb import products_collection


def serialize_product(product):
    if not product:
        return None

    return {
        "_id": str(product["_id"]),
        "name": product.get("name", ""),
        "description": product.get("description", ""),
        "category": product.get("category", "Other"),
        "price": product.get("price", 0),
        "quantity": product.get("quantity", 0),
        "minimum_stock": product.get("minimum_stock", 0),
        "created_at": (
            product["created_at"].isoformat()
            if product.get("created_at")
            else None
        ),
        "updated_at": (
            product["updated_at"].isoformat()
            if product.get("updated_at")
            else None
        ),
    }


def create_product(data):
    now = datetime.now(timezone.utc)

    product = {
        "name": data["name"],
        "description": data.get("description", ""),
        "category": data["category"],
        "price": float(data["price"]),
        "quantity": data["quantity"],
        "minimum_stock": data["minimum_stock"],
        "created_at": now,
        "updated_at": now,
    }

    result = products_collection.insert_one(product)

    product["_id"] = result.inserted_id

    return serialize_product(product)


def get_products(search=None, category=None):
    query = {}

    if search:
        query["name"] = {
            "$regex": search,
            "$options": "i",
        }

    if category and category != "All":
        query["category"] = category

    products = (
        products_collection
        .find(query)
        .sort("created_at", -1)
    )

    return [
        serialize_product(product)
        for product in products
    ]


def get_product(product_id):
    try:
        object_id = ObjectId(product_id)
    except (InvalidId, TypeError):
        return None

    product = products_collection.find_one({
        "_id": object_id
    })

    return serialize_product(product)


def update_product(product_id, data):
    try:
        object_id = ObjectId(product_id)
    except (InvalidId, TypeError):
        return None

    update_data = {
        "name": data["name"],
        "description": data.get("description", ""),
        "category": data["category"],
        "price": float(data["price"]),
        "quantity": data["quantity"],
        "minimum_stock": data["minimum_stock"],
        "updated_at": datetime.now(timezone.utc),
    }

    product = products_collection.find_one_and_update(
        {"_id": object_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )

    return serialize_product(product)


def delete_product(product_id):
    try:
        object_id = ObjectId(product_id)
    except (InvalidId, TypeError):
        return False

    result = products_collection.delete_one({
        "_id": object_id
    })

    return result.deleted_count > 0


def update_stock(product_id, action, amount):
    try:
        object_id = ObjectId(product_id)
    except (InvalidId, TypeError):
        return None

    now = datetime.now(timezone.utc)

    if action == "add":
        product = products_collection.find_one_and_update(
            {"_id": object_id},
            {
                "$inc": {
                    "quantity": amount
                },
                "$set": {
                    "updated_at": now
                },
            },
            return_document=ReturnDocument.AFTER,
        )

        return serialize_product(product)

    if action == "remove":
        product = products_collection.find_one_and_update(
            {
                "_id": object_id,
                "quantity": {
                    "$gte": amount
                },
            },
            {
                "$inc": {
                    "quantity": -amount
                },
                "$set": {
                    "updated_at": now
                },
            },
            return_document=ReturnDocument.AFTER,
        )

        return serialize_product(product)

    return None


def get_inventory_stats():
    total_products = products_collection.count_documents({})

    total_stock_result = list(
        products_collection.aggregate([
            {
                "$group": {
                    "_id": None,
                    "total_stock": {
                        "$sum": "$quantity"
                    },
                }
            }
        ])
    )

    total_stock = (
        total_stock_result[0]["total_stock"]
        if total_stock_result
        else 0
    )

    low_stock = products_collection.count_documents({
        "$expr": {
            "$and": [
                {
                    "$gt": [
                        "$quantity",
                        0
                    ]
                },
                {
                    "$lte": [
                        "$quantity",
                        "$minimum_stock"
                    ]
                },
            ]
        }
    })

    out_of_stock = products_collection.count_documents({
        "quantity": 0
    })

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
    }