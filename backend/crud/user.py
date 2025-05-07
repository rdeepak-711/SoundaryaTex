from ..models import User, LoginUser
from ..db import get_user_collection

from utils.hash import hash_password, verify_password
from datetime import datetime, timedelta

async def getUserCollection():
    return await get_user_collection()

async def create_user(userData: User):
    try:
        userCollection = await getUserCollection()

        existingEmailid = await userCollection.find_one({"email": userData.email})
        if existingEmailid:
            raise Exception("email already exists - choose a new one or try **logging** in")

        existingUserName = await userCollection.find_one({"username": userData.username})
        if existingUserName:
            raise Exception("username already exists - choose a new one")
        
        userDict = userData.dict()
        userDict["password"] = hash_password(userData.password)
        await userCollection.insert_one(userDict)

        return {
            "success": True,
            "message": "User created successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def read_user(loginUser: LoginUser):
    try:
        username = loginUser.username
        password = loginUser.password
        userCollection = await getUserCollection()
        existingUser = await userCollection.find_one({"username": username})
        if not existingUser:
            raise Exception("Username doesn't exist - request to sign up")
        passwordVerified = verify_password(plain_password=password, hashed_password=existingUser["password"])
        if not passwordVerified:
            raise Exception("Entered password is incorrect")

        return {
            "success": True,
            "message": "User details match to the details present in database"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
# async def update_user(existing_username: str, updateUserData: UpdateUser):
#     try:
#         userCollection = await get_user_collection()

#         update_fields = []

#         if updateUserData.username is not None:
#             update_fields["username"] = updateUserData.username
#         if updateUserData.email is not None:
#             update_fields["email"] = updateUserData.email
#         if updateUserData.password is not None:
#             update_fields["password"] = hash_password(updateUserData.password)

#         userNamePresent = await userCollection.find_one({
#             "username": update_fields["username"]
#         })

#         if userNamePresent:
#             raise Exception("Username already exists")

#         result = await userCollection.update_one(
#             {"username": existing_username},
#             {"$set": update_fields}
#         )

#         if result.modified_count == 0:
#             raise Exception("No user was updated. Check if the username exists")

#         return {
#             "success": True,
#             "message": "User details updated successfully"
#         }
#     except Exception as e:
#         return {
#             "success": False,
#             "message": str(e)
#         }