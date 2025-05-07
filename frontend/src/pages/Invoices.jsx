import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddInvoice from '../components/AddInvoice';
import DateFilter from '../components/DateFilter';
import Table from '../components/Table';
import Output from '../components/Output';
const Invoices = () => {
    const partyDefault='All';

    const [loading, setLoading] = useState(false);
    
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    const [years, setYears] = useState([]);
    const [partyNames, setPartyNames] = useState([]);

    const [showAddPopup, setShowAddPopup] = useState(false);

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedParty, setSelectedParty] = useState(partyDefault);

    const [searchTerm, setSearchTerm] = useState("");

    const API = process.env.REACT_APP_API_BASE_URL;

    const columnOrder = [
        "invoice_no",
        "invoice_date",
        "gst_no",
        "party_name",
        "taxable_value",
        "cgst",
        "sgst",
        "invoice_value"
    ];
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchInvoices = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/invoice/read`);
            const data = response.data.data;
            const invoiceDates = data.map(inv => new Date(inv.invoice_date));
            const uniqueYears = [...new Set(invoiceDates.map(date => date.getFullYear()))].sort((a,b) => b-a);
            setInvoices(data);
            setYears(uniqueYears);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setLoading(false);
        }
    }, [API])

    const fetchParties = useCallback(async () => {
        try{
            const response = await axios.get(`${API}/invoices/partynames`);
            setPartyNames(response.data.data)
        } catch (err) {
            console.error("Failed to getch party names.", err);
        }
    }, [API])

    useEffect(() => {
        fetchInvoices();
        fetchParties();
    }, [fetchInvoices, fetchParties])

    useEffect(() => {
        console.log(invoices)
        const filtered = invoices.filter((inv) => {
            const date = new Date(inv.invoice_date);
            const yearMatch = date.getFullYear() === parseInt(selectedYear);    
            const monthMatch = selectedMonth ? date.getMonth()+1 === parseInt(selectedMonth) : true;
            const dayMatch = selectedDay ? date.getDate() === parseInt(selectedDay) : true;
            const partyMatch = selectedParty === "All" || inv.party_name === selectedParty;
            const searchMatch = inv.party_name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoice_no.includes(searchTerm);

            return yearMatch && monthMatch && dayMatch && partyMatch && searchMatch;
        });

        setFilteredInvoices(filtered)
    }, [invoices, selectedYear, selectedMonth, selectedDay, selectedParty, searchTerm]);

    const updateInvoice = async (invoice) => {
        try {
            const invoiceNumber = invoice["invoice_no"];
            await axios.put(`${API}/invoice/update/${invoiceNumber}`, invoice).then(
                (response) => {
                    if (response.data.success) {
                        fetchInvoices();
                    } else {
                        console.log(response.data);
                        alert("Something went wrong while saving the invoice.");
                    }
                }
            )
        } catch(error){
            console.error("Error:", error)
        }
    }

    const cancelInvoice = async (invoice) => {
        try {
            const invoiceData = {
                invoice_no: invoice["invoice_no"],
                invoice_date: invoice.invoice_date,
                gst_no: "",
                party_name: "Cancelled",
                taxable_value: 0.0,
                cgst: 0.0,
                sgst: 0.0,
                invoice_value: 0.0,
                active: false,
            };
            await updateInvoice(invoiceData)
        } catch(error){
            console.error("Error:", error)
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Topbar title="Invoices"/>
                <div className='p-4 flex-grow space-y-4'>
                    {loading ? (
                        <div>Loading...</div>
                    ):(
                        <div>
                            <div className='flex justify-around'>
                                <DateFilter
                                    years={years}
                                    selectedYear={selectedYear}
                                    setSelectedYear={setSelectedYear}
                                    selectedMonth={selectedMonth}
                                    setSelectedMonth={setSelectedMonth}
                                    selectedDay={selectedDay}
                                    setSelectedDay={setSelectedDay}
                                    partyNames={partyNames}
                                    selectedParty={selectedParty}
                                    setSelectedParty={setSelectedParty}
                                    partyDefault={partyDefault}
                                />
                                <button onClick={() => setShowAddPopup(true)} className='bg-orange-400 m-2 p-2 border-orange-700 rounded text-lg'>
                                    Add Invoice
                                </button>
                                <AddInvoice isOpen={showAddPopup} onClose={() => {setShowAddPopup(false); fetchInvoices(); fetchParties();}}/>
                            </div>
                            
                            <Table 
                                columnOrder={columnOrder}
                                filteredTable={filteredInvoices}
                                formatDate={formatDate}
                                handleUpdate={updateInvoice}
                                cancelUpdate={cancelInvoice}
                            />
                            
                            <Output 
                                columnOrder={columnOrder}
                                filteredTable={filteredInvoices.filter((inv) => inv.party_name.toLowerCase() !== "cancelled")}
                                formatDate={formatDate}
                                selectedYear={selectedYear}
                                selectedMonth={selectedMonth}
                                selectedParty={selectedParty}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Invoices;