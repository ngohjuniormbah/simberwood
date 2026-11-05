import React, { useState, useRef } from 'react';
import {
  useApp,
  PetStatus,
  PetRecord,
  ExtendedReview,
  ExtendedGalleryItem,
  AdoptionApplication,
  SocialProofMessage,
} from '../context/AppContext';
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Bell,
  Sparkles,
  ExternalLink,
  X,
  Check,
  Search,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSettingsTab } from '../components/HeroSettingsTab';

async function uploadAdminImage(file: File): Promise<string> {
  const password = sessionStorage.getItem('simberwood_admin_password');
  if (!password) throw new Error('Open Admin → Settings and save the slideshow settings with your Vercel admin password first.');
  const form = new FormData();
  form.append('image', file);
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: { 'x-admin-password': password },
    body: form,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Image upload failed.');
  return result.url as string;
}

type AdminTab = 'pets' | 'reviews' | 'gallery' | 'applications' | 'notifications' | 'settings';

export const AdminPage: React.FC = () => {
  const {
    pets,
    addPet,
    updatePet,
    updatePetStatus,
    deletePet,

    reviews,
    addReview,
    updateReview,
    deleteReview,

    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,

    applications,
    updateApplicationStatus,
    deleteApplication,

    pushNotificationsEnabled,
    setPushNotificationsEnabled,
    requestPushPermission,
    socialProofEnabled,
    setSocialProofEnabled,
    socialProofMessages,
    addSocialProofMessage,
    updateSocialProofMessage,
    deleteSocialProofMessage,
    triggerManualNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('pets');

  // --- PETS STATE ---
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petFilter, setPetFilter] = useState<'all' | PetStatus>('all');
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);
  const reviewAuthorPhotoInputRef = useRef<HTMLInputElement>(null);
  const reviewPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const [petFormData, setPetFormData] = useState({
    name: '',
    breedType: 'English Cocker Spaniel',
    coatColor: 'Buff / Golden',
    gender: 'Male' as 'Male' | 'Female',
    adoptionFee: 1850,
    primaryImage: '',
    additionalImages: [] as string[],
    status: 'available' as PetStatus,
  });

  const openAddPetModal = () => {
    setEditingPetId(null);
    setPetFormData({
      name: '',
      breedType: 'English Cocker Spaniel',
      coatColor: 'Buff / Golden',
      gender: 'Male',
      adoptionFee: 1850,
      primaryImage: '',
      additionalImages: [],
      status: 'available',
    });
    setShowPetModal(true);
  };

  const openEditPetModal = (pet: PetRecord) => {
    setEditingPetId(pet.id);
    setPetFormData({
      name: pet.name,
      breedType: pet.breedType || 'English Cocker Spaniel',
      coatColor: pet.coatColor || 'Buff / Golden',
      gender: pet.gender || 'Male',
      adoptionFee: pet.adoptionFee || 1850,
      primaryImage: pet.primaryImage,
      additionalImages: pet.additionalImages && pet.additionalImages.length > 0 ? pet.additionalImages : [],
      status: pet.status,
    });
    setShowPetModal(true);
  };

  const handlePrimaryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const imageUrl = await uploadAdminImage(file);
      setPetFormData((prev) => ({ ...prev, primaryImage: imageUrl }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const handleAdditionalPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) return;
    try {
      const uploaded = await Promise.all(files.map(uploadAdminImage));
      setPetFormData((prev) => ({ ...prev, additionalImages: [...prev.additionalImages, ...uploaded] }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const handleRemoveAdditionalPhoto = (idxToRemove: number) => {
    setPetFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petFormData.name.trim()) return;

    const finalPrimary = petFormData.primaryImage.trim();
    if (!editingPetId && !finalPrimary) {
      alert('Upload a primary puppy image before adding this puppy.');
      return;
    }
    const finalAdditional = petFormData.additionalImages.length > 0
      ? petFormData.additionalImages
      : finalPrimary ? [finalPrimary] : [];

    if (editingPetId) {
      updatePet(editingPetId, {
        name: petFormData.name,
        breedType: petFormData.breedType,
        coatColor: petFormData.coatColor,
        gender: petFormData.gender,
        adoptionFee: Number(petFormData.adoptionFee) || 1850,
        primaryImage: finalPrimary,
        additionalImages: finalAdditional,
        status: petFormData.status,
      });
    } else {
      addPet({
        name: petFormData.name,
        breedType: petFormData.breedType,
        coatColor: petFormData.coatColor,
        gender: petFormData.gender,
        ageWeeks: 8,
        adoptionFee: Number(petFormData.adoptionFee) || 1850,
        primaryImage: finalPrimary,
        additionalImages: finalAdditional,
        status: petFormData.status,
        headline: 'Sweet, affectionate companion with gentle eyes.',
        temperament: ['Gentle', 'Loyal', 'Healthy'],
        description: '',
      });
    }
    setShowPetModal(false);
  };

  // --- REVIEWS STATE ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    author: '',
    authorPhoto: '',
    location: 'Austin, TX',
    rating: 5,
    title: 'An unforgettable adoption experience',
    comment: '',
    reviewImage: '',
    reviewLinkUrl: '',
    reviewLinkLabel: '',
  });

  const openAddReviewModal = () => {
    setEditingReviewId(null);
    setReviewFormData({
      author: '',
      authorPhoto: '',
      location: 'Austin, TX',
      rating: 5,
      title: 'Heartfelt Simberwood Experience',
      comment: '',
      reviewImage: '',
      reviewLinkUrl: '',
      reviewLinkLabel: '',
    });
    setShowReviewModal(true);
  };

  const openEditReviewModal = (rev: ExtendedReview) => {
    setEditingReviewId(rev.id);
    setReviewFormData({
      author: rev.author,
      authorPhoto: rev.authorPhoto || '',
      location: rev.location || '',
      rating: rev.rating || 5,
      title: rev.title || '',
      comment: rev.comment || '',
      reviewImage: rev.reviewImage || '',
      reviewLinkUrl: rev.reviewLinkUrl || '',
      reviewLinkLabel: rev.reviewLinkLabel || '',
    });
    setShowReviewModal(true);
  };

  const handleReviewAuthorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const authorPhoto = await uploadAdminImage(file);
      setReviewFormData((prev) => ({ ...prev, authorPhoto }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const handleReviewPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const reviewImage = await uploadAdminImage(file);
      setReviewFormData((prev) => ({ ...prev, reviewImage }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.author.trim() || !reviewFormData.comment.trim()) return;

    const finalAuthorPhoto = reviewFormData.authorPhoto.trim();

    if (editingReviewId) {
      updateReview(editingReviewId, {
        author: reviewFormData.author,
        authorPhoto: finalAuthorPhoto,
        location: reviewFormData.location,
        rating: reviewFormData.rating,
        title: reviewFormData.title,
        comment: reviewFormData.comment,
        reviewImage: reviewFormData.reviewImage || undefined,
        reviewLinkUrl: reviewFormData.reviewLinkUrl || undefined,
        reviewLinkLabel: reviewFormData.reviewLinkLabel || undefined,
      });
    } else {
      addReview({
        author: reviewFormData.author,
        authorPhoto: finalAuthorPhoto,
        location: reviewFormData.location,
        rating: reviewFormData.rating,
        title: reviewFormData.title,
        comment: reviewFormData.comment,
        reviewImage: reviewFormData.reviewImage || undefined,
        reviewLinkUrl: reviewFormData.reviewLinkUrl || undefined,
        reviewLinkLabel: reviewFormData.reviewLinkLabel || undefined,
        verifiedAdopter: true,
      });
    }
    setShowReviewModal(false);
  };

  // --- GALLERY STATE ---
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryFormData, setGalleryFormData] = useState({
    imageUrl: '',
    pictureWriteup: '', // Watermark overlay
    captionWriteup: '', // Below photo
  });

  const openAddGalleryModal = () => {
    setEditingGalleryId(null);
    setGalleryFormData({
      imageUrl: '',
      pictureWriteup: 'Nursery Care • 8 Weeks',
      captionWriteup: 'Gentle handling and social play in our sanctuary yard.',
    });
    setShowGalleryModal(true);
  };

  const openEditGalleryModal = (item: ExtendedGalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryFormData({
      imageUrl: item.imageUrl,
      pictureWriteup: item.pictureWriteup || '',
      captionWriteup: item.captionWriteup || '',
    });
    setShowGalleryModal(true);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const imageUrl = await uploadAdminImage(file);
      setGalleryFormData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = galleryFormData.imageUrl.trim();
    if (!finalImage) {
      alert('Upload a gallery image before saving.');
      return;
    }

    if (editingGalleryId) {
      updateGalleryItem(editingGalleryId, {
        imageUrl: finalImage,
        pictureWriteup: galleryFormData.pictureWriteup,
        captionWriteup: galleryFormData.captionWriteup,
      });
    } else {
      addGalleryItem({
        imageUrl: finalImage,
        pictureWriteup: galleryFormData.pictureWriteup,
        captionWriteup: galleryFormData.captionWriteup,
      });
    }
    setShowGalleryModal(false);
  };

  // --- ADOPTION APPLICATIONS STATE ---
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplication | null>(null);
  const [applicationSearch, setApplicationSearch] = useState('');

  // --- NOTIFICATIONS STATE ---
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [editingPopupId, setEditingPopupId] = useState<string | null>(null);
  const [popupFormData, setPopupFormData] = useState({
    name: '',
    action: 'is viewing available puppies right now',
    timeAgo: 'Just now',
  });

  const openAddPopupModal = () => {
    setEditingPopupId(null);
    setPopupFormData({
      name: '',
      action: 'is viewing available puppies right now',
      timeAgo: 'Just now',
    });
    setShowPopupModal(true);
  };

  const openEditPopupModal = (msg: SocialProofMessage) => {
    setEditingPopupId(msg.id);
    setPopupFormData({
      name: msg.name,
      action: msg.action,
      timeAgo: msg.timeAgo || 'Just now',
    });
    setShowPopupModal(true);
  };

  const handleSavePopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupFormData.name.trim() || !popupFormData.action.trim()) return;

    if (editingPopupId) {
      updateSocialProofMessage(editingPopupId, {
        name: popupFormData.name,
        action: popupFormData.action,
        timeAgo: popupFormData.timeAgo,
      });
    } else {
      addSocialProofMessage({
        name: popupFormData.name,
        action: popupFormData.action,
        location: '',
        avatar: '',
        timeAgo: popupFormData.timeAgo,
      });
    }
    setShowPopupModal(false);
  };

  // Filtered Pets
  const filteredPets = pets.filter((p) => {
    if (petFilter === 'all') return true;
    return p.status === petFilter;
  });

  // Filtered Applications
  const filteredApplications = applications.filter((app) => {
    if (!applicationSearch.trim()) return true;
    const q = applicationSearch.toLowerCase();
    return (
      app.fullName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.phone.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-neutral-50/60 min-h-screen py-10 md:py-14 text-neutral-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading: Centered & Titled "The Admin Portal" */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 font-['Outfit',sans-serif] tracking-tight">
            The Admin Portal
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600">
            Manage your sanctuary puppies, client reviews, nursery gallery, adoption applications, and visitor alerts.
          </p>
        </div>

        {/* Tab Navigation: Styled Like a Sleek Nav Bar */}
        <div className="flex justify-start sm:justify-center mb-10 overflow-x-auto max-w-full pb-2 px-1">
          <nav className="inline-flex items-center gap-1.5 p-1.5 bg-white shadow-xs rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'pets'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Pets ({pets.length})
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Reviews ({reviews.length})
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Gallery ({gallery.length})
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
                activeTab === 'applications'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <span>Adoption Applications</span>
              {applications.length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'applications' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {applications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Notifications
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PETS (CRUD) */}
        {/* ========================================================= */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            {/* Top Bar: Filter & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-neutral-500 mr-1">Status:</span>
                {(['all', 'available', 'reserve', 'adopted', 'cancel'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPetFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer capitalize ${
                      petFilter === st
                        ? 'bg-neutral-950 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                    }`}
                  >
                    {st === 'reserve' ? 'Reserved' : st === 'cancel' ? 'Cancelled' : st}
                  </button>
                ))}
              </div>

              <button
                onClick={openAddPetModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Pet
              </button>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-shadow hover:shadow-md"
                >
                  <div>
                    {/* Primary Photo */}
                    <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                      {pet.primaryImage ? <img src={pet.primaryImage} alt={pet.name} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-neutral-400">No photo</div>}
                      {/* Status Tag */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                            pet.status === 'available'
                              ? 'bg-emerald-600 text-white'
                              : pet.status === 'reserve'
                              ? 'bg-amber-600 text-white'
                              : pet.status === 'adopted'
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-700 text-white'
                          }`}
                        >
                          {pet.status === 'reserve'
                            ? 'Reserved'
                            : pet.status === 'cancel'
                            ? 'Cancelled'
                            : pet.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-black/75 text-white backdrop-blur-xs">
                          ${pet.adoptionFee.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Additional Photos Thumbnails if present */}
                    {pet.additionalImages && pet.additionalImages.length > 1 && (
                      <div className="px-5 pt-3 flex gap-2 overflow-x-auto">
                        {pet.additionalImages.map((img, i) => (
                          <img key={i} src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0" />
                        ))}
                      </div>
                    )}

                    {/* Pet Details */}
                    <div className="p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                          {pet.name}
                        </h3>
                        <span className="text-xs text-neutral-500 font-medium">
                          {pet.gender}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        {pet.coatColor} • {pet.breedType}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 border-t border-neutral-100 flex items-center justify-between gap-3">
                    {/* Status quick select */}
                    <select
                      value={pet.status}
                      onChange={(e) => updatePetStatus(pet.id, e.target.value as PetStatus)}
                      aria-label="Change pet status"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 focus:outline-none cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="reserve">Reserve</option>
                      <option value="adopted">Adopted</option>
                      <option value="cancel">Cancelled</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditPetModal(pet)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
                            deletePet(pet.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Pet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPets.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl p-8">
                <p className="text-sm text-neutral-500">No pets match the selected status.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: REVIEWS (CRUD) */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-950">Client Reviews</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Add, update, or remove testimonials, profile pictures, verified links, and photos inside reviews.
                </p>
              </div>
              <button
                onClick={openAddReviewModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Author & Profile Photo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rev.authorPhoto ? <img src={rev.authorPhoto} alt={rev.author} className="w-12 h-12 rounded-full object-cover bg-neutral-100" /> : <div aria-label="Reviewer photo not added" className="w-12 h-12 rounded-full bg-neutral-100" />}
                        <div>
                          <h4 className="text-sm font-bold text-neutral-950">{rev.author}</h4>
                          <p className="text-xs text-neutral-500">{rev.location || 'Verified Adopter'}</p>
                        </div>
                      </div>

                      {/* Rating stars */}
                      <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                        {'★'.repeat(rev.rating)}
                        <span className="text-neutral-400 text-xs ml-1 font-normal">({rev.rating}/5)</span>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {/* Inserted Link Inside Review if Present */}
                    {rev.reviewLinkUrl && (
                      <div className="pt-1">
                        <a
                          href={rev.reviewLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black underline underline-offset-4"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                          {rev.reviewLinkLabel || rev.reviewLinkUrl}
                        </a>
                      </div>
                    )}

                    {/* Photo Inside Review if Present */}
                    {rev.reviewImage && (
                      <div className="mt-2 rounded-xl overflow-hidden aspect-16/9 bg-neutral-100 max-w-sm">
                        <img
                          src={rev.reviewImage}
                          alt="Review attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditReviewModal(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete review from ${rev.author}?`)) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GALLERY (CRUD) */}
        {/* ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-950">Nursery Gallery</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Add nursery moments, with watermark description over the photo and description writeups below.
                </p>
              </div>
              <button
                onClick={openAddGalleryModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Photo
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Photo with Watermark Overlay */}
                    <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.captionWriteup} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-neutral-400">No photo uploaded</div>}

                      {/* Watermark Description on Photo */}
                      {item.pictureWriteup && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-bold bg-black/75 text-white backdrop-blur-xs shadow-xs">
                            {item.pictureWriteup}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description Below Photo */}
                    <div className="p-4">
                      <p className="text-xs sm:text-sm font-medium text-neutral-800 leading-snug">
                        {item.captionWriteup || 'Nursery snapshot'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditGalleryModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this gallery photo?')) {
                          deleteGalleryItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ADOPTION APPLICATIONS */}
        {/* ========================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Top stats & search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-base font-bold text-neutral-950">Received Applications</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click any application to view the full questionnaire responses, home details, and update status.
                  </p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={applicationSearch}
                  onChange={(e) => setApplicationSearch(e.target.value)}
                  placeholder="Search applicant name, email..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-100 focus:bg-white focus:outline-none text-neutral-900 transition-colors"
                />
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                  >
                    <div
                      onClick={() => setSelectedApplication(app)}
                      className="cursor-pointer space-y-1 flex-1"
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold text-neutral-950 hover:underline">
                          {app.fullName}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">#{app.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        {app.email} • {app.phone} • {app.residenceType || 'House'} • {app.address}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Submitted: {app.date} {app.customPuppyName && `• Desired Puppy Name: "${app.customPuppyName}"`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Full Form
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete application #${app.id}?`)) {
                            deleteApplication(app.id);
                          }
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 p-6">
                    <p className="text-sm text-neutral-500">No applications found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: NOTIFICATIONS */}
        {/* ========================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-8">
            {/* Part A: Browser Push Notifications */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-neutral-900" />
                    <h2 className="text-base font-bold text-neutral-950">
                      Browser Push Notifications
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 max-w-xl leading-relaxed">
                    Receive instant system push notifications directly in your browser as soon as a visitor fills out and submits an adoption application form.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (!pushNotificationsEnabled) {
                        const granted = await requestPushPermission();
                        if (granted) {
                          triggerManualNotification(
                            '🐾 Simberwood Notifications Active',
                            'You will now receive desktop notifications when users fill out adoption forms.'
                          );
                        }
                      } else {
                        setPushNotificationsEnabled(false);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      pushNotificationsEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                    }`}
                  >
                    {pushNotificationsEnabled ? '✓ Notifications On' : 'Turn On Notifications'}
                  </button>

                  {pushNotificationsEnabled && (
                    <button
                      onClick={() => {
                        triggerManualNotification(
                          '🐾 Test Alert from Simberwood',
                          'This is what you will see when an adopter submits an application.'
                        );
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                    >
                      Send Test Alert
                    </button>
                  )}
                </div>
              </div>

              {/* Permission status badge */}
              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
                <span>System status:</span>
                <span
                  className={`font-semibold ${
                    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                      ? 'text-emerald-700'
                      : 'text-neutral-600'
                  }`}
                >
                  {typeof window !== 'undefined' && 'Notification' in window
                    ? Notification.permission.toUpperCase()
                    : 'UNSUPPORTED'}
                </span>
              </div>
            </div>

            {/* Part B: Live Visitor Popups (Social Proof Bubbles) */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neutral-900" />
                    <h2 className="text-base font-bold text-neutral-950">
                      Live Visitor Popups
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 max-w-xl leading-relaxed">
                    Set the name and activity description for the popup bubbles that appear to website visitors (e.g., "Sarah M. is viewing available puppies right now"). Boosts customer confidence.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSocialProofEnabled(!socialProofEnabled)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      socialProofEnabled
                        ? 'bg-neutral-950 text-white'
                        : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                    }`}
                  >
                    {socialProofEnabled ? 'Popups Enabled' : 'Popups Disabled'}
                  </button>

                  <button
                    onClick={openAddPopupModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Add Popup
                  </button>
                </div>
              </div>

              {/* Popup Messages List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Configured Visitor Popups ({socialProofMessages.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialProofMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-neutral-50 flex items-start justify-between gap-3"
                    >
                      {/* Preview formatted as real toast */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Green beacon icon */}
                        <div className="pt-1 shrink-0">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-neutral-950">
                              {msg.name}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.2">
                              online
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {msg.action}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditPopupModal(msg)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
                          title="Edit Popup"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this popup message?')) {
                              deleteSocialProofMessage(msg.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Popup"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && <HeroSettingsTab />}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PET */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showPetModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPetModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                  {editingPetId ? 'Edit Puppy Profile' : 'Add New Puppy'}
                </h3>
                <button
                  onClick={() => setShowPetModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePet} className="mt-5 space-y-4">
                {/* Name & Adoption Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Puppy Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={petFormData.name}
                      onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                      placeholder="e.g. Daisy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={petFormData.adoptionFee}
                      onChange={(e) => setPetFormData({ ...petFormData, adoptionFee: Number(e.target.value) })}
                      placeholder="1850"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>
                </div>

                {/* Status, Gender, Breed Type & Coat Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={petFormData.status}
                      onChange={(e) => setPetFormData({ ...petFormData, status: e.target.value as PetStatus })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200 cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="reserve">Reserve</option>
                      <option value="adopted">Adopted</option>
                      <option value="cancel">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={petFormData.gender}
                      onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value as 'Male' | 'Female' })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Coat Color
                    </label>
                    <input
                      type="text"
                      value={petFormData.coatColor}
                      onChange={(e) => setPetFormData({ ...petFormData, coatColor: e.target.value })}
                      placeholder="Buff / Golden"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Breed Type
                    </label>
                    <select
                      value={petFormData.breedType}
                      onChange={(e) => setPetFormData({ ...petFormData, breedType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200 cursor-pointer"
                    >
                      <option value="English Cocker Spaniel">English Cocker Spaniel</option>
                      <option value="American Cocker Spaniel">American Cocker Spaniel</option>
                    </select>
                  </div>
                </div>

                {/* Primary Photo: Device Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Pet Primary Photo (Upload from Device) *
                  </label>
                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handlePrimaryPhotoUpload}
                    className="hidden"
                  />

                  {petFormData.primaryImage ? (
                    <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                      <div className="aspect-4/3 w-full max-h-52 overflow-hidden bg-neutral-900/5">
                        <img
                          src={petFormData.primaryImage}
                          alt="Primary Pet Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-white flex items-center justify-between border-t border-neutral-100">
                        <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          Photo ready from device
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => primaryFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setPetFormData((prev) => ({ ...prev, primaryImage: '' }))}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100/70"
                    >
                      <div className="mx-auto w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-neutral-900">
                        Upload pet photo from your device
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Click to select an image from your computer or phone
                      </p>
                    </div>
                  )}
                </div>

                {/* Other Photos of the Pet: Device Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Other Photos of the Pet (Upload from Device)
                    </label>
                    <button
                      type="button"
                      onClick={() => additionalFilesInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload Photos
                    </button>
                  </div>

                  <input
                    ref={additionalFilesInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    onChange={handleAdditionalPhotosUpload}
                    className="hidden"
                  />

                  {petFormData.additionalImages.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {petFormData.additionalImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group"
                          >
                            <img
                              src={imgUrl}
                              alt={`Pet extra photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalPhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/75 hover:bg-red-600 text-white transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => additionalFilesInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-50 cursor-pointer"
                        >
                          <Plus className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-semibold">Add More</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {petFormData.additionalImages.length} additional photo{petFormData.additionalImages.length > 1 ? 's' : ''} uploaded from device.
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => additionalFilesInputRef.current?.click()}
                      className="border border-neutral-200 rounded-xl p-4 text-center cursor-pointer hover:bg-neutral-50 transition-colors"
                    >
                      <p className="text-xs font-semibold text-neutral-700">
                        + Select additional photos from your device
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        You can upload multiple pictures of this puppy
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPetModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    {editingPetId ? 'Save Changes' : 'Create Puppy'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT REVIEW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                  {editingReviewId ? 'Edit Review' : 'Add Client Review'}
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReview} className="mt-5 space-y-4">
                {/* Reviewer Profile: Name & Photo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Reviewer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewFormData.author}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, author: e.target.value })}
                      placeholder="e.g. Eleanor & Marcus Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Rating (1 to 5)
                    </label>
                    <select
                      value={reviewFormData.rating}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200 cursor-pointer"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo: Device Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Reviewer Profile Photo (Upload from Device)
                  </label>
                  <input
                    ref={reviewAuthorPhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleReviewAuthorPhotoUpload}
                    className="hidden"
                  />

                  {reviewFormData.authorPhoto ? (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <img
                        src={reviewFormData.authorPhoto}
                        alt="Reviewer Profile"
                        className="w-14 h-14 rounded-full object-cover border border-neutral-300 shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5 text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> Photo uploaded from device
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Will be displayed as reviewer profile avatar
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => reviewAuthorPhotoInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewFormData((prev) => ({ ...prev, authorPhoto: '' }))}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => reviewAuthorPhotoInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-4 text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100/70"
                    >
                      <div className="mx-auto w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 mb-1.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-900">
                        Upload reviewer profile photo from your device
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Click to select an image from your computer or phone
                      </p>
                    </div>
                  )}
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Review Text *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewFormData.comment}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                    placeholder="Write client testimonial..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                  />
                </div>

                {/* Insert a Link Inside the Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Insert Link Inside Review (URL)
                    </label>
                    <input
                      type="url"
                      value={reviewFormData.reviewLinkUrl}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, reviewLinkUrl: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Link Label / Text
                    </label>
                    <input
                      type="text"
                      value={reviewFormData.reviewLinkLabel}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, reviewLinkLabel: e.target.value })}
                      placeholder="e.g. View Instagram Story"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                    />
                  </div>
                </div>

                {/* Photo Inside the Review: Device Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Photo Inside Review (Upload from Device — Optional)
                  </label>
                  <input
                    ref={reviewPhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleReviewPhotoUpload}
                    className="hidden"
                  />

                  {reviewFormData.reviewImage ? (
                    <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                      <div className="aspect-16/9 w-full max-h-48 overflow-hidden bg-neutral-900/5">
                        <img
                          src={reviewFormData.reviewImage}
                          alt="Review Photo Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5 bg-white flex items-center justify-between border-t border-neutral-100">
                        <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          Photo inside review attached
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => reviewPhotoInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewFormData((prev) => ({ ...prev, reviewImage: '' }))}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => reviewPhotoInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-4 text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100/70"
                    >
                      <div className="mx-auto w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 mb-1.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-900">
                        Upload pet or client photo inside this review
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Optional • Click to choose a photo from your computer or phone
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    {editingReviewId ? 'Save Changes' : 'Publish Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: ADD / EDIT GALLERY */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGalleryModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                  {editingGalleryId ? 'Edit Gallery Photo' : 'Add Nursery Photo'}
                </h3>
                <button
                  onClick={() => setShowGalleryModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGallery} className="mt-5 space-y-4">
                {/* Gallery Photo: Device Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Gallery Photo (Upload from Device) *
                  </label>
                  <input
                    ref={galleryImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                  />

                  {galleryFormData.imageUrl ? (
                    <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                      <div className="relative aspect-4/3 w-full max-h-56 overflow-hidden bg-neutral-900/5">
                        <img
                          src={galleryFormData.imageUrl}
                          alt="Gallery Preview"
                          className="w-full h-full object-cover"
                        />
                        {galleryFormData.pictureWriteup && (
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/80 text-white backdrop-blur-xs">
                              {galleryFormData.pictureWriteup}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white flex items-center justify-between border-t border-neutral-100">
                        <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          Photo ready from device
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => galleryImageInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setGalleryFormData((prev) => ({ ...prev, imageUrl: '' }))}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => galleryImageInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100/70"
                    >
                      <div className="mx-auto w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-neutral-900">
                        Upload gallery photo from your device
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Click to select an image from your computer or phone
                      </p>
                    </div>
                  )}
                </div>

                {/* Description that appears ON the photo like a watermark */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Description on Photo (Watermark)
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.pictureWriteup}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, pictureWriteup: e.target.value })}
                    placeholder="e.g. Nursery Play Session • 7 Weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                  />
                </div>

                {/* Description below photo */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Description Below Photo
                  </label>
                  <input
                    type="text"
                    value={galleryFormData.captionWriteup}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, captionWriteup: e.target.value })}
                    placeholder="e.g. Sweet spaniel exploring clover gardens in our outdoor sanctuary."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    {editingGalleryId ? 'Save Changes' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: ADOPTION APPLICATION FULL DETAILS */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplication(null)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                    Application #{selectedApplication.id}
                  </h3>
                  <p className="text-xs text-neutral-500">Submitted on {selectedApplication.date}</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Quick Bar */}
              <div className="my-5 p-4 rounded-xl bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-neutral-700">Application Status:</span>
                <div className="flex items-center gap-2">
                  {(['pending', 'contacted', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, st);
                        setSelectedApplication({ ...selectedApplication, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        selectedApplication.status === st
                          ? 'bg-neutral-950 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Form Sections */}
              <div className="space-y-6 text-sm">
                {/* 1. Applicant Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    1. Applicant Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-neutral-500">Full Name</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Phone</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Email Address</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Home Address</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.address}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Household Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    2. Household & Living Situation
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-neutral-500">Residence Type</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.residenceType || 'House'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Own or Rent</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.ownOrRent || 'Own'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Pets Allowed</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.petsAllowed || 'Yes'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Fenced Yard</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.fencedYard || 'Yes'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Adults in Home</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.adults || '2'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Children in Home</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.children || '0'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <p className="text-xs text-neutral-500">Everyone Agrees to Adopt?</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.everyoneAgrees || 'Yes'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Pet Experience */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    3. Pet Experience & Preferences
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-neutral-500">Owned Dog Before?</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.ownedDog || 'Yes'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Routine Vet Care Agreed?</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.vetCare || 'Yes'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Preferred Color</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.preferredColor || 'No Preference'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Preferred Sex</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.preferredSex || 'No Preference'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-neutral-500">Current Pets in Household</p>
                      <p className="font-semibold text-neutral-900">{selectedApplication.currentPets || 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Agreements & Name Request */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    4. Agreements & Customization
                  </h4>
                  <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Agreed to non-refundable $250 deposit for reservation.
                    </p>
                    <p className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Certified information is true and accurate.
                    </p>
                    <p className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Accepted all terms & 1-Year Genetic Health Guarantee conditions.
                    </p>
                    {selectedApplication.customPuppyName && (
                      <div className="pt-2 border-t border-neutral-200">
                        <p className="text-xs text-neutral-500">Requested Custom Puppy Name:</p>
                        <p className="text-sm font-bold text-neutral-950">
                          "{selectedApplication.customPuppyName}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm(`Delete application #${selectedApplication.id}?`)) {
                      deleteApplication(selectedApplication.id);
                      setSelectedApplication(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Delete Application
                </button>

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 5: ADD / EDIT VISITOR POPUP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showPopupModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopupModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xl font-bold text-neutral-950 font-['Outfit',sans-serif]">
                  {editingPopupId ? 'Edit Visitor Popup' : 'Add Visitor Popup'}
                </h3>
                <button
                  onClick={() => setShowPopupModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePopup} className="mt-5 space-y-4">
                {/* Person's Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Visitor / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={popupFormData.name}
                    onChange={(e) => setPopupFormData({ ...popupFormData, name: e.target.value })}
                    placeholder="e.g. Sarah M., Dr. Julian T."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                  />
                </div>

                {/* What they are doing on the website */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    What they are doing on the website (Description) *
                  </label>
                  <input
                    type="text"
                    required
                    value={popupFormData.action}
                    onChange={(e) => setPopupFormData({ ...popupFormData, action: e.target.value })}
                    placeholder="e.g. is viewing available puppies right now"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all border border-neutral-200"
                  />
                </div>

                {/* Live Preview */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-neutral-500 mb-2">Live Preview on Website:</p>
                  <div className="p-3 rounded-xl bg-white shadow-md border border-neutral-200 flex items-start gap-3">
                    <div className="pt-1 shrink-0">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-950">
                          {popupFormData.name || 'Visitor Name'}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.2">
                          online
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {popupFormData.action || 'is viewing available puppies right now'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPopupModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    {editingPopupId ? 'Save Changes' : 'Save Popup'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
