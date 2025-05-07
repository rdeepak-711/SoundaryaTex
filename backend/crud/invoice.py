from models import Invoice, PartyInvoice, Party
from .partyInvoice import create_partyInvoice, update_party_invoice
from db import get_invoice_collection
from .party import create_party

from datetime import datetime, date

async def create_invoice(invoiceData: Invoice):
    try:
        if isinstance(invoiceData.invoice_date, str):
            invoice_date = datetime.strptime(invoiceData.invoice_date, "%Y-%m-%d")
        elif isinstance(invoiceData.invoice_date, date):
            invoice_date = datetime.combine(invoiceData.invoice_date, datetime.min.time())
        else:
            raise ValueError("Invalid invoice_date format")
        print("Date", invoice_date)
        invoice_data = {
            "invoice_no": invoiceData.invoice_no,
            "invoice_date": invoice_date,
            "gst_no": invoiceData.gst_no,
            "party_name": invoiceData.party_name,
            "taxable_value": float(invoiceData.taxable_value),
            "cgst": float(invoiceData.cgst),
            "sgst": float(invoiceData.sgst),
            "invoice_value": float(invoiceData.invoice_value),
            "active": True
        }
        print(invoice_data)
        invoiceCollection = await get_invoice_collection()
        await invoiceCollection.insert_one(invoice_data)
        partyData = Party(
            party_name=invoiceData.party_name,
            gst_no=invoiceData.gst_no
        )
        await create_party(partyData)

        partyInvoiceData = PartyInvoice(
            party_name=invoiceData.party_name, 
            invoice_no=invoiceData.invoice_no,
            invoice_date=invoiceData.invoice_date,
            particulars="GST 5% Sales",
            invoice_type="INV", 
            debit=invoiceData.invoice_value,
            credit=0.00,
            active=True
        )

        response = await create_partyInvoice(partyInvoiceData=partyInvoiceData)

        if not response["success"]:
            raise Exception(response["message"])

        return {
            "success": True,
            "message": "Invoice Data added successfully"
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def read_all_invoices():
    try:
        invoiceCollection = await get_invoice_collection()
        cursor = invoiceCollection.find()

        invoices=[]
        async for document in cursor:
            document["_id"] = str(document["_id"])
            invoices.append(document)

        return {
            "success": True,
            "data": invoices
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def get_distinct_party_names():
    try:
        invoiceCollection = await get_invoice_collection()
        distinctParties = await invoiceCollection.distinct("party_name")

        return {
            "success": True,
            "data": distinctParties
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
async def update_invoice(updateInvoiceData: Invoice, invoiceNumber: str):
    try:
        invoiceCollection = await get_invoice_collection()
        updateData = {k: v for k, v in updateInvoiceData.dict().items() if v is not None}

        response = await invoiceCollection.update_one(
            {"invoice_no": invoiceNumber},
            {"$set": updateData}
        )

        if response.matched_count == 0:
            raise Exception("No matching invoice found to update")
        
        updatePartyInvoiceData = PartyInvoice(
            party_name=updateData["party_name"], 
            invoice_no=updateData["invoice_no"],
            invoice_date=updateData["invoice_date"],
            particulars="GST 5% Sales",
            invoice_type="INV", 
            debit=updateData["invoice_value"],
            credit=0.00,
            active=updateData["active"]
        )

        response = await update_party_invoice(updatePartyInvoiceData, invoiceNumber)

        if not response["success"]:
            raise Exception(response["message"])

        return {
            "success": True,
            "message": "Updated the data" 
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }