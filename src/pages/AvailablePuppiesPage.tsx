import React, { useState, useMemo } from 'react';
import { Puppy } from '../data/simberwoodData';
import { useApp } from '../context/AppContext';
import { PuppyCard } from '../components/PuppyCard';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AvailablePuppiesPageProps {
  onSelectPuppy: (puppy: Puppy) => void;
  onOpenAdoptModal: (puppyId?: string) => void;
}

export const AvailablePuppiesPage: React.FC<AvailablePuppiesPageProps> = ({
  onSelectPuppy,
  onOpenAdoptModal,
}) => {
  const { pets } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Exclude cancelled pets from visitor view
  const activePets = useMemo(() => {
    return pets.filter((p) => p.status !== 'cancel');
  }, [pets]);

  const filteredPuppies = useMemo(() => {
    if (!searchQuery.trim()) return activePets;
    const query = searchQuery.toLowerCase();
    return activePets.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchColor = p.coatColor.toLowerCase().includes(query);
      const matchBreed = p.breedType.toLowerCase().includes(query);
      const matchGender = p.gender.toLowerCase().includes(query);
      return matchName || matchColor || matchBreed || matchGender;
    });
  }, [searchQuery, activePets]);

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Fade In */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            Available Puppies
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Meet our sweet, home-raised Cocker Spaniel companions ready to join loving families.
          </p>

          {/* Search Bar Only (No gender or status dropdowns) */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search puppy by name, color..."
                className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Puppy Grid: 4 Columns (2 Rows x 4 Columns) */}
        {filteredPuppies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredPuppies.map((pet, idx) => {
              // Convert PetRecord to Puppy interface compatibility
              const puppyItem: Puppy = {
                id: pet.id,
                name: pet.name,
                breedType: (pet.breedType === 'American Cocker Spaniel' ? 'American Cocker Spaniel' : 'English Cocker Spaniel'),
                coatColor: pet.coatColor,
                coatType: 'Silky Flat',
                estimatedWeight: '22-26 lbs',
                gender: pet.gender,
                ageWeeks: pet.ageWeeks,
                dob: 'August 2026',
                sire: 'Simberwood Sir Montgomery',
                dam: 'Lady Clementine',
                status: pet.status === 'available' ? 'available' : 'reserved',
                adoptionFee: pet.adoptionFee,
                headline: pet.headline || 'Sweet companion spaniel',
                description: pet.description || '',
                temperament: pet.temperament || ['Gentle', 'Loyal'],
                healthHighlights: ['Vaccinated', 'Vet Certified', 'Microchipped'],
                vaccinated: true,
                microchipped: true,
                dewormed: true,
                vetChecked: true,
                readyDate: 'Available Now',
                primaryImage: pet.primaryImage,
                additionalImages: [pet.primaryImage],
              };

              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                >
                  <PuppyCard
                    puppy={puppyItem}
                    onSelect={onSelectPuppy}
                    onApply={() => onOpenAdoptModal(pet.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center max-w-md mx-auto"
          >
            <p className="text-base font-bold text-neutral-950">No puppies found matching "{searchQuery}"</p>
            <p className="text-sm text-neutral-500 mt-1">Try searching for a different puppy name or color.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
