function Topbar({title, onSearch}){
    return(
        <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
            <h1 className="text-xl font-semibold">{title}</h1>
        </div>
    )
}

export default Topbar;