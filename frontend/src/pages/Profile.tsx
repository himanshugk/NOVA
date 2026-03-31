import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API_BASE from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState("");

    useEffect(() => {
        if (user) setName(user.username);
    }, [user]);

    const handleSave = async () => {
        try {
            await fetch(`${API_BASE}/auth/me`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ username: name })
            });
            alert("Profile updated successfully!");
            window.location.reload();
        } catch (e) {
            alert("Failed to update profile");
        }
    };

    if (!user) return <div className="text-gray-900 dark:text-white p-20 text-center text-xl font-bold">Initializing link...</div>;

    return (
        <div className="min-h-screen pt-32 px-8 flex justify-center selection:bg-blue-500/30 font-sans relative overflow-hidden transition-colors duration-500 bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white">
            <div className={`absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full blur-[100px] transition-colors duration-500 ${theme === 'light' ? 'bg-blue-300/30' : 'bg-blue-600/10'}`}></div>

            <div className={`max-w-md w-full backdrop-blur-xl p-10 rounded-3xl relative z-10 h-fit transition-all duration-500 shadow-2xl ${theme === 'light' ? 'bg-white/90 border border-gray-200' : 'bg-[#111]/80 border-transparent dark:[animation:global-rgb-glow_4s_linear_infinite]'}`}>
                <h1 className="text-3xl font-black mb-8 tracking-tighter uppercase border-b border-gray-300 dark:border-gray-800 pb-4">
                    Pilot <span className="text-blue-500">Registry</span>
                </h1>

                <div className="flex flex-col gap-8">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl transition-colors bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            {theme === 'light' ? <FiSun className="text-yellow-500 text-xl" /> : <FiMoon className="text-blue-400 text-xl" />}
                            <span className="font-bold text-sm uppercase tracking-widest">{theme === 'light' ? 'Simple Mode' : 'Gaming Mode'}</span>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${theme === 'dark' ? 'bg-blue-600 justify-end shadow-[0_0_15px_#00e5ff]' : 'bg-gray-400 justify-start'}`}
                        >
                            <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`size-24 overflow-hidden border-2 rounded-full flex items-center justify-center transition-all duration-500 ${theme === 'light' ? 'bg-gray-200 border-gray-400' : 'bg-black border-blue-500/30 dark:[animation:global-rgb-glow_2s_linear_infinite]'}`}>
                            {user.profile_image ? (
                                <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full flex justify-center items-center text-4xl font-bold ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>{user.username.charAt(0)}</div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold tracking-tight">{user.username}</h2>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{user.email || "No email linked (Guest Status)"}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-600 font-mono mt-1">ID: #{user.id}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Callsign (Username)</label>
                        <input
                            type="text"
                            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-800 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 shadow-sm dark:shadow-none outline-none transition-all font-mono"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className={`w-full mt-4 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-white hover:bg-gray-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}
                    >
                        Save Configuration
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                        className="w-full text-center text-xs text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors font-bold mt-2"
                    >
                        Sign Out
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full text-center text-xs text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors font-bold mt-2"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
