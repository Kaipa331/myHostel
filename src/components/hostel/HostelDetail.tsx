import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  MessageSquare 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Hostel, 
  UserProfile, 
  Review, 
  AppView 
} from '../../types';
import { ReviewSection } from './ReviewSection';

interface HostelDetailProps {
  hostel: Hostel;
  user: UserProfile | null;
  reviews: Review[];
  savedHostels: Hostel[];
  onBack: () => void;
  onViewChange: (view: AppView) => void;
  onSaveHostel: (id: string) => void;
  onUnsaveHostel: (id: string) => void;
  onBooking: (hostel: Hostel) => void;
  onSendEnquiry: (e: React.FormEvent) => void;
}

const AUTOMATIC_BOOKING_FEE = 5000;

export const HostelDetail = ({ 
  hostel, 
  user, 
  reviews, 
  savedHostels, 
  onBack, 
  onViewChange,
  onSaveHostel, 
  onUnsaveHostel, 
  onBooking, 
  onSendEnquiry 
}: HostelDetailProps) => {
  const isSaved = savedHostels.some(h => h.id === hostel.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-primary font-bold hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Listings
        </button>
        
        {user && user.role === 'student' && (
          <button 
            onClick={() => isSaved ? onUnsaveHostel(hostel.id) : onSaveHostel(hostel.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              isSaved
                ? 'bg-error/10 text-error hover:bg-error hover:text-on-error'
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-error' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            layoutId={`hostel-${hostel.id}`}
            className="rounded-[3rem] overflow-hidden h-[500px] shadow-2xl relative"
          >
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all z-20 shadow-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img 
              src={hostel.image} 
              className="w-full h-full object-cover"
              alt={hostel.name}
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-primary mb-2">{hostel.name}</h1>
                <div className="flex items-center text-on-surface-variant text-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  {hostel.location} • {hostel.university}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Starting from</div>
                  <div className="text-3xl font-black text-primary">MK{hostel.price.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-container p-4 rounded-2xl text-center">
                <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-sm font-bold text-primary">{hostel.rating} Rating</div>
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
                {hostel.description}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hostel.amenities.map((amenity, i) => (
                  <div key={`detail-amenity-${i}`} className="flex items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <CheckCircle2 className="w-5 h-5 text-tertiary mr-3" />
                    <span className="font-semibold text-on-surface-variant">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <ReviewSection hostel={hostel} user={user} reviews={reviews} />
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
                    <option>Single Room (MK{hostel.price.toLocaleString()})</option>
                    <option>Double Sharing (MK{(hostel.price * 0.7).toLocaleString()})</option>
                    <option>Four Sharing (MK{(hostel.price * 0.5).toLocaleString()})</option>
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
                  <span className="font-bold text-primary">MK{hostel.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Booking Fee</span>
                  <span className="font-bold text-primary">MK{(hostel.bookingFee || AUTOMATIC_BOOKING_FEE).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Down Payment (50%)</span>
                  <span className="font-bold text-primary">MK{(hostel.price * 0.5).toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <div className="flex justify-between text-lg font-black text-secondary-fixed">
                    <span>Total Initial Deposit</span>
                    <span>MK{(hostel.price * 0.5 + (hostel.bookingFee || AUTOMATIC_BOOKING_FEE)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-on-surface-variant mt-1">
                    <span>Total Amount to be Paid</span>
                    <span>MK{(hostel.price + (hostel.bookingFee || AUTOMATIC_BOOKING_FEE)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onBooking(hostel)}
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
                <form onSubmit={onSendEnquiry} className="space-y-3">
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
  );
};
