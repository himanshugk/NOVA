import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaPaperclip, FaPaperPlane, FaSearch, FaPlus, FaSmile, FaTimes } from "react-icons/fa";
import EmojiPicker, { Theme } from "emoji-picker-react";

// --- Neon Flow Animation Generator ---
const NeonStyles = () => (
    <style>{`
    @keyframes neon-flow-h {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes neon-flow-v {
      0% { background-position: 50% 0%; }
      100% { background-position: 50% 200%; }
    }
    .neon-border-h {
      background: linear-gradient(90deg, #ff0000, #ffffff, #0000ff, #00ff00, #87ceeb, #800080, #ff0000);
      background-size: 200% auto;
      animation: neon-flow-h 3s linear infinite;
    }
    .neon-border-v {
      background: linear-gradient(180deg, #ff0000, #ffffff, #0000ff, #00ff00, #87ceeb, #800080, #ff0000);
      background-size: auto 200%;
      animation: neon-flow-v 3s linear infinite;
    }
    /* Subtle inner glow for the void feeling */
    .void-glow {
      box-shadow: inset 0 0 100px rgba(0,0,0,1);
    }
  `}</style>
);

const Chat = () => {
    const { token, user } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [contacts, setContacts] = useState<{ id: number; name: string }[]>([
        { id: 1, name: "Global Relay" },
    ]);
    const [activeContact, setActiveContact] = useState<{ id: number; name: string }>(contacts[0]);
    const [messages, setMessages] = useState<{ id: number; text: string; isMine: boolean; sender?: string; image?: string; time?: string }[]>([]);

    const [inputText, setInputText] = useState("");
    const [attachment, setAttachment] = useState<string | null>(null);
    const [showEmoji, setShowEmoji] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newContactUsername, setNewContactUsername] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchContacts = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/chat/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const combined = [{ id: 1, name: "Global Relay" }, ...data];
                const unique = Array.from(new Map(combined.map(item => [item["id"], item])).values());
                setContacts(unique);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchHistory = async (contactId: number) => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/chat/history/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.map((m: any) => ({
                    id: m.id,
                    text: m.content?.startsWith("data:image") ? "" : m.content,
                    isMine: m.sender_id === user?.id,
                    sender: m.sender_id === user?.id ? "Me" : activeContact?.name,
                    image: m.content?.startsWith("data:image") ? m.content : undefined,
                    time: new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) fetchContacts();
    }, [token]);

    useEffect(() => {
        if (activeContact && token) {
            fetchHistory(activeContact.id);
        }
    }, [activeContact, token]);

    useEffect(() => {
        if (!token) return;

        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = import.meta.env.VITE_API_BASE?.replace('http://', '').replace('https://', '') || "localhost:8000";

        const ws = new WebSocket(`${wsProtocol}//${wsHost}/ws/chat/${token}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = event.data;
            try {
                const parsed = JSON.parse(data);
                if (parsed.room_id === activeContact?.id || (parsed.receiver_id === null && activeContact?.id === 1)) {
                    const senderName = parsed.sender_id === (user?.id?.toString() || user?.id) ? "Me" : `Pilot ${parsed.sender_id}`;
                    const isMine = parsed.sender_id === user?.id?.toString() || parsed.sender_id === user?.id;
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + Math.random(),
                            text: parsed.content?.startsWith("data:image") ? "" : parsed.content,
                            isMine: isMine,
                            sender: isMine ? "Me" : senderName,
                            image: parsed.content?.startsWith("data:image") ? parsed.content : undefined,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ]);
                }
            } catch (e) { }
        };

        return () => ws.close();
    }, [token, user, activeContact]);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if ((!inputText.trim() && !attachment) || !wsRef.current) return;

        const payload = attachment || inputText;
        const roomId = activeContact.id === 1 ? null : activeContact.id;

        wsRef.current.send(JSON.stringify({
            content: payload,
            room_id: roomId,
            receiver_id: roomId
        }));

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                text: attachment ? "" : inputText,
                isMine: true,
                sender: "Me",
                image: attachment ? payload : undefined,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);

        setInputText("");
        setAttachment(null);
        setShowEmoji(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment(reader.result as string);
                setShowEmoji(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddContact = async () => {
        if (!newContactUsername.trim()) return;
        try {
            const baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:8000";
            const res = await fetch(`${baseUrl}/api/chat/add_contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: newContactUsername })
            });
            if (res.ok) {
                fetchContacts();
                setShowAddModal(false);
                setNewContactUsername("");
            } else {
                alert("Player not found!");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!token || user?.is_guest) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white pt-16 void-glow">
                <NeonStyles />
                <div className="text-center p-8 bg-black border border-gray-600 rounded-2xl max-w-sm shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] neon-border-h"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] neon-border-h"></div>
                    <h2 className="text-lg font-bold mb-3 tracking-wide text-white mt-2">Verification Required</h2>
                    <p className="text-gray-400 mb-6 text-xs">
                        Please sign in with a verified account to access secure comms.
                    </p>
                    <button onClick={() => window.location.href = '/auth'} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all border border-gray-600 shadow-lg text-xs tracking-widest uppercase">
                        Sign In Now
                    </button>
                </div>
            </div>
        );
    }

    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex h-[100dvh] bg-black text-white pt-16 font-sans overflow-hidden text-[13px] void-glow">
            <NeonStyles />

            {/* Sidebar Container */}
            <div className="w-[280px] flex flex-col bg-black shrink-0 border-r border-gray-600 relative">
                {/* Neon Vertical Separator right on the edge of the Sidebar */}
                <div className="absolute top-0 right-[-1px] w-[2px] h-full neon-border-v z-10 opacity-70"></div>

                {/* User Profile Header */}
                <div className="h-[60px] flex items-center justify-between px-5 shrink-0 border-b border-gray-600">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={user?.profile_image || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                                alt="Me"
                                className="w-8 h-8 rounded-full object-cover border border-gray-600"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                        </div>
                        <h2 className="font-semibold text-white tracking-widest text-[13px]">{user?.username || "My Account"}</h2>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="p-1.5 text-gray-400 hover:text-white transition-colors bg-gray-800 border border-gray-600 rounded-full">
                        <FaPlus className="size-3" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-5 mb-3 mt-3 relative">
                    <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 text-[12px] text-white rounded-full py-2 pl-9 pr-3 outline-none border border-gray-600 placeholder:text-gray-500 focus:border-white transition-colors"
                    />
                </div>

                {/* Tabs */}
                <div className="px-5 flex items-center gap-5 mb-2 text-[10px] font-bold tracking-wider">
                    <button className="text-white border-b border-white pb-1.5 px-0.5">ACTIVE NOW</button>
                    <button className="text-gray-500 hover:text-gray-300 pb-1.5">FAVOURITE</button>
                    <button className="text-gray-500 hover:text-gray-300 pb-1.5">ALL</button>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-black mt-1">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors border-l-2 ${activeContact?.id === contact.id ? "bg-gray-900 border-white" : "border-transparent hover:bg-gray-900"
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center font-bold text-sm text-white shadow-md overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=${contact.name}&background=random`} alt={contact.name} className="w-full h-full object-cover opacity-90" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-semibold text-[13px] truncate text-white">
                                        {contact.name}
                                    </h3>
                                    <span className="text-[9px] text-gray-500 shrink-0">Now</span>
                                </div>
                                <p className="text-[11px] text-gray-500 truncate">Tap to open comms</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-black void-glow">

                {/* Chat Header */}
                <div className="h-[60px] flex items-center justify-between px-6 border-b border-gray-600 shrink-0 relative">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full overflow-hidden shadow-md border border-gray-600">
                            <img src={`https://ui-avatars.com/api/?name=${activeContact?.name}&background=random`} alt={activeContact?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-[14px] tracking-widest">{activeContact?.name}</h3>
                            <span className="text-[10px] text-green-400 opacity-90 block -mt-0.5 uppercase tracking-wider">Active Void Node</span>
                        </div>
                    </div>
                </div>

                {/* Messages Hub */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-black relative">
                    {messages.map((msg, index) => {
                        const isMe = msg.isMine;
                        return (
                            <div key={msg.id + index} className={`flex max-w-[65%] ${isMe ? "self-end" : "self-start"} flex-col`}>
                                {!isMe && (
                                    <div className="flex items-baseline gap-2 mb-1 ml-1.5">
                                        <span className="text-[10.5px] text-gray-400 font-medium uppercase tracking-wider">{msg.sender}</span>
                                        <span className="text-[9px] text-gray-600">{msg.time || "Now"}</span>
                                    </div>
                                )}

                                <div className={`flex items-end gap-2 ${isMe ? "flex-row" : "flex-row-reverse"}`}>
                                    <div className={`w-fit max-w-full px-3.5 py-2.5 relative group border border-gray-600 ${isMe
                                            ? "bg-black text-white rounded-[16px] rounded-br-[4px] shadow-sm"
                                            : "bg-gray-900 text-white rounded-[16px] rounded-bl-[4px]"
                                        }`}>
                                        {isMe && (
                                            <div className="absolute top-1.5 right-2.5 text-[8px] text-gray-500">{msg.time || "Now"}</div>
                                        )}

                                        {msg.image && (
                                            <img src={msg.image} alt="Attachment" className={`max-w-full rounded-[10px] object-contain max-h-[220px] ${msg.text ? "mb-2" : ""} shadow-sm border border-gray-600`} />
                                        )}
                                        {msg.text && (
                                            <p className={`text-[13px] text-white leading-relaxed break-words whitespace-pre-wrap ${isMe ? "min-w-[40px] pr-6 mt-0.5" : ""}`}>{msg.text}</p>
                                        )}
                                    </div>

                                    {isMe && (
                                        <div className="size-5 rounded-full overflow-hidden shrink-0 hidden sm:block border border-gray-600">
                                            <img src={user?.profile_image || `https://ui-avatars.com/api/?name=${user?.username}&background=random`} alt="Me" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    {!isMe && (
                                        <div className="size-5 rounded-full overflow-hidden shrink-0 hidden sm:block border border-gray-600">
                                            <img src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random`} alt="Them" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Input Hub */}
                <div className="px-5 py-2.5 shrink-0 flex gap-2.5 items-end border-t border-gray-600 bg-black relative">

                    {/* Neon Horizontal Separator right on the edge of the Input Box border */}
                    <div className="absolute top-[-1px] left-0 w-full h-[2px] neon-border-h z-10 opacity-70"></div>

                    {/* Integrated Emoji Picker Window */}
                    {showEmoji && (
                        <div className="absolute bottom-[55px] left-6 z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-600">
                            <EmojiPicker
                                theme={Theme.DARK}
                                onEmojiClick={(emoji) => setInputText(prev => prev + emoji.emoji)}
                                lazyLoadEmojis={true}
                                searchDisabled={true}
                                skinTonesDisabled={true}
                            />
                        </div>
                    )}

                    {/* Messenger Box -> Gray-800 */}
                    <div className="flex-1 flex flex-col items-end gap-1.5 bg-gray-800 rounded-full px-4 focus-within:bg-gray-700 transition-all border border-gray-600 shadow-inner">
                        {attachment && (
                            <div className="w-full my-1.5 relative inline-block p-1 bg-gray-900 rounded-xl self-start border border-gray-600">
                                <img src={attachment} alt="Preview" className="h-[45px] w-auto rounded-[8px] object-cover" />
                                <button onClick={() => setAttachment(null)} className="absolute top-0 right-0 bg-black text-white rounded-full p-1 hover:text-red-500 transition-colors border border-gray-600">
                                    <FaTimes className="size-2.5" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-2 w-full h-[38px]">
                            <button onClick={() => setShowEmoji(!showEmoji)} className="text-gray-400 hover:text-white transition-colors shrink-0">
                                <FaSmile className="size-4" />
                            </button>
                            <input
                                type="text"
                                className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-gray-400"
                                placeholder="Transmit message to the void..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onClick={() => setShowEmoji(false)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                        setShowEmoji(false);
                                    }
                                }}
                            />
                            <label className="text-gray-400 hover:text-white cursor-pointer p-1 transition-colors shrink-0">
                                <FaPaperclip className="size-[14px]" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        className="bg-black hover:bg-gray-800 text-white size-9 rounded-full flex items-center justify-center transition-all border border-gray-500 shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
                        disabled={!inputText.trim() && !attachment}
                    >
                        <FaPaperPlane className="size-3 mr-0.5" />
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-black border border-gray-600 rounded-[20px] p-6 w-full max-w-[320px] shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] neon-border-h"></div>
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <FaTimes className="size-3" />
                        </button>
                        <h3 className="text-[15px] font-bold text-white mb-5 uppercase tracking-widest text-center mt-2">Add Player</h3>
                        <input
                            type="text"
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-[13px] text-white mb-5 outline-none focus:border-white placeholder:text-gray-500 text-center tracking-wide"
                            placeholder="Enter Callsign..."
                            value={newContactUsername}
                            onChange={(e) => setNewContactUsername(e.target.value)}
                        />
                        <button
                            onClick={handleAddContact}
                            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2.5 rounded-lg transition-colors shadow-md uppercase text-[11px] tracking-widest"
                        >
                            Connect
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
