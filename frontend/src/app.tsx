import { Routes, Route } from "react-router-dom";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Story } from "@/components/story";

import Auth from "./pages/Auth"; // make sure this file exists
import Chat from "./pages/Chat";
import Games from "./pages/Games";
import ProfilePage from "./pages/Profile";
import ContactPage from "./pages/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
    </>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/games" element={<Games />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
