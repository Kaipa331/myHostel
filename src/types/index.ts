export interface PaymentDetails {
  airtelMoney?: string;
  tnmMpamba?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  university: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: string[];
  description: string;
  verified: boolean;
  landlordId: string;
  landlordName?: string;
  paymentDetails?: PaymentDetails;
  bookingFee?: number;
  totalRooms: number;
  availableRooms: number;
  createdAt?: any;
}

export interface Booking {
  id: string;
  hostelId: string;
  hostelName: string;
  price: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'fully_paid';
  amountPaid: number;
  totalAmount: number;
  bookingFee: number;
  receiptImage?: string;
  studentId: string;
  studentName?: string;
  landlordId: string;
  createdAt?: any;
}

export interface Enquiry {
  id: string;
  hostelId: string;
  hostelName: string;
  studentId: string;
  studentName: string;
  landlordId: string;
  message: string;
  date: string;
  status: 'new' | 'replied';
  replyMessage?: string;
}

export interface Review {
  id: string;
  hostelId: string;
  hostelName: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  isComplaint: boolean;
  status: 'pending' | 'resolved' | 'dismissed';
  adminNote?: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'landlord' | 'admin';
  photoURL?: string;
  phone?: string;
  bio?: string;
  university?: string;
  address?: string;
  verified?: boolean;
  adminApproved?: boolean;
  documents?: string[];
  createdAt?: any;
}

export type AppView =
  | 'home'
  | 'listings'
  | 'detail'
  | 'list-hostel'
  | 'support'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'payment'
  | 'profile'
  | 'complaints'
  | 'bookings'
  | 'messages'
  | 'saved'
  | 'settings'
  | 'hostels'
  | 'enquiries'
  | 'analytics'
  | 'booking-confirmation'
  | 'approvals'
  | 'moderation'
  | 'properties'
  | 'transactions';
