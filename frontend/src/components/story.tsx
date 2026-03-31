import gsap from "gsap";
import { useRef } from "react";

import { AnimatedTitle } from "./animated-title";
import { Button } from "./button";
import { RoundedCorners } from "./rounded-corners";

export const Story = () => {
  const frameRef = useRef<HTMLImageElement>(null);

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (!element) return;

    gsap.to(element, {
      duration: 0.3,
      rotateX: 0,
      rotateY: 0,
      ease: "power1.inOut",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  return (
    <section id="story" className="min-h-dvh w-screen bg-white dark:bg-black text-gray-900 dark:text-blue-50 transition-colors duration-500 overflow-hidden">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm font-bold uppercase md:text-[10px] text-gray-600 dark:text-gray-400">
          the multiversal ip world
        </p>

        <div className="relative size-full">
          <AnimatedTitle containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10 !text-black dark:!text-white drop-shadow-md dark:drop-shadow-none">
            {"The St<b>o</b>ry of <br /> a hidden real<b>m</b>"}
          </AnimatedTitle>

          <div className="story-img-container shadow-2xl dark:shadow-none">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  onMouseEnter={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  src="/img/entrance.webp"
                  alt="Entrance"
                  className="object-contain"
                />
              </div>
            </div>

            <RoundedCorners />
          </div>
        </div>

        <div className="-mt-80 flex w-full justify-center md:me-44 md:-mt-64 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start relative z-20">
            <p className="font-circular-web mt-3 max-w-sm text-center font-medium text-gray-700 dark:text-violet-50 md:text-start bg-white/50 dark:bg-transparent p-2 rounded-lg backdrop-blur-sm dark:backdrop-blur-none transition-colors">
              Where realms converge, lies Zentry the boundless pillar. Discover
              its secrets and shape your fate amidst infinite opportunities.
            </p>

            <Button id="realm-button" containerClass="mt-5 bg-blue-600 dark:bg-blue-50 text-white dark:text-black shadow-lg">
              Discover Prologue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
