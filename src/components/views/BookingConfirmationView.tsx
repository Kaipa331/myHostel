import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Booking, Hostel, AppView } from '../../types';

interface BookingConfirmationViewProps {
  booking: Booking;
  hostel: Hostel;
  onProceedToPayment: () => void;
  onGoToDashboard: () => void;
  onViewChange: (view: AppView) => void;
}

export const BookingConfirmationView = ({
  booking,
  hostel,
  onProceedToPayment,
  onGoToDashboard,
  onViewChange,
}: BookingConfirmationViewProps) => {
  return (
    <motion.div
      key="booking-confirmation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto px-4 py-20 w-full"
    >
      <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-10 border border-outline-variant/30">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-primary mb-4">Booking Confirmed</h2>
          <p className="text-on-surface-variant">
            Your reservation for <span className="font-bold text-primary">{booking.hostelName}</span> has been created.
          </p>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-primary mb-4">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Hostel</div>
              <div className="font-bold text-primary">{booking.hostelName}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Location</div>
              <div className="font-bold text-primary">{hostel.location}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Monthly Rent</div>
              <div className="font-bold text-primary">MK {booking.totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Booking Fee</div>
              <div className="font-bold text-primary">MK {booking.bookingFee.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-fixed/10 border border-secondary-fixed/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-secondary-fixed mt-0.5" />
            <div>
              <h4 className="font-bold text-primary mb-2">What happens next</h4>
              <p className="text-on-surface-variant text-sm">
                Continue to payment to upload proof of your deposit. The landlord will review the booking and confirm your room after payment verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onProceedToPayment}
            className="flex-1 py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift shadow-lg flex items-center justify-center gap-2"
          >
            Proceed to Payment <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onGoToDashboard}
            className="flex-1 py-4 rounded-xl bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            View Dashboard
          </button>
          <button
            onClick={() => onViewChange('detail')}
            className="flex-1 py-4 rounded-xl bg-surface-container-low text-primary font-bold hover:bg-surface-container-high transition-colors"
          >
            Back to Listing
          </button>
        </div>
      </div>
    </motion.div>
  );
};
