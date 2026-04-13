import React, { useState, useMemo, useEffect, ErrorInfo, ReactNode, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Wifi, 
  Coffee, 
  Zap, 
  ChevronRight, 
  Menu, 
  X,
  Moon,
  Sun,
  Camera,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Mail,
  Instagram,
  Facebook,
  LayoutDashboard,
  LogOut,
  User,
  Calendar,
  CreditCard,
  Building,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Edit,
  MessageSquare,
  Bell,
  Settings,
  Shield,
  FileText,
  Check,
  Ban,
  RefreshCw,
  Send,
  HelpCircle,
  MoreVertical,
  ArrowUpRight,
  Heart,
  FileCheck,
  AlertTriangle,
  ClipboardList, 
  Plus
} from 'lucide-react';
import { 
  supabase, 
  handleSupabaseError, 
  OperationType 
} from './supabase';
import { Navbar as LayoutNavbar } from './components/layout/Navbar';
import { Sidebar as LayoutSidebar } from './components/layout/Sidebar';
import LayoutFooter from './components/layout/Footer';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { HomeView } from './components/views/HomeView';
import { ListingsView } from './components/views/ListingsView';

const LandlordDashboardView = lazy(() => import('./components/dashboard/LandlordDashboard').then((module) => ({ default: module.LandlordDashboard })));
const AdminDashboardView = lazy(() => import('./components/dashboard/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const StudentDashboardView = lazy(() => import('./components/dashboard/StudentDashboard').then((module) => ({ default: module.StudentDashboard })));
const HostelDetailView = lazy(() => import('./components/hostel/HostelDetail').then((module) => ({ default: module.HostelDetail })));
const HostelFormView = lazy(() => import('./components/hostel/HostelForm').then((module) => ({ default: module.HostelForm })));
const ProfileFormView = lazy(() => import('./components/profile/ProfileForm').then((module) => ({ default: module.ProfileForm })));
const PaymentModalView = lazy(() => import('./components/modal/PaymentModal').then((module) => ({ default: module.PaymentModal })));
const InvoiceModalView = lazy(() => import('./components/modal/InvoiceModal').then((module) => ({ default: module.InvoiceModal })));
const AuthView = lazy(() => import('./components/views/AuthView').then((module) => ({ default: module.AuthView })));
const BookingConfirmationView = lazy(() => import('./components/views/BookingConfirmationView').then((module) => ({ default: module.BookingConfirmationView })));
const SupportView = lazy(() => import('./components/views/SupportView').then((module) => ({ default: module.SupportView })));

const ScreenFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center p-8">
    <div className="rounded-3xl border border-outline-variant/30 bg-white dark:bg-surface-container px-6 py-4 text-sm font-bold text-primary shadow-xl">
      Loading screen...
    </div>
  </div>
);

// --- Constants ---
const AMENITY_OPTIONS = [
  "High-speed WiFi",
  "24/7 Security",
  "Study Lounge",
  "Backup Power",
  "Laundry Services",
  "En-suite Bathroom",
  "Shared Kitchen",
  "Gym Access",
  "Parking Space",
  "Water Reservoir"
];

const AUTOMATIC_BOOKING_FEE = 0;

const UNIVERSITIES = [
  "University of Malawi (UNIMA)",
  "Malawi University of Business and Applied Sciences (MUBAS)",
  "Mzuzu University (MZUNI)",
  "Lilongwe University of Agriculture and Natural Resources (LUANAR)",
  "Kamuzu University of Health Sciences (KUHeS)",
  "Malawi University of Science and Technology (MUST)",
  "Catholic University of Malawi (CUNIMA)",
  "Livingstonia University (UNILIA)",
  "Nkhoma University",
  "Adventist University of Malawi",
  "Malawi Assemblies of God University (MAGU)",
  "Pentecostal Life University (PLU)",
  "Blantyre International University (BIU)",
  "Exploits University",
  "Millennium University",
  "DMI St. John the Baptist University"
];

const ADMIN_EMAIL = 'kaipap33@gmail.com';

// --- Types ---
interface PaymentDetails {
  airtelMoney?: string;
  tnmMpamba?: string;
  bankName?: string;
  bankAccount?: string;
}

interface Hostel {
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

interface Booking {
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

interface Enquiry {
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

interface Review {
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

interface UserProfile {
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

type AppView =
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

// --- Mock Data ---
const MOCK_HOSTELS: Hostel[] = [
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
    totalRooms: 20,
    availableRooms: 15,
    paymentDetails: {
      airtelMoney: '0999123456',
      tnmMpamba: '0888123456',
      bankName: 'National Bank',
      bankAccount: '1002003004'
    }
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
    totalRooms: 25,
    availableRooms: 10,
    paymentDetails: {
      airtelMoney: '0999654321',
      tnmMpamba: '0888654321'
    }
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
    totalRooms: 15,
    availableRooms: 8
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
    totalRooms: 30,
    availableRooms: 22
  }
];

const MOCK_APPROVAL_QUEUE = [
  { id: 'approval-1', name: 'Ephraim Mtika', email: 'e.mtika@provider.mw', university: 'UNIMA (Chanco)', date: '24 Oct, 2024', documents: ['ID_Card.pdf', 'Title_Deed.jpg'] },
  { id: 'approval-2', name: 'Bester Kapila', email: 'bester.hostels@mw.com', university: 'MUBAS (Poly)', date: '23 Oct, 2024', documents: ['Tax_Clearance.pdf'] },
];

const MOCK_FLAGGED_LISTINGS = [
  { id: 'flagged-1', name: 'Graceful Guesthouse (Room 4)', reason: 'SCAM ALERT', details: 'Reported by 4 students for inaccurate photos and hidden utility fees not disclosed in listing.' },
  { id: 'flagged-2', name: 'Hilltop Annex - Area 47', reason: 'DUPLICATE', details: 'Potential duplicate listing of Hilltop Area 47 (ID: #8821). Needs manual verification.' },
];

// --- Components ---

// --- Components ---

const Sidebar = ({ user, activeView, onViewChange, onLogout, isOpen, onClose }: { user: UserProfile, activeView: string, onViewChange: (view: string) => void, onLogout: () => void, isOpen?: boolean, onClose?: () => void }) => {
  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Panel', icon: Shield },
          { id: 'approvals', label: 'Approval Queue', icon: FileCheck },
          { id: 'complaints', label: 'Complaints', icon: ShieldAlert },
          { id: 'moderation', label: 'Moderation', icon: AlertTriangle },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'landlord':
        return [
          { id: 'dashboard', label: 'Landlord Hub', icon: LayoutDashboard },
          { id: 'properties', label: 'My Properties', icon: Building },
          { id: 'bookings', label: 'Booking Requests', icon: ClipboardList },
          { id: 'messages', label: 'Student Enquiries', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bookings', label: 'My Bookings', icon: Building },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'saved', label: 'Saved Hostels', icon: Heart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-container border-r border-outline-variant/30 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center cursor-pointer" onClick={() => { onViewChange('home'); onClose?.(); }}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="myHostel Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-black text-primary tracking-tighter">myHostel</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl mb-8 border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-primary" />}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-primary truncate">Welcome back</div>
                <div className="text-[10px] font-medium text-on-surface-variant truncate uppercase tracking-widest">{user.role} Account</div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id as AppView); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeView === item.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
              <HelpCircle className="w-5 h-5" />
              Help Center
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-error hover:bg-error/10 transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = ({ user, activeView, onViewChange, reviews, hostels, pendingLandlords, onViewHostel }: { user: UserProfile, activeView: string, onViewChange: (view: AppView) => void, reviews: Review[], hostels: Hostel[], pendingLandlords: UserProfile[], onViewHostel: (h: Hostel) => void }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Review | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleUpdateStatus = async (reviewId: string, status: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status, admin_note: adminNote })
        .eq('id', reviewId);
      
      if (error) throw error;
      setSelectedComplaint(null);
      setAdminNote('');
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  const handleDeleteListing = async (hostelId: string) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        const { error: deleteError } = await supabase
          .from('hostels')
          .delete()
          .eq('id', hostelId);
        
        if (deleteError) throw deleteError;

        // Also mark related complaints as resolved
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ status: 'resolved', admin_note: 'Listing deleted due to valid complaints.' })
          .eq('hostel_id', hostelId);

        if (updateError) throw updateError;
        
        setSelectedComplaint(null);
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  const handleSendMessage = async (studentId: string, studentName: string) => {
    if (!replyMessage.trim()) return;
    try {
      const { error } = await supabase.from('enquiries').insert({
        hostel_id: 'admin-support',
        hostel_name: 'Admin Support',
        student_id: studentId,
        student_name: studentName,
        landlord_id: user.uid, // Admin is the sender
        message: replyMessage,
        date: new Date().toLocaleDateString(),
        status: 'new'
      });
      
      if (error) throw error;
      setReplyMessage('');
      setIsReplying(false);
      alert("Message sent to student successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleApproveLandlord = async (landlordId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ admin_approved: true, verified: true })
        .eq('id', landlordId);

      if (error) throw error;
      alert("Landlord approved successfully!");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'profiles');
    }
  };

  const handleRejectLandlord = async (landlordId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ admin_approved: false, verified: false })
        .eq('id', landlordId);

      if (error) throw error;
      alert("Landlord rejected. They can reapply with proper documentation.");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'profiles');
    }
  };



  const renderContent = () => {
    switch (activeView) {
      case 'complaints':
        const complaints = reviews.filter(r => r.isComplaint);
        return (
          <section className="space-y-6">
            <div className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
              <div className="p-8 border-b border-outline-variant/30">
                <h2 className="text-xl font-black text-primary">Student Complaints</h2>
                <p className="text-sm text-on-surface-variant font-medium">Review and resolve issues reported by students.</p>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {complaints.length > 0 ? complaints.map((complaint) => (
                  <div key={complaint.id} className="p-8 hover:bg-surface-container-lowest transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{complaint.hostelName}</h4>
                          <p className="text-xs text-on-surface-variant font-medium">Reported by {complaint.studentName} • {new Date(complaint.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                        complaint.status === 'pending' ? 'bg-secondary-fixed/10 text-secondary-fixed' :
                        complaint.status === 'resolved' ? 'bg-tertiary/10 text-tertiary' : 'bg-on-surface-variant/10 text-on-surface-variant'
                      }`}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 italic">
                      "{complaint.comment}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => {
                          const hostel = hostels.find(h => h.id === complaint.hostelId);
                          if (hostel) onViewHostel(hostel);
                        }}
                        className="px-4 py-2 bg-white dark:bg-surface-container border border-outline-variant/30 rounded-xl text-xs font-bold text-primary hover:bg-surface-container-high transition-colors"
                      >
                        View Listing
                      </button>
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover-lift transition-all"
                      >
                        Take Action
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsReplying(true);
                        }}
                        className="px-4 py-2 bg-surface-container text-primary rounded-xl text-xs font-bold hover:bg-primary/5 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message Student
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center">
                    <CheckCircle2 className="w-12 h-12 text-tertiary/30 mx-auto mb-4" />
                    <p className="text-on-surface-variant font-bold">No active complaints. Everything looks good!</p>
                  </div>
                )}
              </div>
            </div>

            {selectedComplaint && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white dark:bg-surface-container rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-primary">Resolve Complaint</h3>
                    <button onClick={() => { setSelectedComplaint(null); setIsReplying(false); }} className="p-2 hover:bg-surface-container rounded-full"><X className="w-6 h-6" /></button>
                  </div>

                  {isReplying ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">To: {selectedComplaint.studentName}</p>
                        <p className="text-sm text-primary font-bold">Re: Complaint about {selectedComplaint.hostelName}</p>
                      </div>
                      <textarea 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your message to the student..."
                        className="w-full p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary h-40"
                      />
                      <button 
                        onClick={() => handleSendMessage(selectedComplaint.studentId, selectedComplaint.studentName)}
                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black hover-lift interactive-scale flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Admin Note</label>
                        <textarea 
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Add a note for the internal records..."
                          className="w-full p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary h-32"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')}
                          className="py-4 bg-tertiary text-on-tertiary rounded-2xl font-black hover-lift"
                        >
                          Mark Resolved
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedComplaint.id, 'dismissed')}
                          className="py-4 bg-surface-container text-on-surface-variant rounded-2xl font-black hover:bg-surface-container-high"
                        >
                          Dismiss
                        </button>
                      </div>
                      <div className="pt-6 border-t border-outline-variant/30">
                        <button 
                          onClick={() => handleDeleteListing(selectedComplaint.hostelId)}
                          className="w-full py-4 bg-error text-on-error rounded-2xl font-black hover-lift flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Listing Permanently
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </section>
        );
      case 'approvals':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-primary">Landlord Approval Queue</h2>
                <p className="text-sm text-on-surface-variant font-medium">Review documentation for pending authentication requests.</p>
              </div>
              <button className="px-4 py-2 bg-surface-container rounded-xl text-xs font-bold text-primary hover:bg-primary/10 transition-colors">Export CSV</button>
            </div>
            <div className="overflow-x-auto -mx-8">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Landlord Name</th>
                    <th className="px-8 py-4">University Area</th>
                    <th className="px-8 py-4">Documents</th>
                    <th className="px-8 py-4">Date Applied</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {pendingLandlords.map((landlord) => (
                    <tr key={landlord.uid} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {landlord.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-primary">{landlord.name}</div>
                            <div className="text-xs text-on-surface-variant">{landlord.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold border border-primary/10">
                          {landlord.university || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          {landlord.documents && landlord.documents.length > 0 ? landlord.documents.map((doc: string, i: number) => (
                            <div key={`doc-${landlord.uid}-${i}`} className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant hover:text-primary cursor-pointer">
                              <FileText className="w-3 h-3" />
                              {doc}
                            </div>
                          )) : (
                            <span className="text-[10px] text-on-surface-variant">No documents uploaded</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-on-surface-variant">
                        {new Date().toLocaleDateString()} {/* TODO: Add created_at to profiles */}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApproveLandlord(landlord.uid)}
                            className="px-3 py-1.5 bg-tertiary text-on-tertiary rounded-lg text-[10px] font-black hover:scale-105 transition-transform"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectLandlord(landlord.uid)}
                            className="px-3 py-1.5 bg-error/10 text-error rounded-lg text-[10px] font-black hover:bg-error/20 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'moderation':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-error" />
              Flagged Listings
            </h2>
            <div className="space-y-4">
              {MOCK_FLAGGED_LISTINGS.map((listing) => (
                <div key={listing.id} className="p-6 rounded-3xl bg-surface-container-low border-l-4 border-error flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-primary">{listing.name}</h4>
                      <span className="px-2 py-0.5 bg-error text-on-error rounded text-[8px] font-black tracking-widest">{listing.reason}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{listing.details}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-4 py-2 bg-white dark:bg-surface-container rounded-xl text-xs font-bold text-primary border border-outline-variant/30 hover:bg-surface-container-high transition-colors">View Listing</button>
                    <button className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold shadow-lg shadow-error/20 hover:scale-105 transition-transform">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'settings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-2xl font-black text-primary mb-8">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Platform Config</h3>
                <div className="space-y-4">
                  {['Maintenance Mode', 'Allow New Registrations', 'Enable Global Search'].map((pref, i) => (
                    <div key={`system-pref-${i}`} className="flex justify-between items-center p-4 rounded-2xl bg-surface-container-low">
                      <span className="text-sm font-bold text-primary">{pref}</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Admin Access</h3>
                <div className="space-y-3">
                  <button className="w-full p-4 rounded-2xl bg-surface-container-low text-left font-bold text-primary hover:bg-primary/5 transition-all flex justify-between items-center">
                    Manage Admin Users <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-surface-container-low text-left font-bold text-primary hover:bg-primary/5 transition-all flex justify-between items-center">
                    Audit Logs <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <>
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Platform Statistics
                </h2>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last 24 Hours</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 editorial-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Building className="w-24 h-24" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building className="text-primary w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-tertiary">+12.5%</span>
                  </div>
                  <div className="text-4xl font-black text-primary mb-1">1,284</div>
                  <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Bookings</div>
                </div>
                <div className="bg-white dark:bg-surface-container p-8 rounded-[2rem] border border-outline-variant/30 editorial-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <User className="w-24 h-24" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary-fixed/10 rounded-xl flex items-center justify-center">
                      <User className="text-secondary-fixed w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">Stable</span>
                  </div>
                  <div className="text-4xl font-black text-primary mb-1">412</div>
                  <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Active Landlords</div>
                </div>
                <div className="bg-primary text-on-primary p-8 rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-24 h-24" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white/60">MWK</span>
                  </div>
                  <div className="text-4xl font-black mb-1">18.4M</div>
                  <div className="text-sm font-bold text-white/60 uppercase tracking-widest">Total Revenue Fees</div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
                  <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-error" />
                    Urgent Moderation
                  </h2>
                  <div className="space-y-4">
                    {MOCK_FLAGGED_LISTINGS.slice(0, 2).map((listing) => (
                      <div key={listing.id} className="p-6 rounded-3xl bg-surface-container-low border-l-4 border-error flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-primary">{listing.name}</h4>
                          <p className="text-xs text-on-surface-variant">{listing.reason}</p>
                        </div>
                        <button onClick={() => onViewChange('dashboard')} className="text-xs font-black text-primary hover:underline">Review</button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
                  <h2 className="text-xl font-black text-primary mb-8">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Clear Cache', icon: RefreshCw },
                      { label: 'Push Notice', icon: Send },
                    ].map((item, i) => (
                      <button key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-surface-container hover:bg-primary/5 hover:text-primary transition-all group">
                        <item.icon className="w-8 h-8 mb-3 text-on-surface-variant group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-surface-container-lowest min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => (window as any).toggleSidebar?.()}
            className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-primary">
              {activeView === 'dashboard' ? 'Admin Hub' : 
               activeView === 'approvals' ? 'Landlord Approvals' :
               activeView === 'moderation' ? 'Content Moderation' : 'System Settings'}
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              {activeView === 'dashboard' ? 'System Overview & Management' : 
               activeView === 'approvals' ? 'Review documentation for pending authentication requests.' :
               activeView === 'moderation' ? 'Manage flagged listings and user reports.' : 'Configure platform-wide settings.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm border border-primary/20">
            <Shield className="w-4 h-4" />
            Admin Status: Active
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};

const ReviewSection = ({ hostel, user, reviews }: { hostel: Hostel, user: UserProfile | null, reviews: Review[] }) => {
  const [isComplaint, setIsComplaint] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hostelReviews = reviews.filter(r => r.hostelId === hostel.id && !r.isComplaint);
  const averageRating = hostelReviews.length > 0 
    ? (hostelReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / hostelReviews.length).toFixed(1)
    : (hostel?.rating || 5.0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to leave a review or report an issue.");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Insert review
      const { error } = await supabase.from('reviews').insert({
        hostel_id: hostel.id,
        hostel_name: hostel.name,
        student_id: user.uid,
        student_name: user.name,
        rating: isComplaint ? 1 : rating,
        comment,
        is_complaint: isComplaint,
        status: 'pending'
      });
      
      if (error) throw error;

      // 2. Update hostel stats (Increment count and average rating)
      const { data: updatedHostel } = await supabase.from('hostels').select('rating, reviews_count').eq('id', hostel.id).single();
      if (updatedHostel && !isComplaint) {
        const newCount = (updatedHostel.reviews_count || 0) + 1;
        const newRating = ((Number(updatedHostel.rating) * (newCount - 1)) + rating) / newCount;
        
        await supabase.from('hostels').update({
          reviews_count: newCount,
          rating: Number(newRating.toFixed(1))
        }).eq('id', hostel.id);
      }

      setComment('');
      setIsComplaint(false);
      alert(isComplaint ? "Your complaint has been sent to the admin for review." : "Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-primary mb-2">Reviews & Feedback</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary-fixed/20 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
              <span className="text-sm font-black text-secondary">{averageRating}</span>
            </div>
            <span className="text-sm text-on-surface-variant font-medium">{hostelReviews.length} Verified Reviews</span>
          </div>
        </div>
        {user?.role === 'student' && (
          <button 
            onClick={() => setIsComplaint(!isComplaint)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isComplaint ? 'bg-error text-on-error' : 'bg-surface-container text-primary hover:bg-primary/5'}`}
          >
            {isComplaint ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isComplaint ? 'Cancel Report' : 'Report an Issue'}
          </button>
        )}
      </div>

      {user?.role === 'student' && (
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/30 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-primary">{isComplaint ? 'File a Complaint' : 'Write a Review'}</h4>
            {!isComplaint && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={`review-star-${s}`} type="button" onClick={() => setRating(s)} className="p-1">
                    <Star className={`w-6 h-6 ${s <= rating ? 'text-secondary fill-secondary' : 'text-on-surface-variant/30'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder={isComplaint ? "Describe the issue you're facing with this hostel..." : "Share your experience living here..."}
            className="w-full p-4 rounded-2xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary h-32"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black hover-lift interactive-scale shadow-lg flex items-center justify-center gap-2 ${isComplaint ? 'bg-error text-on-error shadow-error/20' : 'bg-primary text-on-primary shadow-primary/20'}`}
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
              <>
                {isComplaint ? <ShieldAlert className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {isComplaint ? 'Submit Complaint to Admin' : 'Post Review'}
              </>
            )}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {hostelReviews.length > 0 ? hostelReviews.map((review) => (
          <div key={review.id} className="p-6 bg-white dark:bg-surface-container rounded-3xl border border-outline-variant/20 editorial-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {review.studentName ? review.studentName[0] : 'U'}
                </div>
                <div>
                  <div className="font-bold text-primary">{review.studentName || 'Unknown User'}</div>
                  <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Verified Resident</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={`review-item-star-${review.id}-${i}`} className={`w-3 h-3 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-on-surface-variant/20'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed italic">"{review.comment}"</p>
          </div>
        )) : (
          <div className="text-center py-12 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
            <Star className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentDashboard = ({ 
  user, 
  bookings, 
  enquiries, 
  hostels, 
  savedHostels,
  activeView, 
  onViewChange,
  onOpenPayment,
  onOpenInvoice,
  onSelectEnquiry,
  onOpenHostelDetail,
  onSaveHostel,
  onUnsaveHostel
}: { 
  user: UserProfile, 
  bookings: Booking[], 
  enquiries: Enquiry[], 
  hostels: Hostel[], 
  savedHostels: Hostel[],
  activeView: string, 
  onViewChange: (view: AppView) => void,
  onOpenPayment: () => void,
  onOpenInvoice: () => void,
  onSelectEnquiry: (e: Enquiry) => void,
  onOpenHostelDetail: (h: Hostel) => void,
  onSaveHostel: (hostelId: string) => void,
  onUnsaveHostel: (hostelId: string) => void
}) => {
  const renderContent = () => {
    switch (activeView) {
      case 'bookings':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">My Bookings</h2>
              <button onClick={() => onViewChange('listings')} className="text-sm font-bold text-primary hover:underline">Find More Hostels</button>
            </div>
            <div className="space-y-6">
              {bookings.length > 0 ? bookings.map((booking, i) => {
                const hostel = hostels.find(h => h.id === booking.hostelId);
                return (
                  <div 
                    key={`booking-list-${booking.id || i}`} 
                    onClick={() => hostel && onOpenHostelDetail(hostel)}
                    className="bg-white dark:bg-surface-container rounded-[2.5rem] p-6 border border-outline-variant/30 editorial-shadow flex flex-col md:flex-row items-center gap-8 hover:border-primary transition-all group cursor-pointer"
                  >
                    <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                      <img src={hostel?.image || 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${booking.status === 'confirmed' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-fixed/10 text-secondary-fixed'}`}>
                          {(booking.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-primary mb-1">{booking.hostelName}</h3>
                      <div className="flex items-center text-xs text-on-surface-variant font-medium">
                        <MapPin className="w-3 h-3 mr-1" /> {hostel?.location || 'Location'}
                      </div>
                    </div>
                    <div className="flex gap-12 text-right">
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Payment Status</div>
                        <div className={`text-sm font-bold ${booking.paymentStatus === 'fully_paid' ? 'text-tertiary' : 'text-secondary-fixed'}`}>
                          {booking.paymentStatus?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Price</div>
                        <div className="text-xl font-black text-primary">MK {booking.totalAmount?.toLocaleString() || '0'}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-surface-container rounded-2xl text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-center bg-white dark:bg-surface-container rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                  <Building className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">You haven't made any bookings yet.</p>
                  <button onClick={() => onViewChange('listings')} className="mt-4 text-primary font-black hover:underline">Browse available hostels</button>
                </div>
              )}
            </div>
          </section>
        );
      case 'messages':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30">
              <h2 className="text-2xl font-black text-primary">My Enquiries</h2>
              <p className="text-sm text-on-surface-variant font-medium">Track your conversations with landlords.</p>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {enquiries.length > 0 ? enquiries.map((enquiry, i) => (
                <div key={i} onClick={() => onSelectEnquiry(enquiry)} className="p-8 hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-primary group-hover:text-secondary-fixed transition-colors">{enquiry.hostelName}</h4>
                    <span className="text-[10px] font-medium text-on-surface-variant">{enquiry.date}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{enquiry.message}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${enquiry.status === 'replied' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                      {enquiry.status?.toUpperCase() || 'NEW'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <MessageSquare className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">No enquiries sent yet.</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'saved':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">Saved Hostels</h2>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{savedHostels.length} Items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHostels.length > 0 ? savedHostels.map((hostel) => (
                <div key={`saved-hostel-${hostel.id}`} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group editorial-shadow">
                  <div className="h-40 relative overflow-hidden">
                    <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <button 
                      onClick={() => onUnsaveHostel(hostel.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-error shadow-sm hover:bg-error hover:text-on-error transition-all"
                    >
                      <Heart className="w-4 h-4 fill-error" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-primary mb-1">{hostel.name}</h3>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">{hostel.location} • MK {hostel.price?.toLocaleString() || '0'}/mo</p>
                    <button onClick={() => onOpenHostelDetail(hostel)} className="w-full py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-black hover:bg-primary hover:text-on-primary transition-all">View Details</button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <Heart className="w-16 h-16 text-outline-variant mx-auto mb-4" />
                  <p className="text-on-surface-variant font-medium">No saved hostels yet.</p>
                  <p className="text-sm text-on-surface-variant/70 mt-2">Start exploring and save your favorite hostels!</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'settings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-2xl font-black text-primary mb-8">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Profile Preferences</h3>
                <div className="space-y-4">
                  {['Public Profile', 'Show University', 'Allow Direct Messages'].map((pref, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-surface-container-low">
                      <span className="text-sm font-bold text-primary">{pref}</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Security</h3>
                <div className="space-y-3">
                  <button onClick={() => alert("Password reset link sent to your email.")} className="w-full p-4 rounded-2xl bg-surface-container-low text-left font-bold text-primary hover:bg-primary/5 transition-all flex justify-between items-center">
                    Change Password <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => alert("2FA settings updated.")} className="w-full p-4 rounded-2xl bg-surface-container-low text-left font-bold text-primary hover:bg-primary/5 transition-all flex justify-between items-center">
                    Two-Factor Auth <span className="text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded">ON</span>
                  </button>
                  <button onClick={() => { if(window.confirm("Delete account?")) alert("Account deletion request sent."); }} className="w-full p-4 rounded-2xl bg-error/5 text-left font-bold text-error hover:bg-error/10 transition-all flex justify-between items-center">
                    Delete Account <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <>
            <div className="bg-secondary-fixed/10 border-l-8 border-secondary-fixed p-8 rounded-3xl mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-secondary-fixed rounded-full flex items-center justify-center text-on-secondary-fixed shadow-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-primary">Deposit Deadline</h2>
                  <span className="px-4 py-1 bg-white dark:bg-surface-container rounded-full text-[10px] font-black text-secondary-fixed border border-secondary-fixed/20">28 HOURS LEFT</span>
                </div>
                <p className="text-on-surface-variant font-medium mb-6">Your reservation for 'Sunnyside Elite' expires soon.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-primary">48h Window</span>
                    <span className="text-secondary-fixed">MK 45,000 Deposit Pending</span>
                  </div>
                  <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed w-[65%] rounded-full shadow-lg shadow-secondary-fixed/20"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 relative z-10">
                <button onClick={onOpenPayment} className="px-8 py-4 bg-secondary-fixed text-on-secondary-fixed rounded-2xl font-black text-sm hover-lift shadow-xl shadow-secondary-fixed/20">Pay Deposit</button>
                <button onClick={onOpenInvoice} className="px-8 py-4 bg-surface-container text-primary rounded-2xl font-black text-sm hover:bg-surface-container-high transition-colors">View Invoice</button>
              </div>
              <AlertCircle className="absolute -bottom-8 -right-8 w-48 h-48 text-secondary-fixed/10 -rotate-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-primary">Active Bookings</h2>
                    <button onClick={() => onViewChange('bookings')} className="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-6">
                    {bookings.slice(0, 2).map((booking, i) => {
                      const hostel = hostels.find(h => h.id === booking.hostelId);
                      return (
                        <div 
                          key={`active-booking-${booking.id || i}`} 
                          onClick={() => hostel && onOpenHostelDetail(hostel)}
                          className="bg-white dark:bg-surface-container rounded-[2.5rem] p-6 border border-outline-variant/30 editorial-shadow flex flex-col md:flex-row items-center gap-8 hover:border-primary transition-all group cursor-pointer"
                        >
                          <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                            <img src={hostel?.image || 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${booking.status === 'confirmed' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-fixed/10 text-secondary-fixed'}`}>
                                {(booking.status || 'pending').toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-primary mb-1">{booking.hostelName}</h3>
                            <div className="flex items-center text-xs text-on-surface-variant font-medium">
                              <MapPin className="w-3 h-3 mr-1" /> {hostel?.location || 'Location'}
                            </div>
                          </div>
                          <div className="p-3 bg-surface-container rounded-2xl text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <div className="bg-primary text-on-primary p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  <h2 className="text-2xl font-black mb-1 relative z-10">Quick Stats</h2>
                  <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div onClick={() => onViewChange('bookings')} className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="text-3xl font-black mb-1">{bookings.length.toString().padStart(2, '0')}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Bookings</div>
                    </div>
                    <div onClick={() => onViewChange('saved')} className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="text-3xl font-black mb-1">14</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Saved</div>
                    </div>
                  </div>
                  <Building className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
              </aside>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-surface-container-lowest min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => (window as any).toggleSidebar?.()}
            className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-primary">
              {activeView === 'dashboard' ? 'Student Dashboard' : 
               activeView === 'bookings' ? 'My Bookings' :
               activeView === 'messages' ? 'My Enquiries' :
               activeView === 'saved' ? 'Saved Hostels' : 'Settings'}
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              {activeView === 'dashboard' ? 'Manage your academic residence and booking status.' : 
               activeView === 'bookings' ? 'View your current and past reservations.' :
               activeView === 'messages' ? 'Your communication history with landlords.' :
               activeView === 'saved' ? 'Hostels you have bookmarked for later.' : 'Manage your account and preferences.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-surface-container p-2 rounded-2xl border border-outline-variant/30">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
          </div>
          <div className="pr-2 md:pr-4">
            <div className="text-sm md:text-base font-bold text-primary">{user.name}</div>
            <div className="text-[8px] md:text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{user.university || 'UNIMA'} | Year 3</div>
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};

const Navbar = ({ 
  onViewChange, 
  isMenuOpen, 
  setIsMenuOpen,
  isLoggedIn,
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onBack,
  canGoBack
}: { 
  onViewChange: (view: AppView) => void,
  isMenuOpen: boolean,
  setIsMenuOpen: (open: boolean) => void,
  isLoggedIn: boolean,
  user: UserProfile | null,
  onLogout: () => void,
  darkMode: boolean,
  onToggleDarkMode: () => void,
  onBack: () => void,
  canGoBack: boolean
}) => (
  <nav className="sticky top-0 z-50 glass-effect border-b border-outline-variant/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <div className="flex items-center cursor-pointer interactive-scale" onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="myHostel Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter text-primary">myHostel</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => onViewChange('home')}
            className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </button>
          {(!isLoggedIn || user?.role !== 'landlord') && (
            <button 
              onClick={() => onViewChange('listings')}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
            >
              Find a Room
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
          )}
          {(!isLoggedIn || user?.role === 'landlord') && (
            <button 
              onClick={() => {
                if (isLoggedIn) onViewChange('list-hostel');
                else onViewChange('login');
              }}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
            >
              List Your Hostel
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
          )}
          <button 
            onClick={() => onViewChange('support')}
            className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
          >
            Support
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </button>

          {isLoggedIn && (
            <button 
              onClick={() => onViewChange('dashboard')}
              className="text-primary font-black transition-colors relative group flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
          )}

          <button 
            onClick={onToggleDarkMode}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors interactive-scale"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onLogout}
                className="p-2 text-on-surface-variant hover:text-error transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onViewChange('login')}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:bg-primary-container transition-all shadow-md hover-lift interactive-scale"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors interactive-scale"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-primary interactive-scale"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-surface border-b border-outline-variant/30 overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button 
              onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
            >
              Home
            </button>
            {(!isLoggedIn || user?.role !== 'landlord') && (
              <button 
                onClick={() => { onViewChange('listings'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
              >
                Find a Room
              </button>
            )}
            {(!isLoggedIn || user?.role === 'landlord') && (
              <button 
                onClick={() => { 
                  if (isLoggedIn) onViewChange('list-hostel');
                  else onViewChange('login');
                  setIsMenuOpen(false); 
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
              >
                List Your Hostel
              </button>
            )}
            <button 
              onClick={() => { onViewChange('support'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
            >
              Support
            </button>
            {isLoggedIn && (
              <button 
                onClick={() => { onViewChange('dashboard'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-black transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            )}
            <div className="pt-4 px-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full text-error py-3 rounded-xl font-bold flex items-center justify-center"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onViewChange('login'); setIsMenuOpen(false); }}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold shadow-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

const Footer = ({ onViewChange, isLoggedIn }: { onViewChange: (view: AppView) => void, isLoggedIn: boolean }) => (
  <footer className="bg-primary text-on-primary py-16 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center cursor-pointer" onClick={() => onViewChange('home')}>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl mx-auto overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="myHostel Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-2xl font-bold tracking-tighter text-on-primary">myHostel</span>
            </div>
          </div>
          <p className="text-on-primary/80 text-sm leading-relaxed">
            Revolutionizing student living in Malawi. We connect students with safe, verified, and premium accommodation.
          </p>
          <div className="flex space-x-4 pt-4">
            <Instagram className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
            <Facebook className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
            <Mail className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3 text-on-primary/80 text-sm">
            <li onClick={() => onViewChange('listings')} className="hover:text-on-primary cursor-pointer transition-colors">Search Hostels</li>
            <li onClick={() => onViewChange('list-hostel')} className="hover:text-on-primary cursor-pointer transition-colors">List Your Hostel</li>
            <li onClick={() => onViewChange('support')} className="hover:text-on-primary cursor-pointer transition-colors">How it Works</li>
            <li onClick={() => onViewChange('support')} className="hover:text-on-primary cursor-pointer transition-colors">Safety & Security</li>
            {isLoggedIn && (
              <>
                <li onClick={() => onViewChange('dashboard')} className="hover:text-on-primary cursor-pointer transition-colors">Dashboard</li>
                <li onClick={() => onViewChange('profile')} className="hover:text-on-primary cursor-pointer transition-colors">Your Profile</li>
              </>
            )}
            <li onClick={() => onViewChange('support')} className="hover:text-on-primary cursor-pointer transition-colors">Terms of Service</li>
            <li onClick={() => onViewChange('support')} className="hover:text-on-primary cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-6">Universities</h4>
          <ul className="space-y-3 text-on-primary/80 text-sm">
            <li onClick={() => onViewChange('listings')} className="hover:text-on-primary cursor-pointer transition-colors">UNIMA</li>
            <li onClick={() => onViewChange('listings')} className="hover:text-on-primary cursor-pointer transition-colors">MUBAS</li>
            <li onClick={() => onViewChange('listings')} className="hover:text-on-primary cursor-pointer transition-colors">MZUNI</li>
            <li onClick={() => onViewChange('listings')} className="hover:text-on-primary cursor-pointer transition-colors">LUANAR</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4 text-on-primary/80 text-sm">
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-secondary-fixed" />
              +265 888 123 456
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-secondary-fixed" />
              hello@myhostel.mw
            </li>
            <li className="flex items-center">
              <MapPin className="w-4 h-4 mr-3 text-secondary-fixed" />
              Lilongwe, Malawi
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-on-primary/20 mt-12 pt-8 text-center text-xs text-on-primary/60">
        © 2026 myHostel Malawi. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Data Mappers (Supabase snake_case to App camelCase) ---
const mapHostel = (h: any): Hostel => ({
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
  totalRooms: h.total_rooms || 0,
  availableRooms: h.available_rooms || 0,
  paymentDetails: h.payment_details || {}
});

const mapBooking = (b: any): Booking => ({
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

const mapEnquiry = (e: any): Enquiry => ({
  id: e.id,
  hostelId: e.hostel_id,
  hostelName: e.hostel_name,
  studentId: e.student_id,
  studentName: e.student_name,
  landlordId: e.landlord_id,
  message: e.message,
  date: e.date,
  status: e.status
});

const mapReview = (r: any): Review => ({
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

const mapProfile = (p: any): UserProfile => ({
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

// --- Error Boundary ---
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare public readonly props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CRITICAL UI CRASH:", error, errorInfo);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-error/10 text-error rounded-3xl flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-primary mb-4">Something went wrong</h1>
          <p className="text-on-surface-variant mb-8 max-w-md">
            The application crashed due to a runtime error. This usually happens when data is missing or a naming mismatch occurs.
          </p>
          <div className="bg-surface-container rounded-2xl p-6 text-left w-full max-w-2xl overflow-auto border border-outline-variant/30">
            <p className="font-mono text-xs text-error font-bold mb-2">Error: {this.state.error?.message}</p>
            <pre className="font-mono text-[10px] text-on-surface-variant whitespace-pre-wrap">
              {this.state.error?.stack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-10 px-8 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg hover-lift"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}

function MainApp() {
  const [view, setView] = useState<AppView>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    (window as any).toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  }, []);
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isEditingHostel, setIsEditingHostel] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeDashboardView, setActiveDashboardView] = useState('dashboard');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>(MOCK_HOSTELS);
  const [pendingLandlords, setPendingLandlords] = useState<UserProfile[]>([]);
  const [savedHostels, setSavedHostels] = useState<Hostel[]>([]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;
      alert("Booking accepted successfully!");
      // Refresh bookings data
      const { data: updatedBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('landlord_id', user?.uid);
      if (updatedBookings) setBookings(updatedBookings.map(mapBooking));
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'bookings');
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      alert("Booking declined.");
      // Refresh bookings data
      const { data: updatedBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('landlord_id', user?.uid);
      if (updatedBookings) setBookings(updatedBookings.map(mapBooking));
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'bookings');
    }
  };

  const handleReplyEnquiry = async (enquiryId: string, reply: string) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ 
          status: 'replied',
          reply_message: reply 
        })
        .eq('id', enquiryId);

      if (error) throw error;
      alert("Reply sent successfully!");
      // Refresh enquiries data
      const { data: updatedEnquiries } = await supabase
        .from('enquiries')
        .select('*')
        .eq('landlord_id', user?.uid);
      if (updatedEnquiries) setEnquiries(updatedEnquiries.map(mapEnquiry));
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'enquiries');
    }
  };

  const handleSaveHostel = async (hostelId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('saved_hostels')
        .insert({ student_id: user.uid, hostel_id: hostelId });

      if (error) throw error;
      // Refresh saved hostels
      const { data: updatedSaved } = await supabase
        .from('saved_hostels')
        .select(`
          hostel_id,
          hostels (*)
        `)
        .eq('student_id', user.uid);
      if (updatedSaved) {
        const saved = updatedSaved.map(item => mapHostel(item.hostels as any));
        setSavedHostels(saved);
      }
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'saved_hostels');
    }
  };

  const handleUnsaveHostel = async (hostelId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('saved_hostels')
        .delete()
        .eq('student_id', user.uid)
        .eq('hostel_id', hostelId);

      if (error) throw error;
      // Refresh saved hostels
      const { data: updatedSaved } = await supabase
        .from('saved_hostels')
        .select(`
          hostel_id,
          hostels (*)
        `)
        .eq('student_id', user.uid);
      if (updatedSaved) {
        const saved = updatedSaved.map(item => mapHostel(item.hostels as any));
        setSavedHostels(saved);
      }
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, 'saved_hostels');
    }
  };

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200'
  ];

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    // 1. Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            uid: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            photoURL: profile.photo_url,
            phone: profile.phone,
            bio: profile.bio,
            university: profile.university,
            address: profile.address,
            createdAt: profile.created_at
          } as UserProfile);
          setIsLoggedIn(true);
        } else {
          console.warn("App: No profile found in database.");
        }
      }
      setIsAuthReady(true);
    };

    checkUser();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // 1. Fetch existing profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            uid: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            photoURL: profile.photo_url,
            phone: profile.phone,
            bio: profile.bio,
            university: profile.university,
            address: profile.address,
            createdAt: profile.created_at
          } as UserProfile);
          setIsLoggedIn(true);

          // Auto-redirect to dashboard if this is a fresh sign-in (e.g. from Google)
          if (event === 'SIGNED_IN' && (view === 'login' || view === 'signup' || view === 'home')) {
            navigateTo('dashboard');
          }
        } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          // 2. Handle new OAuth user (automatic profile creation)
          console.log("App: Creating new profile for OAuth user...");
          const savedRole = localStorage.getItem('supabase_auth_role') as UserProfile['role'] || 'student';
          
          const newProfile = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'New User',
            email: session.user.email!,
            role: savedRole,
            photo_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
            created_at: new Date().toISOString()
          };

          const { error: insertError } = await supabase.from('profiles').insert(newProfile);

          if (!insertError) {
            setUser({
              uid: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role,
              photoURL: newProfile.photo_url || undefined,
              createdAt: newProfile.created_at
            } as UserProfile);
            setIsLoggedIn(true);
            localStorage.removeItem('supabase_auth_role');
            
            // Auto-redirect new OAuth users to dashboard
            navigateTo('dashboard');
          } else {
            console.error("Error creating OAuth profile:", insertError);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time Hostels
  useEffect(() => {
    const fetchHostels = async () => {
      const { data, error } = await supabase.from('hostels').select('*');
      if (error) handleSupabaseError(error, OperationType.LIST, 'hostels');
      else if (data) setHostels(data.map(mapHostel));
    };

    fetchHostels();

    const channel = supabase
      .channel('public:hostels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hostels' }, () => {
        fetchHostels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. User Data (Fetch when logged in)
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setBookings([]);
      setEnquiries([]);
      setReviews([]);
      setSavedHostels([]);
      setPendingLandlords([]);
      return;
    }

    const fetchUserData = async () => {
      try {
        const column = user.role === 'student' ? 'student_id' : 'landlord_id';
        const promises: Promise<any>[] = [
          supabase.from('bookings').select('*').eq(column, user.uid),
          supabase.from('enquiries').select('*').eq(column, user.uid)
        ];

        if (user.role === 'student') {
          promises.push(supabase.from('saved_hostels').select('hostel_id, hostels(*)').eq('student_id', user.uid));
          promises.push(supabase.from('reviews').select('*').eq('student_id', user.uid));
        } else if (user.role === 'admin') {
          promises.push(supabase.from('profiles').select('*').eq('role', 'landlord').eq('admin_approved', false));
          promises.push(supabase.from('reviews').select('*'));
        }

        const results = await Promise.all(promises);
        
        if (results[0].data) setBookings(results[0].data.map(mapBooking));
        if (results[1].data) setEnquiries(results[1].data.map(mapEnquiry));
        
        if (user.role === 'student') {
          if (results[2]?.data) {
            const saved = (results[2].data as any[]).map(item => mapHostel(item.hostels));
            setSavedHostels(saved);
          }
          if (results[3]?.data) setReviews(results[3].data.map(mapReview));
        } else if (user.role === 'admin') {
          if (results[2]?.data) setPendingLandlords(results[2].data.map(mapProfile));
          if (results[3]?.data) setReviews(results[3].data.map(mapReview));
        }
      } catch (error) {
        console.error("Authenticated data sync failed:", error);
      }
    };

    fetchUserData();

    const channels = [
      supabase.channel('bookings_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchUserData).subscribe(),
      supabase.channel('enquiries_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, fetchUserData).subscribe(),
      supabase.channel('reviews_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchUserData).subscribe()
    ];

    if (user.role === 'admin') {
      channels.push(supabase.channel('profiles_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUserData).subscribe());
    }

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [isLoggedIn, user?.uid, user?.role]);

  const navigateTo = (newView: AppView) => {
    if (newView !== view) {
      if (newView !== 'list-hostel') {
        setIsEditingHostel(false);
        setEditingHostel(null);
      }
      setViewHistory(prev => [...prev, view]);
      setView(newView);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(prevHistory => prevHistory.slice(0, -1));
      setView(prev);
      window.scrollTo(0, 0);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredHostels = useMemo(() => {
    return hostels.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, hostels]);

  const activePaymentBooking = selectedBooking ?? bookings.find(b => b.paymentStatus !== 'fully_paid') ?? bookings[0] ?? null;
  const activePaymentHostel = activePaymentBooking
    ? hostels.find(h => h.id === activePaymentBooking.hostelId) ?? null
    : null;
  const activeInvoiceHostel = selectedBooking
    ? hostels.find(h => h.id === selectedBooking.hostelId) ?? null
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('listings');
  };

  const openDetail = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    navigateTo('detail');
  };

  const [loginRole, setLoginRole] = useState<'student' | 'landlord'>('student');
  const [signupRole, setSignupRole] = useState<'student' | 'landlord'>('student');

  const handleGoogleAuth = async (role: 'student' | 'landlord') => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Save role to localStorage so we can retrieve it after the redirect
      localStorage.setItem('supabase_auth_role', role);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setAuthError(error.message || "An error occurred during Google sign in.");
      localStorage.removeItem('supabase_auth_role');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (data.user) {
        navigateTo('dashboard');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setAuthError(error.message || "Invalid email or password.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: signupRole
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile in Supabase table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: name,
            role: signupRole
          });

        if (profileError) throw profileError;
        navigateTo('dashboard');
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      setAuthError(error.message || "Could not create account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmPayment = async (bookingId: string, amount: number, receiptUrl: string | null) => {
    try {
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;
      
      const currentAmountPaid = Number(booking.amount_paid || 0);
      const totalAmount = Number(booking.total_amount || 0);
      const bookingFee = Number(booking.booking_fee || 0);
      const newAmountPaid = currentAmountPaid + amount;
      const newPaymentStatus: Booking['paymentStatus'] =
        newAmountPaid >= totalAmount ? 'fully_paid' :
        newAmountPaid > 0 ? 'partially_paid' :
        'unpaid';
      const newStatus: Booking['status'] =
        newAmountPaid >= (totalAmount * 0.5 + bookingFee) ? 'confirmed' : 'pending';
      
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          amount_paid: newAmountPaid,
          payment_status: newPaymentStatus,
          status: newStatus,
          receipt_image: receiptUrl || booking.receipt_image
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;
      
      setReceiptImage(null);
      setSelectedBooking({
        ...mapBooking({
          ...booking,
          amount_paid: newAmountPaid,
          payment_status: newPaymentStatus,
          status: newStatus,
          receipt_image: receiptUrl || booking.receipt_image
        })
      });
      navigateTo('dashboard');
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'bookings');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsLoggedIn(false);
      setUser(null);
      navigateTo('home');
      setViewHistory([]);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleBooking = async (hostel: Hostel) => {
    if (!isLoggedIn || !user) {
      navigateTo('login');
      return;
    }

    try {
      const bookingData = {
        hostel_id: hostel.id,
        hostel_name: hostel.name,
        price: hostel.price,
        date: new Date().toLocaleDateString(),
        status: 'pending',
        payment_status: 'unpaid',
        amount_paid: 0,
        total_amount: hostel.price,
        booking_fee: hostel.bookingFee !== undefined ? hostel.bookingFee : AUTOMATIC_BOOKING_FEE,
        student_id: user.uid,
        student_name: user.name,
        landlord_id: hostel.landlordId
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      
      setSelectedBooking(mapBooking(data));
      setSelectedHostel(hostel);
      navigateTo('booking-confirmation');
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'bookings');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'landlord') return;

    const formData = new FormData(e.target as HTMLFormElement);
    const selectedAmenities = Array.from(formData.getAll('amenities')) as string[];
    const totalRooms = Number(formData.get('totalRooms') || formData.get('rooms') || 0);
    const availableRooms = isEditingHostel ? editingHostel?.availableRooms ?? totalRooms : totalRooms;
    
    try {
      const hostelData = {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        university: formData.get('university') as string,
        price: Number(formData.get('price')),
        image: uploadedImage || (isEditingHostel ? editingHostel?.image : '/logo.jpg'),
        amenities: selectedAmenities.length > 0 ? selectedAmenities : ['General Amenities'],
        description: formData.get('description') as string,
        payment_details: {
          airtelMoney: formData.get('airtelMoney') as string,
          tnmMpamba: formData.get('tnmMpamba') as string,
          bankName: formData.get('bankName') as string,
          bankAccount: formData.get('bankAccount') as string,
        },
        total_rooms: totalRooms,
        available_rooms: availableRooms
      };

      if (isEditingHostel && editingHostel) {
        const { error } = await supabase
          .from('hostels')
          .update({
            ...hostelData,
            verified: editingHostel.verified ?? false,
          })
          .eq('id', editingHostel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hostels')
          .insert({
            ...hostelData,
            rating: 5.0,
            reviews_count: 0,
            verified: false,
            landlord_id: user.uid,
            landlord_name: user.name
          });
        if (error) throw error;
      }

      setUploadedImage(null);
      setIsEditingHostel(false);
      setEditingHostel(null);
      navigateTo('dashboard');
    } catch (error) {
      handleSupabaseError(error, isEditingHostel ? OperationType.UPDATE : OperationType.CREATE, 'hostels');
    }
  };

  const handleDeleteHostel = async (hostelId: string) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      const { error } = await supabase.from('hostels').delete().eq('id', hostelId);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `hostels/${hostelId}`);
    }
  };

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedHostel) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message') as string;

    try {
      const { error } = await supabase.from('enquiries').insert({
        hostel_id: selectedHostel.id,
        hostel_name: selectedHostel.name,
        student_id: user.uid,
        student_name: user.name,
        landlord_id: selectedHostel.landlordId,
        message,
        date: new Date().toLocaleDateString(),
        status: 'new'
      });
      if (error) throw error;
      alert("Enquiry sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, 'enquiries');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedData: any = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
    };

    if (user.role === 'student') {
      updatedData.university = formData.get('university') as string;
    } else {
      updatedData.address = formData.get('address') as string;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.uid);
      
      if (error) throw error;
      setUser(prev => prev ? { ...prev, ...updatedData } : prev);
      alert("Profile updated successfully!");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `profiles/${user.uid}`);
    }
  };

  const renderAuthLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-surface text-on-surface' : 'bg-surface text-on-surface'}`}>
      {view !== 'dashboard' && (
        <LayoutNavbar 
          onViewChange={navigateTo} 
          isMenuOpen={isMobileMenuOpen} 
          setIsMenuOpen={setIsMobileMenuOpen} 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBack}
          canGoBack={false}
        />
      )}

      <main className="flex-grow">
        <Suspense fallback={<ScreenFallback />}>
          <AnimatePresence mode="wait">
          {view === 'booking-confirmation' && selectedBooking && selectedHostel && (
            <BookingConfirmationView
              booking={selectedBooking}
              hostel={selectedHostel}
              onProceedToPayment={() => navigateTo('payment')}
              onGoToDashboard={() => navigateTo('dashboard')}
              onViewChange={navigateTo}
            />
          )}

          {view === 'payment' && selectedBooking && selectedHostel && (
            <PaymentModalView
              selectedBooking={selectedBooking}
              selectedHostel={selectedHostel}
              receiptImage={receiptImage}
              onReceiptUpload={handleReceiptUpload}
              onConfirmPayment={handleConfirmPayment}
              onClose={() => navigateTo('dashboard')}
            />
          )}

          {(view === 'login' || view === 'signup') && (
            <AuthView
              mode={view}
              loginRole={loginRole}
              signupRole={signupRole}
              email={email}
              password={password}
              name={name}
              authLoading={authLoading}
              authError={authError}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onNameChange={setName}
              onLoginRoleChange={setLoginRole}
              onSignupRoleChange={setSignupRole}
              onLogin={handleLogin}
              onSignup={handleSignup}
              onGoogleAuth={handleGoogleAuth}
              onBack={handleBack}
              onViewChange={navigateTo}
            />
          )}

          {view === 'dashboard' && (
            !isAuthReady ? renderAuthLoading() : user ? (
              <div className="flex flex-col lg:flex-row min-h-screen bg-surface-container-lowest overflow-x-hidden">
                <LayoutSidebar
                  user={user}
                  activeView={activeDashboardView}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  onViewChange={(v) => {
                    if (['dashboard', 'bookings', 'messages', 'saved', 'settings', 'approvals', 'moderation', 'properties', 'transactions', 'complaints'].includes(v)) {
                      setActiveDashboardView(v);
                    } else {
                      navigateTo(v as AppView);
                    }
                  }}
                  onLogout={handleLogout}
                />
                {user.role === 'admin' ? (
                  <AdminDashboardView
                    user={user}
                    activeView={activeDashboardView}
                    onViewChange={(v) => {
                      if (['dashboard', 'approvals', 'moderation', 'settings', 'complaints'].includes(v)) {
                        setActiveDashboardView(v);
                      } else {
                        navigateTo(v as AppView);
                      }
                    }}
                    reviews={reviews}
                    hostels={hostels}
                    pendingLandlords={pendingLandlords}
                    onViewHostel={(h) => {
                      setSelectedHostel(h);
                      setView('detail');
                    }}
                  />
                ) : user.role === 'landlord' ? (
                  <LandlordDashboardView
                    user={user}
                    hostels={hostels}
                    bookings={bookings}
                    activeView={activeDashboardView}
                    enquiries={enquiries}
                    onViewChange={navigateTo}
                    onEdit={(h) => {
                      setEditingHostel(h);
                      setIsEditingHostel(true);
                      navigateTo('list-hostel');
                    }}
                    onDelete={handleDeleteHostel}
                    onAcceptBooking={handleAcceptBooking}
                    onDeclineBooking={handleDeclineBooking}
                    onOpenHostelDetail={(h) => {
                      setSelectedHostel(h);
                      setView('detail');
                    }}
                    onReplyEnquiry={handleReplyEnquiry}
                  />
                ) : (
                  <StudentDashboardView
                    user={user}
                    bookings={bookings}
                    enquiries={enquiries}
                    hostels={hostels}
                    savedHostels={savedHostels}
                    activeView={activeDashboardView}
                    onViewChange={navigateTo}
                    onOpenPayment={() => setShowPaymentModal(true)}
                    onOpenInvoice={() => setShowInvoiceModal(true)}
                    onSelectEnquiry={(e) => setSelectedEnquiry(e)}
                    onOpenHostelDetail={(h) => {
                      setSelectedHostel(h);
                      setView('detail');
                    }}
                    onSaveHostel={handleSaveHostel}
                    onUnsaveHostel={handleUnsaveHostel}
                  />
                )}
              </div>
            ) : null // Should be handled by navigateTo('login') in auth useEffect if not logged in
          )}

          {/* Modals */}
          <AnimatePresence>
            {showPaymentModal && activePaymentBooking && activePaymentHostel && (
              <PaymentModalView
                selectedBooking={activePaymentBooking}
                selectedHostel={activePaymentHostel}
                receiptImage={receiptImage}
                onReceiptUpload={handleReceiptUpload}
                onConfirmPayment={handleConfirmPayment}
                onClose={() => setShowPaymentModal(false)}
              />
            )}

            {showInvoiceModal && selectedBooking && activeInvoiceHostel && (
              <InvoiceModalView
                booking={selectedBooking}
                hostel={activeInvoiceHostel}
                onClose={() => setShowInvoiceModal(false)}
              />
            )}

            {selectedEnquiry && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-surface-container rounded-[3rem] p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/30 flex flex-col h-[80vh]"
                >
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-primary">{selectedEnquiry.hostelName}</h3>
                        <p className="text-xs text-on-surface-variant font-medium">Conversation with Landlord</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-surface-container rounded-full"><X className="w-6 h-6" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
                    <div className="flex flex-col items-end">
                      <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
                        <p className="text-sm">{selectedEnquiry.message}</p>
                        <p className="text-[8px] mt-2 opacity-60 font-bold uppercase tracking-widest">{selectedEnquiry.date}</p>
                      </div>
                    </div>
                    
                    {selectedEnquiry.status === 'replied' && (
                      <div className="flex flex-col items-start">
                        <div className="bg-surface-container p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-outline-variant/10">
                          <p className="text-sm text-primary">Hello! Thank you for your enquiry. Yes, we have rooms available for the upcoming semester. Would you like to schedule a viewing?</p>
                          <p className="text-[8px] mt-2 text-on-surface-variant font-bold uppercase tracking-widest">Landlord • Just now</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-outline-variant/30 shrink-0">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Type your message..."
                        className="flex-1 p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="p-4 bg-primary text-on-primary rounded-2xl hover-lift interactive-scale shadow-lg">
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          {/* OLD DASHBOARD REMOVED */}

          {/* OLD STUDENT DASHBOARD REMOVED */}
          {/* OLD LANDLORD DASHBOARD REMOVED */}

          {view === 'home' && (
            <HomeView
              heroImageIndex={heroImageIndex}
              heroImages={heroImages}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearch}
              featuredHostels={hostels}
              isLoggedIn={isLoggedIn}
              onViewChange={navigateTo}
              onOpenHostel={(hostel) => {
                setSelectedHostel(hostel);
                setView('detail');
              }}
            />
          )}

          {view === 'listings' && (
            <ListingsView
              hostels={filteredHostels}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewChange={navigateTo}
              onOpenHostel={(hostel) => openDetail(hostel)}
            />
          )}

          {view === 'list-hostel' && (
            <HostelFormView
              user={user}
              isEditingHostel={isEditingHostel}
              editingHostel={editingHostel}
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
              onListHostel={handleListHostel}
              onBack={() => navigateTo('dashboard')}
            />
          )}

          {view === 'support' && <SupportView />}

          {view === 'detail' && selectedHostel && (
            <HostelDetailView
              hostel={selectedHostel}
              user={user}
              reviews={reviews}
              savedHostels={savedHostels}
              onBack={() => navigateTo('listings')}
              onViewChange={navigateTo}
              onSaveHostel={handleSaveHostel}
              onUnsaveHostel={handleUnsaveHostel}
              onBooking={handleBooking}
              onSendEnquiry={handleSendEnquiry}
            />
          )}

          {view === 'profile' && user && (
            <ProfileFormView user={user} onUpdateProfile={handleUpdateProfile} onBack={() => navigateTo('dashboard')} />
          )}
          </AnimatePresence>
        </Suspense>
      </main>

      {view !== 'dashboard' && <LayoutFooter onViewChange={navigateTo} isLoggedIn={isLoggedIn} />}
    </div>
  );
}

const AppWrapper = () => (
  <GlobalErrorBoundary>
    <MainApp />
  </GlobalErrorBoundary>
);

export default AppWrapper;
