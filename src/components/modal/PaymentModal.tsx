import React from 'react';
import { 
  CheckCircle2, 
  Upload 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Booking, 
  Hostel 
} from '../../types';

interface PaymentModalProps {
  selectedBooking: Booking;
  selectedHostel: Hostel;
  receiptImage: string | null;
  onReceiptUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPayment: (bookingId: string, amount: number, receiptUrl: string | null) => void;
  onClose: () => void;
}

export const PaymentModal = ({ 
  selectedBooking, 
  selectedHostel, 
  receiptImage, 
  onReceiptUpload, 
  onConfirmPayment, 
  onClose 
}: PaymentModalProps) => {
  return (
    <motion.div
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
                onConfirmPayment(selectedBooking.id, amount, receiptImage);
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
                      onChange={onReceiptUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {receiptImage ? (
                      <div className="flex items-center justify-center gap-2 text-primary bg-primary/5 p-4 rounded-xl border border-primary/20">
                        <CheckCircle2 className="w-5 h-5 text-tertiary" />
                        <span className="text-sm font-black uppercase tracking-widest">Receipt Selected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <Upload className="w-8 h-8 text-on-surface-variant/40" />
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Click to upload receipt</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift shadow-lg">
                  Confirm & Submit Proof
                </button>
              </form>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors"
            >
              Pay Later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
