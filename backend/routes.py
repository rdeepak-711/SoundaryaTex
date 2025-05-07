from fastapi import APIRouter

from models import Invoice, PartyInvoice, User, LoginUser
from crud.invoice import create_invoice, read_all_invoices, update_invoice, get_distinct_party_names
from crud.partyInvoice import create_partyInvoice, read_partyInvoice, update_party_invoice
from crud.user import create_user, read_user
from crud.party import get_party

router = APIRouter()

# --------- Invoice Endpoints ---------
@router.post("/invoice/create")
async def create_invoice_route(invoice: Invoice):
    return await create_invoice(invoice)

@router.get("/invoice/read")
async def read_invoices_route():
    return await read_all_invoices()

@router.get("/invoices/partynames")
async def get_all_partyNames():
    return await get_distinct_party_names()

@router.put("/invoice/update/{invoice_number}")
async def update_invoice_route(invoice_number: str, updated_invoice: Invoice):
    return await update_invoice(updated_invoice, invoice_number)

# --------- PartyInvoice Endpoints ---------
@router.post("/party-invoice/create")
async def create_party_invoice(party_invoice: PartyInvoice):
    return await create_partyInvoice(party_invoice)

@router.get("/party-invoice/read/{party_name}")
async def read_party_invoice(party_name: str):
    return await read_partyInvoice(party_name)

@router.put("/party-invoice/update/debit/{invoice_number}")
async def update_party_invoice_debit(invoice_number: str, updated_party_invoice: PartyInvoice):
    return await update_party_invoice(updated_party_invoice, invoiceNumber=invoice_number)

@router.put("/party-invoice/update/credit/{id}")
async def update_party_invoice_credit(id: str, updated_party_invoice: PartyInvoice):
    return await update_party_invoice(updatedPartyInvoiceData=updated_party_invoice, id=id)

# --------- User Endpoints ---------
@router.post("/user/signup")
async def signup_user_route(user: User):
    return await create_user(userData=user)

@router.post("/user/login")
async def login_user_route(loginUser: LoginUser):
    return await read_user(loginUser)

# @router.put("/user/update/{username}")
# async def update_user_route(username: str, update_user_data: UpdateUser):
#     return await update_user(username, update_user_data)

# --------- Party Endpoints ---------
@router.get("/party/{party_name}")
async def fetch_party_by_name(party_name: str):
    return await get_party(party_name)