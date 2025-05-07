import { useState } from "react";
import axios from "axios";

const AddCredit = (props) => {
    const [creditDate, setCreditDate] = useState(() => new Date().toISOString().split("T")[0])
    const [creditAmount, setCreditAmount] = useState(0)
    const [particulars, setParticulars] = useState("")

    const [enterMessage, setEnterMessage] = useState("")

    const API = process.env.REACT_APP_API_BASE_URL;
    
    const addCredit = async() => {
        try {
            if (creditDate.toString==="" || creditAmount===0 || particulars===""){
                setEnterMessage("Please enter all the details");
                return;        
            }
            const creditData = {
                party_name: props.party_name,
                invoice_no: "",
                invoice_date: creditDate.toString(),
                particulars: particulars,
                invoice_type: "",
                debit: 0.0,
                credit: creditAmount,
                active: true
            };
            console.log(creditData)       
            await axios.post(`${API}/party-invoice/create`, creditData).then(
                (response) => {
                    if (response.data.success) {
                        props.onClose();
                    } else {
                        console.log(response.data)
                        alert("Something went wrong while saving the invoice.");
                    }
                }
            )
        } catch (err) {
            console.error("Credit Adding", err);
            alert("Failed to save invoice. Try again");
        }
    }

    if(!props.isOpen || props.party_name==="None") return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-md px-6 py-4 w-full max-w-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Add Credit
                </h2>

                <form 
                    className="space-y-4 flex flex-col w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addCredit()
                    }}
                >
                    {/* Credti Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Credit Date</label>
                        <input
                            id="date"
                            name="creditDate"
                            type="date"
                            onChange={(e) => setCreditDate(e.target.value)}
                            value={creditDate}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Particulars */}
                    <div>
                        <label htmlFor="particulars" className="block text-sm font-medium text-gray-700 mb-1">Particulars</label>
                        <input
                            id="particulars"
                            name="particulars"
                            type="text"
                            onChange={(e) => setParticulars(e.target.value)}
                            value={particulars}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Credit Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Credit Amount</label>
                        <input
                            id="amount"
                            name="creditAmount"
                            type="number"
                            onChange={(e) => setCreditAmount(e.target.value)}
                            value={creditAmount}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4 pt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-1/2"
                            onClick={props.onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-1/2"
                        >
                            Add Credit
                            {enterMessage && (
                                <div className="absolute mt-1 text-sm text-red-600 bg-orange-50 border border-red-300 rounded px-2 py-1">
                                    {enterMessage}
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCredit;