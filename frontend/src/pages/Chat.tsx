import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const Chat = () => {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<{ id: number; text: string; isMine: boolean; sender?: string }[]>([]);
    const [inputText, setInputText] = useState("");
    const wsRef = useRef<WebSocket | null>(null);

    // Placeholder contacts
    const contacts = [
        { id: 1, name: "Global Chat" },
        { id: 2, name: "Alice (Guest_1a2b)" },
        { id: 3, name: "Bob (Team Squad)" },
    ];

    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${token}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = event.data;
            try {
                const parsed = JSON.parse(data);
                const sender = parsed.sender_id === (user?.id?.toString() || "me") ? "Me" : `Pilot ${parsed.sender_id}`;
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + Math.random(), text: parsed.content, isMine: parsed.sender_id === user?.id?.toString(), sender }
                ]);
            } catch (e) {
                // simple fallback
            }
        };

        return () => {
            ws.close();
        };
    }, [token, user]);

    const handleSend = () => {
        if (!inputText.trim() || !wsRef.current) return;

        wsRef.current.send(JSON.stringify({ content: inputText, room_id: 1, receiver_id: null }));
        setInputText("");
    };

    // Strict Check: Block completely if not logged in, OR if user object is loaded and confirmed as guest
    if (!token || user?.is_guest) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white pt-16">
                <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-sm backdrop-blur-xl shadow-2xl">
                    <div className="size-16 mx-auto bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full flex items-center justify-center mb-6 text-2xl font-black">!</div>
                    <h2 className="text-2xl font-bold mb-3 tracking-widest uppercase">Verification Required</h2>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        Global Comms and Team matchmaking are restricted to officially registered pilots. Guest access is limited to Solo simulation.
                    </p>
                    <button
                        onClick={() => window.location.href = '/auth'}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/25 uppercase text-sm tracking-widest"
                    >
                        Sign In / Register
                    </button>
                    {user?.is_guest && (
                        <p className="text-xs text-gray-500 mt-4">(Your current guest progress will be saved when you link an email)</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 pt-16">
            {/* Sidebar - Contacts */}
            <div className="w-1/3 border-r border-gray-700 bg-gray-900 overflow-y-auto">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Chats</h2>
                </div>
                <div className="flex flex-col">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="p-4 cursor-pointer hover:bg-gray-800 border-b border-gray-800 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {contact.name.charAt(0)}
                                </div>
                                <span className="text-white font-medium">{contact.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col bg-black">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-900">
                    <h3 className="text-lg font-bold text-white">Global Chat</h3>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[70%] p-3 rounded-lg ${msg.isMine
                                ? "bg-blue-600 self-end text-white rounded-tr-none"
                                : "bg-gray-800 self-start text-white rounded-tl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-full bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="rounded-full bg-blue-600 px-6 py-2 font-bold text-white transition hover:bg-blue-500"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
