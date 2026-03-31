import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { AnimatedTitle } from "./animated-title";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-gray-50 dark:bg-black transition-colors duration-500">
      <div className="relative mt-36 mb-8 flex flex-col items-center gap-5">
        <p className="font-general text-sm font-bold uppercase md:text-[10px] text-gray-600 dark:text-gray-400">
          Welcome to NOVA
        </p>

        <AnimatedTitle containerClass="mt-5 !text-gray-900 dark:!text-white text-center">
          {
            "Disc<b>o</b>ver the world&apos;s l<b>a</b>rgest <br /> shared adventure"
          }
        </AnimatedTitle>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image shadow-2xl dark:shadow-none">
          <img
            src="/img/about.webp"
            alt="Background"
            className="absolute top-0 left-0 size-full object-cover dark:opacity-80"
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center px-10 md:px-32 py-24 bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-circular-web gap-10 transition-colors duration-500">
        <p className="max-w-sm text-center md:text-left text-xl md:text-2xl font-medium leading-relaxed">
          The Ultimate Gaming Arena begins—your life, now an epic multiplayer thrill ride.
        </p>
        <p className="max-w-sm text-center md:text-right text-xl md:text-2xl font-medium leading-relaxed">
          NOVA unites players across games with instant guest access, seamless team play, and real-time chat.
        </p>
      </div>
    </div>
  );
};
