import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
    // View mode: 'mala' or 'tap' - No localStorage persistence
  const [viewMode, setViewMode] = useState("mala");

  // daily streak system - ONLY localStorage for streak
  const [streak, setStreak] = useState(
    Number(localStorage.getItem("mala-streak") || 0),
  );
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "मुख्य पृष्ठ", path: "/" },
    { name: "जाप माला", path: "/mala" },
    {name:"जाप माला (टैप)", path:"/tap"},
    { name: "शिवलिंग दर्शन", path: "/shivlinga" }
  ];
// ---------- STREAK ----------
  const updateStreak = () => {
    const lastDate = localStorage.getItem("last-mala-date");
    const today = new Date().toDateString();

    if (lastDate !== today) {
      setStreak((s) => {
        const newStreak = s + 1;
        localStorage.setItem("mala-streak", newStreak);
        return newStreak;
      });
      localStorage.setItem("last-mala-date", today);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1612]/90 backdrop-blur-md border-b border-[var(--deep-gold)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-[var(--deep-gold)] tracking-wider flex items-center">
             <img src="shiva-logo.png" alt=""
             className="h-10 w-10"
             />
              SHIVBHAKTI
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <NavLink
                 state={{
                  viewMode:item.path === "/tap" ? "tap" : "mala",
                 }}
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[var(--deep-gold)] bg-[#2a241d]"
                        : "text-gray-300 hover:text-[var(--deep-gold)] hover:bg-[#2a241d]/50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden flex items-center">
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#2a241d] focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1612] border-b border-[var(--deep-gold)]/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-[var(--deep-gold)] bg-[#2a241d]"
                      : "text-gray-300 hover:text-[var(--deep-gold)] hover:bg-[#2a241d]/50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
