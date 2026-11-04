import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Phone, Mail } from 'lucide-react';

export type PageId = 'home' | 'about' | 'puppies' | 'reviews' | 'gallery' | 'policy' | 'contact' | 'admin';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAdoptModal: (puppyId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAdoptModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'puppies', label: 'Available Puppies' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'policy', label: 'Policy' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top bar above navbar: +1 (318) 200-9580 and simberwoodspaniel@gmail.com */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-1 font-medium tracking-wide">
          <a
            href="tel:+13182009580"
            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>+1 (318) 200-9580</span>
          </a>
          <a
            href="mailto:simberwoodspaniel@gmail.com"
            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>simberwoodspaniel@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo: Clean borderless Gray Paw Logo + Simberwood name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg p-1 cursor-pointer"
          >
            {/* Paw Icon in Gray Color - Simple & borderless */}
            <svg
              className="w-7 h-7 text-neutral-600 fill-current transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <ellipse cx="12" cy="16.5" rx="4.2" ry="3.3" />
              <circle cx="6.5" cy="10" r="2.1" />
              <circle cx="10" cy="6.2" r="1.9" />
              <circle cx="14" cy="6.2" r="1.9" />
              <circle cx="17.5" cy="10" r="2.1" />
            </svg>
            <span className="font-bold text-2xl tracking-tight text-neutral-950 font-['Outfit',sans-serif]">
              Simberwood
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-neutral-950 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-neutral-800 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Far Right: Adopt a Spaniel button (Heart icon removed) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenAdoptModal()}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 hover:from-neutral-900 hover:to-black border border-neutral-700 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer active:scale-98"
            >
              <span>Adopt a Spaniel</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenAdoptModal()}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-neutral-900 border border-neutral-700"
            >
              Adopt
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            id="mobile-navigation"
            className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 overflow-hidden"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left text-sm font-medium ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-950 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdoptModal();
                }}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 shadow-sm"
              >
                <span>Adopt a Spaniel</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-1">
                <span>OFA Certified • 2-Year Health Warranty</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
