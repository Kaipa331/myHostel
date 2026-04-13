import React from 'react';
import { 
  Building, 
  Settings, 
  Trash2, 
  FileText, 
  Check, 
  CheckCircle2, 
  Plus, 
  CreditCard, 
  Star, 
  Bell, 
  Menu,
  History
} from 'lucide-react';
import { 
  UserProfile, 
  Hostel, 
  Booking, 
  Enquiry, 
  AppView 
} from '../../types';

interface LandlordDashboardProps {
  user: UserProfile;
  hostels: Hostel[];
  bookings: Booking[];
  activeView: string;
  enquiries: Enquiry[];
  onViewChange: (view: AppView) => void;
  onEdit: (h: Hostel) => void;
  onDelete: (id: string) => void;
  onAcceptBooking: (bookingId: string) => void;
  onDeclineBooking: (bookingId: string) => void;
  onOpenHostelDetail: (h: Hostel) => void;
  onReplyEnquiry: (id: string, reply: string) => void;
}

export const LandlordDashboard = ({ 
  user, 
  hostels, 
  bookings, 
  activeView, 
  enquiries, 
  onViewChange, 
  onEdit, 
  onDelete, 
  onAcceptBooking, 
  onDeclineBooking, 
  onOpenHostelDetail, 
  onReplyEnquiry,
  // This helps when we move state up or down
  setSelectedReceipt
}: LandlordDashboardProps & { setSelectedReceipt?: (img: string | null) => void }) => {
  const myHostels = hostels.filter(h => h.landlordId === user.uid);
  const myEnquiries = enquiries.filter(e => e.landlordId === user.uid);
  const myBookings = bookings.filter(b => b.landlordId === user.uid);
  
  const totalRevenue = myBookings.reduce((acc, b) => acc + (b.amountPaid || 0), 0);
  const pendingBookings = myBookings.filter(b => b.status === 'pending');
  const pendingInvoicesCount = myBookings.filter(b => b.paymentStatus !== 'fully_paid').length;
  const averageRating = myHostels.length > 0 ? (myHostels.reduce((acc, h) => acc + h.rating, 0) / myHostels.length).toFixed(1) : '5.0';

  const renderContent = () => {
    switch (activeView) {
      case 'properties':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">My Properties</h2>
              <button onClick={() => onViewChange('list-hostel')} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:scale-105 transition-transform">Add Property</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHostels.map(hostel => (
                <div key={hostel.id} 
                  onClick={() => onOpenHostelDetail(hostel)}
                  className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high rounded-[2.5rem] overflow-hidden border border-outline-variant/30 hover:border-primary transition-all group editorial-shadow cursor-pointer relative shadow-sm hover:shadow-2xl"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img src={hostel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button onClick={(e) => { e.stopPropagation(); onEdit(hostel); }} className="p-2 bg-white/90 backdrop-blur rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm"><Settings className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(hostel.id); }} className="p-2 bg-white/90 backdrop-blur rounded-lg text-error hover:bg-error hover:text-on-error transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-primary mb-1">{hostel.name}</h3>
                    <p className="text-sm text-on-surface-variant font-medium mb-6">{hostel.location}</p>
                    <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-6">
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Rooms</div>
                        <div className="text-2xl font-black text-primary">{hostel.availableRooms} / {hostel.totalRooms}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Occupancy</div>
                        <div className="text-2xl font-black text-secondary-fixed">
                          {hostel.totalRooms > 0 ? Math.round(((hostel.totalRooms - hostel.availableRooms) / hostel.totalRooms) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {myHostels.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white dark:bg-surface-container rounded-[2.5rem] border-2 border-dashed border-outline-variant/30">
                  <Building className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-bold">No properties listed yet.</p>
                  <button onClick={() => onViewChange('list-hostel')} className="mt-4 text-primary font-black hover:underline">List your first hostel</button>
                </div>
              )}
            </div>
          </section>
        );
      case 'bookings':
        return (
            <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-2xl font-black text-primary">Booking Requests</h2>
              <p className="text-sm text-on-surface-variant font-medium">Manage incoming reservations for your properties.</p>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {myBookings.length > 0 ? myBookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl bg-gradient-to-br from-surface-container-low to-white dark:from-surface-container-high dark:to-surface-container border border-outline-variant/20 gap-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {booking.studentName ? booking.studentName[0] : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{booking.studentName}</h4>
                        <p className="text-xs text-on-surface-variant">{booking.hostelName} • {booking.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-12 text-right">
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Deposit</div>
                        <div className="text-sm font-bold text-primary">MK {booking.totalAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Remaining</div>
                        <div className="text-sm font-bold text-secondary-fixed">MK {(booking.totalAmount - (booking.amountPaid || 0)).toLocaleString()}</div>
                      </div>
                    </div>
                    {booking.receiptImage && setSelectedReceipt && (
                      <button 
                        onClick={() => setSelectedReceipt(booking.receiptImage!)}
                        className="px-4 py-2 bg-secondary-fixed/10 text-secondary-fixed rounded-xl text-[10px] font-black hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all flex items-center gap-2"
                      >
                        <FileText className="w-3 h-3" />
                        View Receipt
                      </button>
                    )}
                    {booking.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => onAcceptBooking(booking.id)} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black hover:scale-105 transition-transform">Accept</button>
                        <button onClick={() => onDeclineBooking(booking.id)} className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl text-[10px] font-black hover:bg-error/10 hover:text-error transition-all">Decline</button>
                      </div>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
                        {booking.status}
                      </span>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-on-surface-variant font-medium">No booking requests yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      case 'transactions':
        return (
            <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-gradient-to-r from-secondary-fixed/10 to-transparent">
              <div>
                <h2 className="text-2xl font-black text-primary">Transaction History</h2>
                <p className="text-sm text-on-surface-variant font-medium">Monitor all payments and verified receipts from your students.</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Revenue</div>
                <div className="text-2xl font-black text-tertiary">MK {totalRevenue.toLocaleString()}</div>
              </div>
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant/20">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Student / Hostel</th>
                      <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Amount Paid</th>
                      <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {myBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-surface-container-lowest transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-primary">{booking.studentName}</div>
                          <div className="text-[10px] text-on-surface-variant">{booking.hostelName}</div>
                        </td>
                        <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{booking.date}</td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-tertiary">MK {booking.amountPaid?.toLocaleString() || '0'}</div>
                          <div className="text-[10px] text-on-surface-variant">of MK {booking.totalAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${booking.paymentStatus === 'fully_paid' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-fixed/10 text-secondary-fixed'}`}>
                          {booking.paymentStatus?.replace('_', ' ').toUpperCase() || 'UNPAID'}
                        </span>
                        </td>
                        <td className="px-8 py-6">
                          {booking.receiptImage && setSelectedReceipt && (
                            <button 
                              onClick={() => setSelectedReceipt(booking.receiptImage!)}
                              className="p-2 bg-surface-container-low text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all shadow-sm"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {myBookings.length === 0 && (
                  <div className="text-center py-20">
                    <History className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                    <p className="text-on-surface-variant font-bold">No transactions recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      case 'messages':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30">
              <h2 className="text-2xl font-black text-primary">Student Enquiries</h2>
              <p className="text-sm text-on-surface-variant font-medium">Respond to questions from potential residents.</p>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {myEnquiries.length > 0 ? myEnquiries.map((msg, i) => (
                <div key={i} className="p-8 hover:bg-surface-container-lowest transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-primary">{msg.studentName}</h4>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-medium text-on-surface-variant">{msg.date}</span>
                      <span className={`mt-1 px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${msg.status === 'replied' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                        {msg.status?.toUpperCase() || 'NEW'}
                      </span>
                    </div>
                  </div>
                  <h5 className="text-sm font-bold text-primary/80 mb-2">{msg.hostelName}</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{msg.message}</p>
                  {msg.replyMessage ? (
                    <div className="p-4 bg-surface-container rounded-2xl border-l-4 border-tertiary">
                      <div className="text-[8px] font-black text-tertiary uppercase tracking-widest mb-1">Your Reply</div>
                      <p className="text-xs text-on-surface-variant italic leading-relaxed">{msg.replyMessage}</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const reply = new FormData(e.currentTarget).get('reply') as string;
                      onReplyEnquiry(msg.id, reply);
                      (e.currentTarget as HTMLFormElement).reset();
                    }} className="flex gap-2">
                      <input name="reply" type="text" required placeholder="Type your reply..." className="flex-1 p-3 rounded-xl bg-surface-container border-none text-xs focus:ring-2 focus:ring-primary" />
                      <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black hover:scale-105 transition-transform">Reply Now</button>
                    </form>
                  )}
                </div>
              )) : (
                <div className="p-20 text-center">
                  <p className="text-on-surface-variant font-bold">No enquiries yet.</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'settings':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow p-8">
            <h2 className="text-2xl font-black text-primary mb-8">Landlord Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed font-bold">A</div>
                      <div>
                        <div className="text-sm font-bold text-primary">Airtel Money</div>
                        <div className="text-[10px] text-on-surface-variant">0888 123 456</div>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-primary hover:underline">Edit</button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Notifications</h3>
                {['Email', 'SMS', 'Alert Sounds'].map((pref, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-surface-container-low">
                    <span className="text-sm font-bold text-primary">{pref}</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <>
            <div className="bg-gradient-to-br from-tertiary/15 to-white dark:from-tertiary/10 dark:to-surface-container border-l-8 border-tertiary p-8 rounded-3xl mb-12 flex justify-between items-center relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-on-tertiary shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-primary">Approved by Admin</h2>
                </div>
                <p className="text-on-surface-variant font-medium">Your profile and properties are verified for the current cycle.</p>
              </div>
              <CheckCircle2 className="absolute -bottom-8 -right-8 w-48 h-48 text-tertiary/10 -rotate-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-primary">My Properties</h2>
                    <button onClick={() => onViewChange('list-hostel')} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">Add New <Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myHostels.slice(0, 2).map(hostel => (
                      <div key={hostel.id} className="bg-white dark:bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/30 p-8">
                        <h3 className="text-xl font-black text-primary mb-1">{hostel.name}</h3>
                        <p className="text-sm text-on-surface-variant font-medium">{hostel.location}</p>
                      </div>
                    ))}
                  </div>
                </section>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-primary to-primary/80 text-on-primary p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Revenue</div>
                    <div className="text-2xl font-black">MK {totalRevenue.toLocaleString()}</div>
                    <CreditCard className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                  </div>
                  <div className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-on-surface-variant">Invoices</div>
                    <div className="text-2xl font-black text-primary">{pendingInvoicesCount}</div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-on-surface-variant">Rating</div>
                    <div className="text-2xl font-black text-primary">{averageRating} / 5.0</div>
                  </div>
                </div>
              </div>

              <aside className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/30">
                <h2 className="text-xl font-black text-primary mb-8 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  New Bookings
                </h2>
                <div className="space-y-6">
                  {pendingBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-surface-container p-6 rounded-3xl border-l-4 border-primary shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-primary">{booking.studentName}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-4">{booking.hostelName}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onAcceptBooking(booking.id)} className="py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black">Accept</button>
                        <button onClick={() => onDeclineBooking(booking.id)} className="py-2 bg-surface-container text-on-surface-variant rounded-xl text-[10px] font-black">Decline</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => onViewChange('transactions' as any)} className="w-full py-4 rounded-2xl border-2 border-dashed border-outline-variant/50 text-on-surface-variant font-bold text-sm">View All Activity</button>
                </div>
              </aside>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1 p-8 bg-surface-container-lowest min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => (window as any).toggleSidebar?.()} className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-primary">
              {activeView === 'dashboard' ? 'Landlord Hub' : 
               activeView === 'properties' ? 'My Properties' :
               activeView === 'bookings' ? 'Booking Requests' :
               activeView === 'messages' ? 'Student Enquiries' : 'Settings'}
            </h1>
          </div>
        </div>
        {activeView === 'dashboard' && (
          <button onClick={() => onViewChange('list-hostel')} className="flex items-center px-8 py-4 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-black text-lg hover-lift shadow-xl shadow-secondary-fixed/20">
            <Plus className="w-6 h-6 mr-2" /> Add New Hostel
          </button>
        )}
      </header>
      {renderContent()}
    </div>
  );
};
