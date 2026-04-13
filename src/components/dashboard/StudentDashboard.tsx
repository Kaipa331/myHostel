import React from 'react';
import { 
  Plus, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Heart, 
  CreditCard, 
  LayoutDashboard,
  Search,
  ChevronRight
} from 'lucide-react';
import { 
  UserProfile, 
  Booking, 
  Enquiry, 
  Hostel, 
  AppView 
} from '../../types';

interface StudentDashboardProps {
  user: UserProfile;
  bookings: Booking[];
  enquiries: Enquiry[];
  hostels: Hostel[];
  savedHostels: Hostel[];
  activeView: string;
  onViewChange: (view: AppView) => void;
  onOpenPayment: () => void;
  onOpenInvoice: () => void;
  onSelectEnquiry: (e: Enquiry) => void;
  onOpenHostelDetail: (h: Hostel) => void;
  onSaveHostel: (hostelId: string) => void;
  onUnsaveHostel: (hostelId: string) => void;
}

export const StudentDashboard = ({ 
  user, 
  bookings, 
  enquiries, 
  hostels, 
  savedHostels,
  activeView, 
  onViewChange,
  onOpenPayment,
  onOpenInvoice,
  onSelectEnquiry,
  onOpenHostelDetail,
  onSaveHostel,
  onUnsaveHostel
}: StudentDashboardProps) => {
  const pendingBooking = bookings.find(b => b.paymentStatus !== 'fully_paid');
  const remainingBalance = pendingBooking ? (pendingBooking.totalAmount - (pendingBooking.amountPaid || 0)) : 0;

  const renderContent = () => {
    switch (activeView) {
      case 'bookings':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">My Bookings</h2>
              <button onClick={() => onViewChange('listings')} className="text-sm font-bold text-primary hover:underline">Find More Hostels</button>
            </div>
            <div className="space-y-6">
              {bookings.length > 0 ? bookings.map((booking, i) => {
                const hostel = hostels.find(h => h.id === booking.hostelId);
                return (
                  <div 
                    key={`booking-list-${booking.id || i}`} 
                    onClick={() => hostel && onOpenHostelDetail(hostel)}
                    className="bg-white dark:bg-surface-container rounded-[2.5rem] p-6 border border-outline-variant/30 editorial-shadow flex flex-col md:flex-row items-center gap-8 hover:border-primary transition-all group cursor-pointer"
                  >
                    <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                      <img src={hostel?.image || 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${booking.status === 'confirmed' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-fixed/10 text-secondary-fixed'}`}>
                          {(booking.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-primary mb-1">{booking.hostelName}</h3>
                      <div className="flex items-center text-xs text-on-surface-variant font-medium">
                        <MapPin className="w-3 h-3 mr-1" /> {hostel?.location || 'Location'}
                      </div>
                    </div>
                    <div className="flex gap-12 text-right">
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Payment Status</div>
                        <div className={`text-sm font-bold ${booking.paymentStatus === 'fully_paid' ? 'text-tertiary' : 'text-secondary-fixed'}`}>
                          {booking.paymentStatus?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Amount Paid</div>
                        <div className="text-sm font-bold text-tertiary">MK {booking.amountPaid?.toLocaleString() || '0'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Remaining</div>
                        <div className="text-sm font-bold text-secondary-fixed">MK {(booking.totalAmount - (booking.amountPaid || 0)).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-20 bg-white dark:bg-surface-container rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-primary mb-2">No Bookings Found</h3>
                  <p className="text-on-surface-variant font-medium mb-6">Start your journey by finding your perfect hostel today.</p>
                  <button onClick={() => onViewChange('listings')} className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black hover-lift shadow-xl shadow-primary/20">Explore Listings</button>
                </div>
              )}
            </div>
          </section>
        );
      case 'saved':
        return (
          <section>
            <h2 className="text-2xl font-black text-primary mb-6">Saved Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedHostels.length > 0 ? savedHostels.map(hostel => (
                <div key={hostel.id} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group cursor-pointer" onClick={() => onOpenHostelDetail(hostel)}>
                  <div className="h-48 relative overflow-hidden">
                    <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUnsaveHostel(hostel.id); }}
                      className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-2xl text-error shadow-lg hover:scale-110 transition-transform"
                    >
                      <Heart className="w-5 h-5 fill-error" />
                    </button>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-primary mb-1">{hostel.name}</h3>
                    <p className="text-sm text-on-surface-variant font-medium">{hostel.location}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-surface-container rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                  <Heart className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">No hostels saved yet.</p>
                  <button onClick={() => onViewChange('listings')} className="mt-4 text-primary font-black hover:underline">Browse hostels</button>
                </div>
              )}
            </div>
          </section>
        );
      case 'messages':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30">
              <h2 className="text-2xl font-black text-primary">Messages</h2>
              <p className="text-sm text-on-surface-variant font-medium">Your enquiries and conversations with landlords.</p>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {enquiries.length > 0 ? enquiries.map((enquiry) => (
                <div 
                  key={enquiry.id} 
                  onClick={() => onSelectEnquiry(enquiry)}
                  className="p-8 hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-primary group-hover:text-primary-high transition-colors">{enquiry.hostelName}</h4>
                    <span className="text-[10px] font-medium text-on-surface-variant">{enquiry.date}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{enquiry.message}</p>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <MessageSquare className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">No messages yet.</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <>
            <div className="mb-12 rounded-[2.5rem] border border-outline-variant/30 bg-white dark:bg-surface-container p-6 md:p-8 editorial-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Student overview</div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">Keep your housing flow moving</h2>
                <p className="text-sm text-on-surface-variant font-medium mt-2 max-w-2xl">
                  Track bookings, clear balances, and keep a shortlist of properties that fit your routine.
                </p>
              </div>
              <button
                onClick={() => onViewChange('listings')}
                className="inline-flex items-center px-5 py-3 rounded-2xl bg-primary text-on-primary font-black text-sm hover-lift shadow-xl shadow-primary/20"
              >
                <Search className="w-4 h-4 mr-2" />
                Explore hostels
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div
                onClick={() => onViewChange('bookings')}
                className="bg-gradient-to-br from-primary to-primary/90 text-on-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 hover-lift cursor-pointer transition-all relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Active Bookings</div>
                    <LayoutDashboard className="w-5 h-5 opacity-70" />
                  </div>
                  <div className="text-4xl font-black mb-2">{bookings.filter(b => b.status === 'confirmed').length}</div>
                  <div className="text-[10px] font-medium opacity-80">Rooms confirmed and ready for the term</div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </div>

              <div
                onClick={onOpenPayment}
                className="bg-gradient-to-br from-secondary-fixed to-secondary-fixed/90 text-on-secondary-fixed p-8 rounded-[2.5rem] shadow-xl shadow-secondary-fixed/20 hover-lift cursor-pointer transition-all relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Pending Payment</div>
                    <CreditCard className="w-5 h-5 opacity-70" />
                  </div>
                  <div className="text-4xl font-black mb-2">MK {remainingBalance.toLocaleString()}</div>
                  <div className="text-[10px] font-medium opacity-80">Clear your balance to keep the booking active</div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </div>

              <div
                onClick={() => onViewChange('saved')}
                className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow hover-lift cursor-pointer transition-all relative overflow-hidden group shadow-sm hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Saved</div>
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <div className="text-4xl font-black text-primary mb-2">{savedHostels.length}</div>
                  <div className="text-[10px] font-medium text-on-surface-variant">Hostels shortlisted for later</div>
                </div>
              </div>

              <div
                onClick={() => onViewChange('messages')}
                className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow hover-lift cursor-pointer transition-all relative overflow-hidden group shadow-sm hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Messages</div>
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-4xl font-black text-primary mb-2">{enquiries.length}</div>
                  <div className="text-[10px] font-medium text-on-surface-variant">Open conversations with landlords</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-primary">Recent Bookings</h2>
                    <button onClick={() => onViewChange('bookings')} className="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {bookings.slice(0, 2).map((booking, i) => (
                      <div key={`recent-booking-${i}`} className="bg-white dark:bg-surface-container rounded-3xl p-6 border border-outline-variant/30 editorial-shadow flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center">
                             <img src={hostels.find(h => h.id === booking.hostelId)?.image || 'https://images.unsplash.com/photo-1555854817-5b2260d1bc63?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover rounded-2xl" alt="" />
                           </div>
                           <div>
                             <h4 className="font-bold text-primary">{booking.hostelName}</h4>
                             <p className="text-xs text-on-surface-variant">{booking.date}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <div className={`text-xs font-black uppercase tracking-[0.1em] mb-1 ${booking.status === 'confirmed' ? 'text-tertiary' : 'text-secondary-fixed'}`}>
                             {booking.status}
                           </div>
                           <button onClick={onOpenInvoice} className="text-[10px] font-bold text-primary hover:underline flex items-center justify-end">
                             <FileText className="w-3 h-3 mr-1" /> View Invoice
                           </button>
                         </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-center py-12 bg-white/50 dark:bg-black/10 rounded-3xl border border-dashed border-outline-variant/30">
                        <p className="text-sm text-on-surface-variant font-medium">No recent activity.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <div className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30">
                  <h3 className="text-xl font-black text-primary mb-6">Explore Recommendations</h3>
                  <div className="space-y-4">
                    {hostels.slice(0, 4).map((hostel, i) => (
                      <div 
                        key={`recommend-${i}`} 
                        onClick={() => onOpenHostelDetail(hostel)}
                        className="flex items-center gap-4 cursor-pointer group"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                          <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-primary text-sm truncate">{hostel.name}</h4>
                          <p className="text-xs text-on-surface-variant font-medium truncate">{hostel.university}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onViewChange('listings')} className="w-full mt-8 py-4 bg-white dark:bg-surface-container rounded-2xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant font-bold text-sm hover:border-primary hover:text-primary transition-all">Search Hostels</button>
                </div>
              </aside>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-surface-container-lowest min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-primary">
            {activeView === 'dashboard' ? `Welcome back, ${user.name.split(' ')[0]}!` : 
             activeView === 'bookings' ? 'My Bookings' :
             activeView === 'saved' ? 'Saved Collections' : 'My Enquiries'}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">Manage your housing needs and tracked hostels.</p>
        </div>
        {activeView === 'dashboard' && (
          <button 
            onClick={() => onViewChange('listings')}
            className="flex items-center px-6 py-4 rounded-2xl bg-primary text-on-primary font-black text-sm hover-lift shadow-xl shadow-primary/20"
          >
            <Search className="w-5 h-5 mr-2" />
            Find New Hostel
          </button>
        )}
      </header>

      {renderContent()}
    </div>
  );
};
