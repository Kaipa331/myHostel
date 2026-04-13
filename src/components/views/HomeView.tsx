import React from 'react';
import { motion } from 'motion/react';
import { Building, ChevronRight, ShieldCheck, Clock, Zap, ArrowUpRight } from 'lucide-react';
import { AppView, Hostel } from '../../types';
import { Hero } from '../layout/Hero';
import { HostelCard } from '../hostel/HostelCard';

interface HomeViewProps {
  heroImageIndex: number;
  heroImages: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  featuredHostels: Hostel[];
  isLoggedIn: boolean;
  onViewChange: (view: AppView) => void;
  onOpenHostel: (hostel: Hostel) => void;
}

export const HomeView = ({
  heroImageIndex,
  heroImages,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  featuredHostels,
  isLoggedIn,
  onViewChange,
  onOpenHostel,
}: HomeViewProps) => {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <Hero
        heroImageIndex={heroImageIndex}
        heroImages={heroImages}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />

      <section className="py-24 bg-white dark:bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-2xl md:text-5xl font-black text-primary mb-4">Featured Hostels</h2>
              <p className="text-on-surface-variant max-w-xl font-medium">
                Hand-picked premium accommodations verified for safety and comfort.
              </p>
            </div>
            <button
              onClick={() => onViewChange('listings')}
              className="group flex items-center gap-2 text-primary font-black hover:gap-3 transition-all"
            >
              View All Listings <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHostels.slice(0, 3).map((hostel) => (
              <HostelCard key={`featured-${hostel.id}`} hostel={hostel} onClick={() => onOpenHostel(hostel)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold text-primary mb-4">Why Choose myHostel?</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              We take the stress out of finding accommodation so you can focus on your studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every hostel on our platform is physically inspected and verified by our team.' },
              { icon: Clock, title: 'Real-time Availability', desc: 'No more calling around. See instantly which rooms are available for the semester.' },
              { icon: Zap, title: 'Secure Payments', desc: 'Pay your deposit and rent securely through our integrated payment gateway.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container hover:bg-white dark:hover:bg-surface-container-high hover:editorial-shadow transition-all group">
                <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-on-primary-container w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold text-primary mb-4">
              Maximize Your <span className="text-primary/70">Hostel's Potential</span>
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Join Malawi's premier student housing network. Get verified, reach thousands of students, and manage bookings with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Building, title: 'Reach Thousands', desc: 'List your property and get noticed by students from all 16 major Malawian universities.' },
              { icon: ShieldCheck, title: 'Verified Trust', desc: 'Get the myHostel verification badge to build trust and increase your booking rate significantly.' },
              { icon: Zap, title: 'Easy Management', desc: 'Manage student enquiries and track bookings through your dedicated professional dashboard.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container hover:bg-white dark:hover:bg-surface-container-high hover:editorial-shadow transition-all group">
                <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-on-primary-container w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => (isLoggedIn ? onViewChange('list-hostel') : onViewChange('login'))}
              className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-black text-lg hover-lift shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all"
            >
              List Your Property Now <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
