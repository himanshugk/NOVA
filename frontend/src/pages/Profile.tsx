import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import API_BASE from "../services/api";

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
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

    if (!user) return <div className="text-white p-20 text-center text-xl font-bold">Initializing link...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 flex justify-center selection:bg-blue-500/30 font-sans relative overflow-hidden">
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>

            <div className="max-w-md w-full bg-[#111]/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10 h-fit">
                <h1 className="text-3xl font-black mb-8 tracking-tighter uppercase border-b border-gray-800 pb-4">Pilot <span className="text-blue-500">Registry</span></h1>

                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-6">
                        <div className="size-24 bg-black overflow-hidden border-2 border-blue-500/30 rounded-full flex items-center justify-center">
                            {user.profile_image ? (
                                <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex justify-center items-center text-4xl font-bold text-gray-500">{user.username.charAt(0)}</div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold tracking-tight">{user.username}</h2>
                            <p className="text-sm font-medium text-blue-400">{user.email || "No email linked (Guest Status)"}</p>
                            <span className="text-xs text-gray-600 font-mono mt-1">ID: #{user.id}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Callsign (Username)</label>
                        <input
                            type="text"
                            className="bg-black/50 border border-gray-800 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all font-mono"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm"
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
                        className="w-full text-center text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-bold mt-2"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
