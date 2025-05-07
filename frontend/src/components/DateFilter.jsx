const DateFilter = (props) => {
    return (
        <div className='p-4 space-y-4'>
            <div className='flex flex-wrap gap-4'>
                <select
                    value={props.selectedYear}
                    onChange={(e) => props.setSelectedYear(e.target.value)}
                    className='border px-2 py-1 rounded'
                >
                    {props.years.map((year)=>(
                        <option
                            key={year}
                            value={year}
                        >
                            {year}
                        </option>
                    ))}
                </select>

                <select
                    value={props.selectedMonth}
                    onChange={(e) => props.setSelectedMonth(e.target.value)}
                    className='border px-2 py-1 rounded'
                >
                    <option value="">Choose Month</option>
                    {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                        ].map((month, i) => (
                        <option key={i + 1} value={i + 1}>
                            {month}
                        </option>
                    ))}
                </select>

                <select
                    value={props.selectedDay}
                    onChange={(e) => props.setSelectedDay(e.target.value)}
                    className='border px-2 py-1 rounded'
                >
                    <option value="">Choose Day</option>
                    {Array.from({ length: 31 }, (_, i) => {
                        return(
                            <option key={i+1} value={i+1}>
                                {i+1}
                            </option>
                        )
                    })}
                </select>

                <select
                    value={props.selectedParty}
                    onChange={(e) => props.setSelectedParty(e.target.value)}
                    className='border px-2 py-1 rounded'
                >
                    <option value={props.partyDefault}>{props.partyDefault}</option>
                    {props.partyNames
                        .filter((partyName) => partyName.toLowerCase() !== "cancelled")
                        .map((partyName) => (
                            <option key={partyName} value={partyName}>
                                {partyName}
                            </option>
                        ))}
                </select>

            </div>
        </div>
    )
}

export default DateFilter;