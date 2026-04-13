import React from 'react';
import { 
  X, 
  User, 
  HelpCircle, 
  LogOut, 
  Shield, 
  FileCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Settings, 
  LayoutDashboard, 
  Building, 
  ClipboardList, 
  MessageSquare, 
  Heart,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, AppView } from '../../types';

interface SidebarProps {
  user: UserProfile;
  activeView: string;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ 
  user, 
  activeView, 
  onViewChange, 
  onLogout, 
  isOpen, 
  onClose 
}: SidebarProps) => {
  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Panel', icon: Shield },
          { id: 'approvals', label: 'Approval Queue', icon: FileCheck },
          { id: 'complaints', label: 'Complaints', icon: ShieldAlert },
          { id: 'moderation', label: 'Moderation', icon: AlertTriangle },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'landlord':
        return [
          { id: 'dashboard', label: 'Landlord Hub', icon: LayoutDashboard },
          { id: 'properties', label: 'My Properties', icon: Building },
          { id: 'bookings', label: 'Booking Requests', icon: ClipboardList },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'messages', label: 'Student Enquiries', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bookings', label: 'My Bookings', icon: Building },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'saved', label: 'Saved Hostels', icon: Heart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-container border-r border-outline-variant/30 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center cursor-pointer" onClick={() => { onViewChange('home'); onClose?.(); }}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="myHostel Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-black text-primary tracking-tighter">myHostel</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl mb-8 border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-primary" />}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-primary truncate">Welcome back</div>
                <div className="text-[10px] font-medium text-on-surface-variant truncate uppercase tracking-widest">{user.role} Account</div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id as AppView); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeView === item.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
              <HelpCircle className="w-5 h-5" />
              Help Center
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-error hover:bg-error/10 transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
