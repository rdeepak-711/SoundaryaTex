import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // make sure this is imported

const Auth = ({setIsLoggedIn}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_BASE_URL;

    const checkLogin = async () => {
        try {
            const response = await axios.post(`${API}/user/login`, {
                username,
                password,
            });

            if (response.data.success) {
                localStorage.setItem("loggedIn", "true");
                setIsLoggedIn(true);
                navigate("/invoices");
            } else {
                setErrorMessage("Invalid login credentials");
            }
        } catch (err) {
            console.error("Unable to login", err);
            setErrorMessage(err.response?.data?.message || "Unable to login");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-violet-300 to-slate-400">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
                {/* Header */}
                <div className="flex w-full mb-6 justify-center">
                    <button className="w-1/2 py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105 z-10 rounded-md">
                        Login
                    </button>
                </div>

                {/* Form */}
                <form
                    className="space-y-4 flex flex-col w-full gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        checkLogin();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                        >
                            {!showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="text-red-600 text-sm font-semibold">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 shadow-md"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
