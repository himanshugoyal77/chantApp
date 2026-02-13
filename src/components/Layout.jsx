import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white font-sans selection:bg-[var(--deep-gold)] selection:text-black">
      <Navbar />
      <main className="pt-16 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
