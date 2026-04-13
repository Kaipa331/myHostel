import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { AppView } from '../../types';
import { UNIVERSITIES } from '../../constants';

interface FooterProps {
  onViewChange: (view: AppView) => void;
  isLoggedIn: boolean;
}

const Footer = ({ onViewChange, isLoggedIn }: FooterProps) => (
  <footer className="bg-white dark:bg-black border-t border-outline-variant/30 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="text-3xl font-black text-primary tracking-tighter font-headline mb-6">myHostel</div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            The premium platform for student accommodation in Malawi. We connect students with verified, high-quality living spaces for academic success.
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit myHostel on Facebook"
              className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit myHostel on X"
              className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit myHostel on Instagram"
              className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-headline font-black text-primary uppercase tracking-widest text-xs mb-8">Quick Links</h4>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => onViewChange('home')}
                className="text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => onViewChange('listings')}
                className="text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
              >
                Find a Hostel
              </button>
            </li>
            <li>
              <button
                onClick={() => (isLoggedIn ? onViewChange('list-hostel') : onViewChange('login'))}
                className="text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
              >
                List Property
              </button>
            </li>
            {isLoggedIn && (
              <li>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className="text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
                >
                  Dashboard
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => onViewChange('support')}
                className="text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
              >
                Support Center
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-black text-primary uppercase tracking-widest text-xs mb-8">Universities</h4>
          <ul className="space-y-4">
            {UNIVERSITIES.slice(0, 4).map((uni, i) => (
              <li
                key={`footer-uni-${i}`}
                className="text-on-surface-variant text-sm font-medium hover:text-primary cursor-pointer transition-colors"
              >
                {uni}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-black text-primary uppercase tracking-widest text-xs mb-8">Newsletter</h4>
          <p className="text-on-surface-variant text-xs mb-6 font-medium">
            Get the latest updates on new listings and student tips.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3 text-xs flex-grow focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-on-primary p-3 rounded-xl hover-lift">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
          © {new Date().getFullYear()} myHostel Malawi. All rights reserved.
        </p>
        <div className="flex gap-8">
          <button
            type="button"
            className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest cursor-pointer hover:text-primary"
            onClick={() => onViewChange('support')}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest cursor-pointer hover:text-primary"
            onClick={() => onViewChange('support')}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
