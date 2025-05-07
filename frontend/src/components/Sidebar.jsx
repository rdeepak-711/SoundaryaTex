import { NavLink } from "react-router-dom";

function Sidebar(){
    const links = [
        { name: "Invoices", path: "/invoices" },
        { name: "Party Invoices", path: "/party-invoices" },
    ];
    
    return (
        <div className="h-screen w-64 bg-gray-800 flex flex-col text-white">
            <div className="p-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
                    Soundarya Tex
                </h1>
            </div>
            <div className="flex flex-col space-y-4 px-4 py-6">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive
                                ? "text-pink-500 text-lg"
                                : "text-white hover:text-gray-300 text-lg"
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>
            <div className="mt-auto p-4">
                <button className="text-white bg-red-500 hover:bg-red-700 w-full py-2 rounded">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar;