import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DateFilter from "../components/DateFilter";

import axios from 'axios';
import Table from "../components/Table";
import Output from "../components/Output";
import AddCredit from "../components/AddCredit";

function PartyInvoices() {
    const partyDefault='None'

    const [loading, setLoading] = useState(false)

    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    const [years, setYears] = useState([]);
    const [partyNames, setPartyNames] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedParty, setSelectedParty] = useState(partyDefault);

    const API = process.env.REACT_APP_API_BASE_URL;

    const columnOrder = [
        "invoice_no",
        "invoice_date",
        "particulars",
        "invoice_type",
        "debit",
        "credit"
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchPartyInvoices = useCallback(async (partyName)=> {
        try {
            if(partyName==="None") {return;}
            setLoading(true);
            const response = await axios.get(`${API}/party-invoice/read/${partyName}`);
            var data="";
            if(response.data.success){
                data=response.data.data;
            } else {
                throw new Error(response.data.message);
            }
            const invoiceDates = data.map(inv => new Date(inv.invoice_date));
            const uniqueYears = [...new Set(invoiceDates.map(date => date.getFullYear()))].sort((a,b) => b-a);
            setInvoices(data);
            setYears(uniqueYears);
        } catch(err) {
            console.error("Failed to fetch party Invoices of party:", partyName, "Error is: ", err);
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
        fetchParties();
    }, [fetchParties])

    useEffect(() => {
        fetchPartyInvoices(selectedParty);
    }, [selectedParty, fetchPartyInvoices])

    useEffect(() => {
        if (selectedParty === "None") {
            setFilteredInvoices([]);
            return;
        }

        const filtered = invoices.filter((inv) => {
            const date = new Date(inv.invoice_date);
            const yearMatch = date.getFullYear() === parseInt(selectedYear);    
            const monthMatch = selectedMonth ? date.getMonth()+1 === parseInt(selectedMonth) : true;
            const dayMatch = selectedDay ? date.getDate() === parseInt(selectedDay) : true;
            const partyMatch = selectedParty === inv.party_name;

            return yearMatch && monthMatch && dayMatch && partyMatch;
        });

        setFilteredInvoices(filtered)
    }, [invoices, selectedYear, selectedMonth, selectedDay, selectedParty]);
    
    const totalDebit = filteredInvoices.reduce((sum, inv) => sum + (inv.active ? Number(inv.debit) : 0), 0);
    const totalCredit = filteredInvoices.reduce((sum, inv) => sum + (inv.active ? Number(inv.credit) : 0), 0);
    const totalBalance = totalDebit - totalCredit;


    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Topbar title="Party Invoices"/>
                <div className="p-4 flex-grow space-y-4">
                    {loading ? (
                        <div>Loading....</div>
                    ):(
                        <div>
                            <div className="flex justify-around">
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
                            <button onClick={() => {
                                if(selectedParty==="None"){
                                    return;
                                }
                                setShowAddPopup(true);
                                }
                            } className='bg-orange-400 m-2 p-2 border-orange-700 rounded text-lg'>
                                Add Credit
                            </button>
                            <AddCredit
                                isOpen={showAddPopup}
                                party_name={selectedParty}
                                onClose={() => {
                                    setShowAddPopup(false);
                                    fetchPartyInvoices(selectedParty);
                                }}
                            />
                            </div>

                            {selectedParty !== "None" ? (
                                <>
                                    <Table
                                    filteredTable={filteredInvoices}
                                    columnOrder={columnOrder}
                                    formatDate={formatDate}
                                    />

                                    <div className="mt-8 text-center">
                                        <h2 className="text-xl font-bold text-indigo-600">
                                            Total Debit: ₹{totalDebit.toFixed(2)} | Total Credit: ₹{totalCredit.toFixed(2)}
                                        </h2>
                                        <p className="text-xl mt-2 font-semibold text-green-700">
                                            Balance: ₹{totalBalance.toFixed(2)}
                                        </p>
                                    </div>

                                    <Output 
                                        columnOrder={columnOrder}
                                        filteredTable={filteredInvoices}
                                        formatDate={formatDate}
                                        selectedYear={selectedYear}
                                        selectedMonth={selectedMonth}
                                        selectedParty={selectedParty}
                                        totalDebit={totalDebit}
                                        totalCredit={totalCredit}
                                        totalBalance={totalBalance}
                                    />
                                </>

                            ) : (
                                <p className="text-center text-gray-500">No invoices found for selected filters.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PartyInvoices;