import React from 'react';
import { X, Download, ShieldCheck, ExternalLink } from 'lucide-react';

interface ReceiptModalProps {
  receiptUrl: string;
  onClose: () => void;
}

export const ReceiptModal = ({ receiptUrl, onClose }: ReceiptModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="bg-white dark:bg-surface-container rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden editorial-shadow relative flex flex-col">
        <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary">Verification Document</h2>
              <p className="text-xs text-on-surface-variant font-medium">Uploaded Payment Receipt</p>
            </div>
          </div>
          <div className="flex gap-2">
             <a 
              href={receiptUrl} 
              target="_blank" 
              rel="noreferrer"
              className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-all text-on-surface-variant"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-all text-on-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-surface-container-lowest flex items-center justify-center">
          <div className="max-w-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <img 
              src={receiptUrl} 
              alt="Payment Receipt" 
              className="max-w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="p-8 border-t border-outline-variant/20 bg-surface-container flex justify-between items-center">
          <p className="text-sm text-on-surface-variant font-medium max-w-md">
            Please verify the transaction details on the receipt against your bank or mobile money statement before confirming the booking.
          </p>
          <button className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-2 hover-lift shadow-xl shadow-primary/20">
            <Download className="w-5 h-5" /> Save Image
          </button>
        </div>
      </div>
    </div>
  );
};
