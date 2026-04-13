import React from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut 
} from 'lucide-react';
import { AppView, UserProfile } from '../../types';

interface NavbarProps {
  onViewChange: (view: AppView) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  user: UserProfile | null;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export const Navbar = ({ 
  onViewChange, 
  isMenuOpen, 
  setIsMenuOpen,
  isLoggedIn,
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center cursor-pointer interactive-scale" onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="myHostel Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-primary">myHostel</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onViewChange('home')}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
            {(!isLoggedIn || user?.role !== 'landlord') && (
              <button 
                onClick={() => onViewChange('listings')}
                className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
              >
                Find a Room
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            )}
            {(!isLoggedIn || user?.role === 'landlord') && (
              <button 
                onClick={() => {
                  if (isLoggedIn) onViewChange('list-hostel');
                  else onViewChange('login');
                }}
                className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
              >
                List Your Hostel
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            )}
            <button 
              onClick={() => onViewChange('support')}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors relative group"
            >
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>

            {isLoggedIn && (
              <button 
                onClick={() => onViewChange('dashboard')}
                className="text-primary font-black transition-colors relative group flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            )}

            <button 
              onClick={onToggleDarkMode}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors interactive-scale"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onLogout}
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onViewChange('login')}
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:bg-primary-container transition-all shadow-md hover-lift interactive-scale"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors interactive-scale"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary interactive-scale"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant/30 overflow-hidden">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button 
              onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
            >
              Home
            </button>
            {(!isLoggedIn || user?.role !== 'landlord') && (
              <button 
                onClick={() => { onViewChange('listings'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
              >
                Find a Room
              </button>
            )}
            {(!isLoggedIn || user?.role === 'landlord') && (
              <button 
                onClick={() => { 
                  if (isLoggedIn) onViewChange('list-hostel');
                  else onViewChange('login');
                  setIsMenuOpen(false); 
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
              >
                List Your Hostel
              </button>
            )}
            <button 
              onClick={() => { onViewChange('support'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium transition-all"
            >
              Support
            </button>
            {isLoggedIn && (
              <button 
                onClick={() => { onViewChange('dashboard'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-black transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            )}
            <div className="pt-4 px-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full text-error py-3 rounded-xl font-bold flex items-center justify-center"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onViewChange('login'); setIsMenuOpen(false); }}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold shadow-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
