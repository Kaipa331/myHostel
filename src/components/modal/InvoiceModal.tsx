import React from 'react';
import { X, FileText, Download, Printer } from 'lucide-react';
import { Booking, Hostel } from '../../types';

interface InvoiceModalProps {
  booking: Booking;
  hostel?: Hostel;
  onClose: () => void;
}

export const InvoiceModal = ({ booking, hostel, onClose }: InvoiceModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white dark:bg-surface-container rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto editorial-shadow relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-all"
        >
          <X className="w-6 h-6 text-on-surface-variant" />
        </button>

        <div className="p-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-primary tracking-tighter">myHostel</h2>
              </div>
              <p className="text-on-surface-variant font-medium">Booking Invoice & Reservation Details</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Invoice ID</div>
              <div className="font-bold text-primary">MH-{booking.id.slice(0, 8).toUpperCase()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-outline-variant/20">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Student Details</div>
              <div className="font-black text-xl text-primary mb-1">{booking.studentName}</div>
              <div className="text-sm text-on-surface-variant font-medium">Reservation Date: {booking.date}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Hostel Details</div>
              <div className="font-black text-xl text-primary mb-1">{booking.hostelName}</div>
              <div className="text-sm text-on-surface-variant font-medium">Managed by: Landlord ID {booking.landlordId.slice(0, 5)}</div>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-bold">Base Price</span>
              <span className="font-black text-primary">MK {booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-bold">Booking Fee</span>
              <span className="font-black text-primary">MK {booking.bookingFee?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center py-6 bg-surface-container-low px-6 rounded-3xl">
              <span className="text-xl font-black text-primary">Total Amount Due</span>
              <span className="text-3xl font-black text-primary">MK {(booking.totalAmount + (booking.bookingFee || 0)).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-tertiary/10 p-6 rounded-3xl mb-12 flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-tertiary mb-1">Current Status</div>
              <div className="font-black text-primary uppercase">{booking.paymentStatus?.replace('_', ' ') || 'PENDING'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-tertiary mb-1">Amount Paid</div>
              <div className="text-2xl font-black text-tertiary">MK {booking.amountPaid?.toLocaleString() || '0'}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black flex items-center justify-center gap-2 hover-lift shadow-xl shadow-primary/20">
              <Download className="w-5 h-5" /> Download PDF
            </button>
            <button className="p-4 border-2 border-outline-variant/30 rounded-2xl text-on-surface-variant hover:border-primary hover:text-primary transition-all">
              <Printer className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
