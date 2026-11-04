import React, { useState } from 'react';
import { FAQS_DATA } from '../data/simberwoodData';
import { Mail, Phone, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactPageProps {
  onOpenAdoptModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'We could not save your message. Please try again or email us directly.');
      }
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Have questions about our Cocker Spaniels, adoption process, or scheduling a visit? We would love to hear from you.
          </p>
        </motion.div>

        {/* Simple Call and Email Icon Links Only */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10 text-sm font-medium text-neutral-800"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="tel:+13182009580"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span>+1 (318) 200-9580</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:simberwoodspaniel@gmail.com"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span>simberwoodspaniel@gmail.com</span>
          </motion.a>
        </motion.div>

        {/* Simple Message Form with no heavy borders around text */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 px-4 bg-neutral-50/80 rounded-2xl mb-16 border border-neutral-200"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-950">Message Sent Successfully</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Thank you! We will get back to you shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-5 px-5 py-2 rounded-xl text-xs font-semibold text-neutral-800 bg-neutral-200 hover:bg-neutral-300 transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-4 mb-16 md:mb-20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200"
                />
              </div>
            </div>

            {/* Message Box */}
            <div>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your Message..."
                className="w-full px-4 py-3 text-sm rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 transition-all border border-neutral-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              {submitError && <p role="alert" className="mb-3 text-sm text-red-700">{submitError}</p>}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4 text-neutral-300" />
                <span>{isSubmitting ? 'Sending…' : 'Send Message'}</span>
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* FAQs with Centered Heading */}
        <div className="pt-10 border-t border-neutral-200">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS_DATA.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-xl bg-neutral-50 border border-neutral-200/80 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-100/70 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-neutral-900 font-['Outfit',sans-serif]">
                    {faq.question}
                  </span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-neutral-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
