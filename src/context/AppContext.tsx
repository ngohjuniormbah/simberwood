import React, { createContext, useContext, useState, useEffect } from 'react';
import { Puppy, PUPPIES_DATA, AdopterReview, REVIEWS_DATA, GalleryItem, GALLERY_ITEMS } from '../data/simberwoodData';

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

// Initial pets from PUPPIES_DATA
const INITIAL_PETS: PetRecord[] = PUPPIES_DATA.map((p) => ({
  id: p.id,
  name: p.name,
  breedType: p.breedType,
  coatColor: p.coatColor,
  gender: p.gender,
  ageWeeks: p.ageWeeks,
  adoptionFee: p.adoptionFee,
  primaryImage: p.primaryImage,
  additionalImages: p.additionalImages && p.additionalImages.length > 0 ? p.additionalImages : [p.primaryImage],
  status: p.status === 'available' ? 'available' : 'reserve',
  headline: p.headline,
  temperament: p.temperament,
  description: p.description,
  dateAdded: '2026-10-15',
}));

// Initial reviews with author profile + photo inside review + optional link
const INITIAL_REVIEWS: ExtendedReview[] = [
  {
    id: 'rev-01',
    author: 'Eleanor & Marcus Vance',
    authorPhoto: '',
    location: 'Boston, MA',
    rating: 5,
    title: 'The most emotionally intelligent, gentle dog we have ever loved',
    comment: 'Adopting Oliver from Simberwood was an absolute dream. Oliver arrived crate-trained, sound-desensitized, and has never met a stranger he did not greet with soft tail wags.',
    reviewImage: '',
    reviewLinkUrl: 'https://instagram.com',
    reviewLinkLabel: 'Instagram @vance_spaniels',
    date: '2026-09-12',
    verifiedAdopter: true,
  },
  {
    id: 'rev-02',
    author: 'Dr. Julian Thorne',
    authorPhoto: '',
    location: 'Greenwich, CT',
    rating: 5,
    title: 'Exemplary health transparency and genuine lifelong support',
    comment: 'As a veterinary physician, health testing and orthopedic soundness were my non-negotiables. Simberwood supplied complete OFA hip scores, PRA DNA genetics, and pediatric cardiology notes before I even finalized.',
    reviewImage: '',
    date: '2026-08-20',
    verifiedAdopter: true,
  },
  {
    id: 'rev-03',
    author: 'The Holloway Family',
    authorPhoto: '',
    location: 'Denver, CO',
    rating: 5,
    title: 'Our children have found their guardian angels and best friends',
    comment: 'We adopted our first spaniel Bramble two years ago and came back for Scout this spring! The ENS puppy protocol makes a huge difference: neither dog flinches at thunderstorms.',
    reviewImage: '',
    date: '2026-07-05',
    verifiedAdopter: true,
  },
  {
    id: 'rev-04',
    author: 'Claire Sterling',
    authorPhoto: '',
    location: 'Portland, OR',
    rating: 5,
    title: 'Warm communication and pristine puppy care',
    comment: 'The weekly nursery photo updates and video calls made the waiting period so special. When Poppy arrived via their in-cabin hand courier, she was clean, relaxed, and immediately snuggled right into my cardigan.',
    reviewImage: '',
    date: '2026-06-18',
    verifiedAdopter: true,
  },
  {
    id: 'rev-05',
    author: 'Marcus & Sophia Chen',
    authorPhoto: '',
    location: 'San Francisco, CA',
    rating: 5,
    title: 'Remarkable temperament and apartment adaptability',
    comment: 'Our puppy settled into city life without a single hiccup. The breeder foundations in crate and house training gave us such a peaceful head start. Truly exceptional care.',
    reviewImage: '',
    date: '2026-05-24',
    verifiedAdopter: true,
  },
  {
    id: 'rev-06',
    author: 'The Gallagher Family',
    authorPhoto: '',
    location: 'Austin, TX',
    rating: 5,
    title: 'Everything we hoped for and more',
    comment: 'Penny is remarkably gentle with our toddlers and loves her evening cuddle routine. Simberwood devotion to ethical, loving breeding shines in every interaction.',
    reviewImage: '',
    date: '2026-04-12',
    verifiedAdopter: true,
  },
];

// Initial gallery with writeup on picture & writeup below picture
const INITIAL_GALLERY: ExtendedGalleryItem[] = [
  {
    id: 'gal-01',
    imageUrl: '',
    pictureWriteup: 'Nursery Play Session • 7 Weeks',
    captionWriteup: 'Golden buff litter exploring our outdoor country sensory garden.',
    dateAdded: '2026-10-01',
  },
  {
    id: 'gal-02',
    imageUrl: '',
    pictureWriteup: 'Gentle Handling & ENS',
    captionWriteup: 'Soft velvet ears and calm snuggles during early socialization.',
    dateAdded: '2026-10-05',
  },
  {
    id: 'gal-03',
    imageUrl: '',
    pictureWriteup: 'Cuddle Hour',
    captionWriteup: 'In-home resting time in temperature-controlled nursery suites.',
    dateAdded: '2026-10-08',
  },
  {
    id: 'gal-04',
    imageUrl: '',
    pictureWriteup: 'Littermates at Play',
    captionWriteup: 'Developing joyful tail-wags and friendly pack socialization.',
    dateAdded: '2026-10-12',
  },
  {
    id: 'gal-05',
    imageUrl: '',
    pictureWriteup: 'Vet Checked & Ready',
    captionWriteup: 'Complete pediatric clearance and full health documentation.',
    dateAdded: '2026-10-18',
  },
  {
    id: 'gal-06',
    imageUrl: '',
    pictureWriteup: 'Sweet Temperament',
    captionWriteup: 'Eager to please and naturally affectionate companion spaniel.',
    dateAdded: '2026-10-22',
  },
];

// Initial sample applications
const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'SW-834921',
    date: '2026-11-01 14:32',
    fullName: 'Hannah Reynolds',
    phone: '+1 (512) 809-4321',
    email: 'hannah.reynolds@example.com',
    address: '4208 Oak Hollow Dr, Austin, TX 78704',
    residenceType: 'House',
    ownOrRent: 'Own',
    petsAllowed: 'Yes',
    fencedYard: 'Yes',
    adults: '2',
    children: '1',
    everyoneAgrees: 'Yes',
    ownedDog: 'Yes',
    currentPets: 'One senior Golden Retriever (10 yrs)',
    preferredColor: 'Buff / Golden',
    preferredSex: 'Female',
    vetCare: 'Yes',
    customPuppyName: 'Daisy',
    selectedPuppyId: 'cocker-01',
    status: 'pending',
  },
  {
    id: 'SW-692145',
    date: '2026-10-29 09:15',
    fullName: 'Robert & Michelle Chen',
    phone: '+1 (312) 555-8902',
    email: 'robert.chen@example.com',
    address: '1540 N Lake Shore Dr, Chicago, IL 60610',
    residenceType: 'Condo',
    ownOrRent: 'Own',
    petsAllowed: 'Yes',
    fencedYard: 'No',
    adults: '2',
    children: '0',
    everyoneAgrees: 'Yes',
    ownedDog: 'Yes',
    currentPets: 'None currently',
    preferredColor: 'Classic Blue Roan',
    preferredSex: 'Male',
    vetCare: 'Yes',
    customPuppyName: 'Barnaby',
    selectedPuppyId: 'cocker-02',
    status: 'approved',
  },
];

// Initial visitor activities to boost buyer confidence - clean page/item checking
const INITIAL_SOCIAL_PROOF: SocialProofMessage[] = [
  {
    id: 'sp-1',
    name: 'Sarah M.',
    location: '',
    avatar: '',
    action: 'is checking Available Puppies right now',
    timeAgo: 'Just now',
  },
  {
    id: 'sp-2',
    name: 'Marcus & Elena',
    location: '',
    avatar: '',
    action: 'is viewing Barnaby’s adoption details',
    timeAgo: '1 minute ago',
  },
  {
    id: 'sp-3',
    name: 'Dr. Katherine B.',
    location: '',
    avatar: '',
    action: 'is reading our 1-Year Genetic Health Guarantee',
    timeAgo: '2 minutes ago',
  },
  {
    id: 'sp-4',
    name: 'David W.',
    location: '',
    avatar: '',
    action: 'is browsing puppy nursery gallery photos',
    timeAgo: '4 minutes ago',
  },
  {
    id: 'sp-5',
    name: 'Chloe & James',
    location: '',
    avatar: '',
    action: 'is viewing Winnie’s adoption profile',
    timeAgo: '5 minutes ago',
  },
  {
    id: 'sp-6',
    name: 'Hannah R.',
    location: '',
    avatar: '',
    action: 'is filling out the Adoption Application form',
    timeAgo: 'Just now',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pets State: Ensure at least 8 initial pets are always loaded
  const [pets, setPets] = useState<PetRecord[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_pets');
      if (saved) {
        const parsed: PetRecord[] = JSON.parse(saved);
        if (parsed.length >= 8) return parsed;
        const existingIds = new Set(parsed.map((p) => p.id));
        const merged = [...parsed, ...INITIAL_PETS.filter((p) => !existingIds.has(p.id))];
        return merged;
      }
      return INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  // Reviews State: Ensure at least 6 initial reviews are always loaded
  const [reviews, setReviews] = useState<ExtendedReview[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_reviews');
      if (saved) {
        const parsed: ExtendedReview[] = JSON.parse(saved);
        if (parsed.length >= 6) return parsed;
        const existingIds = new Set(parsed.map((r) => r.id));
        const merged = [...parsed, ...INITIAL_REVIEWS.filter((r) => !existingIds.has(r.id))];
        return merged;
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Gallery State
  const [gallery, setGallery] = useState<ExtendedGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_gallery');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // Applications State
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('simberwood_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Push Notifications Setting
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('simberwood_push_enabled');
      return saved ? JSON.parse(saved) : true;
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
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_PROOF;
    } catch {
      return INITIAL_SOCIAL_PROOF;
    }
  });

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
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
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
