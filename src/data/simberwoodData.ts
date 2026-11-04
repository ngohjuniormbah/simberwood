export interface Puppy {
  id: string;
  name: string;
  breedType: 'English Cocker Spaniel' | 'American Cocker Spaniel';
  gender: 'Male' | 'Female';
  ageWeeks: number;
  dob: string;
  coatColor: string;
  coatType: string;
  estimatedWeight: string;
  adoptionFee: number;
  status: 'available' | 'reserved' | 'adopted';
  sire: string;
  dam: string;
  headline: string;
  description: string;
  temperament: string[];
  healthHighlights: string[];
  vaccinated: boolean;
  microchipped: boolean;
  dewormed: boolean;
  vetChecked: boolean;
  readyDate: string;
  primaryImage: string;
  additionalImages: string[];
}

export interface AdopterReview {
  id: string;
  author: string;
  location: string;
  spanielName: string;
  spanielColor: string;
  adoptionYear: number;
  rating: number;
  title: string;
  comment: string;
  photoUrl: string;
  verifiedAdopter: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'puppies' | 'parents' | 'alumni' | 'grounds';
  caption: string;
  imageUrl: string;
  tag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'adoption' | 'health' | 'care';
}

export const PUPPIES_DATA: Puppy[] = [
  {
    id: 'sw-2026-01',
    name: 'Barnaby',
    breedType: 'English Cocker Spaniel',
    gender: 'Male',
    ageWeeks: 9,
    dob: 'September 1, 2026',
    coatColor: 'Rich Golden Buff',
    coatType: 'Silky Soft Feathering',
    estimatedWeight: '26 - 30 lbs',
    adoptionFee: 1850,
    status: 'available',
    sire: 'Simberwood Sir Montgomery (OFA Good, PRA Clear)',
    dam: 'Lady Clementine of Sussex (OFA Excellent, FN Clear)',
    headline: 'Gentle, cuddly boy with expressive amber eyes and an eager-to-please heart',
    description: 'Barnaby is a soulful, affectionate golden pup who thrives on human companionship. He completed our 4-week Early Neurological Stimulation (ENS) course with calm curiosity and loves curled-up lap naps just as much as garden strolls. He is accustomed to gentle children, crate rest intervals, and household sounds.',
    temperament: ['Velcro Lap Companion', 'Gentle with Children', 'Attentive & Trainable', 'Moderate Energy'],
    healthHighlights: ['OFA Eye CAER Normal', 'PRA-prcd Clear by Parentage', 'FN Hereditary Clear', 'Core Vaccines Phase 1 & 2 Completed'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Immediate / Ready for pickup or hand transport',
    primaryImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-02',
    name: 'Winnie',
    breedType: 'English Cocker Spaniel',
    gender: 'Female',
    ageWeeks: 8,
    dob: 'September 8, 2026',
    coatColor: 'Chocolate & Tan Roan',
    coatType: 'Wavy Glossy Coat',
    estimatedWeight: '24 - 28 lbs',
    adoptionFee: 1950,
    status: 'available',
    sire: 'Ch. Braemar Wildwood Ranger (Champion Bloodline)',
    dam: 'Simberwood Autumn Willow (DNA 100% Clear Panel)',
    headline: 'Sweet, bright-eyed little explorer with breathtaking chocolate roan markings',
    description: 'Winnie has inherited her mother’s famous merry disposition and her father’s elegant compact balance. She loves puzzle toys, fetch with miniature tennis balls, and resting her chin softly on your footwear. She already demonstrates natural recall when called softly.',
    temperament: ['Playful & Alert', 'Merry Tail-Wagger', 'Quick Learner', 'Loves Water Play'],
    healthHighlights: ['AMS Clear', 'PRA-prcd Normal', 'OFA Patellas Normal', 'Clean Cardiovascular Auscultation'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Ready for Home Departure',
    primaryImage: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-03',
    name: 'Pip',
    breedType: 'English Cocker Spaniel',
    gender: 'Male',
    ageWeeks: 10,
    dob: 'August 24, 2026',
    coatColor: 'Classic Blue Roan',
    coatType: 'Dense Silky Coat with Black Freckling',
    estimatedWeight: '27 - 31 lbs',
    adoptionFee: 1900,
    status: 'available',
    sire: 'Ch. Simberwood Sterling Prince',
    dam: 'Mistress Fiona of Highland Heather',
    headline: 'Aristocratic looks paired with a warm, endlessly joyful family personality',
    description: 'Pip is our stunning classic blue roan male. True to traditional working and bench spaniel ancestry, he has an incredible nose for scent games and will gladly accompany you on morning hikes or leisurely afternoon café visits.',
    temperament: ['Outgoing & Friendly', 'Outdoor Trail Enthusiast', 'Calm in House', 'Dog & Cat Socialized'],
    healthHighlights: ['Hips OFA Prelim Good', 'Elbows Normal', 'Full 210-Gene Embark DNA Verified', 'Microchip Pre-Registered'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Ready for Departure',
    primaryImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-04',
    name: 'Maisie',
    breedType: 'American Cocker Spaniel',
    gender: 'Female',
    ageWeeks: 9,
    dob: 'September 2, 2026',
    coatColor: 'Warm Honey Cream',
    coatType: 'Luxurious Long Feathered Coat',
    estimatedWeight: '22 - 25 lbs',
    adoptionFee: 1800,
    status: 'available',
    sire: 'Simberwood Sir Montgomery',
    dam: 'Amber Sunbeam of Simberwood',
    headline: 'Tender-hearted sweetheart with an angelic expression and gentle soul',
    description: 'Maisie is serene, responsive, and adores being brushed. She has been socialized with gentle noise exposure (vacuum, doorbell, children’s laughter) and shows outstanding emotional intuition. Ideal for someone looking for a therapeutic companion.',
    temperament: ['Therapy Dog Candidate', 'Deeply Affectionate', 'Gentle Temperament', 'Quiet House Manners'],
    healthHighlights: ['Cardiac OFA Normal', 'Eye Clearance 2026', 'PRA-prcd Non-Carrier', 'Vaccines Up to Date'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Immediate',
    primaryImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-05',
    name: 'Archie',
    breedType: 'English Cocker Spaniel',
    gender: 'Male',
    ageWeeks: 8,
    dob: 'September 10, 2026',
    coatColor: 'Deep Black & Rich Tan Points',
    coatType: 'Silky Double Coat with Tan Eyebrows',
    estimatedWeight: '26 - 29 lbs',
    adoptionFee: 1850,
    status: 'available',
    sire: 'Ch. Braemar Wildwood Ranger',
    dam: 'Duchess Darcy of Woodberry',
    headline: 'Striking black and tan gentleman with jaunty puppy charm and confidence',
    description: 'Archie carries distinct chestnut eyebrows and tan markings on his muzzle and chest. He is adventurous without being unruly, enjoys water bowls, and has already begun learning crate safety in our puppy nursery.',
    temperament: ['Confident & Curious', 'Friendly & Welcoming', 'Loves Tug & Retrieval', 'Affectionate'],
    healthHighlights: ['OFA Thyroid Normal', 'FN Clear', 'PRA Clear', 'Veterinary Certificate of Health Included'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Available Next Week',
    primaryImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-06',
    name: 'Clover',
    breedType: 'English Cocker Spaniel',
    gender: 'Female',
    ageWeeks: 11,
    dob: 'August 18, 2026',
    coatColor: 'Red Chestnut Sable',
    coatType: 'Glossy Auburn Feathering',
    estimatedWeight: '23 - 26 lbs',
    adoptionFee: 1750,
    status: 'reserved',
    sire: 'Simberwood Sir Montgomery',
    dam: 'Lady Clementine of Sussex',
    headline: 'Warm auburn beauty currently matched with an approved adoptive family',
    description: 'Clover has reserved status for an approved family traveling from Seattle. She is a shining example of our breeding focus: sound structure, stable nerves, and an endlessly wagging tail.',
    temperament: ['Devoted Shadow', 'Balanced Disposition', 'Great with Cats', 'Crate Accustomed'],
    healthHighlights: ['Complete Health Clearance', 'Full Genetic Panel Clear', 'Microchip Registered'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Departing to family November 15',
    primaryImage: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-07',
    name: 'Archie',
    breedType: 'English Cocker Spaniel',
    gender: 'Male',
    ageWeeks: 8,
    dob: 'September 12, 2026',
    coatColor: 'Rich Red Sable',
    coatType: 'Silky Glossy Feathering',
    estimatedWeight: '25 - 28 lbs',
    adoptionFee: 1850,
    status: 'available',
    sire: 'Simberwood Sir Montgomery',
    dam: 'Simberwood Autumn Willow',
    headline: 'Affectionate little adventurer with warm amber eyes and playful spirit',
    description: 'Archie is an eager learner who loves ball games and gentle snuggles. Raised with round-the-clock home presence and early sound desensitization.',
    temperament: ['Gentle & Loving', 'Playful & Alert', 'Great with Kids', 'Cuddle Bug'],
    healthHighlights: ['OFA CAER Normal', 'PRA Clear', 'Core Vaccinations Complete', 'Microchipped'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Available for immediate departure',
    primaryImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'sw-2026-08',
    name: 'Maisie',
    breedType: 'English Cocker Spaniel',
    gender: 'Female',
    ageWeeks: 9,
    dob: 'September 5, 2026',
    coatColor: 'Blue Roan & Tan',
    coatType: 'Soft Wavy Feathering',
    estimatedWeight: '23 - 26 lbs',
    adoptionFee: 1950,
    status: 'available',
    sire: 'Ch. Braemar Wildwood Ranger',
    dam: 'Lady Clementine of Sussex',
    headline: 'Devoted, sweet companion with velvety ears and serene demeanor',
    description: 'Maisie is calm, observant, and deeply people-focused. Perfect for a family seeking a loving, gentle, emotionally stable spaniel companion.',
    temperament: ['Calm & Sensitive', 'Eager to Please', 'Affectionate', 'Loves Outdoor Trails'],
    healthHighlights: ['OFA Hips Certified', 'Full Genetic Panel Clear', 'Clean Cardiac Auscultation', 'Microchipped'],
    vaccinated: true,
    microchipped: true,
    dewormed: true,
    vetChecked: true,
    readyDate: 'Available Now',
    primaryImage: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1000&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

export const REVIEWS_DATA: AdopterReview[] = [
  {
    id: 'rev-01',
    author: 'Eleanor & Marcus Vance',
    location: 'Boston, Massachusetts',
    spanielName: 'Oliver (adopted 2024)',
    spanielColor: 'Golden Buff',
    adoptionYear: 2024,
    rating: 5,
    title: 'The most emotionally intelligent, gentle dog we have ever loved',
    comment: 'Adopting Oliver from Simberwood was an absolute dream. From our initial video consultation through visiting the peaceful countryside grounds, the care and ethical devotion of their team was unmistakable. Oliver arrived crate-trained, sound-desensitized, and has never met a stranger he did not greet with soft tail wags.',
    photoUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  },
  {
    id: 'rev-02',
    author: 'Dr. Julian Thorne',
    location: 'Greenwich, Connecticut',
    spanielName: 'Gemma (adopted 2025)',
    spanielColor: 'Blue Roan',
    adoptionYear: 2025,
    rating: 5,
    title: 'Exemplary health transparency and genuine lifelong support',
    comment: 'As a veterinary physician, health testing and orthopedic soundness were my non-negotiables. Simberwood supplied complete OFA hip scores, PRA DNA genetics, and pediatric cardiology notes before I even finalized my adoption agreement. Gemma is now 18 months old, agile, vibrant, and pure joy.',
    photoUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  },
  {
    id: 'rev-03',
    author: 'The Holloway Family',
    location: 'Denver, Colorado',
    spanielName: 'Bramble & Scout',
    spanielColor: 'Chocolate Roan & Black/Tan',
    adoptionYear: 2025,
    rating: 5,
    title: 'Our children have found their guardian angels and best friends',
    comment: 'We adopted our first spaniel Bramble two years ago and came back for Scout this spring! The ENS puppy protocol makes a huge difference: neither dog flinches at thunderstorms or noisy school mornings. Thank you Simberwood for upholding true ethical standards.',
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  },
  {
    id: 'rev-04',
    author: 'Claire Sterling',
    location: 'Portland, Oregon',
    spanielName: 'Poppy',
    spanielColor: 'Cream Buff',
    adoptionYear: 2026,
    rating: 5,
    title: 'Warm communication and pristine puppy care',
    comment: 'The weekly nursery photo updates and video calls made the waiting period so special. When Poppy arrived via their in-cabin hand courier, she was clean, relaxed, and immediately snuggled right into my cardigan. She is the center of our world.',
    photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  },
  {
    id: 'rev-05',
    author: 'Marcus & Sophia Chen',
    location: 'San Francisco, CA',
    spanielName: 'Waffles',
    spanielColor: 'Parti-Color',
    adoptionYear: 2026,
    rating: 5,
    title: 'Remarkable temperament and apartment adaptability',
    comment: 'Our puppy settled into city life without a single hiccup. The breeder foundations in crate and house training gave us such a peaceful head start. Truly exceptional care.',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  },
  {
    id: 'rev-06',
    author: 'The Gallagher Family',
    location: 'Austin, TX',
    spanielName: 'Penny',
    spanielColor: 'Golden Buff',
    adoptionYear: 2026,
    rating: 5,
    title: 'Everything we hoped for and more',
    comment: 'Penny is remarkably gentle with our toddlers and loves her evening cuddle routine. Simberwood devotion to ethical, loving breeding shines in every interaction.',
    photoUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=600&q=80',
    verifiedAdopter: true
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Golden Sunshine in the Meadow',
    category: 'puppies',
    caption: 'Our 7-week-old golden litter discovering dew on clover grass in our sheltered puppy garden.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
    tag: 'Puppy Nursery'
  },
  {
    id: 'gal-02',
    title: 'Ch. Braemar Wildwood Ranger',
    category: 'parents',
    caption: 'Our foundation sire, exemplary bench champion with verified OFA hips and PRA clear genetics.',
    imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80',
    tag: 'Foundation Sire'
  },
  {
    id: 'gal-03',
    title: 'Oliver at his 1st Birthday with the Vance Family',
    category: 'alumni',
    caption: 'Alumnus Oliver celebrating his first year with his loving family in Massachusetts.',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&q=80',
    tag: 'Simberwood Alumni'
  },
  {
    id: 'gal-04',
    title: 'Morning Forest Trail Walks',
    category: 'grounds',
    caption: 'Our private 12-acre meadow and woodland trails where our adult dogs enjoy daily free exercise.',
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&q=80',
    tag: 'Country Grounds'
  },
  {
    id: 'gal-05',
    title: 'Curious Snouts & Soft Velvet Ears',
    category: 'puppies',
    caption: 'Early socialization session introducing soft tactile textures, tunnels, and low balance ramps.',
    imageUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1000&q=80',
    tag: 'ENS Enrichment'
  },
  {
    id: 'gal-06',
    title: 'Lady Clementine of Sussex',
    category: 'parents',
    caption: 'Sweet matriarch Clementine relaxing under the orchard apple trees during sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&q=80',
    tag: 'Foundation Dam'
  },
  {
    id: 'gal-07',
    title: 'Beach Weekend with Alumnus Jasper',
    category: 'alumni',
    caption: 'Jasper enjoying salty sea spray and safe coastal jogs with his adoptive parents.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80',
    tag: 'Alumni Adventures'
  },
  {
    id: 'gal-08',
    title: 'Sanctuary Sunroom & Nursery Play Area',
    category: 'grounds',
    caption: 'Temperature-monitored, heated flooring nursery suite where mama dogs nurse and nurture in serenity.',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
    tag: 'Nursery Suite'
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    question: 'What is included in the Simberwood Cocker Spaniel adoption?',
    answer: 'Every adopted Simberwood puppy comes with: 2-Year Genetic Health Guarantee, complete age-appropriate core vaccinations, deworming schedule, pre-registered ISO microchip, comprehensive veterinary health certificate, 30 days complimentary pet health insurance voucher, a scent-infused blanket from mom, transition food, and lifetime breeder guidance.',
    category: 'adoption'
  },
  {
    question: 'How do you screen and test the parents for health?',
    answer: 'All our breeding adults are tested through OFA (Orthopedic Foundation for Animals) for hips, patellas, and annual board-certified CAER eye exams. In addition, we run full DNA genetic disease panels covering Progressive Retinal Atrophy (PRA-prcd), Familial Nephropathy (FN), and Adult Onset Neuropathy (AMS).',
    category: 'health'
  },
  {
    question: 'What is your Early Neurological Stimulation (ENS) protocol?',
    answer: 'From days 3 through 16 of life, each puppy undergoes 5 daily gentle stimulation exercises: tactile stimulation, head held erect, head pointed down, supine position, and thermal stimulation. Research confirms this enhances cardiovascular performance, stronger heartbeats, more resilient adrenal glands, and higher stress tolerance.',
    category: 'health'
  },
  {
    question: 'How does travel or puppy pickup work?',
    answer: 'Families are invited to visit Simberwood on scheduled adoption days to meet our team, parents, and pick up their puppy in person. For long-distance families across North America, we arrange a dedicated in-cabin flight nanny courier who gently carries your puppy in-cabin right into your arms at your nearest airport. We never ship puppies in cargo.',
    category: 'adoption'
  },
  {
    question: 'What is the grooming commitment for a Cocker Spaniel?',
    answer: 'Cocker Spaniels possess iconic silky feathering. A routine brush 3–4 times weekly prevents mats, alongside regular ear checks to ensure their long ears stay dry and clean. Many pet families choose a manageable, neat "puppy cut" groom every 6–8 weeks for easy low-maintenance care.',
    category: 'care'
  },
  {
    question: 'What happens if our life circumstances ever change?',
    answer: 'Our core ethical pledge is our Lifetime Return Guarantee: no Simberwood dog will ever be surrendered to a shelter, rescue, or unknown third party. Should circumstances prevent you from keeping your dog at any point in their life, we will immediately welcome them back into our care.',
    category: 'adoption'
  }
];
