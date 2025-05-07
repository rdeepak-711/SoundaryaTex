import { useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Table = (props) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedRow, setEditedRow] = useState({});

    const startEditing = (index, rowData) => {
        setEditingIndex(index);
        setEditedRow({ ...rowData });
    };

    const handleInputChange = (key, value) => {
        let updatedRow = { ...editedRow, [key]: value };
    
        if (key === "taxable_value") {
            const taxable = parseFloat(value) || 0;
            const cgst = parseFloat((taxable * 0.025).toFixed(2));
            const sgst = parseFloat((taxable * 0.025).toFixed(2));
            const invoiceValue = parseFloat((taxable + cgst + sgst).toFixed(2));
    
            updatedRow = {
                ...updatedRow,
                cgst,
                sgst,
                invoice_value: invoiceValue,
            };
        }
    
        setEditedRow(updatedRow);
    };
    

    const saveEdit = (cancel) => {
        if(editedRow.active===false){
            alert("Can't change")
        }
        else if(cancel){
            props.cancelUpdate(editedRow);
        } else {
            props.handleUpdate(editedRow);
        }
        setEditingIndex(null);
        setEditedRow({});
    };

    return (
        <div className='overflow-auto max-h-[500px] border rounded' id="print-selection">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {props.columnOrder.map((col) => (
                            <th key={col} className="border px-4 py-2 text-left">
                                {col.replace("_", " ").toUpperCase()}
                            </th>
                        ))}
                        <th className="border px-4 py-2 text-left">Update Invoice</th>
                    </tr>
                </thead>
                <tbody>
                    {props.filteredTable.map((invoice, index) => (
                        <tr key={index} className={`hover:bg-gray-50 ${!invoice.active ? "text-red-500 bg-red-50" : ""}`}>
                            {props.columnOrder.map((key) => (
                                <td key={key} className="border px-4 py-2">
                                    {editingIndex === index ? (
                                        <input
                                            type={["taxable_value", "cgst", "sgst", "invoice_value"].includes(key) ? "number" : "text"}
                                            value={editedRow[key]}
                                            onChange={(e) =>
                                                handleInputChange(key, e.target.value)
                                            }
                                            className="w-full border px-1 py-0.5 rounded"
                                        />
                                    ) : key === "invoice_date" ? (
                                        props.formatDate(invoice[key])
                                    ) : ["taxable_value", "cgst", "sgst", "invoice_value"].includes(key) ? (
                                        Number(invoice[key]).toFixed(2)
                                    ) : (
                                        invoice[key]
                                    )}
                                </td>
                            ))}
                            <td className="border px-4 py-2 text-center">
                                {editingIndex === index ? (
                                    <>
                                        <button
                                            onClick={() => saveEdit(true)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Cancel Invoice"
                                        >
                                            <XMarkIcon className="h-5 w-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => saveEdit(false)}
                                            className="text-green-600 hover:text-green-800 text"
                                            title="Save Invoice"
                                            >
                                            <CheckIcon className="h-5 w-5 inline" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => startEditing(index, invoice)}
                                        className="text-blue-500 hover:text-blue-700 text-center"
                                        title="Edit Invoice"
                                    >
                                        <PencilIcon className="h-5 w-5 inline" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
