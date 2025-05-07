from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    username: str
    password: str
    email: str

class LoginUser(BaseModel):
    username: str
    password: str

class Invoice(BaseModel):
    invoice_no: str
    invoice_date: datetime
    gst_no: str
    party_name: str
    taxable_value: float
    cgst: float
    sgst: float
    invoice_value: float
    active: bool

class PartyInvoice(BaseModel):
    party_name: str
    invoice_no: str
    invoice_date: datetime
    particulars: str
    invoice_type: str
    debit: float
    credit: float
    active: bool

class Party(BaseModel):
    party_name: str
    gst_no: str
