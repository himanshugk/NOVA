import { useState } from "react";
import API_BASE from "../services/api";

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch(`${API_BASE}/contact/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-500 overflow-hidden font-sans pt-16 pb-8 px-4">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-40 dark:opacity-30 animate-pulse transition-colors duration-500"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-40 dark:opacity-30 animate-pulse transition-colors duration-500" style={{ animationDelay: "2s" }}></div>
            </div>

            <div className="relative z-10 w-full max-w-lg p-8 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-2xl mt-8 transition-colors duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-widest text-gray-900 dark:text-white uppercase mb-2">NOVA</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Leave a review, report an anomaly, or contact High Command.
                    </p>
                </div>

                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="size-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400 dark:border-blue-500 rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transmission Sent</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center font-medium">Your message has been securely recorded in the NOVA database.</p>
                        <button onClick={() => setStatus("idle")} className="mt-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white transition font-bold text-sm uppercase tracking-wider">
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wider">CALLSIGN (NAME)</label>
                            <input
                                type="text"
                                required
                                placeholder="Pilot Name"
                                className="bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono shadow-sm dark:shadow-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wider">SECURE EMAIL</label>
                            <input
                                type="email"
                                required
                                placeholder="pilot@nova.com"
                                className="bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono shadow-sm dark:shadow-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wider">TRANSMISSION (MESSAGE)</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Enter your review or feedback here..."
                                className="bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-sm dark:shadow-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        {status === "error" && (
                            <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border border-red-300 dark:border-red-400/20 p-3 rounded-lg text-sm text-center font-bold font-mono">
                                Transmission failed. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white font-black py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "loading" ? "Transmitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactPage;
