import { useState } from "react";

interface EnterOverlayProps {
  onEnter: () => void;
}

export const EnterOverlay = ({ onEnter }: EnterOverlayProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 dark:bg-black transition-all duration-500 font-zentry ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-20 animate-pulse transition-colors duration-500"></div>
      </div>

      <div className="z-10 text-center">
        <h1 className="text-gray-900 dark:text-white text-4xl md:text-6xl uppercase tracking-widest mb-8 drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-colors">
          Welcome to the Nexus
        </h1>
        <button
          onClick={handleClick}
          className="group relative px-8 py-4 bg-transparent border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:text-white uppercase tracking-[0.3em] font-bold text-sm overflow-hidden rounded-full transition-all hover:border-transparent hover:shadow-lg dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]"
        >
          <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
          <span className="relative z-10 transition-colors">Initialize Comms</span>
        </button>
      </div>
    </div>
  );
};
