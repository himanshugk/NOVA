import { SOCIAL_LINKS } from "@/constants";

export const Footer = () => {
  return (
    <footer className="w-screen bg-black py-2.5 text-gray-400 border-t border-white/10 z-50 relative">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-8 md:flex-row">
        <p className="text-center text-[11px] md:text-left tracking-wide">
          &copy; <strong className="font-semibold text-white">Nova</strong>{" "}
          {new Date().getFullYear()}. All rights reserved.
        </p>

        <div className="flex justify-center gap-3 md:justify-start">
          {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-gray-500 hover:text-white transition-colors duration-300 ease-in-out size-3.5 flex items-center justify-center"
            >
              <Icon />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <a
            href="#"
            className="text-center transition hover:text-white hover:underline md:text-right"
          >
            Privacy Policy
          </a>

          <span className="text-gray-600">|</span>

          <a
            href="#"
            className="text-center transition hover:text-white hover:underline md:text-right"
          >
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};
