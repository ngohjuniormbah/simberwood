/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Navbar, PageId } from './components/Navbar';
import { Footer } from './components/Footer';
import { PuppyDetailModal } from './components/PuppyDetailModal';
import { AdoptApplicationModal } from './components/AdoptApplicationModal';
import { Puppy } from './data/simberwoodData';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { SocialProofToast } from './components/SocialProofToast';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then((module) => ({ default: module.AboutUsPage })));
const AvailablePuppiesPage = lazy(() => import('./pages/AvailablePuppiesPage').then((module) => ({ default: module.AvailablePuppiesPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then((module) => ({ default: module.ReviewsPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((module) => ({ default: module.GalleryPage })));
const PolicyPage = lazy(() => import('./pages/PolicyPage').then((module) => ({ default: module.PolicyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })));

// Helper to determine the target page from the current browser URL (path, hash, or query)
function parsePageFromUrl(): PageId {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const queryPage = searchParams.get('page')?.toLowerCase();

  const pathsToCheck = [pathname, hash, queryPage].filter(Boolean) as string[];

  for (const item of pathsToCheck) {
    if (item === 'admin' || item.endsWith('/admin')) return 'admin';
    if (item === 'about' || item === 'about-us' || item.endsWith('/about')) return 'about';
    if (item === 'puppies' || item === 'available-puppies' || item.endsWith('/puppies')) return 'puppies';
    if (item === 'reviews' || item.endsWith('/reviews')) return 'reviews';
    if (item === 'gallery' || item.endsWith('/gallery')) return 'gallery';
    if (item === 'policy' || item === 'policies' || item.endsWith('/policy')) return 'policy';
    if (item === 'contact' || item.endsWith('/contact')) return 'contact';
  }

  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(parsePageFromUrl);
  const [selectedPuppyForDetail, setSelectedPuppyForDetail] = useState<Puppy | null>(null);
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [preselectedPuppyId, setPreselectedPuppyId] = useState<string | undefined>(undefined);\n  const [preselectedPuppyName, setPreselectedPuppyName] = useState<string | undefined>(undefined);

  // Synchronize state when browser URL changes (back/forward or direct hash/path change)
  useEffect(() => {
    const handleLocationChange = () => {
      const pageFromUrl = parsePageFromUrl();
      setCurrentPage(pageFromUrl);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page);

    // Update browser URL state cleanly
    try {
      const newPath = page === 'home' ? '/' : `/${page}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    } catch {
      // Fallback for sandboxed iframes
      window.location.hash = page === 'home' ? '' : `#${page}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenAdoptModal = (puppyId?: string) => {
    setPreselectedPuppyId(puppyId);
    setAdoptModalOpen(true);
  };

  const handleSelectPuppy = (puppy: Puppy) => {
    setSelectedPuppyForDetail(puppy);
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-800 selection:text-white relative overflow-x-hidden">
        {/* Global Navigation - Admin button removed, accessible strictly via /admin URL */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAdoptModal={() => handleOpenAdoptModal()}
        />

        {/* Main Page Area with Framer Motion Fade Transitions */}
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[50vh]" aria-label="Loading page" />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onSelectPuppy={handleSelectPuppy}
                  onOpenAdoptModal={handleOpenAdoptModal}
                />
              )}
              {currentPage === 'about' && (
                <AboutUsPage
                  onNavigate={handleNavigate}
                  onOpenAdoptModal={() => handleOpenAdoptModal()}
                />
              )}
              {currentPage === 'puppies' && (
                <AvailablePuppiesPage
                  onSelectPuppy={handleSelectPuppy}
                  onOpenAdoptModal={handleOpenAdoptModal}
                />
              )}
              {currentPage === 'reviews' && <ReviewsPage />}
              {currentPage === 'gallery' && <GalleryPage />}
              {currentPage === 'policy' && (
                <PolicyPage
                  onNavigate={handleNavigate}
                  onOpenAdoptModal={() => handleOpenAdoptModal()}
                />
              )}
              {currentPage === 'contact' && (
                <ContactPage onOpenAdoptModal={() => handleOpenAdoptModal()} />
              )}
              {currentPage === 'admin' && <AdminPage />}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        {/* Global Footer - Clean 4 columns, no visible admin link */}
        <Footer
          onNavigate={handleNavigate}
          onOpenAdoptModal={() => handleOpenAdoptModal()}
        />

        {/* Real-time Visitor Social Proof Message Toast Bubble: appears every 5 mins */}
        <SocialProofToast />

        {/* Global Modals */}
        <PuppyDetailModal
          puppy={selectedPuppyForDetail}
          onClose={() => setSelectedPuppyForDetail(null)}
          onSelectOtherPuppy={(pup) => setSelectedPuppyForDetail(pup)}
          onApply={(pup) => {
            setSelectedPuppyForDetail(null);
            handleOpenAdoptModal(pup.id, pup.name);
          }}
        />

        <AdoptApplicationModal
          isOpen={adoptModalOpen}
          onClose={() => setAdoptModalOpen(false)}
          preselectedPuppyId={preselectedPuppyId}
        />
      </div>
    </AppProvider>
  );
}
