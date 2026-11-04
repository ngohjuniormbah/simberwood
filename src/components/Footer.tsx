import React from 'react';
import { PageId } from './Navbar';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenAdoptModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdoptModal }) => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* 4-Column Short Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-neutral-600 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <ellipse cx="12" cy="16.5" rx="4.2" ry="3.3" />
                <circle cx="6.5" cy="10" r="2.1" />
                <circle cx="10" cy="6.2" r="1.9" />
                <circle cx="14" cy="6.2" r="1.9" />
                <circle cx="17.5" cy="10" r="2.1" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-neutral-950 font-['Outfit',sans-serif]">
                Simberwood
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-xs">
              Home-raised Cocker Spaniels cultivated with love, sound genetics, and family devotion.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAdoptModal}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              <span>Adopt a Spaniel</span>
            </motion.button>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600">
              {([
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'puppies', label: 'Available Puppies' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'policy', label: 'Policy' },
                { id: 'contact', label: 'Contact' },
              ] as const).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-neutral-950 transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Adoption & Standards */}
          <div>
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-3">
              Adoption & Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600">
              <li>• $250 Deposit to Reserve</li>
              <li>• 1-Year Genetic Health Guarantee</li>
              <li>• Certified Vet Clearance</li>
              <li>• Flight Nanny In-Cabin Travel</li>
              <li>• Raised Inside Our Home</li>
              <li>• Lifetime Zero-Shelter Promise</li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <a href="tel:+13182009580" className="hover:text-neutral-950 transition-colors">
                  +1 (318) 200-9580
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <a href="mailto:simberwoodspaniel@gmail.com" className="hover:text-neutral-950 transition-colors break-all">
                  simberwoodspaniel@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-neutral-500 pt-1 leading-normal">
                Meadowbrook Country Sanctuary • Mon – Sat 9AM – 6PM
              </li>
            </ul>
          </div>
        </div>

        {/* Short Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
          <p>© 2026 Simberwood Cocker Spaniels. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onNavigate('policy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Policy
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
