import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export const SocialProofToast: React.FC = () => {
  const { socialProofEnabled, socialProofMessages } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socialProofEnabled || isDismissedByUser || socialProofMessages.length === 0) {
      setIsVisible(false);
      return;
    }

    // Initial delay: Show first popup 20 seconds after page load
    const initialDelay = 20000;
    // Interval: Appear once in a while (every 5 minutes = 300,000 ms)
    const intervalDelay = 5 * 60 * 1000;
    // How long each popup stays visible before smoothly auto-dismissing (6 seconds)
    const displayDuration = 6000;

    const showNotification = () => {
      setIsVisible(true);
      // Automatically hide after displayDuration
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length);
      }, displayDuration);
    };

    // First appearance after initial 20 seconds
    const firstTimeout = setTimeout(() => {
      showNotification();
    }, initialDelay);

    // Recurring interval every 5 minutes
    const interval = setInterval(() => {
      showNotification();
    }, intervalDelay);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [socialProofEnabled, isDismissedByUser, socialProofMessages.length]);

  if (!socialProofEnabled || isDismissedByUser || socialProofMessages.length === 0) {
    return null;
  }

  const activeMsg = socialProofMessages[currentIndex];
  if (!activeMsg) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pointer-events-auto bg-white rounded-xl py-3 px-3.5 sm:px-4 shadow-xl border border-neutral-200/90 flex items-start gap-3 relative overflow-hidden"
          >
            {/* Online Status Beacon Icon */}
            <div className="pt-1 shrink-0 flex items-center justify-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            {/* Notification Text: Name + Online Status + Page / Activity */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-neutral-950">
                  {activeMsg.name}
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.2">
                  online
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5 leading-snug">
                {activeMsg.action}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setIsDismissedByUser(true);
              }}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md cursor-pointer transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
