import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useApp();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % gallery.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Fade In */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            Gallery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Moments, developmental milestones, and serene nursery days with our Cocker Spaniel puppies.
          </p>
        </motion.div>

        {/* Gallery Grid with ON-PICTURE writeup and BELOW-PICTURE writeup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow border border-neutral-100"
            >
              {/* Photo Container with on-picture writeup */}
              <div
                onClick={() => handleOpenLightbox(idx)}
                className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.captionWriteup}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Writeup that appears ON the picture */}
                {item.pictureWriteup && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-950/80 text-white backdrop-blur-md shadow-xs">
                      {item.pictureWriteup}
                    </span>
                  </div>
                )}
              </div>

              {/* Writeup that goes BELOW the picture */}
              {item.captionWriteup && (
                <div className="p-3.5 bg-white border-t border-neutral-100">
                  <p className="text-xs sm:text-sm font-medium text-neutral-800 leading-snug">
                    {item.captionWriteup}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div onClick={() => setLightboxIndex(null)} className="fixed inset-0" />

            <div className="relative max-w-4xl w-full z-10 flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-neutral-300 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl">
                <img
                  src={gallery[lightboxIndex].imageUrl}
                  alt={gallery[lightboxIndex].captionWriteup}
                  className="w-full max-h-[75vh] object-contain mx-auto"
                />

                {/* Lightbox captions */}
                <div className="p-4 bg-neutral-900 text-white border-t border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    {gallery[lightboxIndex].pictureWriteup && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                        {gallery[lightboxIndex].pictureWriteup}
                      </span>
                    )}
                    <p className="text-xs sm:text-sm text-neutral-200">
                      {gallery[lightboxIndex].captionWriteup}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 shrink-0">
                    {lightboxIndex + 1} / {gallery.length}
                  </span>
                </div>

                {/* Prev / Next controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
