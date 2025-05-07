from ..models import PartyInvoice
from ..db import get_party_invoice_collection

from bson import ObjectId

async def create_partyInvoice(partyInvoiceData: PartyInvoice):
    try:
        partyInvoiceCollection = await get_party_invoice_collection()

        partyInvoiceDict = partyInvoiceData.dict()
        await partyInvoiceCollection.insert_one(partyInvoiceDict)

        return {
            "success": True,
            "message": "Added entry to party invoice collection"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def read_partyInvoice(partyName: str):
    try:
        partyInvoiceCollection = await get_party_invoice_collection()
        cursor = partyInvoiceCollection.find({"party_name": partyName}).sort("invoice_date",1)

        partyInvoices = []
        async for document in cursor:
            document["_id"] = str(document["_id"])
            partyInvoices.append(document)

        if not partyInvoices:
            raise Exception("No entried found for the given party name")

        return {
            "success": True,
            "data": partyInvoices
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def update_party_invoice(updatedPartyInvoiceData: PartyInvoice, invoiceNumber: str = None, id: str = None):
    try:
        partyInvoiceCollection = await get_party_invoice_collection()

        updateData = {k: v for k, v in updatedPartyInvoiceData.dict().items() if v is not None}


        if not updateData:
            raise Exception("No data provided to update")

        if invoiceNumber:
            filter_query = {"invoice_no": invoiceNumber}

        elif id:
            filter_query = {"_id": ObjectId(id)}
        
        else:
            raise Exception("No valid fields to update (either debit or credit should be provided)")

        result = await partyInvoiceCollection.update_one(
            filter_query,
            {"$set": updateData}
        )
        if result.matched_count == 0:
            raise Exception("No matching invoice found to update")

        return {
            "success": True,
            "message" : "Party details updated successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }