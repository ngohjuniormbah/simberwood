import React, { createContext, useContext, useState, useEffect } from 'react';

export type PetStatus = 'available' | 'reserve' | 'adopted' | 'cancel';

export interface PetRecord {
  id: string;
  name: string;
  breedType: string;
  coatColor: string;
  gender: 'Male' | 'Female';
  ageWeeks: number;
  adoptionFee: number;
  primaryImage: string;
  additionalImages?: string[];
  status: PetStatus;
  headline?: string;
  temperament?: string[];
  description?: string;
  dateAdded: string;
}

export interface ExtendedReview {
  id: string;
  author: string;
  authorPhoto: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  reviewImage?: string; // photo inside the review
  reviewLinkUrl?: string; // link inside the review
  reviewLinkLabel?: string; // link display label
  date: string;
  verifiedAdopter?: boolean;
}

export interface ExtendedGalleryItem {
  id: string;
  imageUrl: string;
  pictureWriteup?: string; // writeup that appears ON the picture
  captionWriteup: string;  // writeup that goes BELOW the picture
  dateAdded: string;
}

export interface AdoptionApplication {
  id: string;
  date: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  residenceType: string;
  ownOrRent: string;
  petsAllowed: string;
  fencedYard: string;
  adults: string;
  children: string;
  everyoneAgrees: string;
  ownedDog: string;
  currentPets: string;
  preferredColor: string;
  preferredSex: string;
  vetCare: string;
  customPuppyName?: string;
  selectedPuppyId?: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
}

export interface SocialProofMessage {
  id: string;
  name: string;
  location: string;
  avatar: string;
  action: string;
  timeAgo: string;
}

interface AppContextType {
  pets: PetRecord[];
  addPet: (pet: Omit<PetRecord, 'id' | 'dateAdded'>) => void;
  updatePet: (id: string, pet: Partial<PetRecord>) => void;
  updatePetStatus: (id: string, status: PetStatus) => void;
  deletePet: (id: string) => void;

  reviews: ExtendedReview[];
  addReview: (rev: Omit<ExtendedReview, 'id' | 'date'>) => void;
  updateReview: (id: string, rev: Partial<ExtendedReview>) => void;
  deleteReview: (id: string) => void;

  gallery: ExtendedGalleryItem[];
  addGalleryItem: (item: Omit<ExtendedGalleryItem, 'id' | 'dateAdded'>) => void;
  updateGalleryItem: (id: string, item: Partial<ExtendedGalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  applications: AdoptionApplication[];
  addApplication: (app: Omit<AdoptionApplication, 'id' | 'date' | 'status'>) => Promise<string | null>;
  updateApplicationStatus: (id: string, status: AdoptionApplication['status']) => void;
  deleteApplication: (id: string) => void;

  // Settings
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  requestPushPermission: () => Promise<boolean>;
  socialProofEnabled: boolean;
  setSocialProofEnabled: (enabled: boolean) => void;
  socialProofMessages: SocialProofMessage[];
  addSocialProofMessage: (msg: Omit<SocialProofMessage, 'id'>) => void;
  updateSocialProofMessage: (id: string, msg: Partial<SocialProofMessage>) => void;
  deleteSocialProofMessage: (id: string) => void;
  triggerManualNotification: (title: string, body: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const cleanImageUrl = (url?: string) => {
  if (!url || url.startsWith('data:image/') || url.includes('images.unsplash.com')) return '';
  return url;
};

const SAMPLE_PET_IDS = new Set(Array.from({ length: 8 }, (_, index) => `sw-2026-${String(index + 1).padStart(2, '0')}`));
const SAMPLE_REVIEW_IDS = new Set(Array.from({ length: 6 }, (_, index) => `rev-0${index + 1}`));
const SAMPLE_GALLERY_IDS = new Set(Array.from({ length: 6 }, (_, index) => `gal-0${index + 1}`));

const cleanImageUrl = (url?: string) => {
  if (!url || url.startsWith('data:image/') || url.includes('images.unsplash.com')) return '';
  return url;
};

const cleanPetImages = (items: PetRecord[]) => items
  .filter((pet) => !SAMPLE_PET_IDS.has(pet.id))
  .map((pet) => ({
    ...pet,
    primaryImage: cleanImageUrl(pet.primaryImage),
    additionalImages: (pet.additionalImages || []).map(cleanImageUrl).filter(Boolean),
  }));

const cleanReviewImages = (items: ExtendedReview[]) => items
  .filter((review) => !SAMPLE_REVIEW_IDS.has(review.id))
  .map((review) => ({
    ...review,
    authorPhoto: cleanImageUrl(review.authorPhoto),
    reviewImage: cleanImageUrl(review.reviewImage),
  }));

const cleanGalleryImages = (items: ExtendedGalleryItem[]) => items
  .filter((item) => !SAMPLE_GALLERY_IDS.has(item.id))
  .map((item) => ({
    ...item,
    imageUrl: cleanImageUrl(item.imageUrl),
  }));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public listing content is managed from the password-protected admin page.
  const [pets, setPets] = useState<PetRecord[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_pets');
      return saved ? cleanPetImages(JSON.parse(saved)) : [];
    } catch { return []; }
  });

  const [reviews, setReviews] = useState<ExtendedReview[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_reviews');
      return saved ? cleanReviewImages(JSON.parse(saved)) : [];
    } catch { return []; }
  });

  const [gallery, setGallery] = useState<ExtendedGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_gallery');
      return saved ? cleanGalleryImages(JSON.parse(saved)) : [];
    } catch { return []; }
  });

  // Applications State
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_applications');
      return saved ? JSON.parse(saved).filter((app: AdoptionApplication) => !['SW-834921', 'SW-692145'].includes(app.id)) : [];
    } catch {
      return [];
    }
  });

  // Push Notifications Setting
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('simberwood_push_enabled');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return true;
    }
  });

  // Social Proof Bubbles Setting
  const [socialProofEnabled, setSocialProofEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('simberwood_social_proof_enabled');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Social Proof Messages
  const [socialProofMessages, setSocialProofMessages] = useState<SocialProofMessage[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_social_proof_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [siteContentReady, setSiteContentReady] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(() =>
    typeof window !== 'undefined' && Boolean(sessionStorage.getItem('simberwood_admin_password'))
  );

  useEffect(() => {
    let active = true;
    fetch('/api/site-content')
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((content) => {
        if (!active || !content) return;
        if (Array.isArray(content.pets)) setPets(cleanPetImages(content.pets));
        if (Array.isArray(content.reviews)) setReviews(cleanReviewImages(content.reviews));
        if (Array.isArray(content.gallery)) setGallery(cleanGalleryImages(content.gallery));
      })
      .catch((error) => console.warn('Using local site content because shared content could not be loaded.', error))
      .finally(() => { if (active) setSiteContentReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const syncAdminSession = () => {
      setHasAdminSession(Boolean(sessionStorage.getItem('simberwood_admin_password')));
    };
    window.addEventListener('simberwood-admin-authenticated', syncAdminSession);
    return () => window.removeEventListener('simberwood-admin-authenticated', syncAdminSession);
  }, []);

  useEffect(() => {
    if (!hasAdminSession) return;
    const password = sessionStorage.getItem('simberwood_admin_password');
    if (!password) return;
    fetch('/api/applications', { headers: { 'x-admin-password': password } })
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!Array.isArray(result?.applications)) return;
        setApplications(result.applications.map((row: Record<string, unknown>) => ({
          id: String(row.id || ''),
          date: String(row.submitted_at || ''),
          fullName: String(row.full_name || ''),
          phone: String(row.phone || ''),
          email: String(row.email || ''),
          address: String(row.address || ''),
          residenceType: String(row.residence_type || ''),
          ownOrRent: String(row.own_or_rent || ''),
          petsAllowed: String(row.pets_allowed || ''),
          fencedYard: String(row.fenced_yard || ''),
          adults: String(row.adults || ''),
          children: String(row.children || ''),
          everyoneAgrees: String(row.everyone_agrees || ''),
          ownedDog: String(row.owned_dog || ''),
          currentPets: String(row.current_pets || ''),
          preferredColor: String(row.preferred_color || ''),
          preferredSex: String(row.preferred_sex || ''),
          vetCare: String(row.vet_care || ''),
          customPuppyName: typeof row.custom_puppy_name === 'string' ? row.custom_puppy_name : undefined,
          selectedPuppyId: typeof row.selected_puppy_id === 'string' ? row.selected_puppy_id : undefined,
          status: ['pending', 'contacted', 'approved', 'rejected'].includes(String(row.status)) ? row.status as AdoptionApplication['status'] : 'pending',
        })));
      })
      .catch((error) => console.error('Could not load adoption applications.', error));
  }, [hasAdminSession]);



  useEffect(() => {
    if (!siteContentReady || !hasAdminSession) return;
    const timer = window.setTimeout(async () => {
      const password = sessionStorage.getItem('simberwood_admin_password');
      if (!password) return;
      try {
        const response = await fetch('/api/site-content', {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ pets, reviews, gallery }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          console.error('Shared site content was not saved:', result.error || response.status);
        }
      } catch (error) {
        console.error('Shared site content was not saved.', error);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pets, reviews, gallery, siteContentReady, hasAdminSession]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('simberwood_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('simberwood_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('simberwood_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('simberwood_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('simberwood_push_enabled', JSON.stringify(pushNotificationsEnabled));
  }, [pushNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('simberwood_social_proof_enabled', JSON.stringify(socialProofEnabled));
  }, [socialProofEnabled]);

  useEffect(() => {
    localStorage.setItem('simberwood_social_proof_messages', JSON.stringify(socialProofMessages));
  }, [socialProofMessages]);

  // Push Notification Handler
  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setPushNotificationsEnabled(granted);
    return granted;
  };

  const triggerManualNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted' && pushNotificationsEnabled) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Push notification error:', err);
      }
    }
  };

  // Actions for Pets
  const addPet = (petData: Omit<PetRecord, 'id' | 'dateAdded'>) => {
    const newPet: PetRecord = {
      ...petData,
      id: 'pet-' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setPets((prev) => [newPet, ...prev]);
  };

  const updatePet = (id: string, updatedData: Partial<PetRecord>) => {
    setPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const updatePetStatus = (id: string, status: PetStatus) => {
    setPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  // Actions for Reviews
  const addReview = (revData: Omit<ExtendedReview, 'id' | 'date'>) => {
    const newRev: ExtendedReview = {
      ...revData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      verifiedAdopter: true,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const updateReview = (id: string, updatedData: Partial<ExtendedReview>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Actions for Gallery
  const addGalleryItem = (itemData: Omit<ExtendedGalleryItem, 'id' | 'dateAdded'>) => {
    const newItem: ExtendedGalleryItem = {
      ...itemData,
      id: 'gal-' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const updateGalleryItem = (id: string, updatedData: Partial<ExtendedGalleryItem>) => {
    setGallery((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedData } : g))
    );
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  // Actions for Applications
  const addApplication = async (appData: Omit<AdoptionApplication, 'id' | 'date' | 'status'>) => {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(appData),
    });
    if (!response.ok) return null;
    const result = await response.json() as { id: string };
    const newApp: AdoptionApplication = {
      ...appData,
      id: result.id,
      date: new Date().toLocaleString(),
      status: 'pending',
    };
    setApplications((prev) => [newApp, ...prev]);

    // Send push notification if configured
    if (pushNotificationsEnabled) {
      triggerManualNotification(
        '🐾 New Simberwood Adoption Application!',
        `${appData.fullName} submitted an application for a Cocker Spaniel.`
      );
    }
    return result.id;
  };

  const updateApplicationStatus = (id: string, status: AdoptionApplication['status']) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
    const password = sessionStorage.getItem('simberwood_admin_password');
    if (!password) return;
    fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, status }),
    }).then((response) => {
      if (!response.ok) console.error('Could not save the application status.');
    }).catch((error) => console.error('Could not save the application status.', error));
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    const password = sessionStorage.getItem('simberwood_admin_password');
    if (!password) return;
    fetch('/api/applications', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    }).then((response) => {
      if (!response.ok) console.error('Could not delete the application.');
    }).catch((error) => console.error('Could not delete the application.', error));
  };

  // Social Proof Messages Actions
  const addSocialProofMessage = (msgData: Omit<SocialProofMessage, 'id'>) => {
    const newMsg: SocialProofMessage = {
      ...msgData,
      id: 'sp-' + Date.now(),
    };
    setSocialProofMessages((prev) => [newMsg, ...prev]);
  };

  const updateSocialProofMessage = (id: string, updatedData: Partial<SocialProofMessage>) => {
    setSocialProofMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
  };

  const deleteSocialProofMessage = (id: string) => {
    setSocialProofMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
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
        addApplication,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
