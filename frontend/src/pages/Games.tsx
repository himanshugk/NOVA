import { useState } from "react";
import { FaExpand, FaCompress, FaPlay } from "react-icons/fa";

const Games = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // List of other popular games to show in grid
    const popularGames = [
        { id: 1, title: "Neon Rider", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" },
        { id: 2, title: "Cyber Strike", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" },
        { id: 3, title: "Void Runners", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400" },
        { id: 4, title: "Astro Clash", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=400" },
    ];

    if (isPlaying) {
        return (
            <div className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-black text-white font-sans overflow-hidden pt-16">
                {/* Background Glow */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
                </div>

                <div className={`relative z-10 w-full transition-all duration-500 flex flex-col items-center ${isFullscreen ? "h-[calc(100dvh-64px)] px-0" : "h-[calc(100dvh-100px)] md:h-[85vh] max-w-7xl px-2 md:px-8"}`}>
                    
                    {/* Header Control Panel */}
                    <div className="w-full flex justify-between items-end mb-2 px-1 md:px-2">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Smash Karts
                            </h1>
                            <p className="text-gray-400 text-xs tracking-widest uppercase mt-1 hidden sm:block">
                                Multiplayer Tactical Racing
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-600 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs uppercase tracking-widest hover:border-blue-500 transition-colors"
                            >
                                {isFullscreen ? (
                                    <><FaCompress className="size-3" /> <span className="hidden sm:inline">Normal</span></>
                                ) : (
                                    <><FaExpand className="size-3" /> <span className="hidden sm:inline">Expand</span></>
                                )}
                            </button>
                            <button 
                                onClick={() => { setIsPlaying(false); setIsFullscreen(false); }}
                                className="flex items-center gap-2 px-4 py-2 border border-red-900/50 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded-lg text-xs uppercase tracking-widest transition-colors"
                            >
                                Exit Game
                            </button>
                        </div>
                    </div>

                    {/* Game Container */}
                    <div className={`w-full flex-1 relative bg-[#111] border border-gray-600 shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden ${isFullscreen ? "rounded-none border-x-0 border-b-0" : "rounded-2xl"}`}>
                        
                        {/* Placeholder loader behind iframe */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                            <div className="size-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <span className="text-xs text-blue-500 tracking-widest uppercase animate-pulse">Initializing Engine...</span>
                        </div>

                        <iframe 
                            src="https://smashkarts.io/" 
                            className="absolute inset-0 w-full h-full z-10"
                            frameBorder="0"
                            scrolling="no"
                            allow="gamepad *; autoplay *; fullscreen *; display-capture *; keyboard *"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[100dvh] bg-black text-white font-sans overflow-x-hidden pt-24 pb-20 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Featured Game Hero */}
                <div className="relative w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(37,99,235,0.15)] mb-12 group">
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none group-hover:bg-black/20 transition-all duration-500"></div>
                    
                    {/* YouTube Video Background (3s to 23s Loop) */}
                    <div className="absolute inset-0 w-full h-full bg-black z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                        <iframe
                            className="w-[300%] h-[300%] md:w-[150%] md:h-[150%] scale-[1.2] opacity-80"
                            src="https://www.youtube.com/embed/qCl3jAZP28I?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=qCl3jAZP28I&start=3&end=23"
                            allow="autoplay; encrypted-media"
                            frameBorder="0"
                        ></iframe>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                        <div className="inline-block px-3 py-1 mb-4 border border-blue-500/50 rounded-full bg-blue-500/20 backdrop-blur-md w-fit pointer-events-auto">
                            <span className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Featured Title</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white mb-2 drop-shadow-lg">
                            Smash Karts
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base max-w-2xl mb-8 tracking-wide font-light border-l-2 border-blue-500 pl-4 py-1">
                            Battle online against players from around the world in this fast-paced, weapon-filled kart racing arena. Master tactical drops and perfect your drifting mechanics.
                        </p>
                        
                        <button 
                            onClick={() => setIsPlaying(true)}
                            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] w-fit pointer-events-auto"
                        >
                            <FaPlay className="size-4" />
                            Play Now
                        </button>
                    </div>
                </div>

                {/* Popular Games Library */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-l-4 border-purple-500 pl-3">
                            Trending Games
                        </h2>
                        <span className="text-xs text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">View All</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {popularGames.map((game) => (
                            <div key={game.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-not-allowed border border-gray-800 bg-gray-900 transition-all hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2">
                                <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm md:text-base mb-1">{game.title}</h3>
                                    <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                                        Coming Soon
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Games;
