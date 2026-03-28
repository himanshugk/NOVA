import { useEffect, useState } from "react";
import { FaGlobeAmericas } from "react-icons/fa";

export const LiveCounter = () => {
    const [liveUsers, setLiveUsers] = useState(1);

    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = import.meta.env.VITE_API_BASE?.replace('http://', '').replace('https://', '') || "localhost:8000";
        const wsUrl = `${wsProtocol}//${wsHost}/ws/live`;

        let ws: WebSocket;
        let reconnectTimer: number;

        const connect = () => {
            ws = new WebSocket(wsUrl);
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.live_users) {
                        setLiveUsers(data.live_users);
                    }
                } catch (e) {
                    console.error("Invalid WS message", e);
                }
            };
            ws.onclose = () => {
                reconnectTimer = setTimeout(connect, 5000);
            };
        };

        connect();

        return () => {
            clearTimeout(reconnectTimer);
            if (ws) {
                ws.onclose = null; // Prevent reconnect loop on unmount
                ws.close();
            }
        };
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111]/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 cursor-default group">
            <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            <span className="text-white font-mono text-xs tracking-widest font-bold">
                {liveUsers} <span className="text-gray-500 group-hover:text-gray-300 transition-colors uppercase ml-1">Pilots Online</span>
            </span>
            <FaGlobeAmericas className="text-blue-500 size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};
