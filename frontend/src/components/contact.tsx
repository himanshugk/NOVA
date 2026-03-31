import { Button } from "./button";

interface ImageClipBoxProps {
  src: string;
  alt: string;
  clipClass?: string;
}

const ImageClipBox = ({ src, alt, clipClass }: ImageClipBoxProps) => (
  <div className={clipClass}>
    <img src={src} alt={alt} />
  </div>
);

export const Contact = () => {
  return (
    <section id="contact" className="my-20 min-h-96 w-screen px-10 transition-colors duration-500 bg-gray-50 dark:bg-transparent">
      <div className="relative rounded-2xl bg-white dark:bg-black py-24 text-gray-900 dark:text-white sm:overflow-hidden border border-gray-200 dark:border-gray-600 shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,1)] transition-colors duration-500">
        <div className="absolute top-0 -left-20 hidden h-full w-48 overflow-hidden sm:block lg:left-20 lg:w-64 opacity-60 dark:opacity-80">
          <ImageClipBox
            src="/img/contact-1.webp"
            alt="Contact bg 1"
            clipClass="contact-clip-path-1"
          />

          <ImageClipBox
            src="/img/contact-2.webp"
            alt="Contact bg 2"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:right-10 md:left-auto lg:top-20 lg:w-80 opacity-90 dark:opacity-100">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            alt="Swordman partial"
            clipClass="absolute md:scale-125"
          />

          <ImageClipBox
            src="/img/swordman.webp"
            alt="Swordman"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center relative z-10 bg-white/40 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none p-8 rounded-2xl max-w-2xl mx-auto">
          <p className="font-general text-[10px] uppercase font-bold text-blue-600 dark:text-gray-300 tracking-wider">Join NOVA</p>

          <p className="special-font font-zentry mt-6 w-full text-4xl leading-[0.9] md:text-[4rem] text-gray-900 dark:text-white tracking-widest drop-shadow-sm dark:drop-shadow-none">
            Let&apos;s b<b>u</b>ild the
            <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether
          </p>

          <Button containerClass="mt-10 cursor-pointer bg-blue-600 text-white dark:bg-white dark:text-black hover:bg-blue-700 dark:hover:bg-gray-200 uppercase tracking-widest shadow-lg dark:shadow-none" onClick={() => window.location.href = "/contact"}>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};
