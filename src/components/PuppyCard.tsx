import React from 'react';
import { Puppy } from '../data/simberwoodData';
import { motion } from 'motion/react';

interface PuppyCardProps {
  puppy: Puppy;
  onSelect: (puppy: Puppy) => void;
  onApply: (puppy: Puppy) => void;
}

export const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, onSelect, onApply }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group border border-neutral-100"
    >
      {/* Puppy Image */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        {puppy.primaryImage ? (
          <img
            src={puppy.primaryImage}
            alt={`Cocker Spaniel puppy ${puppy.name}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-neutral-400">Photo coming soon</div>
        )}
      </div>

      {/* Puppy Name and Price only */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
            {puppy.name}
          </h3>
          <span className="text-lg font-bold text-neutral-900 font-['Outfit',sans-serif]">
            ${puppy.adoptionFee.toLocaleString()}
          </span>
        </div>

        {/* Two Buttons: Full View and Apply to Adopt */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onSelect(puppy)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center cursor-pointer"
          >
            Full View
          </button>

          <button
            onClick={() => onApply(puppy)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-900 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
          >
            Apply to Adopt
          </button>
        </div>
      </div>
    </motion.div>
  );
};
