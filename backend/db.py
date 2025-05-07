import motor.motor_asyncio
from config import MONGO_URI

client = None
db = None

async def get_database():
    global client, db

    if client is None:
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
        db = client["soundarya_tex"]
    return db

async def get_user_collection():
    db = await get_database()
    return db["user"]

async def get_invoice_collection():
    db = await get_database()
    invoice_collection = db["invoice"]
    await invoice_collection.create_index(
        [("party_name",1),("invoice_no",1)],
        unique = True
    )
    return invoice_collection 

async def get_party_invoice_collection():
    db = await get_database()
    return db["partyInvoice"]

async def get_party_collection():
    db = await get_database()
    party_collection = db["party"]
    await party_collection.create_index(
        [("party_name",1),("gst_no",1)],
        unique=True
    )
    return party_collection