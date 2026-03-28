import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Story } from "@/components/story";
import { EnterOverlay } from "@/components/EnterOverlay";

import Auth from "./pages/Auth"; // make sure this file exists
import Chat from "./pages/Chat";
import Games from "./pages/Games";
import ProfilePage from "./pages/Profile";
import ContactPage from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import { LiveCounter } from "./components/LiveCounter";

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
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <EnterOverlay onEnter={() => setEntered(true)} />;
  }

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
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <LiveCounter />
      <Footer />
    </div>
  );
};

export default App;
