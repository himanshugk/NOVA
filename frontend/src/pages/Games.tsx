import { Link } from "react-router-dom";

const Games = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden font-sans">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
            </div>

            <div className="relative z-10 text-center flex flex-col items-center px-4">
                <div className="inline-block px-3 py-1 mb-6 border border-blue-500/30 rounded-full bg-blue-500/5 backdrop-blur-sm">
                    <span className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-semibold">Nexus Expansion</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    COMING SOON
                </h1>
                
                <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-12 border-l-2 border-blue-500 pl-4 py-2">
                    Our engineering division is heavily focused on building the next generation of multiplayer tactical simulators. 
                    <br/><span className="text-white font-medium mt-2 block">Deployments begin later this cycle.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                        to="/chat"
                        className="group relative px-8 py-4 bg-transparent border border-gray-600 text-white hover:text-white uppercase tracking-[0.2em] font-bold text-xs overflow-hidden rounded-full transition-all hover:border-transparent hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <div className="absolute inset-0 bg-white w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                        <span className="relative z-10 group-hover:text-black transition-colors">Open Comms</span>
                    </Link>
                    <Link
                        to="/"
                        className="group relative px-8 py-4 bg-transparent border border-blue-600 text-blue-400 hover:text-white uppercase tracking-[0.2em] font-bold text-xs overflow-hidden rounded-full transition-all hover:border-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                    >
                        <div className="absolute inset-0 bg-blue-600 w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                        <span className="relative z-10 transition-colors">Return to Base</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Games;
