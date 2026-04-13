import React from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Upload, 
  Camera 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  UserProfile, 
  Hostel 
} from '../../types';

interface HostelFormProps {
  user: UserProfile | null;
  isEditingHostel: boolean;
  editingHostel: Hostel | null;
  uploadedImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onListHostel: (e: React.FormEvent) => void;
  onBack: () => void;
}

const AMENITY_OPTIONS = [
  'Free WiFi', 'Internal Water', 'Kitchen Access', 'Backup Power',
  '24/7 Security', 'Study Area', 'Laundry Service', 'Hot Water', 'Parking'
];

const UNIVERSITIES = ['UNIMA', 'MUBAS', 'MZUNI', 'LUANAR', 'MUST', 'KUHES', 'DMI', 'CUNIMA'];

export const HostelForm = ({ 
  user, 
  isEditingHostel, 
  editingHostel, 
  uploadedImage, 
  onImageUpload, 
  onListHostel, 
  onBack 
}: HostelFormProps) => {
  if (user?.role !== 'landlord') {
    return (
      <div className="text-center py-20 bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow border border-outline-variant/30">
        <ShieldAlert className="w-20 h-20 text-error mx-auto mb-6" />
        <h2 className="text-3xl font-black text-primary mb-4">Access Denied</h2>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">Only registered landlords can list properties on myHostel. If you are a landlord, please sign in with a landlord account.</p>
        <button 
          onClick={onBack}
          className="px-8 py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="p-3 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-primary shadow-sm hover-lift">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1 pr-12">
          <h2 className="text-4xl font-black text-primary mb-2">{isEditingHostel ? 'Edit Your Property' : 'List Your Property'}</h2>
          <p className="text-on-surface-variant text-lg">{isEditingHostel ? 'Update your hostel details to keep students informed.' : 'Join Malawi\'s largest student housing network.'}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-container rounded-[2.5rem] editorial-shadow p-8 md:p-12 border border-outline-variant/30">
        <form onSubmit={onListHostel} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hostel Name</label>
              <input name="name" type="text" required defaultValue={editingHostel?.name} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. Sunrise Villa" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Location</label>
              <input name="location" type="text" required defaultValue={editingHostel?.location} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. Area 47, Lilongwe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Rooms</label>
              <input name="totalRooms" type="number" required defaultValue={editingHostel?.totalRooms} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="e.g. 20" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hostel Image (Inside or Outside)</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-3xl p-8 hover:border-primary transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={onImageUpload}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Monthly Price (MK)</label>
              <input name="price" type="number" required defaultValue={editingHostel?.price} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="45000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Rooms</label>
              <input name="rooms" type="number" required defaultValue={editingHostel?.totalRooms} className="w-full p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border-none focus:ring-2 focus:ring-primary" placeholder="10" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};
