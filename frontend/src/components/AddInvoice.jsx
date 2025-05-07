import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios"

const AddInvoice = ({ isOpen, onClose }) => {
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0])
    const [partyName, setPartyName] = useState("")
    const [gstNumber, setGstNumber] = useState("")
    const [taxableValue, setTaxableValue] = useState(0)
    
    const [extractNumber, setExtractNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [gstMessage, setGstMessage] = useState("")
    const [enterMessage, setEnterMessage] = useState("")

    const API = process.env.REACT_APP_API_BASE_URL;
    let cgst=0.00;
    let sgst=0.00;
    let invoiceValue=0.00;

    const fetchGSTNumber = useCallback(async () => {
        if (!extractNumber || !partyName.trim()) return;

        try {
            setLoading(true)
            const response = await axios.get(`${API}/party/${partyName}`);
            let data = ""
            if(response.data.success){
                data=response.data.message;
                setExtractNumber(false);
                setGstMessage("")
            }else {
                setExtractNumber(true);
                setGstMessage("GST not found. Please enter it manually.");
            }
            setGstNumber(data);
        } catch (err) {
            console.error("Unable to extract GST number", err);
            setGstNumber("");
            setGstMessage("Could not fetch GST. Please enter it manually.");
        } finally {
            setLoading(false)
        }
    }, [API])

    useEffect(() => {
        if (extractNumber && partyName.trim()) {
          fetchGSTNumber();
        }
    }, [extractNumber, partyName, fetchGSTNumber]);  
    
    const resetForm = () => {
        setInvoiceNumber("");
        setInvoiceDate(new Date().toISOString().split("T")[0]);
        setGstNumber("");
        setPartyName("");
        setTaxableValue(0);
        setEnterMessage("");
        setGstMessage("");
    };
      

    const addInvoice = async() => {
        try {
            if (
                invoiceNumber.trim() === "" ||
                invoiceDate.trim() === "" ||
                gstNumber.trim() === "" ||
                partyName.trim() === "" ||
                taxableValue === 0.0
            ) {
                setEnterMessage("Please enter all the details");
                return;
            }              
            const invoiceData = {
                invoice_no: invoiceNumber.trim(),
                invoice_date: invoiceDate.toString(),
                gst_no: gstNumber.trim().toUpperCase(),
                party_name: partyName.trim().toUpperCase(),
                taxable_value: Number(taxableValue),
                cgst: Number(cgst.toFixed(2)),
                sgst: Number(sgst.toFixed(2)),
                invoice_value: Number(invoiceValue.toFixed(2)),
                active: true,
            };            
            await axios.post(`${API}/invoice/create`, invoiceData).then(
                (response) => {
                    if (response.data.success) {
                        onClose();
                    } else {
                        console.log(response.data)
                        alert("Something went wrong while saving the invoice.");
                    }
                }
            )
            resetForm();
        } catch (err) {
            console.error("Invoice adding", err);
            alert("Failed to save invoice. Try again");
        }
    }

    const handleGSTCheck = () => {
        if (gstNumber.trim() !== "") {
            // eslint-disable-next-line no-restricted-globals
            const shouldFetch = confirm( "GST number is already filled. Do you want to fetch it again?");
            if (!shouldFetch) return;
        }
        setExtractNumber(true);
    };

    cgst = useMemo(() => taxableValue * 0.025, [taxableValue]);
    sgst = useMemo(() => taxableValue * 0.025, [taxableValue]);
    invoiceValue = useMemo(() => Math.round(taxableValue + cgst + sgst), [taxableValue, cgst, sgst]);
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-md px-6 py-4 w-full max-w-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Add Invoice</h2>
                <form
                    className="space-y-4 flex flex-col w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addInvoice();
                    }}
                >
                    {/* Invoice Number */}
                    <div>
                        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                        <input
                            id="invoiceNumber"
                            name="invoiceNumber"
                            type="text"
                            placeholder="Input the Invoice Number"
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            value={invoiceNumber}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Invoice Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                        <input
                            id="date"
                            name="invoiceDate"
                            type="date"
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            value={invoiceDate}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Party Name */}
                    <div>
                        <label htmlFor="partyName" className="block text-sm font-medium text-gray-700 mb-1">Party Name</label>
                        <input
                            id="partyName"
                            name="partyName"
                            type="text"
                            placeholder="Input the Party Name"
                            onChange={(e) => setPartyName(e.target.value.toUpperCase())}
                            value={partyName}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            className="mt-2 text-white bg-orange-500 hover:bg-orange-700 w-full py-2 rounded"
                            onClick={handleGSTCheck}
                            disabled={!partyName.trim() || extractNumber}
                        >
                            {loading ? "Checking..." : "Check for GST"}
                        </button>
                    </div>

                    {/* GST Number */}
                    <div className="relative">
                        <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                        <input
                            id="gstNumber"
                            name="gstNumber"
                            type="text"
                            placeholder="Input the GST Number"
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            value={gstNumber}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!extractNumber}
                            required
                        />
                        {gstMessage && (
                            <div className="absolute left-0 mt-1 text-xs text-orange-600 bg-orange-50 border border-orange-300 rounded px-2 py-1">
                                {gstMessage}
                            </div>
                        )}
                    </div>

                    {/* Taxable Value */}
                    <div>
                        <label htmlFor="taxableValue" className="block text-sm font-medium text-gray-700 mb-1">Taxable Value</label>
                        <input
                            id="taxableValue"
                            name="taxableValue"
                            type="number"
                            placeholder="Input the amount"
                            onChange={(e) => setTaxableValue(Number(e.target.value))}
                            value={taxableValue}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        {/* Live Calculated summary */}
                        <div className="mt-3">
                            <div className="flex justify-around text-sm font-medium text-gray-800">
                                <p>CGST: ₹{cgst.toFixed(2)}</p>
                                <p>SGST: ₹{sgst.toFixed(2)}</p>
                            </div>
                            <div className="mt-2 text-center text-lg font-bold text-blue-700">
                                Invoice Value: ₹{invoiceValue.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4 pt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-1/2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="..."
                            disabled={loading}
                        >
                            Add Invoice
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

export default AddInvoice;