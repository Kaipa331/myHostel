import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Hostel } from '../../types';

interface HostelCardProps {
  hostel: Hostel;
  onClick: () => void;
}

export const HostelCard = ({ hostel, onClick }: HostelCardProps) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      layoutId={`hostel-${hostel.id}`}
      className="bg-white dark:bg-surface-container rounded-[2rem] overflow-hidden editorial-shadow border border-outline-variant/20 group cursor-pointer hover-lift flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden shrink-0">
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
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-primary">{hostel.name}</h3>
          <div className="flex items-center bg-secondary-fixed/20 px-2 py-1 rounded-lg shrink-0">
            <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
            <span className="text-sm font-bold text-secondary">{hostel.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-on-surface-variant text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {hostel.location}
        </div>
        <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden items-start">
          {hostel.amenities.slice(0, 3).map((amenity, i) => (
            <span key={`amenity-${hostel.id}-${i}`} className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              {amenity}
            </span>
          ))}
        </div>
        <button className="w-full mt-auto py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors flex items-center justify-center group">
          View Details
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
