import { 
  Hostel, 
  Booking, 
  Enquiry, 
  Review, 
  UserProfile 
} from '../types';

export const mapHostel = (h: any): Hostel => ({
  id: h.id,
  name: h.name,
  location: h.location,
  university: h.university,
  price: Number(h.price),
  rating: Number(h.rating),
  reviewsCount: h.reviews_count || 0,
  image: h.image,
  amenities: h.amenities || [],
  verified: h.verified || false,
  description: h.description,
  landlordId: h.landlord_id,
  landlordName: h.landlord_name,
  bookingFee: h.booking_fee || 0,
  paymentDetails: h.payment_details || {},
  totalRooms: h.total_rooms || 0,
  availableRooms: h.available_rooms || 0
});

export const mapBooking = (b: any): Booking => ({
  id: b.id,
  hostelId: b.hostel_id,
  hostelName: b.hostel_name,
  price: Number(b.price),
  date: b.date,
  status: b.status,
  paymentStatus: b.payment_status,
  amountPaid: Number(b.amount_paid),
  totalAmount: Number(b.total_amount),
  bookingFee: Number(b.booking_fee),
  studentId: b.student_id,
  studentName: b.student_name,
  landlordId: b.landlord_id,
  receiptImage: b.receipt_image,
  createdAt: b.created_at
});

export const mapEnquiry = (e: any): Enquiry => ({
  id: e.id,
  hostelId: e.hostel_id,
  hostelName: e.hostel_name,
  studentId: e.student_id,
  studentName: e.student_name,
  landlordId: e.landlord_id,
  message: e.message,
  date: e.date,
  status: e.status,
  replyMessage: e.reply_message
});

export const mapReview = (r: any): Review => ({
  id: r.id,
  hostelId: r.hostel_id,
  hostelName: r.hostel_name,
  studentId: r.student_id,
  studentName: r.student_name,
  rating: Number(r.rating),
  comment: r.comment,
  isComplaint: r.is_complaint,
  status: r.status,
  adminNote: r.admin_note,
  createdAt: r.created_at
});

export const mapProfile = (p: any): UserProfile => ({
  uid: p.id,
  email: p.email,
  name: p.name,
  role: p.role,
  phone: p.phone,
  bio: p.bio,
  university: p.university,
  address: p.address,
  photoURL: p.photo_url,
  verified: p.verified || false,
  adminApproved: p.admin_approved || false,
  documents: p.documents || []
});
