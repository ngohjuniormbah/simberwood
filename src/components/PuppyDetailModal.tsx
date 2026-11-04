import React, { useState, useEffect } from 'react';
import { Puppy, PUPPIES_DATA } from '../data/simberwoodData';
import { X, ShieldCheck, Check, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PuppyDetailModalProps {
  puppy: Puppy | null;
  onClose: () => void;
  onApply: (puppy: Puppy) => void;
  onSelectOtherPuppy?: (puppy: Puppy) => void;
}

export const PuppyDetailModal: React.FC<PuppyDetailModalProps> = ({
  puppy,
  onClose,
  onApply,
  onSelectOtherPuppy,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (puppy) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [puppy, onClose]);

  if (!puppy) return null;

  const images = puppy.additionalImages && puppy.additionalImages.length > 0
    ? puppy.additionalImages
    : [puppy.primaryImage];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-700 shadow-sm border border-neutral-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left: Photos */}
            <div className="md:col-span-5 bg-neutral-100 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
              <div>
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-xs relative">
                  <img
                    src={images[selectedImageIndex] || puppy.primaryImage}
                    alt={puppy.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900/90 text-white backdrop-blur-md">
                      {puppy.status === 'available' ? 'Available for Adoption' : 'Reserved'}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                          selectedImageIndex === idx
                            ? 'border-neutral-900 shadow-sm scale-102'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`${puppy.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Adoption Package Quick Checklist */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-neutral-200">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-neutral-800" />
                  <span>Adoption Package Included</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                    <span>2-Year Genetic Health Warranty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                    <span>ISO Microchip pre-registered</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                    <span>Core puppy vaccines & dewormings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                    <span>Pedigree registration paperwork</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                    <span>Scent blanket & transition nutrition kit</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Bio & Full Details */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      {puppy.breedType}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-['Outfit',sans-serif] mt-0.5">
                      {puppy.name}
                    </h2>
                    <p className="text-sm font-medium text-neutral-600 mt-1">
                      {puppy.coatColor} • {puppy.coatType}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">Adoption Fee</span>
                    <p className="text-2xl font-bold text-neutral-900 font-['Outfit',sans-serif]">
                      ${puppy.adoptionFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                  <div>
                    <span className="text-neutral-500 block">Gender</span>
                    <span className="font-semibold text-neutral-900">{puppy.gender}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Health</span>
                    <span className="font-semibold text-neutral-900">Vet Certified</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Adult Size</span>
                    <span className="font-semibold text-neutral-900">{puppy.estimatedWeight}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Ready Date</span>
                    <span className="font-semibold text-neutral-900 truncate block">Now</span>
                  </div>
                </div>

                {/* Personality & Bio */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Personality & Temperament
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {puppy.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {puppy.temperament.map((trait, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pedigree & Parents */}
                <div className="mt-5 pt-4 border-t border-neutral-200">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Parentage & Lineage</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-neutral-600">
                    <p>
                      <strong className="text-neutral-800 font-medium">Sire (Father):</strong> {puppy.sire}
                    </p>
                    <p>
                      <strong className="text-neutral-800 font-medium">Dam (Mother):</strong> {puppy.dam}
                    </p>
                  </div>
                </div>

                {/* Health & DNA Clearances */}
                <div className="mt-5 pt-4 border-t border-neutral-200">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Verified Genetic & Veterinary Clearances</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {puppy.healthHighlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onApply(puppy);
                    }}
                    className="flex-1 py-3 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-neutral-800 to-neutral-950 hover:from-neutral-900 hover:to-black border border-neutral-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply to Adopt {puppy.name}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-3 px-5 rounded-lg text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>

            {/* Other Available Pets for Adoption */}
            <div className="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-950 font-['Outfit',sans-serif]">
                Other Available Pets for Adoption
              </h3>
              <span className="text-xs text-neutral-500 font-medium">Click any puppy to view</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {PUPPIES_DATA.filter((p) => p.id !== puppy.id).slice(0, 4).map((other) => (
                <div
                  key={other.id}
                  onClick={() => {
                    if (onSelectOtherPuppy) {
                      onSelectOtherPuppy(other);
                    }
                  }}
                  className="group bg-white p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 mb-2">
                    <img
                      src={other.primaryImage}
                      alt={other.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-black">
                      {other.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500">${other.adoptionFee.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
