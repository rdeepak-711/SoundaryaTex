from models import Party
from db import get_party_collection

async def create_party(partyData: Party):
    try:
        partyCollection = await get_party_collection()
        partyNamePresent = await partyCollection.find_one({
            "$and":[
                {"party_name": partyData.party_name},
                {"gst_no": partyData.gst_no}
            ]
        })
        if partyNamePresent:
            return {
                "success": True,
                "message": "Party Name already present so no need"
            }
        
        partyDict = partyData.dict()
        await partyCollection.insert_one(partyDict)
        
        return {
            "success": True,
            "message": "Party Name and GST added successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def get_party(party_name: str):
    try:
        partyCollection = await get_party_collection()
        partyNamePresent = await partyCollection.find_one({
            "party_name": party_name
        })
        if not partyNamePresent:
            raise Exception("Party Name not present")
        
        gst_number = partyNamePresent["gst_no"]

        return {
            "success": True,
            "message": str(gst_number)
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }