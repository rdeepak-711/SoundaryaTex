const Output = (props) => {
    const {
        columnOrder,
        filteredTable,
        formatDate,
        selectedYear,
        selectedMonth,
        selectedParty,
        totalDebit,
        totalCredit,
        totalBalance
    } = props;

    const handleExport = () => {
        const headers = columnOrder
            .filter(col => col !== "updateInvoice")
            .map(col => col.replace("_", "").toUpperCase())
            .join(",");

        const rows = filteredTable.map(invoice =>
            columnOrder.map(key =>
                key === "invoice_date"
                    ? formatDate(invoice[key])
                    : ["taxable_value", "cgst", "sgst", "invoice_value"].includes(key)
                        ? Number(invoice[key] || 0).toFixed(2)
                        : invoice[key]
            ).join(",")
        );

        const footer = (typeof totalDebit !== "undefined" && typeof totalCredit !== "undefined" && typeof totalBalance !== "undefined")
            ? `\n\nTotal Debit,₹${totalDebit.toFixed(2)}\nTotal Credit,₹${totalCredit.toFixed(2)}\nBalance,₹${totalBalance.toFixed(2)}`
            : "";

        const excel = [headers, ...rows].join("\n") + footer;
        const blob = new Blob([excel], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoices-${selectedYear}-${selectedMonth}-Party_${selectedParty}.csv`;
        a.click();
    };

    const printPdf = () => {
        const container = document.getElementById("print-selection");
        if (!container) return;

        const table = container.querySelector("table")?.cloneNode(true);
        if (!table) return;
        const theadRow = table.querySelector("thead tr");
        if (theadRow) theadRow.lastElementChild?.remove();
        table.querySelectorAll("tbody tr").forEach(row => row.lastElementChild?.remove());

        const totalsHTML = (typeof totalDebit !== "undefined" && typeof totalCredit !== "undefined" && typeof totalBalance !== "undefined")
            ? `
                <div style="margin-top: 30px; text-align: center;">
                    <h2>Total Debit: ₹${totalDebit.toFixed(2)} | Total Credit: ₹${totalCredit.toFixed(2)}</h2>
                    <p style="font-weight: bold; color: green;">Balance: ₹${totalBalance.toFixed(2)}</p>
                </div>
            ` : "";

        const win = window.open("", "", "height=800, width=1000");
        win.document.write(`
            <html>
                <head>
                    <title>Print Invoices</title>
                    <style>
                        @media print {
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                margin: 0;
                                text-align: center;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 30px;
                            }
                            th, td {
                                border: 1px solid #000;
                                padding: 8px;
                            }
                            th {
                                background-color: #f0f0f0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h1>Soundarya Tex</h1>
                    <p>Chellam Nagar, Pannakaran Thottam, Iduvampalayam, Murugampalayam, Tiruppur, Tamil Nadu 641687</p>
                    <p>Ph. no: 9843370666</p>
                    ${table.outerHTML}
                    ${totalsHTML}
                </body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
    };

    return (
        <div className='flex justify-end gap-4 mt-8'>
            <button
                onClick={handleExport}
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700'
            >
                Export Excel
            </button>

            <button
                onClick={printPdf}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
                Print PDF
            </button>
        </div>
    );
};

export default Output;
