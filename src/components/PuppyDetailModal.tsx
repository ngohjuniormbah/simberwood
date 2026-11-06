import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { Puppy } from '../data/simberwoodData';

interface PuppyDetailModalProps {
  puppy: Puppy | null;
  onClose: () => void;
  onApply: (puppy: Puppy) => void;
}

export const PuppyDetailModal: React.FC<PuppyDetailModalProps> = ({ puppy, onClose, onApply }) => {
  useEffect(() => {
    if (!puppy) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [puppy, onClose]);

  if (!puppy) return null;
  const image = puppy.primaryImage || puppy.additionalImages?.find(Boolean) || '';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close pet details"
        className="fixed inset-0 h-full w-full cursor-default"
      />
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pet-detail-name"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 my-auto grid max-h-[calc(100dvh-1rem)] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] md:grid-cols-2"
      >
        <div className="relative aspect-[4/3] bg-neutral-100 md:aspect-auto md:min-h-[420px]">
          {image ? (
            <img src={image} alt={puppy.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center text-sm text-neutral-400">Photo coming soon</div>
          )}
        </div>

        <div className="flex min-h-[260px] flex-col justify-center p-5 sm:p-8 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pet details"
            className="absolute right-3 top-3 z-20 rounded-full border border-neutral-200 bg-white/95 p-2 text-neutral-700 shadow-sm transition hover:bg-neutral-100 sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 id="pet-detail-name" className="pr-10 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            {puppy.name}
          </h2>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Price</p>
            <p className="mt-1 text-3xl font-bold text-neutral-950">
              ${puppy.adoptionFee.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onApply(puppy)}
            className="mt-8 w-full rounded-xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Adopt {puppy.name}
          </button>
        </div>
      </motion.section>
    </div>
  );
};
