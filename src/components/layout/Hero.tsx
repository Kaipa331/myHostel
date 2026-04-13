import React from 'react';
import { 
  Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  heroImageIndex: number;
  heroImages: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Hero = ({ 
  heroImageIndex, 
  heroImages, 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit 
}: HeroProps) => {
  return (
    <section className="relative h-[65vh] md:h-[85vh] flex items-center overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div 
          key={heroImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 bg-black"
        >
          <img 
            src={heroImages[heroImageIndex]} 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Students studying"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full border-box">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Find Your Perfect <span className="text-secondary-fixed">Study Haven</span> in Malawi.
          </h1>
          
          <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by university or location..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-fixed shadow-xl"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
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
    </section>
  );
};
