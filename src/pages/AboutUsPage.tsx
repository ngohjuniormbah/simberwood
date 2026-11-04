import React from 'react';
import { PageId } from '../components/Navbar';
import { motion } from 'motion/react';

interface AboutUsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenAdoptModal: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate, onOpenAdoptModal }) => {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            About Us
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Our multi-generational family journey of raising sound, affectionate Cocker Spaniels.
          </p>
        </motion.div>

        {/* 2 Paragraphs Each Placed Side by Side with Left & Right Entrances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 text-neutral-600 text-sm sm:text-base leading-loose max-w-5xl mx-auto mb-16 md:mb-24">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="space-y-5"
          >
            <p>
              For over 6+ years, our family has been dedicated to raising Cocker Spaniels with genuine love and prioritizing their sound health above everything else. We nurture our spaniels directly inside our home, ensuring each puppy grows up in a calm, affectionate environment where they receive individual human attention from their earliest days.
            </p>
            <p>
              Long before our own journey began, our parents were also devoted to raising Cocker Spaniels. Growing up surrounded by their gentle companionship taught us the generational knowledge, gentle touch, and patience required to cultivate loyal, calm, and emotionally balanced family dogs.
            </p>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="space-y-5"
          >
            <p>
              We believe every puppy deserves thoughtful care from day one. Our spaniels are fed premium veterinary-approved nutrition, given daily gentle handling, and introduced to everyday household sights and sounds so they grow into confident, friendly companions who adapt effortlessly to family routines.
            </p>
            <p>
              When you welcome a Simberwood Cocker Spaniel, you are not simply bringing home a pet—you are receiving a companion raised with warmth, socialization, and lifelong dedication to their well-being. We remain a trusted resource and family friend for the entire lifetime of your spaniel.
            </p>
          </motion.div>
        </div>

        {/* Why Our Cocker Spaniels Excel as Family Dogs */}
        <div className="max-w-6xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Why Our Cocker Spaniels Excel as Family Dogs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              {
                title: 'Raised with Love',
                desc: 'Raised inside our home with daily affection, gentle cuddles, and personal devotion from day one.',
              },
              {
                title: 'Fully Vaccinated',
                desc: 'Complete age-appropriate core vaccinations, deworming, and certified veterinary health clearances.',
              },
              {
                title: 'Lovingly Cared For',
                desc: 'Attentive day-to-day enrichment, premium nutrition, clean country grounds, and round-the-clock supervision.',
              },
              {
                title: 'Ready for Forever Homes',
                desc: 'Thoroughly socialized, confident, and prepared to transition smoothly into their loving forever families.',
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 text-left hover:shadow-sm transition-all"
              >
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 font-['Outfit',sans-serif] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Adoption Process Timeline */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Adoption Process
            </h2>
          </motion.div>

          <div className="relative">
            {/* Horizontal Line behind process steps on larger screens */}
            <div className="hidden lg:block absolute top-6 left-8 right-8 h-0.5 bg-neutral-300 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              {[
                { step: '1', title: 'Adoption Form', desc: 'Fill out our questionnaire' },
                { step: '2', title: '$250 Deposit', desc: 'Reserve your puppy' },
                { step: '3', title: 'Schedule Pickup', desc: 'Set convenient pickup date' },
                { step: '4', title: 'The Vet', desc: 'Licensed health check' },
                { step: '5', title: 'Receive Spaniel', desc: 'Welcome your companion' },
                { step: '6', title: 'Send Us a Picture', desc: 'Share your new moments' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-neutral-900 text-neutral-900 font-bold flex items-center justify-center text-sm shadow-xs mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-950 mb-1 font-['Outfit',sans-serif]">{item.title}</h3>
                  <p className="text-xs text-neutral-500 leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('puppies')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black transition-colors cursor-pointer shadow-xs"
          >
            See Available Puppies
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAdoptModal}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Adopt a Spaniel
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
