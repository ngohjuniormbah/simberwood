import React from 'react';
import { PageId } from '../components/Navbar';
import { motion } from 'motion/react';

interface PolicyPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAdoptModal: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ onNavigate, onOpenAdoptModal }) => {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            Adoption Policies
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Our clear commitments and terms designed to protect the health, welfare, and lifetime happiness of every Simberwood Cocker Spaniel.
          </p>
        </motion.div>

        {/* Documented in Paragraphs with alternating directional motion */}
        <div className="space-y-12 md:space-y-14 text-neutral-700 leading-loose text-base sm:text-lg">
          {/* Deposits & Reservations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif] mb-2.5">
              Deposits & Reservations
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              To reserve a puppy, a non-refundable deposit of $250 is required. This deposit goes toward the final purchase price of your puppy. Upon submitting your adoption form and receiving approval, your deposit secures your chosen spaniel or priority position for an upcoming litter. All reservations are handled transparently with immediate digital receipt and reservation confirmation.
            </p>
          </motion.div>

          {/* 1-Year Health Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif] mb-2.5">
              1-Year Health Guarantee
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              All puppies come with a 1-year genetic health guarantee covering life-threatening congenital defects. If a genetic condition is diagnosed by a licensed veterinarian within the first year, we will offer a replacement puppy. We take extreme pride in the health testing of our parent spaniels and stand firmly behind the vitality and constitutional soundness of every puppy we place.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base mt-3.5">
              To validate this guarantee, adopters agree to have their puppy examined by a licensed veterinarian within 72 business hours of receiving their puppy, ensuring complete baseline verification and peace of mind.
            </p>
          </motion.div>

          {/* Shipping & Delivery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif] mb-2.5">
              Shipping & Delivery
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              We can arrange a flight nanny for an additional fee to deliver your puppy to your nearest major airport. We prefer not to ship cargo to ensure the safety and comfort of our puppies. A dedicated flight nanny travels with your puppy inside the passenger airplane cabin directly under their care, providing soothing comfort, fresh water, and constant attention until placing them safely in your arms at the airport terminal.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base mt-3.5">
              Alternatively, families are always welcome to schedule a personal pickup date directly at our sanctuary estate or fly into our local airport to meet us curbside.
            </p>
          </motion.div>

          {/* Lifetime Return Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif] mb-2.5">
              Lifetime Return & Zero-Shelter Promise
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              Our moral commitment never expires. If an adopter's circumstances ever change at any point in the dog's life due to relocation, health, or personal hardship, we will immediately welcome the spaniel back into our care. No Simberwood Cocker Spaniel will ever enter a rescue shelter or humane society.
            </p>
          </motion.div>
        </div>

        {/* Clean CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 pt-8 border-t border-neutral-200 text-center flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAdoptModal}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black transition-colors cursor-pointer shadow-xs"
          >
            Apply to Adopt
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
