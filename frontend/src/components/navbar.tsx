import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaBars, FaTimes } from "react-icons/fa";
import { useWindowScroll } from "react-use";

import Profile from "./profile";
import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const RGBVertexStyles = () => (
  <style>{`
    @keyframes spin-border {
      100% { transform: rotate(360deg); }
    }
    .rgb-vertex-container {
      padding: 2px;
      position: relative;
      overflow: hidden;
      border-radius: 1.5rem;
      box-shadow: 0 0 40px rgba(0,0,0,0.9);
    }
    .rgb-vertex-container::before {
      content: '';
      position: absolute;
      width: 250%;
      height: 250%;
      top: -75%;
      left: -75%;
      background: conic-gradient(from 0deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000);
      animation: spin-border 3s linear infinite;
      z-index: 0;
    }
    .rgb-vertex-inner {
      position: relative;
      z-index: 10;
      background: #000000;
      border-radius: calc(1.5rem - 2px);
      width: 100%;
      height: 100%;
    }
  `}</style>
);

export const Navbar = () => {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { y: currentScrollY } = useWindowScroll();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prevAudioPlaying) => !prevAudioPlaying);
    setIsIndicatorActive((prevIndicatorActive) => !prevIndicatorActive);
  };

  useEffect(() => {
    if (isAudioPlaying) void audioElementRef.current?.play();
    else audioElementRef.current?.pause();
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
      setIsMobileMenuOpen(false);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <>
      <RGBVertexStyles />
      <header
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
      >
        <div className="absolute top-1/2 w-full -translate-y-1/2 flex justify-center">
          {/* Here we constraint the max width massively to fix the 'too much space' issue globally */}
          <nav className="flex w-full max-w-5xl items-center justify-between p-4 bg-transparent rounded-full backdrop-blur-sm">

            {/* Left Side: Logo (Hero icon) & Leaderboard */}
            <div className="flex items-center gap-6">
              <a href="#hero" className="transition hover:opacity-75">
                <img src="/img/logo.png" alt="Logo" className="w-10 mix-blend-screen" />
              </a>

              <Button
                id="leaderboard-button"
                rightIcon={TiLocationArrow}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              >
                Leaderboards
              </Button>
            </div>

            {/* Right Side: Links, Audio, Profile, and Mobile Hamburger Button */}
            <div className="flex h-full items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                {NAV_ITEMS.map(({ label, href }) => (
                  <a key={href} href={href} className="nav-hover-btn font-zentry tracking-wider text-sm">
                    {label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudioIndicator}
                  className="flex items-center space-x-1 p-2 transition hover:opacity-75"
                  title="Play Audio"
                >
                  <audio ref={audioElementRef} src="/audio/loop.mp3" className="hidden" loop />
                  {Array(4).fill("").map((_, i) => (
                    <div key={i + 1} className={cn("indicator-line", isIndicatorActive && "active")} style={{ animationDelay: `${(i + 1) * 0.1}s` }} />
                  ))}
                </button>

                <Profile />

                {/* Mobile Menu Toggle Button (Restored FaBars / Original Hamburger Request) */}
                <button
                  className="md:hidden text-white hover:text-pink-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Flyout Menu with Animated RGB Vertex Borders */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 md:hidden rgb-vertex-container z-50 transition-all duration-300">
            <div className="rgb-vertex-inner flex flex-col items-center justify-center gap-6 py-10 px-4">
              {NAV_ITEMS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-2xl font-zentry tracking-widest uppercase hover:text-pink-500 transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="w-full h-[1px] bg-white/10 my-2"></div>
              <Button onClick={() => window.location.href = '/chat'} containerClass="bg-white text-black mt-2 w-full flex justify-center uppercase tracking-widest hover:bg-gray-200">
                Contact
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
