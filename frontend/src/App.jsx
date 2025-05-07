import { Routes, Route, Navigate } from "react-router-dom";
import Invoices from "./pages/Invoices";
import PartyInvoices from "./pages/PartyInvoices";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = localStorage.getItem("loggedIn");
        if (loginStatus === "true") {
            setIsLoggedIn(true);
        }
    
        let logoutTimer;
    
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                logoutTimer = setTimeout(() => {
                    localStorage.removeItem("loggedIn");
                    setIsLoggedIn(false);
                }, 5 * 60 * 1000);
            } else {
                clearTimeout(logoutTimer);
            }
        };
    
        document.addEventListener("visibilitychange", handleVisibilityChange);
    
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearTimeout(logoutTimer);
        };
    }, []);
    

    return (
        <Routes key={isLoggedIn ? "logged-in" : "logged-out"}>
            <Route path="/" element={isLoggedIn ? <Navigate to="/invoices" /> : <Auth setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/invoices" element={isLoggedIn ? <Invoices /> : <Navigate to="/" />} />
            <Route path="/party-invoices" element={isLoggedIn ? <PartyInvoices /> : <Navigate to="/" />} />
        </Routes>
    );    
}

export default App;
