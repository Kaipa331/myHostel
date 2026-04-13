import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Camera 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  UserProfile 
} from '../../types';

interface ProfileFormProps {
  user: UserProfile;
  onUpdateProfile: (e: React.FormEvent) => void;
  onBack: () => void;
}

const UNIVERSITIES = ['UNIMA', 'MUBAS', 'MZUNI', 'LUANAR', 'MUST', 'KUHES', 'DMI', 'CUNIMA'];

export const ProfileForm = ({ user, onUpdateProfile, onBack }: ProfileFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
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
        <form onSubmit={onUpdateProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};
