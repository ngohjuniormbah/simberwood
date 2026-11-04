import React from 'react';
import { useApp } from '../context/AppContext';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

export const ReviewsPage: React.FC = () => {
  const { reviews } = useApp();

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            Reviews
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Real stories and heartfelt experiences from families who welcomed a Simberwood Cocker Spaniel into their home.
          </p>
        </motion.div>

        {/* Reviews Grid: 2 Rows by 3 Columns (6 Reviews) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="flex flex-col space-y-3"
            >
              {/* Profile, Name, and Rating */}
              <div className="flex items-center gap-3.5">
                <img
                  src={rev.authorPhoto}
                  alt={rev.author}
                  className="w-12 h-12 rounded-full object-cover shrink-0 shadow-2xs border border-neutral-200"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-950 font-['Outfit',sans-serif]">
                    {rev.author}
                  </h3>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-neutral-800 text-neutral-800" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text Below It */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-0.5">
                "{rev.comment}"
              </p>

              {/* Link inside review if present */}
              {rev.reviewLinkUrl && (
                <div className="pt-1">
                  <a
                    href={rev.reviewLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black underline underline-offset-4 transition-colors"
                  >
                    <span>🔗</span> {rev.reviewLinkLabel || 'View Reference / Story'}
                  </a>
                </div>
              )}

              {/* Photo inside the review if attached */}
              {rev.reviewImage && (
                <div className="rounded-xl overflow-hidden aspect-16/9 bg-neutral-100 max-w-md shadow-2xs border border-neutral-100">
                  <img
                    src={rev.reviewImage}
                    alt="Pet inside review"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
