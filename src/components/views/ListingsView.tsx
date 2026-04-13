import React from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck } from 'lucide-react';
import { AppView, Hostel } from '../../types';
import { HostelCard } from '../hostel/HostelCard';

interface ListingsViewProps {
  hostels: Hostel[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewChange: (view: AppView) => void;
  onOpenHostel: (hostel: Hostel) => void;
}

export const ListingsView = ({
  hostels,
  searchQuery,
  onSearchChange,
  onViewChange,
  onOpenHostel,
}: ListingsViewProps) => {
  return (
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
          <p className="text-on-surface-variant">Showing {hostels.length} results for your search</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            placeholder="Filter results..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hostels.map((hostel) => (
          <HostelCard
            key={hostel.id}
            hostel={hostel}
            onClick={() => onOpenHostel(hostel)}
          />
        ))}
      </motion.div>

      {hostels.length === 0 && (
        <div className="mt-10 rounded-[2.5rem] border border-dashed border-outline-variant/30 bg-white dark:bg-surface-container p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-black text-primary mb-2">No hostels match this search</h3>
          <p className="text-on-surface-variant font-medium mb-6">
            Try a different university, suburb, or hostel name to widen the results.
          </p>
          <button
            onClick={() => onViewChange('home')}
            className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-black hover-lift shadow-xl shadow-primary/20"
          >
            Back to Home
          </button>
        </div>
      )}
    </motion.div>
  );
};
