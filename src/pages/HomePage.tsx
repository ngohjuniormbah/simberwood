import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puppy } from '../data/simberwoodData';
import { useApp } from '../context/AppContext';
import { PageId } from '../components/Navbar';
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectPuppy: (puppy: Puppy) => void;
  onOpenAdoptModal: (puppyId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectPuppy,
  onOpenAdoptModal,
}) => {
  const { pets, reviews, gallery } = useApp();

  // Typewriter effect for heading: "Find your perfect companion."
  const headingText = 'Find your perfect companion.';
  const [typedHeading, setTypedHeading] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= headingText.length) {
        setTypedHeading(headingText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 65);
    return () => clearInterval(interval);
  }, []);

  // Changing writeups below heading
  const writeups = [
    'Gentle, merry, and health-tested Cocker Spaniels nurtured with unconditional love and dedicated family care.',
    'Raised inside our home with early neurological stimulation, daily socialization, and lifelong devotion.',
    'Thoughtfully bred for sweet dispositions, joyful tail-wags, and loving companionship for your household.',
    'Connecting caring families with happy, healthy Cocker Spaniels backed by our 2-year genetic warranty.',
  ];

  const [writeupIndex, setWriteupIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWriteupIndex((prev) => (prev + 1) % writeups.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [writeups.length]);

  // Gallery slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryItems = gallery.length > 0 ? gallery : [
    { id: 'default-1', imageUrl: '', pictureWriteup: '', captionWriteup: 'Nursery session' }
  ];

  useEffect(() => {
    if (galleryItems.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [galleryItems.length]);

  const [heroSlides, setHeroSlides] = useState<Array<{ id: string; image_url: string }>>([]);
  const [heroSettings, setHeroSettings] = useState({ slideshow_enabled: true, interval_seconds: 5 });
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/hero-slides')
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        if (!active || !result) return;
        setHeroSlides(Array.isArray(result.slides) ? result.slides : []);
        if (result.settings) setHeroSettings(result.settings);
      })
      .catch(() => {
        // Keep the default animated hero if the slideshow has not been configured.
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2 || !heroSettings.slideshow_enabled) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % heroSlides.length);
    }, Math.max(3, heroSettings.interval_seconds) * 1000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length, heroSettings.slideshow_enabled, heroSettings.interval_seconds]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  // Simple contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSending, setContactSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSending(true);
    setContactError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'We could not save your message. Please email us directly.');
      }
      setContactSent(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setContactError(error instanceof Error ? error.message : 'Unable to send your message. Please try again.');
    } finally {
      setContactSending(false);
    }
  };

  const featuredPuppies = pets.filter((p) => p.status !== 'cancel').slice(0, 8);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section: Animated Gray Gradient Background with 21st.dev Style Smooth Motions */}
      <section className={`relative overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20 ${heroSlides.length ? 'bg-neutral-900' : 'animated-gray-gradient-hero'} text-white`}>
        {heroSlides[heroSlideIndex] && (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={heroSlides[heroSlideIndex].id}
                src={heroSlides[heroSlideIndex].image_url}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div aria-hidden="true" className="absolute inset-0 z-[1] bg-black/55" />
          </>
        )}
        {/* Floating Animated Ambient Gray Glowing Orbs */}
        <motion.div
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.15, 0.92, 1],
            opacity: [0.3, 0.55, 0.35, 0.3],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 left-1/4 w-[520px] h-[360px] bg-slate-400/25 rounded-full blur-3xl pointer-events-none z-0"
        />
        <motion.div
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 0.9, 1.18, 1],
            opacity: [0.25, 0.45, 0.3, 0.25],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 right-1/4 w-[560px] h-[380px] bg-neutral-400/20 rounded-full blur-3xl pointer-events-none z-0"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Headline with Typewriter Writing Effect & Fade */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif] leading-[1.12] min-h-[1.2em] drop-shadow-xs"
          >
            <span>{typedHeading}</span>
            <span className="inline-block w-0.5 h-[0.9em] bg-white ml-1 animate-pulse align-middle" />
          </motion.h1>

          {/* Changing writeup effect below heading */}
          <div className="min-h-[2.5rem] mt-3.5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={writeupIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl px-4 leading-relaxed font-medium"
              >
                {writeups[writeupIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Substantive writeup accompanying the hero */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-3.5 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            Welcome to Simberwood. We nurture sound-minded, health-tested English and American Cocker Spaniels right inside our countryside home. With a devoted focus on sweet temperaments, early neurological enrichment, and full genetic guarantees, our puppies grow up to become cherished family companions for a lifetime of unconditional love.
          </motion.p>

          {/* CTAs: Interactive Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAdoptModal()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-100 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Adopt a Spaniel</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('gallery')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See More</span>
              <ArrowRight className="w-4 h-4 text-neutral-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Section: Centered heading "About Us" with Left and Right Animated Columns */}
      <section className="py-10 md:py-14 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Up to Down */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              About Us
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-medium">
              A family tradition of love, health, and lifelong dedication to Cocker Spaniels.
            </p>
          </motion.div>

          {/* Simple text placed side by side: Left Column Animated from Left, Right Column Animated from Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 text-sm sm:text-base text-neutral-600 leading-loose">
            {/* Column 1: Animated from Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-4"
            >
              <p>
                We have been raising Cocker Spaniels for over 6+ years, and through every single day of that journey we have dedicated ourselves to raising them with genuine love, gentle patience, and great veterinary care. From the very first breath our puppies take in our warm nursery suite, they are treated as irreplaceable members of our family, receiving constant human presence, soothing cuddles, and attentive daily monitoring.
              </p>
              <p>
                Over these years, we have mastered every detail of early puppy development—from our daily neonatal stimulation routines and sound desensitization to positive early crate training and house manners. We understand the unique emotional sensitivity of Cocker Spaniels and know how to foster the cheerful, confident, and sweet disposition that makes this breed such a beloved companion in homes with children and other pets.
              </p>
            </motion.div>

            {/* Column 2: Animated from Right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="space-y-4"
            >
              <p>
                Before us, our parents were raising Cocker Spaniels too. Growing up in a household filled with soft velvet ears, joyful tail wags, and merry little shadows gave us an instinctive, lifelong understanding of this wonderful breed. The wisdom, compassionate principles, and ethical standards handed down to us by our parents form the moral foundation of everything we do today at Simberwood.
              </p>
              <p>
                We proudly carry forward this generational legacy by pairing time-honored family dedication with thorough modern health screening, including extensive DNA disease panels, board-certified eye checks, and orthopedic clearance. When you welcome a Simberwood puppy, you become part of our extended family—backed by our lifetime support, caring advice, and open door at every stage of your dog’s life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Adoption Process Section: Animated Down to Up with Staggered Steps */}
      <section className="py-10 md:py-14 bg-neutral-50/50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Down to Up */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              The Process of Adoption
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-medium">
              A smooth, transparent, six-step journey from your initial form to welcome day.
            </p>
          </motion.div>

          {/* Process Timeline with a Visible Horizontal Line */}
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-0.5 bg-neutral-300 z-0" />

            {/* Steps Grid: Staggered entry from Down to Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4 relative z-10">
              {[
                { num: '01', title: 'Fill Adoption Form', desc: 'Fill out our brief adoption questionnaire detailing your home and preferences.' },
                { num: '02', title: '$250 Deposit Payment', desc: 'Submit a $250 reservation deposit to officially lock in and secure your puppy.' },
                { num: '03', title: 'Schedule Pickup Date', desc: 'Coordinate departure for sanctuary pickup or safe flight nanny escort.' },
                { num: '04', title: 'The Vet Clearance', desc: 'Licensed veterinarian performs wellness check, vaccines, and health paperwork.' },
                { num: '05', title: 'Receive Your Spaniel', desc: 'Welcome your sweet, cuddly Cocker Spaniel into your loving arms.' },
                { num: '06', title: 'Send Us a Picture', desc: 'Snap a photo of your puppy happy at home to join our alumni family!' },
              ].map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
                  className="text-center flex flex-col items-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-13 h-13 rounded-full bg-white border-2 border-neutral-900 text-neutral-950 font-bold text-sm flex items-center justify-center shadow-2xs mb-3.5 transition-all group-hover:bg-neutral-950 group-hover:text-white"
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 mb-1.5 font-['Outfit',sans-serif]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action button below the timeline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAdoptModal()}
              className="px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black border border-neutral-700 shadow-xs transition-colors cursor-pointer"
            >
              Start Step 1: Fill Adoption Form
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Available Puppies Section: Directional Card Stagger (Left, Down, Right) */}
      <section className="py-10 md:py-14 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Up to Down */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Available Puppies
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-medium">
              Healthy, joyful Cocker Spaniel puppies ready to join loving families.
            </p>
          </motion.div>

          {/* Minimalist Cards: 2 Rows by 4 Columns (8 Puppies) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featuredPuppies.map((puppy, idx) => {
              // Directional animation: left card from left, middle from bottom, right from right
              const xOffset = idx === 0 ? -35 : idx === 2 ? 35 : 0;
              const yOffset = idx === 1 ? 35 : 15;

              return (
                <motion.div
                  key={puppy.id}
                  initial={{ opacity: 0, x: xOffset, y: yOffset }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: idx * 0.1, ease: 'easeOut' }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow duration-300 flex flex-col group"
                >
                  {/* Puppy Picture */}
                  <div className="aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                    {puppy.primaryImage ? (
                      <img src={puppy.primaryImage} alt={puppy.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-medium text-neutral-400">Photo coming soon</div>
                    )}
                  </div>

                  {/* Name & Price */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                        {puppy.name}
                      </h3>
                      <span className="text-lg font-bold text-neutral-900 font-['Outfit',sans-serif]">
                        ${puppy.adoptionFee.toLocaleString()}
                      </span>
                    </div>

                    {/* Two Buttons: Full View and Apply to Adopt */}
                    <div className="grid grid-cols-2 gap-2.5 mt-5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const mappedPuppy: Puppy = {
                            id: puppy.id,
                            name: puppy.name,
                            breedType: puppy.breedType === 'American Cocker Spaniel' ? 'American Cocker Spaniel' : 'English Cocker Spaniel',
                            coatColor: puppy.coatColor,
                            coatType: 'Silky Flat',
                            estimatedWeight: '22-26 lbs',
                            gender: puppy.gender,
                            ageWeeks: puppy.ageWeeks,
                            dob: 'August 2026',
                            sire: 'Simberwood Sir Montgomery',
                            dam: 'Lady Clementine',
                            status: puppy.status === 'available' ? 'available' : 'reserved',
                            adoptionFee: puppy.adoptionFee,
                            headline: puppy.headline || 'Sweet companion spaniel',
                            description: puppy.description || '',
                            temperament: puppy.temperament || ['Gentle', 'Loyal'],
                            healthHighlights: ['Vaccinated', 'Vet Certified', 'Microchipped'],
                            vaccinated: true,
                            microchipped: true,
                            dewormed: true,
                            vetChecked: true,
                            readyDate: 'Available Now',
                            primaryImage: puppy.primaryImage,
                            additionalImages: [puppy.primaryImage],
                          };
                          onSelectPuppy(mappedPuppy);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors cursor-pointer text-center"
                      >
                        Full View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenAdoptModal(puppy.id)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-black border border-neutral-700 shadow-2xs transition-colors cursor-pointer text-center"
                      >
                        Apply to Adopt
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Policy Section: Alternating Left and Right Animated Writeups */}
      <section className="py-10 md:py-14 bg-neutral-50/50 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Down to Up */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Adoption Policies
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-medium">
              Clear, transparent standards to guarantee safety, health, and lifelong trust.
            </p>
          </motion.div>

          {/* Paragraphs writeups: Alternating Slide Animations */}
          <div className="space-y-8 text-neutral-600 leading-relaxed">
            {/* Deposits & Reservations: From Left */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                Deposits & Reservations
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-loose pt-0.5">
                To reserve a puppy, a non-refundable deposit of $250 is required. This deposit goes toward the final purchase price of your puppy. Placing this deposit officially reserves your chosen Cocker Spaniel, guaranteeing that they will not be offered to any other applicant while our nursery team prepares their individualized care plan, developmental milestones, and homecoming essentials.
              </p>
            </motion.div>

            {/* 1-Year Health Guarantee: From Right */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                1-Year Health Guarantee
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-loose pt-0.5">
                All puppies come with a 1-year genetic health guarantee covering life-threatening congenital defects. We test and certify our parent bloodlines to ensure the soundest genetic foundation. If a genetic condition is diagnosed by a licensed veterinarian within the first year, we will offer a replacement puppy from an upcoming planned litter.
              </p>
            </motion.div>

            {/* Shipping & Delivery: From Left */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                Shipping & Delivery
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-loose pt-0.5">
                We can arrange a flight nanny for an additional fee to deliver your puppy to your nearest major airport. We prefer not to ship cargo to ensure the safety and comfort of our puppies. With our dedicated flight nanny service, your puppy travels safely in-cabin under gentle, watchful human supervision throughout transit and is personally hand-delivered directly into your arms at baggage claim. Families are also warmly welcomed to pick up their puppy in person at our country sanctuary.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Our Cocker Spaniels Excel as Family Dogs: Directional Pop-Up Cards */}
      <section className="py-10 md:py-14 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Up to Down */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Why Our Cocker Spaniels Excel as Family Dogs
            </h2>
          </motion.div>

          {/* Cards with no icons, larger font size, and directional entry */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Raised with Love',
                desc: 'We raise each puppy right inside our home with deep affection, constant gentle handling, and unconditional love from their very first day.',
                badge: 'Home-Raised with Love',
                dir: 'left',
              },
              {
                title: 'Fully Vaccinated',
                desc: 'We make sure every puppy is up to date on all core vaccinations, dewormed, microchipped, and certified healthy by a licensed veterinarian.',
                badge: 'Veterinary Certified',
                dir: 'up',
              },
              {
                title: 'Lovingly Cared For',
                desc: 'Cared for with wholesome nutrition, clean nursery rest, and daily social playtime so they grow up calm, gentle, and confident.',
                badge: 'Attentive In-Home Care',
                dir: 'up',
              },
              {
                title: 'Forever Homes',
                desc: 'We make sure each puppy is well prepared and happily socialized so they can be adopted smoothly into their loving forever homes.',
                badge: 'Ready to Be Adopted',
                dir: 'right',
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{
                  opacity: 0,
                  x: card.dir === 'left' ? -30 : card.dir === 'right' ? 30 : 0,
                  y: card.dir === 'up' ? 30 : 0,
                }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 mt-2.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-neutral-100 text-xs font-semibold text-neutral-800">
                  {card.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section: Left & Right Directional Slide Animations */}
      <section className="py-10 md:py-14 bg-neutral-50/50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Down to Up */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Reviews
            </h2>
          </motion.div>

          {/* Reviews Grid: 2 Rows by 3 Columns (6 Reviews) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.slice(0, 6).map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="flex flex-col space-y-2.5"
              >
                {/* Profile, Name, and Rating */}
                <div className="flex items-center gap-3">
                  {rev.authorPhoto ? (
                    <img src={rev.authorPhoto} alt={rev.author} loading="lazy" className="w-11 h-11 rounded-full object-cover shrink-0 shadow-2xs" />
                  ) : (
                    <div aria-label="Reviewer photo not added" className="w-11 h-11 rounded-full bg-neutral-100 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-neutral-950 font-['Outfit',sans-serif]">
                      {rev.author}
                    </h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-neutral-800 text-neutral-800" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text Below It */}
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-0.5">
                  "{rev.comment}"
                </p>

                {/* Optional link inside review */}
                {rev.reviewLinkUrl && (
                  <div className="pt-0.5">
                    <a
                      href={rev.reviewLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black underline underline-offset-4 transition-colors"
                    >
                      <span>🔗</span> {rev.reviewLinkLabel || 'View Reference'}
                    </a>
                  </div>
                )}

                {/* Optional photo inside the review */}
                {rev.reviewImage && (
                  <div className="mt-2 rounded-xl overflow-hidden aspect-16/9 bg-neutral-100 max-w-sm">
                    <img src={rev.reviewImage} alt="Review snapshot" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section: Animated Up to Down with Smooth Slideshow Scale */}
      <section className="py-10 md:py-14 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Up to Down */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Gallery
            </h2>
          </motion.div>

          {/* Slideshow with no writeups or subtle overlays */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative aspect-16/10 sm:aspect-16/9 md:aspect-21/10 w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="w-full h-full relative"
                >
                  {galleryItems[currentSlide].imageUrl ? (
                    <img src={galleryItems[currentSlide].imageUrl} alt={galleryItems[currentSlide].captionWriteup || 'Simberwood Cocker Spaniel photo'} loading="lazy" className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-100 text-sm font-medium text-neutral-400">Add gallery photos in Admin</div>
                  )}
                  {galleryItems[currentSlide].pictureWriteup && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-neutral-950/80 text-white backdrop-blur-md">
                        {galleryItems[currentSlide].pictureWriteup}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Prev Slide Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevSlide}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Next Slide Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextSlide}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Slideshow Dot Indicators */}
            <div className="flex justify-center items-center gap-1.5 mt-3.5">
              {galleryItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-5 bg-neutral-900' : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section: Animated Down to Up & Compact Height */}
      <section className="py-10 md:py-14 bg-neutral-50/50 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading: Animated Down to Up */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Contact Us
            </h2>
          </motion.div>

          {/* Simple Call and Email Icon Links Only: Animated Left & Right */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8 text-sm font-medium text-neutral-800"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:+13182009580"
              className="inline-flex items-center gap-2 hover:text-black transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-neutral-700">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>+1 (318) 200-9580</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="mailto:simberwoodspaniel@gmail.com"
              className="inline-flex items-center gap-2 hover:text-black transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-neutral-700">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>simberwoodspaniel@gmail.com</span>
            </motion.a>
          </motion.div>

          {/* Simple Message Form with no borders around text: Animated Upwards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {contactSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 bg-white rounded-2xl shadow-2xs p-6"
              >
                <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950">Message Sent Successfully</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Thank you! We will get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="Your Email"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200"
                    />
                  </div>
                </div>

                {/* Message Box */}
                <div>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Your Message..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all resize-none border border-neutral-200"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-1">
                  {contactError && <p role="alert" className="mb-3 text-sm text-red-700">{contactError}</p>}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={contactSending}
                    className="px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-neutral-300" />
                    <span>{contactSending ? 'Sending…' : 'Send Message'}</span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
