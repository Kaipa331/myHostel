import { Hostel } from '../types';

export const MOCK_HOSTELS: Hostel[] = [
  {
    id: '1',
    name: 'The Grand Residence',
    location: 'Area 47, Lilongwe',
    university: 'UNIMA',
    price: 45000,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=1000',
    amenities: ['High-speed WiFi', '24/7 Security', 'Study Lounge', 'Backup Power'],
    description: 'A premium living experience designed for serious students. Located just 5 minutes from campus, The Grand Residence offers a quiet, secure environment with all modern amenities.',
    verified: true,
    landlordId: 'mock-1',
    bookingFee: 0,
    paymentDetails: {
      airtelMoney: '0999123456',
      tnmMpamba: '0888123456',
      bankName: 'National Bank',
      bankAccount: '1002003004'
    },
    totalRooms: 20,
    availableRooms: 20
  },
  {
    id: '2',
    name: 'Lakeside Scholars Inn',
    location: 'Chichiri, Blantyre',
    university: 'MUBAS',
    price: 38000,
    rating: 4.5,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
    amenities: ['WiFi', 'Cafeteria', 'Laundry', 'Gym'],
    description: 'Affordable and social. Lakeside Scholars Inn is perfect for students who want to be in the heart of the action while maintaining a comfortable study space.',
    verified: true,
    landlordId: 'mock-2',
    bookingFee: 3000,
    paymentDetails: {
      airtelMoney: '0999654321',
      tnmMpamba: '0888654321'
    },
    totalRooms: 15,
    availableRooms: 15
  },
  {
    id: '3',
    name: 'Elite Campus Suites',
    location: 'Zomba Central',
    university: 'Chancellor College',
    price: 52000,
    rating: 4.9,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
    amenities: ['AC', 'Private Kitchen', 'Shuttle Service', 'Backup Power'],
    description: 'The pinnacle of student luxury. Elite Campus Suites provides private living spaces with top-tier security and a dedicated shuttle service to campus.',
    verified: true,
    landlordId: 'mock-3',
    totalRooms: 10,
    availableRooms: 10
  },
  {
    id: '4',
    name: 'Unity Student Housing',
    location: 'Mzuzu City',
    university: 'MZUNI',
    price: 32000,
    rating: 4.2,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000',
    amenities: ['WiFi', 'Shared Kitchen', 'Water Backup', 'Study Hall'],
    description: 'A community-focused hostel that prioritizes safety and affordability. Great for first-year students looking to make friends.',
    verified: false,
    landlordId: 'mock-4',
    totalRooms: 25,
    availableRooms: 25
  }
];

export const MOCK_APPROVAL_QUEUE = [
  { id: 'approval-1', name: 'Ephraim Mtika', email: 'e.mtika@provider.mw', university: 'UNIMA (Chanco)', date: '24 Oct, 2024', documents: ['ID_Card.pdf', 'Title_Deed.jpg'] },
  { id: 'approval-2', name: 'Bester Kapila', email: 'bester.hostels@mw.com', university: 'MUBAS (Poly)', date: '23 Oct, 2024', documents: ['Tax_Clearance.pdf'] },
];

export const MOCK_FLAGGED_LISTINGS = [
  { id: 'flagged-1', name: 'Graceful Guesthouse (Room 4)', reason: 'SCAM ALERT', details: 'Reported by 4 students for inaccurate photos and hidden utility fees not disclosed in listing.' },
  { id: 'flagged-2', name: 'Hilltop Annex - Area 47', reason: 'DUPLICATE', details: 'Potential duplicate listing of Hilltop Area 47 (ID: #8821). Needs manual verification.' },
];
