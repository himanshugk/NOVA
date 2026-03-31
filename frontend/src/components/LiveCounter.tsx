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
        <div className="fixed bottom-3 right-3 z-40 bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-blue-500/20 px-2.5 py-1.5 rounded-md shadow-sm dark:shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-default group backdrop-blur-sm scale-90 origin-bottom-right opacity-80 dark:opacity-60 hover:opacity-100">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-gray-900 dark:text-white font-mono text-[10px] tracking-widest font-bold transition-colors">
                {liveUsers} <span className="text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors uppercase">Online</span>
            </span>
            <FaGlobeAmericas className="text-blue-500 size-3 opacity-60 dark:opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};
