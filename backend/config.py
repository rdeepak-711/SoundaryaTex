from dotenv import load_dotenv
import os

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
MONGO_URI = os.getenv("MONGO_URI")
JWT_TOKEN = os.getenv("JWT_TOKEN")