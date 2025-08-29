"use client";

import { useState } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import UserActions from "./UserActions";

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Logo />

          <Navigation />

          <UserActions onMenuToggle={toggleMenu} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <Navigation isMobile={true} onLinkClick={closeMenu} />
        </div>
      )}
    </header>
  );
};

export default MainHeader;
