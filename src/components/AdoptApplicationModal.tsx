import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

interface AdoptApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPuppyId?: string;
  preselectedPuppyName?: string;
}

export const AdoptApplicationModal: React.FC<AdoptApplicationModalProps> = ({
  isOpen,
  onClose,
  preselectedPuppyId,
  preselectedPuppyName,
}) => {
  const { addApplication } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching the 5 steps in the user screenshots
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    phone: '',
    email: '',
    address: '',

    // Step 2: Household
    residenceType: 'House', // House, Apartment, Condo
    ownOrRent: 'Own', // Own, Rent
    petsAllowed: 'Yes', // Yes, No
    fencedYard: 'Yes', // Yes, No
    adults: '2',
    children: '0',
    everyoneAgrees: 'Yes', // Yes, No

    // Step 3: Pet Experience
    ownedDog: 'Yes', // Yes, No
    currentPets: '',
    preferredColor: 'No Preference',
    vetCare: 'Yes', // Yes, No
    preferredSex: 'No Preference',

    // Step 4: Agreements
    certifyTrue: false,
    agreeDeposit: false, // $250 deposit
    wantsNewName: 'No', // Yes, No
    customPuppyName: '',
    puppiesDeserveCare: false,
    acceptTerms: false,

    selectedPuppyId: preselectedPuppyId || '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedPuppyId: preselectedPuppyId || '' }));
  }, [preselectedPuppyId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
      setCurrentStep(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = formData.fullName.trim() && formData.phone.trim() && formData.email.trim() && formData.address.trim();
  const canProceedStep4 = formData.certifyTrue && formData.agreeDeposit && formData.puppiesDeserveCare && formData.acceptTerms;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !canProceedStep1) return;
    if (currentStep === 4 && !canProceedStep4) return;

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 5: Save the completed application to the configured backend.
      setIsSubmitting(true);
      setSubmitError('');
      try {
        const savedId = await addApplication({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        residenceType: formData.residenceType,
        ownOrRent: formData.ownOrRent,
        petsAllowed: formData.petsAllowed,
        fencedYard: formData.fencedYard,
        adults: formData.adults,
        children: formData.children,
        everyoneAgrees: formData.everyoneAgrees,
        ownedDog: formData.ownedDog,
        currentPets: formData.currentPets,
        preferredColor: formData.preferredColor,
        preferredSex: formData.preferredSex,
        vetCare: formData.vetCare,
        customPuppyName: formData.customPuppyName,
        selectedPuppyId: formData.selectedPuppyId,
        });
        if (!savedId) throw new Error('We could not save your application. Please try again or contact us by email.');
        setApplicationId(savedId);
        setIsSubmitted(true);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Unable to submit. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepLabels = [
    { num: 1, label: 'PERSONAL INFO' },
    { num: 2, label: 'HOUSEHOLD' },
    { num: 3, label: 'PET EXPERIENCE' },
    { num: 4, label: 'AGREEMENTS' },
    { num: 5, label: 'REVIEW & SUBMIT' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-2 backdrop-blur-xs sm:items-center sm:p-6">
      {/* Backdrop click to close */}
      <div onClick={onClose} className="fixed inset-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="adoption-form-modal relative z-10 my-auto max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-[#faf9f6] p-4 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Top Stepper Indicator */}
            <div className="mb-8 pt-2">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:hidden">
                Step {currentStep} of 5 · {stepLabels[currentStep - 1].label}
              </p>
              <div className="flex items-center justify-between max-w-xl mx-auto px-2">
                {stepLabels.map((s, idx) => {
                  const isCompleted = s.num < currentStep;
                  const isCurrent = s.num === currentStep;

                  return (
                    <React.Fragment key={s.num}>
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-[#1a2b49] text-white shadow-sm'
                              : 'bg-neutral-200 text-neutral-500'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                        </div>
                        <span
                          className={`mt-2 hidden text-[9px] tracking-wider uppercase font-semibold transition-colors sm:block sm:text-[10px] ${
                            isCurrent
                              ? 'text-[#1a2b49] font-bold'
                              : isCompleted
                              ? 'text-neutral-700'
                              : 'text-neutral-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>

                      {/* Connecting Line between steps */}
                      {idx < stepLabels.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1.5 -mt-5 transition-colors duration-300 ${
                            s.num < currentStep ? 'bg-emerald-500' : 'bg-neutral-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {preselectedPuppyName && (
              <div className="mb-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
                You’re applying to adopt <strong className="font-bold text-neutral-950">{preselectedPuppyName}</strong>.
              </div>
            )}

            {/* Main White Card Content */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 sm:p-8">
              <form onSubmit={handleNext}>
                {/* STEP 1: Applicant Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
                        Applicant Information
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Tell us about yourself.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="you@email.com"
                          className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Home Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main St, City, State, Zip"
                        className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                      />
                    </div>

                    {/* Step 1 Actions */}
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={!canProceedStep1}
                        className="px-8 py-3 rounded-md text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <span>NEXT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Household Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
                        Household Information
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Your living situation.
                      </p>
                    </div>

                    {/* Type of Residence */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Type of Residence <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['House', 'Apartment', 'Condo'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleInputChange('residenceType', type)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.residenceType === type
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Do you own or rent? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Do you own or rent? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Own', 'Rent'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleInputChange('ownOrRent', status)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.ownOrRent === status
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Does your residence allow pets? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Does your residence allow pets? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('petsAllowed', opt)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.petsAllowed === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Do you have a fenced yard? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Do you have a fenced yard?
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('fencedYard', opt)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.fencedYard === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Household Members */}
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-[#1a2b49] font-['Outfit',sans-serif] mb-2.5">
                        Household Members
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1">
                            Adults
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.adults}
                            onChange={(e) => handleInputChange('adults', e.target.value)}
                            className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1">
                            Children
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.children}
                            onChange={(e) => handleInputChange('children', e.target.value)}
                            className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Does everyone agree to adopt? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Does everyone agree to adopt? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('everyoneAgrees', opt)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.everyoneAgrees === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 Actions */}
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase text-[#1a2b49] border border-[#1a2b49] hover:bg-neutral-50 transition-colors flex w-full items-center justify-center gap-1.5 cursor-pointer sm:w-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-3 rounded-md text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] transition-colors flex w-full items-center justify-center gap-2 cursor-pointer shadow-sm sm:w-auto"
                      >
                        <span>NEXT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Pet Experience */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
                        Pet Experience
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Your experience with pets.
                      </p>
                    </div>

                    {/* Have you owned a dog before? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Have you owned a dog before? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('ownedDog', opt)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.ownedDog === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Current Pets */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Current Pets (species/breed/age)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.currentPets}
                        onChange={(e) => handleInputChange('currentPets', e.target.value)}
                        placeholder="e.g. Dog — Golden Retriever — 4yrs, or 'None'"
                        className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1a2b49] resize-none"
                      />
                    </div>

                    {!preselectedPuppyId && (
                      <>
                    {/* Preferred Color */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Preferred Color
                      </label>
                      <select
                        value={formData.preferredColor}
                        onChange={(e) => handleInputChange('preferredColor', e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Buff / Golden">Buff / Golden</option>
                        <option value="Black">Black</option>
                        <option value="Black & Tan">Black & Tan</option>
                        <option value="Parti-Color / Roan">Parti-Color / Roan</option>
                      </select>
                    </div>

                      </>
                    )}

                    {/* Will you provide routine veterinary care? */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Will you provide routine veterinary care? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('vetCare', opt)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                              formData.vetCare === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white shadow-xs'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!preselectedPuppyId && (
                      <>
                    {/* Preferred Sex */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Preferred Sex
                      </label>
                      <select
                        value={formData.preferredSex}
                        onChange={(e) => handleInputChange('preferredSex', e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-lg border border-neutral-200 text-neutral-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                      </>
                    )}

                    {/* Step 3 Actions */}
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase text-[#1a2b49] border border-[#1a2b49] hover:bg-neutral-50 transition-colors flex w-full items-center justify-center gap-1.5 cursor-pointer sm:w-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-3 rounded-md text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] transition-colors flex w-full items-center justify-center gap-2 cursor-pointer shadow-sm sm:w-auto"
                      >
                        <span>NEXT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Agreement & Terms */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
                        Agreement & Terms
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Read and agree to the following.
                      </p>
                    </div>

                    {/* Checkbox 1 */}
                    <label className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.certifyTrue}
                        onChange={(e) => handleInputChange('certifyTrue', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#1a2b49] focus:ring-[#1a2b49] accent-[#1a2b49]"
                        required
                      />
                      <span className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        I certify this information is true and complete. I understand this does not guarantee approval. <span className="text-red-500">*</span>
                      </span>
                    </label>

                    {/* Checkbox 2: Exactly $250 deposit */}
                    <label className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.agreeDeposit}
                        onChange={(e) => handleInputChange('agreeDeposit', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#1a2b49] focus:ring-[#1a2b49] accent-[#1a2b49]"
                        required
                      />
                      <span className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        I agree that a <strong className="font-bold text-neutral-950">$250 deposit</strong> is required for my complete application and reservation. <span className="text-red-500">*</span>
                      </span>
                    </label>

                    {/* Custom Puppy Name Card with Gold Border */}
                    <div className="p-4 sm:p-5 rounded-xl border border-amber-400 bg-amber-50/15">
                      <div className="flex items-start gap-2 text-amber-600 mb-1">
                        <Heart className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0 mt-0.5" />
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                          Would you like to give your puppy a new name?
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-500 mb-3.5 pl-6">
                        The chosen name will be included in your transfer of ownership and health guarantee certificate.
                      </p>

                      <div className="grid grid-cols-2 gap-3 pl-6">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange('wantsNewName', opt)}
                            className={`py-2.5 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                              formData.wantsNewName === opt
                                ? 'border-[#1a2b49] bg-[#1a2b49] text-white'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {formData.wantsNewName === 'Yes' && (
                        <div className="mt-3.5 pl-6">
                          <input
                            type="text"
                            value={formData.customPuppyName}
                            onChange={(e) => handleInputChange('customPuppyName', e.target.value)}
                            placeholder="Enter your puppy's new name (e.g. Copper, Bella)"
                            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1a2b49]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Checkbox 3 */}
                    <label className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.puppiesDeserveCare}
                        onChange={(e) => handleInputChange('puppiesDeserveCare', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#1a2b49] focus:ring-[#1a2b49] accent-[#1a2b49]"
                        required
                      />
                      <span className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        I understand our puppies deserve protection, love, attention, and proper care. <span className="text-red-500">*</span>
                      </span>
                    </label>

                    {/* Checkbox 4 */}
                    <label className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#1a2b49] focus:ring-[#1a2b49] accent-[#1a2b49]"
                        required
                      />
                      <span className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        I accept all terms and conditions. <span className="text-red-500">*</span>
                      </span>
                    </label>

                    {/* Step 4 Actions */}
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase text-[#1a2b49] border border-[#1a2b49] hover:bg-neutral-50 transition-colors flex w-full items-center justify-center gap-1.5 cursor-pointer sm:w-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="submit"
                        disabled={!canProceedStep4}
                        className="px-8 py-3 rounded-md text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <span>NEXT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Review & Submit */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
                        Review & Submit
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Verify everything before submitting.
                      </p>
                    </div>

                    {preselectedPuppyName && (
                      <div className="rounded-xl border border-[#1a2b49]/15 bg-[#1a2b49]/5 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Pet you’re applying to adopt</p>
                        <p className="mt-1 text-base font-bold text-[#1a2b49]">{preselectedPuppyName}</p>
                      </div>
                    )}

                    {/* Personal Info Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-neutral-50/70 border border-neutral-100 space-y-2">
                      <h4 className="text-xs font-bold text-[#1a2b49] uppercase tracking-wider mb-2">
                        PERSONAL INFO
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">NAME</span>
                          <span className="font-medium text-neutral-900">{formData.fullName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">PHONE</span>
                          <span className="font-medium text-neutral-900">{formData.phone || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">EMAIL</span>
                          <span className="font-medium text-neutral-900 break-all">{formData.email || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">ADDRESS</span>
                          <span className="font-medium text-neutral-900">{formData.address || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Household Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-neutral-50/70 border border-neutral-100 space-y-2">
                      <h4 className="text-xs font-bold text-[#1a2b49] uppercase tracking-wider mb-2">
                        HOUSEHOLD
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">RESIDENCE</span>
                          <span className="font-medium text-neutral-900">{formData.residenceType}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">OWN/RENT</span>
                          <span className="font-medium text-neutral-900">{formData.ownOrRent}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">PETS ALLOWED</span>
                          <span className="font-medium text-neutral-900">{formData.petsAllowed}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">FENCED YARD</span>
                          <span className="font-medium text-neutral-900">{formData.fencedYard}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">ADULTS</span>
                          <span className="font-medium text-neutral-900">{formData.adults}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">CHILDREN</span>
                          <span className="font-medium text-neutral-900">{formData.children === '0' ? 'None' : formData.children}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-neutral-400 block uppercase text-[10px]">EVERYONE AGREES</span>
                          <span className="font-medium text-neutral-900">{formData.everyoneAgrees}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pet Experience Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-neutral-50/70 border border-neutral-100 space-y-2">
                      <h4 className="text-xs font-bold text-[#1a2b49] uppercase tracking-wider mb-2">
                        PET EXPERIENCE
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">OWNED DOG</span>
                          <span className="font-medium text-neutral-900">{formData.ownedDog}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-neutral-400 block uppercase text-[10px]">CURRENT PETS</span>
                          <span className="font-medium text-neutral-900">{formData.currentPets || 'None'}</span>
                        </div>
                        {!preselectedPuppyId && (
                          <>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">COLOR</span>
                          <span className="font-medium text-neutral-900">{formData.preferredColor}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">SEX</span>
                          <span className="font-medium text-neutral-900">{formData.preferredSex}</span>
                        </div>
                          </>
                        )}
                        <div>
                          <span className="text-neutral-400 block uppercase text-[10px]">VET CARE</span>
                          <span className="font-medium text-neutral-900">{formData.vetCare}</span>
                        </div>
                        {formData.wantsNewName === 'Yes' && formData.customPuppyName && (
                          <div className="col-span-2">
                            <span className="text-neutral-400 block uppercase text-[10px]">NEW PUPPY NAME</span>
                            <span className="font-medium text-amber-700">{formData.customPuppyName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agreements Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-neutral-50/70 border border-neutral-100 space-y-2 text-xs">
                      <h4 className="text-xs font-bold text-[#1a2b49] uppercase tracking-wider mb-2">
                        AGREEMENTS
                      </h4>
                      <div className="space-y-1.5 text-neutral-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Info certified true</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>$250 deposit agreed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Puppies deserve the best</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Terms accepted</span>
                        </div>
                      </div>
                    </div>

                    {submitError && <p role="alert" className="mt-4 break-words rounded-lg bg-red-50 p-3 text-sm leading-relaxed text-red-700">{submitError}</p>}

                    {/* Step 5 Actions */}
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase text-[#1a2b49] border border-[#1a2b49] hover:bg-neutral-50 transition-colors flex w-full items-center justify-center gap-1.5 cursor-pointer sm:w-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>PREVIOUS</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-md text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] transition-colors flex w-full items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 sm:w-auto"
                      >
                        <span>{isSubmitting ? 'SAVING…' : 'SUBMIT APPLICATION'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Questions Footer note */}
            <div className="mt-5 text-center text-xs text-neutral-500">
              Questions? Call <a href="tel:+13182009580" className="font-bold text-[#1a2b49] hover:underline">+1 (318) 200-9580</a>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-10 px-4 bg-white rounded-2xl border border-neutral-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 mb-2">
              Application ID: {applicationId}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a2b49] font-['Outfit',sans-serif]">
              Thank You, {formData.fullName || 'Valued Adopter'}!
            </h3>

            <p className="text-sm text-neutral-600 max-w-lg mx-auto mt-2 leading-relaxed">
              {preselectedPuppyName
                ? <>Your application to adopt <strong className="text-neutral-950">{preselectedPuppyName}</strong> has been received. We will contact you at <strong>{formData.email}</strong>.</>
                : <>Your Cocker Spaniel adoption application has been received. We will contact you at <strong>{formData.email}</strong>.</>}
            </p>

            <div className="mt-6 p-5 rounded-xl bg-neutral-50 text-left max-w-md mx-auto text-xs space-y-2.5 border border-neutral-200">
              <h4 className="font-bold text-[#1a2b49] uppercase tracking-wider text-[11px]">
                Next Steps for Reservation:
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                1. Our nursery care coordinators will review your household information within 24–48 business hours.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                2. We will contact you at <strong>{formData.phone}</strong> to confirm your puppy match and provide instructions for the <strong>$250 reservation deposit</strong>.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                3. Your deposit officially secures your chosen Cocker Spaniel until your pickup or flight nanny arrival!
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="py-3 px-8 rounded-lg text-xs font-semibold tracking-wider uppercase text-white bg-[#1a2b49] hover:bg-[#111c30] shadow-sm transition-colors cursor-pointer"
              >
                Return to Simberwood
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
