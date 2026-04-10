import React, { useState, useMemo, useEffect, ErrorInfo, ReactNode } from 'react';
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
import { User as SupabaseUser } from '@supabase/supabase-js';

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
  createdAt?: any;
}

type AppView = 'home' | 'listings' | 'detail' | 'list-hostel' | 'support' | 'login' | 'signup' | 'dashboard' | 'payment' | 'profile' | 'complaints' | 'bookings' | 'messages' | 'saved' | 'settings' | 'hostels' | 'enquiries' | 'analytics';

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
    landlordId: 'mock-3'
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
    landlordId: 'mock-4'
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
                  src="https://images.unsplash.com/photo-1592591502238-028381bb5017?auto=format&fit=crop&q=80&w=100" 
                  alt="MyHostel Logo" 
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

const AdminDashboard = ({ user, activeView, onViewChange, reviews, hostels, onViewHostel }: { user: UserProfile, activeView: string, onViewChange: (view: AppView) => void, reviews: Review[], hostels: Hostel[], onViewHostel: (h: Hostel) => void }) => {
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
                  {MOCK_APPROVAL_QUEUE.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-primary">{item.name}</div>
                            <div className="text-xs text-on-surface-variant">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold border border-primary/10">
                          {item.university}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          {item.documents.map((doc, i) => (
                            <div key={`doc-${item.id}-${i}`} className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant hover:text-primary cursor-pointer">
                              <FileText className="w-3 h-3" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-on-surface-variant">{item.date}</td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-tertiary text-on-tertiary rounded-lg text-[10px] font-black hover:scale-105 transition-transform">Approve</button>
                          <button className="px-3 py-1.5 bg-error/10 text-error rounded-lg text-[10px] font-black hover:bg-error/20 transition-colors">Reject</button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

const LandlordDashboard = ({ user, hostels, activeView, onViewChange, onEdit, onDelete }: { user: UserProfile, hostels: Hostel[], activeView: string, onViewChange: (view: AppView) => void, onEdit: (h: Hostel) => void, onDelete: (id: string) => void }) => {
  const myHostels = hostels.filter(h => h.landlordId === user.uid);
  
  const renderContent = () => {
    switch (activeView) {
      case 'properties':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">My Properties</h2>
              <button onClick={() => onViewChange('list-hostel')} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:scale-105 transition-transform">Add Property</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHostels.map(hostel => (
                <div key={hostel.id} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group editorial-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => onEdit(hostel)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm"><Settings className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(hostel.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-error hover:bg-error hover:text-on-error transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-primary mb-1">{hostel.name}</h3>
                    <p className="text-sm text-on-surface-variant font-medium mb-6">{hostel.location}</p>
                    <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-6">
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Rooms</div>
                        <div className="text-2xl font-black text-primary">24</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Occupancy</div>
                        <div className="text-2xl font-black text-secondary-fixed">88%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {myHostels.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white dark:bg-surface-container rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                  <Building className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">No properties listed yet.</p>
                  <button onClick={() => onViewChange('list-hostel')} className="mt-4 text-primary font-black hover:underline">List your first hostel</button>
                </div>
              )}
            </div>
          </section>
        );
      case 'bookings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30">
              <h2 className="text-2xl font-black text-primary">Booking Requests</h2>
              <p className="text-sm text-on-surface-variant font-medium">Manage incoming reservations for your properties.</p>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {[
                  { name: 'Chifundo Phiri', room: 'Single Room - Skyline', time: '2 mins ago', status: 'pending', amount: 'MK 45,000' },
                  { name: 'Grace Banda', room: 'Shared Wing - MUBAS', time: '45 mins ago', status: 'pending', amount: 'MK 32,000' },
                  { name: 'Limbani Mwale', room: 'Single Room - Skyline', time: '3 hours ago', status: 'confirmed', amount: 'MK 45,000' },
                ].map((booking, i) => (
                  <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl bg-surface-container-low border border-outline-variant/20 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {booking.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{booking.name}</h4>
                        <p className="text-xs text-on-surface-variant">{booking.room} • {booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Deposit</div>
                        <div className="text-sm font-bold text-primary">{booking.amount}</div>
                      </div>
                      {booking.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black hover:scale-105 transition-transform">Accept</button>
                          <button className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl text-[10px] font-black hover:bg-error/10 hover:text-error transition-all">Decline</button>
                        </div>
                      ) : (
                        <span className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-xl text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'messages':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30">
              <h2 className="text-2xl font-black text-primary">Student Enquiries</h2>
              <p className="text-sm text-on-surface-variant font-medium">Respond to questions from potential residents.</p>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {[
                { name: 'Tiwonge Kumwenda', subject: 'Water availability at Skyline', date: 'Today, 09:15', message: 'Hi, I wanted to ask if there is a backup water tank at the hostel? I noticed the area has frequent water cuts.' },
                { name: 'Isaac Msiska', subject: 'Room sharing policy', date: 'Yesterday', message: 'Can I share a room with a friend who is at a different university?' },
              ].map((msg, i) => (
                <div key={i} className="p-8 hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-primary group-hover:text-secondary-fixed transition-colors">{msg.name}</h4>
                    <span className="text-[10px] font-medium text-on-surface-variant">{msg.date}</span>
                  </div>
                  <h5 className="text-sm font-bold text-primary/80 mb-2">{msg.subject}</h5>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{msg.message}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reply Now</button>
                    <button className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:underline">Mark as Read</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'settings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-2xl font-black text-primary mb-8">Landlord Settings</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed font-bold">A</div>
                        <div>
                          <div className="text-sm font-bold text-primary">Airtel Money</div>
                          <div className="text-[10px] text-on-surface-variant">0888 123 456</div>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-primary hover:underline">Edit</button>
                    </div>
                    <button className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/50 text-[10px] font-black text-on-surface-variant hover:border-primary hover:text-primary transition-all">+ Add New Method</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Notification Preferences</h3>
                  <div className="space-y-3">
                    {['Email Notifications', 'SMS Alerts', 'New Booking Sounds'].map((pref, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-surface-container-low">
                        <span className="text-sm font-bold text-primary">{pref}</span>
                        <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <>
            <div className="bg-tertiary/20 border-l-8 border-tertiary p-8 rounded-3xl mb-12 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-on-tertiary shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-primary">Approved by Admin</h2>
                </div>
                <p className="text-on-surface-variant font-medium">Your profile and properties are verified for the 2024/25 academic year.</p>
              </div>
              <div className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-[10px] font-black tracking-[0.2em] relative z-10">
                CERTIFIED PARTNER
              </div>
              <CheckCircle2 className="absolute -bottom-8 -right-8 w-48 h-48 text-tertiary/10 -rotate-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-primary">My Properties</h2>
                    <button onClick={() => onViewChange('list-hostel')} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                      Add New <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myHostels.slice(0, 2).map(hostel => (
                      <div key={hostel.id} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group editorial-shadow">
                        <div className="h-48 relative overflow-hidden">
                          <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${hostel.verified ? 'bg-tertiary text-on-tertiary' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                              {hostel.verified ? 'ACTIVE' : 'MAINTENANCE'}
                            </span>
                          </div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-xl font-black text-primary mb-1">{hostel.name}</h3>
                          <p className="text-sm text-on-surface-variant font-medium mb-6">{hostel.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary text-on-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Monthly Revenue</div>
                      <div className="text-2xl font-black">MK 2,450,000</div>
                    </div>
                    <CreditCard className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="bg-white dark:bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-on-surface-variant">Pending Invoices</div>
                      <div className="text-2xl font-black text-primary">14</div>
                    </div>
                    <FileText className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="bg-white dark:bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-on-surface-variant">Average Rating</div>
                      <div className="text-2xl font-black text-primary">4.8 / 5.0</div>
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5].map(i => <Star key={`rating-star-${i}`} className="w-3 h-3 fill-secondary-fixed text-secondary-fixed" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-8">
                <section className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30">
                  <h2 className="text-xl font-black text-primary mb-8 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    New Bookings
                  </h2>
                  <div className="space-y-6">
                    {[
                      { name: 'Chifundo Phiri', room: 'Single Room - Skyline', time: '2 mins ago', status: 'pending' },
                      { name: 'Grace Banda', room: 'Shared Wing - MUBAS', time: '45 mins ago', status: 'pending' },
                    ].map((booking, i) => (
                      <div key={`new-booking-${i}`} className="bg-white dark:bg-surface-container p-6 rounded-3xl border-l-4 border-primary shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-primary">{booking.name}</h4>
                          <span className="text-[10px] font-medium text-on-surface-variant">{booking.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-4 font-medium">Booked {booking.room}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black hover:scale-105 transition-transform">Accept</button>
                          <button className="py-2 bg-surface-container text-on-surface-variant rounded-xl text-[10px] font-black hover:bg-error/10 hover:text-error transition-all">Decline</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => onViewChange('dashboard')} className="w-full py-4 rounded-2xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant font-bold text-sm hover:border-primary hover:text-primary transition-all">
                      View All Activity
                    </button>
                  </div>
                </section>
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
              {activeView === 'dashboard' ? 'Landlord Hub' : 
               activeView === 'properties' ? 'My Properties' :
               activeView === 'bookings' ? 'Booking Requests' :
               activeView === 'messages' ? 'Student Enquiries' : 'Settings'}
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              {activeView === 'dashboard' ? 'Manage your properties and student reservations.' : 
               activeView === 'properties' ? 'View and manage your listed accommodation.' :
               activeView === 'bookings' ? 'Review and respond to booking requests.' :
               activeView === 'messages' ? 'Communication with potential residents.' : 'Manage your account preferences.'}
            </p>
          </div>
        </div>
        {activeView === 'dashboard' && (
          <button 
            onClick={() => onViewChange('list-hostel')}
            className="flex items-center px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-black text-sm md:text-lg hover-lift shadow-xl shadow-secondary-fixed/20"
          >
            <Building className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Add New Hostel
          </button>
        )}
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
  activeView, 
  onViewChange,
  onOpenPayment,
  onOpenInvoice,
  onSelectEnquiry,
  onOpenHostelDetail
}: { 
  user: UserProfile, 
  bookings: Booking[], 
  enquiries: Enquiry[], 
  hostels: Hostel[], 
  activeView: string, 
  onViewChange: (view: AppView) => void,
  onOpenPayment: () => void,
  onOpenInvoice: () => void,
  onSelectEnquiry: (e: Enquiry) => void,
  onOpenHostelDetail: (h: Hostel) => void
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
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{hostels.filter(h => h.verified).length} Items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.slice(0, 3).map((hostel, i) => (
                <div key={`saved-hostel-${hostel.id || i}`} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group editorial-shadow">
                  <div className="h-40 relative overflow-hidden">
                    <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-error shadow-sm"><Heart className="w-4 h-4 fill-error" /></button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-primary mb-1">{hostel.name}</h3>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">{hostel.location} • MK {hostel.price?.toLocaleString() || '0'}/mo</p>
                    <button onClick={() => onOpenHostelDetail(hostel)} className="w-full py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-black hover:bg-primary hover:text-on-primary transition-all">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'settings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-2xl font-black text-primary mb-8">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          {canGoBack && (
            <button 
              onClick={onBack}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors interactive-scale"
              title="Go Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center cursor-pointer interactive-scale" onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1592591502238-028381bb5017?auto=format&fit=crop&q=80&w=100" 
                alt="MyHostel Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter text-primary">MyHostel</span>
              <span className="text-[10px] font-bold text-primary/60 ml-0.5">.com</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center cursor-pointer" onClick={() => onViewChange('home')}>
            <div className="w-10 h-10 bg-secondary-fixed rounded-lg flex items-center justify-center mr-3 shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1592591502238-028381bb5017?auto=format&fit=crop&q=80&w=100" 
                alt="MyHostel Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold tracking-tighter text-on-primary">MyHostel</span>
              <span className="text-[10px] font-bold text-on-primary/60 ml-0.5">.com</span>
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

// --- Error Boundary ---
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
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

  public render() {
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
    return this.props.children;
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

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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

  // Real-time Bookings
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      const column = user.role === 'student' ? 'student_id' : 'landlord_id';
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq(column, user.uid);
      
      if (error) handleSupabaseError(error, OperationType.LIST, 'bookings');
      else if (data) setBookings(data.map(mapBooking));
    };

    fetchBookings();

    const channel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings',
        filter: `${user.role === 'student' ? 'student_id' : 'landlord_id'}=eq.${user.uid}`
      }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user]);

  // Real-time Enquiries
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setEnquiries([]);
      return;
    }

    const fetchEnquiries = async () => {
      const column = user.role === 'student' ? 'student_id' : 'landlord_id';
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq(column, user.uid);
      
      if (error) handleSupabaseError(error, OperationType.LIST, 'enquiries');
      else if (data) setEnquiries(data.map(mapEnquiry));
    };

    fetchEnquiries();

    const channel = supabase
      .channel('public:enquiries')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'enquiries',
        filter: `${user.role === 'student' ? 'student_id' : 'landlord_id'}=eq.${user.uid}`
      }, () => {
        fetchEnquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user]);

  // Real-time Reviews
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      let query = supabase.from('reviews').select('*');
      
      if (user.role === 'student') {
        query = query.eq('student_id', user.uid);
      }
      
      const { data, error } = await query;
      if (error) handleSupabaseError(error, OperationType.LIST, 'reviews');
      else if (data) setReviews(data.map(mapReview));
    };

    fetchReviews();

    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user]);

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
      
      const newAmountPaid = (booking.amountFull || 0) + amount;
      let newPaymentStatus: Booking['paymentStatus'] = 'partially_paid';
      
      if (newAmountPaid >= booking.total_amount) {
        newPaymentStatus = 'fully_paid';
      } else if (newAmountPaid > 0) {
        newPaymentStatus = 'partially_paid';
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          amount_paid: newAmountPaid,
          payment_status: newPaymentStatus,
          status: newAmountPaid >= (booking.total_amount / 2) ? 'confirmed' : 'pending',
          receipt_image: receiptUrl || booking.receipt_image
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;
      
      setReceiptImage(null);
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
      
      setSelectedBooking(data as unknown as Booking);
      setSelectedHostel(hostel);
      navigateTo('payment');
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
    
    try {
      const hostelData = {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        university: formData.get('university') as string,
        price: Number(formData.get('price')),
        image: uploadedImage || (isEditingHostel ? editingHostel?.image : 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=1000'),
        amenities: selectedAmenities.length > 0 ? selectedAmenities : ['General Amenities'],
        description: formData.get('description') as string,
        payment_details: {
          airtelMoney: formData.get('airtelMoney') as string,
          tnmMpamba: formData.get('tnmMpamba') as string,
          bankName: formData.get('bankName') as string,
          bankAccount: formData.get('bankAccount') as string,
        }
      };

      if (isEditingHostel && editingHostel) {
        const { error } = await supabase
          .from('hostels')
          .update(hostelData)
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
      alert("Profile updated successfully!");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `profiles/${user.uid}`);
    }
  };

  if (!isAuthReady) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-surface text-on-surface' : 'bg-surface text-on-surface'}`}>
      {view !== 'dashboard' && (
        <Navbar 
          onViewChange={navigateTo} 
          isMenuOpen={isMobileMenuOpen} 
          setIsMenuOpen={setIsMobileMenuOpen} 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBack}
          canGoBack={viewHistory.length > 0}
        />
      )}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'payment' && selectedBooking && selectedHostel && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto px-4 py-20 w-full"
            >
              <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-10 border border-outline-variant/30">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-primary mb-6">Secure Your Place</h2>
                    <p className="text-on-surface-variant mb-8">
                      To secure your room at <span className="font-bold text-primary">{selectedBooking.hostelName}</span>, you need to pay at least half of the monthly rent plus the booking fee.
                    </p>

                    <div className="space-y-4 mb-8 bg-surface-container p-6 rounded-2xl">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Monthly Rent</span>
                        <span className="font-bold">MK{selectedBooking.totalAmount?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Booking Fee</span>
                        <span className="font-bold">MK{selectedBooking.bookingFee?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Down Payment (50%)</span>
                        <span className="font-bold">MK{(selectedBooking.totalAmount * 0.5)?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="border-t border-outline-variant/30 pt-4">
                        <div className="flex justify-between text-lg font-black text-primary">
                          <span>Total Initial Deposit</span>
                          <span>MK{(selectedBooking.totalAmount * 0.5 + selectedBooking.bookingFee).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-on-surface-variant mt-1">
                          <span>Total Amount to be Paid</span>
                          <span>MK{(selectedBooking.totalAmount + selectedBooking.bookingFee).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-primary">Landlord Payment Details</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedHostel.paymentDetails?.airtelMoney && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                              <div>
                                <div className="text-xs font-bold text-red-600 uppercase">Airtel Money</div>
                                <div className="font-mono font-bold">{selectedHostel.paymentDetails.airtelMoney}</div>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-red-600 hover:underline">Copy</button>
                          </div>
                        )}
                        {selectedHostel.paymentDetails?.tnmMpamba && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                              <div>
                                <div className="text-xs font-bold text-green-600 uppercase">TNM Mpamba</div>
                                <div className="font-mono font-bold">{selectedHostel.paymentDetails.tnmMpamba}</div>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-green-600 hover:underline">Copy</button>
                          </div>
                        )}
                        {selectedHostel.paymentDetails?.bankName && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                              <div>
                                <div className="text-xs font-bold text-blue-600 uppercase">{selectedHostel.paymentDetails.bankName}</div>
                                <div className="font-mono font-bold">{selectedHostel.paymentDetails.bankAccount}</div>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-blue-600 hover:underline">Copy</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-80 space-y-6">
                    <div className="p-6 bg-surface-container rounded-3xl border border-outline-variant/30">
                      <h4 className="font-bold text-primary mb-4">Confirm Payment</h4>
                      <p className="text-xs text-on-surface-variant mb-6">
                        Once you have made the transfer using any of the methods provided, enter the amount paid below to update your booking status.
                      </p>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const amount = Number(new FormData(e.currentTarget).get('amount'));
                        if (!receiptImage) {
                          alert("Please upload a receipt as proof of payment.");
                          return;
                        }
                        handleConfirmPayment(selectedBooking.id, amount, receiptImage);
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount Paid (MK)</label>
                          <input name="amount" type="number" required className="w-full p-3 rounded-xl bg-white dark:bg-surface-container-high border border-outline-variant/30 focus:ring-2 focus:ring-primary" placeholder="e.g. 25000" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Upload Receipt (Proof of Payment)</label>
                          <div className="relative border-2 border-dashed border-outline-variant rounded-xl p-4 hover:border-primary transition-colors cursor-pointer text-center">
                            <input 
                              type="file" 
                              accept="image/*" 
                              required
                              onChange={handleReceiptUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {receiptImage ? (
                              <div className="flex items-center justify-center gap-2 text-primary">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold">Receipt Uploaded</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-5 h-5 text-on-surface-variant" />
                                <span className="text-[10px] font-bold text-on-surface-variant">Click to upload receipt</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift shadow-lg">
                          Confirm Payment
                        </button>
                      </form>
                    </div>
                    <button 
                      onClick={() => navigateTo('dashboard')}
                      className="w-full py-4 rounded-xl bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors"
                    >
                      Pay Later
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto px-4 py-20 w-full"
            >
              <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-10 border border-outline-variant/30">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1592591502238-028381bb5017?auto=format&fit=crop&q=80&w=200" 
                      alt="MyHostel Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-primary">Welcome Back</h2>
                  <p className="text-on-surface-variant mt-2">Sign in to your account</p>
                </div>

                <div className="flex bg-surface-container p-1 rounded-2xl mb-8">
                  <button 
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginRole === 'student' ? 'bg-white dark:bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant'}`}
                    onClick={() => setLoginRole('student')}
                  >
                    Student
                  </button>
                  <button 
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginRole === 'landlord' ? 'bg-white dark:bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant'}`}
                    onClick={() => setLoginRole('landlord')}
                  >
                    Landlord
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {authError && (
                    <div className="p-4 bg-error/10 text-error text-sm rounded-xl border border-error/20 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {authError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary" 
                      placeholder="email@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full py-5 rounded-2xl bg-primary text-on-primary font-black text-lg hover-lift interactive-scale shadow-xl disabled:opacity-50 flex items-center justify-center"
                  >
                    {authLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-surface-container px-2 text-on-surface-variant font-bold">Or continue with</span></div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleGoogleAuth(loginRole)}
                    disabled={authLoading}
                    className="w-full py-4 rounded-2xl bg-surface-container text-on-surface font-bold hover-lift interactive-scale border border-outline-variant/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="" />
                    Google
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
                  <p className="text-on-surface-variant text-sm">
                    Don't have an account? <span onClick={() => setView('signup')} className="text-primary font-bold cursor-pointer hover:underline">Create one</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto px-4 py-20 w-full"
            >
              <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-10 border border-outline-variant/30">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-secondary-fixed rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1592591502238-028381bb5017?auto=format&fit=crop&q=80&w=200" 
                      alt="MyHostel Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-primary">Create Account</h2>
                  <p className="text-on-surface-variant mt-2">Join the myHostel community</p>
                </div>

                <div className="flex bg-surface-container p-1 rounded-2xl mb-8">
                  <button 
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${signupRole === 'student' ? 'bg-white dark:bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant'}`}
                    onClick={() => setSignupRole('student')}
                  >
                    Student
                  </button>
                  <button 
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${signupRole === 'landlord' ? 'bg-white dark:bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant'}`}
                    onClick={() => setSignupRole('landlord')}
                  >
                    Landlord
                  </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  {authError && (
                    <div className="p-4 bg-error/10 text-error text-sm rounded-xl border border-error/20 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {authError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary" 
                      placeholder="email@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full py-5 rounded-2xl bg-primary text-on-primary font-black text-lg hover-lift interactive-scale shadow-xl disabled:opacity-50 flex items-center justify-center"
                  >
                    {authLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-surface-container px-2 text-on-surface-variant font-bold">Or continue with</span></div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleGoogleAuth(signupRole)}
                    disabled={authLoading}
                    className="w-full py-4 rounded-2xl bg-surface-container text-on-surface font-bold hover-lift interactive-scale border border-outline-variant/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="" />
                    Google
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
                  <p className="text-on-surface-variant text-sm">
                    Already have an account? <span onClick={() => setView('login')} className="text-primary font-bold cursor-pointer hover:underline">Sign in</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && user && (
            <div className="flex flex-col lg:flex-row min-h-screen bg-surface-container-lowest overflow-x-hidden">
              <Sidebar 
                user={user} 
                activeView={activeDashboardView} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onViewChange={(v) => {
                  if (['dashboard', 'bookings', 'messages', 'saved', 'settings', 'approvals', 'moderation', 'properties'].includes(v)) {
                    setActiveDashboardView(v);
                  } else {
                    navigateTo(v as AppView);
                  }
                }} 
                onLogout={handleLogout} 
              />
              {user.role === 'admin' ? (
                <AdminDashboard 
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
                  onViewHostel={(h) => {
                    setSelectedHostel(h);
                    setView('detail');
                  }}
                />
              ) : user.role === 'landlord' ? (
                <LandlordDashboard 
                  user={user} 
                  hostels={hostels} 
                  activeView={activeDashboardView}
                  onViewChange={navigateTo}
                  onEdit={(h) => {
                    setEditingHostel(h);
                    setIsEditingHostel(true);
                    navigateTo('list-hostel');
                  }}
                  onDelete={handleDeleteHostel}
                />
              ) : (
                <StudentDashboard 
                  user={user} 
                  bookings={bookings} 
                  enquiries={enquiries} 
                  hostels={hostels} 
                  activeView={activeDashboardView}
                  onViewChange={navigateTo} 
                  onOpenPayment={() => setShowPaymentModal(true)}
                  onOpenInvoice={() => setShowInvoiceModal(true)}
                  onSelectEnquiry={(e) => setSelectedEnquiry(e)}
                  onOpenHostelDetail={(h) => {
                    setSelectedHostel(h);
                    setView('detail');
                  }}
                />
              )}
            </div>
          )}

          {/* Modals */}
          <AnimatePresence>
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-surface-container rounded-[3rem] p-8 max-w-md w-full shadow-2xl border border-outline-variant/30"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-primary">Secure Payment</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-surface-container rounded-full"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Amount to Pay</p>
                      <p className="text-3xl font-black text-primary">MK 45,000</p>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full py-4 bg-surface-container text-primary rounded-2xl font-bold flex items-center justify-between px-6 hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center text-error font-black">A</div>
                          Airtel Money
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="w-full py-4 bg-surface-container text-primary rounded-2xl font-bold flex items-center justify-between px-6 hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black">M</div>
                          TNM Mpamba
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="w-full py-4 bg-surface-container text-primary rounded-2xl font-bold flex items-center justify-between px-6 hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-tertiary" />
                          Bank Transfer
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-center text-on-surface-variant font-medium">
                      Payments are processed securely. Your booking will be confirmed within 24 hours of payment verification.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {showInvoiceModal && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-surface-container rounded-[3rem] p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/30 overflow-y-auto max-h-[90vh]"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <FileText className="text-white w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black text-primary">Invoice #INV-2024-088</h3>
                    </div>
                    <button onClick={() => setShowInvoiceModal(false)} className="p-2 hover:bg-surface-container rounded-full"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Billed To</p>
                        <p className="font-bold text-primary">{user.name}</p>
                        <p className="text-sm text-on-surface-variant">{user.email}</p>
                        <p className="text-sm text-on-surface-variant">{user.university || 'UNIMA'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Issued By</p>
                        <p className="font-bold text-primary">myHostel Malawi</p>
                        <p className="text-sm text-on-surface-variant">Lilongwe, Area 47</p>
                        <p className="text-sm text-on-surface-variant">support@myhostel.mw</p>
                      </div>
                    </div>

                    <div className="border border-outline-variant/20 rounded-3xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-surface-container">
                          <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Description</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          <tr>
                            <td className="p-4 text-sm font-medium text-primary">Booking Deposit - Sunnyside Elite</td>
                            <td className="p-4 text-sm font-bold text-primary text-right">MK 45,000</td>
                          </tr>
                          <tr>
                            <td className="p-4 text-sm font-medium text-primary">Service Fee</td>
                            <td className="p-4 text-sm font-bold text-primary text-right">MK 5,000</td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-surface-container-low">
                          <tr>
                            <td className="p-4 text-sm font-black text-primary">Total Amount</td>
                            <td className="p-4 text-lg font-black text-secondary-fixed text-right">MK 50,000</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black hover-lift flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" /> Pay Now
                      </button>
                      <button className="flex-1 py-4 bg-surface-container text-primary rounded-2xl font-black hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" /> Download PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
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
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              {/* Hero Section */}
              <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover brightness-[0.4]"
                    alt="Students studying"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <span className="inline-block bg-secondary-fixed text-on-secondary-fixed px-4 py-1 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
                      Premium Student Living
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                      Find Your Perfect <span className="text-secondary-fixed">Study Haven</span> in Malawi.
                    </h1>
                    <p className="text-lg md:text-xl text-surface-container-highest/90 mb-10 leading-relaxed font-medium">
                      Safe, verified, and curated hostels near all major universities. Your academic success starts with a comfortable home.
                    </p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl">
                      <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                        <input 
                          type="text" 
                          placeholder="Search by university or location..."
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-fixed shadow-xl"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-secondary-fixed text-on-secondary-fixed px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl whitespace-nowrap"
                      >
                        Search Now
                      </button>
                    </form>
                  </motion.div>
                </div>

                {/* Floating Stats */}
                <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-4">
                  <div className="glass-effect p-6 rounded-3xl editorial-shadow border border-white/20">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Verified Hostels</div>
                  </div>
                  <div className="glass-effect p-6 rounded-3xl editorial-shadow border border-white/20">
                    <div className="text-3xl font-bold text-primary">12k+</div>
                    <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Happy Students</div>
                  </div>
                </div>
              </section>

              {/* Featured Hostels Section */}
              <section className="py-24 bg-white dark:bg-surface-container-lowest">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-black text-primary mb-4">Featured Hostels</h2>
                      <p className="text-on-surface-variant max-w-xl font-medium">Hand-picked premium accommodations verified for safety and comfort.</p>
                    </div>
                    <button 
                      onClick={() => navigateTo('listings')}
                      className="group flex items-center gap-2 text-primary font-black hover:gap-3 transition-all"
                    >
                      View All Listings <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_HOSTELS.slice(0, 3).map((hostel) => (
                      <div 
                        key={`featured-${hostel.id}`}
                        className="bg-surface-container-low rounded-[2.5rem] overflow-hidden border border-outline-variant/20 group cursor-pointer hover-lift transition-all"
                        onClick={() => {
                          setSelectedHostel(hostel);
                          navigateTo('detail');
                        }}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={hostel.image} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt={hostel.name}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="glass-effect text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                              {hostel.university}
                            </span>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-surface-container/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                            <span className="text-primary font-black text-lg">MK{hostel.price.toLocaleString()}</span>
                            <span className="text-on-surface-variant text-[10px] font-bold uppercase ml-1">/mo</span>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black text-primary">{hostel.name}</h3>
                            <div className="flex items-center bg-secondary-fixed/20 px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                              <span className="text-xs font-black text-secondary">{hostel.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-on-surface-variant text-xs font-bold mb-6">
                            <MapPin className="w-3 h-3 mr-1" />
                            {hostel.location}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hostel.amenities.slice(0, 2).map((amenity, i) => (
                              <span key={i} className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-24 bg-surface-container-lowest">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Why Choose myHostel?</h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto">We take the stress out of finding accommodation so you can focus on your studies.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every hostel on our platform is physically inspected and verified by our team.' },
                      { icon: Clock, title: 'Real-time Availability', desc: 'No more calling around. See instantly which rooms are available for the semester.' },
                      { icon: Zap, title: 'Secure Payments', desc: 'Pay your deposit and rent securely through our integrated payment gateway.' }
                    ].map((feature, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-surface-container hover:bg-white dark:hover:bg-surface-container-high hover:editorial-shadow transition-all group">
                        <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feature.icon className="text-on-primary-container w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                        <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Landlord CTA - Redesigned */}
              <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-primary rounded-[3rem] overflow-hidden relative editorial-shadow group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4 pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                      <div className="p-12 md:p-20 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 w-fit">
                          <Building className="w-3 h-3" />
                          Partner with us
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
                          Maximize Your <span className="text-secondary-fixed italic">Hostel's Potential.</span>
                        </h2>
                        <p className="text-on-primary/70 text-lg md:text-xl font-medium mb-12 max-w-lg">
                          Join Malawi's premier student housing network. Get verified, reach thousands of students, and manage bookings with ease.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                          <button 
                            onClick={() => isLoggedIn ? navigateTo('list-hostel') : navigateTo('login')}
                            className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-2xl font-black text-lg hover-lift shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
                          >
                            List Your Property <ArrowUpRight className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => navigateTo('support')}
                            className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative hidden lg:block overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000"
                          alt="Modern office/hostel"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                        
                        {/* Floating Stats Card */}
                        <div className="absolute bottom-12 right-12 glass-effect p-8 rounded-[2rem] border border-white/20 shadow-2xl animate-float">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-secondary-fixed rounded-2xl flex items-center justify-center text-on-secondary-fixed">
                              <Zap className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-2xl font-black text-white">40%</div>
                              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Faster Bookings</div>
                            </div>
                          </div>
                          <div className="text-xs text-white/80 font-medium leading-relaxed">
                            Landlords on our platform see a significant increase in early reservations.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Available Hostels</h2>
                  <p className="text-on-surface-variant">Showing {filteredHostels.length} results for your search</p>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Filter results..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredHostels.map((hostel) => (
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    layoutId={`hostel-${hostel.id}`}
                    key={hostel.id}
                    className="bg-white dark:bg-surface-container rounded-[2rem] overflow-hidden editorial-shadow border border-outline-variant/20 group cursor-pointer hover-lift"
                    onClick={() => openDetail(hostel)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={hostel.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={hostel.name}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {hostel.verified && (
                          <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                        <span className="glass-effect text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {hostel.university}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-surface-container/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                        <span className="text-primary font-extrabold text-lg">MK{hostel.price.toLocaleString()}</span>
                        <span className="text-on-surface-variant text-xs font-medium">/mo</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-primary">{hostel.name}</h3>
                        <div className="flex items-center bg-secondary-fixed/20 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
                          <span className="text-sm font-bold text-secondary">{hostel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-on-surface-variant text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hostel.location}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {hostel.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={`amenity-${hostel.id}-${i}`} className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors flex items-center justify-center group">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {view === 'list-hostel' && (
            <motion.div
              key="list-hostel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
              {user?.role !== 'landlord' ? (
                <div className="text-center py-20 bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow border border-outline-variant/30">
                  <ShieldAlert className="w-20 h-20 text-error mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-primary mb-4">Access Denied</h2>
                  <p className="text-on-surface-variant mb-8 max-w-md mx-auto">Only registered landlords can list properties on myHostel. If you are a landlord, please sign in with a landlord account.</p>
                  <button 
                    onClick={() => navigateTo('home')}
                    className="px-8 py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift"
                  >
                    Return Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-primary mb-4">{isEditingHostel ? 'Edit Your Property' : 'List Your Property'}</h2>
                    <p className="text-on-surface-variant text-lg">{isEditingHostel ? 'Update your hostel details to keep students informed.' : 'Join Malawi\'s largest student housing network and reach thousands of students.'}</p>
                  </div>

                  <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-8 md:p-12 border border-outline-variant/30">
                    <form onSubmit={handleListHostel} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hostel Name</label>
                          <input name="name" type="text" required defaultValue={editingHostel?.name} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. Sunrise Villa" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Location</label>
                          <input name="location" type="text" required defaultValue={editingHostel?.location} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. Area 47, Lilongwe" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hostel Image (Inside or Outside)</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-3xl p-8 hover:border-primary transition-colors cursor-pointer relative group">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          {(uploadedImage || editingHostel?.image) ? (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                              <img src={uploadedImage || editingHostel?.image} className="w-full h-full object-cover" alt="Preview" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white w-10 h-10" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Camera className="text-primary w-8 h-8" />
                              </div>
                              <p className="text-on-surface-variant font-bold">Click or drag to upload image</p>
                              <p className="text-on-surface-variant/60 text-sm">PNG, JPG up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Description</label>
                        <textarea name="description" required defaultValue={editingHostel?.description} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary h-32" placeholder="Tell students about your hostel..."></textarea>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Amenities</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {AMENITY_OPTIONS.map(option => (
                            <label key={option} className="flex items-center space-x-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                name="amenities" 
                                value={option}
                                defaultChecked={editingHostel?.amenities.includes(option)}
                                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-on-surface">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Monthly Price (MK)</label>
                          <input name="price" type="number" required defaultValue={editingHostel?.price} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="45000" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Rooms</label>
                          <input name="rooms" type="number" required className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">University Proximity</label>
                          <select name="university" defaultValue={editingHostel?.university} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary">
                            {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-primary">Payment Details (For Bookings)</h3>
                        <p className="text-sm text-on-surface-variant">Provide the details where students should send their booking payments.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Airtel Money Number</label>
                            <input name="airtelMoney" type="text" defaultValue={editingHostel?.paymentDetails?.airtelMoney} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="099..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">TNM Mpamba Number</label>
                            <input name="tnmMpamba" type="text" defaultValue={editingHostel?.paymentDetails?.tnmMpamba} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="088..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bank Name</label>
                            <input name="bankName" type="text" defaultValue={editingHostel?.paymentDetails?.bankName} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. National Bank" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bank Account Number</label>
                            <input name="bankAccount" type="text" defaultValue={editingHostel?.paymentDetails?.bankAccount} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="Account number" />
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-5 rounded-2xl bg-primary text-on-primary font-black text-lg hover-lift interactive-scale shadow-xl">
                        {isEditingHostel ? 'Update Hostel' : 'Submit for Verification'}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {view === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-5xl font-black text-primary mb-8 leading-tight">We're here to <span className="text-secondary-fixed">help</span> you settle in.</h2>
                  <p className="text-on-surface-variant text-xl mb-12 leading-relaxed">Whether you're a student looking for a room or a landlord with questions, our team is ready to assist.</p>
                  
                  <div className="space-y-6">
                    {[
                      { q: "How do I book a room?", a: "Simply find a hostel you like, click 'Reserve Now', and our team will contact you to finalize the details." },
                      { q: "Is my payment secure?", a: "Yes, we use industry-standard encryption and verified payment gateways for all transactions." },
                      { q: "What does 'Verified' mean?", a: "It means our team has physically visited the property to ensure it meets our safety and quality standards." }
                    ].map((faq, i) => (
                      <div key={i} className="p-6 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer group">
                        <h4 className="font-bold text-primary mb-2 flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-tertiary" />
                          {faq.q}
                        </h4>
                        <p className="text-on-surface-variant text-sm group-hover:text-on-surface transition-colors">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary-container/10 p-12 rounded-[3rem] border border-primary/10">
                  <h3 className="text-2xl font-bold text-primary mb-8">Send us a message</h3>
                  <form className="space-y-6">
                    <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary" />
                    <input type="email" placeholder="Your Email" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary" />
                    <textarea placeholder="How can we help?" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary h-40"></textarea>
                    <button className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift interactive-scale">Send Message</button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'detail' && selectedHostel && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <button 
                onClick={() => setView('listings')}
                className="flex items-center text-primary font-bold mb-8 hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Listings
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <motion.div 
                    layoutId={`hostel-${selectedHostel.id}`}
                    className="rounded-[3rem] overflow-hidden h-[500px] shadow-2xl"
                  >
                    <img 
                      src={selectedHostel.image} 
                      className="w-full h-full object-cover"
                      alt={selectedHostel.name}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>

                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-black text-primary mb-2">{selectedHostel.name}</h1>
                        <div className="flex items-center text-on-surface-variant text-lg">
                          <MapPin className="w-5 h-5 mr-2" />
                          {selectedHostel.location} • {selectedHostel.university}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Starting from</div>
                          <div className="text-3xl font-black text-primary">MK{selectedHostel.price.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-surface-container p-4 rounded-2xl text-center">
                        <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
                        <div className="text-sm font-bold text-primary">{selectedHostel.rating} Rating</div>
                      </div>
                      <div className="bg-surface-container p-4 rounded-2xl text-center">
                        <ShieldCheck className="w-6 h-6 text-tertiary mx-auto mb-2" />
                        <div className="text-sm font-bold text-primary">Verified</div>
                      </div>
                      <div className="bg-surface-container p-4 rounded-2xl text-center">
                        <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-sm font-bold text-primary">24/7 Access</div>
                      </div>
                      <div className="bg-surface-container p-4 rounded-2xl text-center">
                        <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
                        <div className="text-sm font-bold text-primary">Backup Power</div>
                      </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <h3 className="text-2xl font-bold text-primary mb-4">About this Hostel</h3>
                      <p className="text-on-surface-variant leading-relaxed">
                        {selectedHostel.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-6">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedHostel.amenities.map((amenity, i) => (
                          <div key={`detail-amenity-${i}`} className="flex items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <CheckCircle2 className="w-5 h-5 text-tertiary mr-3" />
                            <span className="font-semibold text-on-surface-variant">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ReviewSection hostel={selectedHostel} user={user} reviews={reviews} />
                  </div>
                </div>

                {(!user || user?.role !== 'landlord') && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 glass-effect p-8 rounded-[2.5rem] editorial-shadow border border-outline-variant/30 space-y-8">
                      <h3 className="text-2xl font-bold text-primary">Book Your Room</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Room Type</label>
                          <select className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary font-medium">
                            <option>Single Room (MK{selectedHostel.price.toLocaleString()})</option>
                            <option>Double Sharing (MK{(selectedHostel.price * 0.7).toLocaleString()})</option>
                            <option>Four Sharing (MK{(selectedHostel.price * 0.5).toLocaleString()})</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Check-in Semester</label>
                          <select className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary font-medium">
                            <option>Semester 1, 2026</option>
                            <option>Semester 2, 2026</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Monthly Rent</span>
                          <span className="font-bold text-primary">MK{selectedHostel.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Booking Fee</span>
                          <span className="font-bold text-primary">MK{(selectedHostel.bookingFee || AUTOMATIC_BOOKING_FEE).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">Down Payment (50%)</span>
                          <span className="font-bold text-primary">MK{(selectedHostel.price * 0.5).toLocaleString()}</span>
                        </div>
                        <div className="pt-3 border-t border-outline-variant/30">
                          <div className="flex justify-between text-lg font-black text-secondary-fixed">
                            <span>Total Initial Deposit</span>
                            <span>MK{(selectedHostel.price * 0.5 + (selectedHostel.bookingFee || AUTOMATIC_BOOKING_FEE)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-on-surface-variant mt-1">
                            <span>Total Amount to be Paid</span>
                            <span>MK{(selectedHostel.price + (selectedHostel.bookingFee || AUTOMATIC_BOOKING_FEE)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleBooking(selectedHostel)}
                        className="w-full py-5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary-fixed/20"
                      >
                        Reserve Now
                      </button>
                      
                      <p className="text-center text-xs text-on-surface-variant font-medium">
                        No payment required today. We'll contact you to verify your student status.
                      </p>

                      <div className="pt-8 border-t border-outline-variant/30">
                        <h4 className="font-bold text-primary mb-4 flex items-center">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Have Questions?
                        </h4>
                        <form onSubmit={handleSendEnquiry} className="space-y-3">
                          <textarea 
                            name="message" 
                            required 
                            className="w-full p-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm h-24" 
                            placeholder="Ask the landlord about availability, rules, etc."
                          ></textarea>
                          <button 
                            type="submit"
                            className="w-full py-3 rounded-xl bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors text-sm"
                          >
                            Send Enquiry
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="flex justify-between items-center mb-12">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className="flex items-center text-primary font-bold hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>

              <div className="text-center mb-12">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white shadow-xl">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-primary" />
                    )}
                  </div>
                  <button className="absolute bottom-4 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-3xl font-black text-primary">{user.name}</h2>
                <p className="text-on-surface-variant font-medium uppercase tracking-widest text-sm mt-1">{user.role}</p>
              </div>

              <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-8 md:p-12 border border-outline-variant/30">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                      <input name="name" type="text" required defaultValue={user.name} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                      <input type="email" disabled defaultValue={user.email} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none opacity-60 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                      <input name="phone" type="tel" defaultValue={user.phone} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="+265..." />
                    </div>
                    {user.role === 'student' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">University</label>
                        <select name="university" defaultValue={user.university} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary">
                          <option value="">Select University</option>
                          {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Business Address</label>
                        <input name="address" type="text" defaultValue={user.address} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="Office location" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bio / Description</label>
                    <textarea name="bio" defaultValue={user.bio} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary h-32" placeholder="Tell us a bit about yourself..."></textarea>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full py-5 rounded-2xl bg-primary text-on-primary font-black text-lg hover-lift interactive-scale shadow-xl">
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view !== 'dashboard' && <Footer onViewChange={navigateTo} isLoggedIn={isLoggedIn} />}
    </div>
  );
}

const AppWrapper = () => (
  <GlobalErrorBoundary>
    <MainApp />
  </GlobalErrorBoundary>
);

export default AppWrapper;
