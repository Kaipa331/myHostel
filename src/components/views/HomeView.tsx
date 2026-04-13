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

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[3rem] overflow-hidden relative editorial-shadow group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 md:p-20 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 w-fit">
                  <Building className="w-3 h-3" />
                  Partner with us
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
                  Maximize Your <span className="text-secondary-fixed italic">Hostel's Potential.</span>
                </h2>
                <p className="text-on-primary/70 text-lg md:text-xl font-medium mb-12 max-w-lg">
                  Join Malawi's premier student housing network. Get verified, reach thousands of students, and manage bookings with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button
                    onClick={() => (isLoggedIn ? onViewChange('list-hostel') : onViewChange('login'))}
                    className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-2xl font-black text-lg hover-lift shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
                  >
                    List Your Property <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onViewChange('support')}
                    className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              <div className="relative hidden lg:block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000"
                  alt="Modern office/hostel"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

                <div className="absolute bottom-12 right-12 glass-effect p-8 rounded-[2rem] border border-white/20 shadow-2xl animate-float">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-secondary-fixed rounded-2xl flex items-center justify-center text-on-secondary-fixed">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">40%</div>
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Faster Bookings</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/80 font-medium leading-relaxed">
                    Landlords on our platform see a significant increase in early reservations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
