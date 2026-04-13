import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { 
  UserProfile, 
  Review, 
  Hostel, 
  AppView 
} from '../../types';
import { supabase, handleSupabaseError, OperationType } from '../../supabase';

interface AdminDashboardProps {
  user: UserProfile;
  activeView: string;
  onViewChange: (view: AppView) => void;
  reviews: Review[];
  hostels: Hostel[];
  pendingLandlords: UserProfile[];
  onViewHostel: (h: Hostel) => void;
}

export const AdminDashboard = ({ 
  user, 
  activeView, 
  onViewChange, 
  reviews, 
  hostels, 
  pendingLandlords, 
  onViewHostel 
}: AdminDashboardProps) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Review | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleUpdateStatus = async (reviewId: string, status: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status, admin_note: adminNote })
        .eq('id', reviewId);
      
      if (error) throw error;
      setSelectedComplaint(null);
      setAdminNote('');
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  };

  const handleDeleteListing = async (hostelId: string) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        const { error: deleteError } = await supabase
          .from('hostels')
          .delete()
          .eq('id', hostelId);
        
        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase
          .from('reviews')
          .update({ status: 'resolved', admin_note: 'Listing deleted due to valid complaints.' })
          .eq('hostel_id', hostelId);

        if (updateError) throw updateError;
        
        setSelectedComplaint(null);
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  const handleSendMessage = async (studentId: string, studentName: string) => {
    if (!replyMessage.trim()) return;
    try {
      const { error } = await supabase.from('enquiries').insert({
        hostel_id: 'admin-support',
        hostel_name: 'Admin Support',
        student_id: studentId,
        student_name: studentName,
        landlord_id: user.uid,
        message: replyMessage,
        date: new Date().toLocaleDateString(),
        status: 'new'
      });
      
      if (error) throw error;
      setReplyMessage('');
      setIsReplying(false);
      alert("Message sent to student successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleApproveLandlord = async (landlordId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ admin_approved: true, verified: true })
        .eq('id', landlordId);

      if (error) throw error;
      alert("Landlord approved successfully!");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'profiles');
    }
  };

  const handleRejectLandlord = async (landlordId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ admin_approved: false, verified: false })
        .eq('id', landlordId);

      if (error) throw error;
      alert("Landlord rejected. They can reapply with proper documentation.");
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, 'profiles');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'complaints':
        const complaints = reviews.filter(r => r.isComplaint);
        return (
          <section className="space-y-6">
            <div className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
              <div className="p-8 border-b border-outline-variant/30">
                <h2 className="text-xl font-black text-primary">Student Complaints</h2>
                <p className="text-sm text-on-surface-variant font-medium">Review and resolve issues reported by students.</p>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {complaints.length > 0 ? complaints.map((complaint) => (
                  <div key={complaint.id} className="p-8 hover:bg-surface-container-lowest transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{complaint.hostelName}</h4>
                          <p className="text-xs text-on-surface-variant font-medium">Reported by {complaint.studentName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                        complaint.status === 'pending' ? 'bg-secondary-fixed/10 text-secondary-fixed' :
                        complaint.status === 'resolved' ? 'bg-tertiary/10 text-tertiary' : 'bg-on-surface-variant/10 text-on-surface-variant'
                      }`}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 italic">
                      "{complaint.comment}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => {
                          const hostel = hostels.find(h => h.id === complaint.hostelId);
                          if (hostel) onViewHostel(hostel);
                        }}
                        className="px-4 py-2 bg-white dark:bg-surface-container border border-outline-variant/30 rounded-xl text-xs font-bold text-primary hover:bg-surface-container-high transition-colors"
                      >
                        View Listing
                      </button>
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover-lift transition-all"
                      >
                        Take Action
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsReplying(true);
                        }}
                        className="px-4 py-2 bg-surface-container text-primary rounded-xl text-xs font-bold hover:bg-primary/5 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message Student
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center">
                    <CheckCircle2 className="w-12 h-12 text-tertiary/30 mx-auto mb-4" />
                    <p className="text-on-surface-variant font-bold">No active complaints. Everything looks good!</p>
                  </div>
                )}
              </div>
            </div>

            {selectedComplaint && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white dark:bg-surface-container rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-primary">Resolve Complaint</h3>
                    <button onClick={() => { setSelectedComplaint(null); setIsReplying(false); }} className="p-2 hover:bg-surface-container rounded-full"><X className="w-6 h-6" /></button>
                  </div>

                  {isReplying ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">To: {selectedComplaint.studentName}</p>
                        <p className="text-sm text-primary font-bold">Re: Complaint about {selectedComplaint.hostelName}</p>
                      </div>
                      <textarea 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your message to the student..."
                        className="w-full p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary h-40"
                      />
                      <button 
                        onClick={() => handleSendMessage(selectedComplaint.studentId, selectedComplaint.studentName)}
                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black hover-lift interactive-scale flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Admin Note</label>
                        <textarea 
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Add a note for the internal records..."
                          className="w-full p-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary h-32"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')}
                          className="py-4 bg-primary text-on-primary rounded-2xl font-black hover-lift transition-all"
                        >
                          Resolve Issue
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedComplaint.id, 'dismissed')}
                          className="py-4 bg-surface-container text-primary rounded-2xl font-black hover:bg-primary/5 transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                      <div className="pt-4 border-t border-outline-variant/20">
                        <button 
                          onClick={() => handleDeleteListing(selectedComplaint.hostelId)}
                          className="w-full py-4 bg-error/5 text-error rounded-2xl font-black hover:bg-error/10 transition-all flex items-center justify-center gap-2"
                        >
                          Delete Problematic Listing
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </section>
        );
      case 'approvals':
        return (
          <section className="bg-white dark:bg-surface-container rounded-[2.5rem] border border-outline-variant/30 editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-xl font-black text-primary">Landlord Approvals</h2>
              <p className="text-sm text-on-surface-variant font-medium">Verify credentials of new landlords.</p>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {pendingLandlords.length > 0 ? pendingLandlords.map((landlord) => (
                <div key={landlord.uid} className="p-8 hover:bg-surface-container-lowest transition-colors flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {landlord.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{landlord.name}</h4>
                        <p className="text-xs text-on-surface-variant">{landlord.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {landlord.documents?.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleApproveLandlord(landlord.uid)}
                      className="px-6 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover-lift"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectLandlord(landlord.uid)}
                      className="px-6 py-2 bg-surface-container text-error rounded-xl text-xs font-bold hover:bg-error/10 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <p className="text-on-surface-variant font-bold">No pending approvals.</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'dashboard':
      default:
        return (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-[2rem] border border-outline-variant/30 bg-white dark:bg-surface-container p-6 editorial-shadow">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Platform overview</div>
                <h2 className="text-2xl font-black text-primary">Admin snapshot</h2>
                <p className="text-sm text-on-surface-variant font-medium">A quick read on listings, verifications, and unresolved reports.</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                Live monitoring
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-on-primary p-8 rounded-[2.5rem] editorial-shadow shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="text-3xl font-black mb-1">{hostels.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Total Listings</div>
                <div className="text-[10px] font-medium opacity-80">Hostels currently active on the platform</div>
              </div>
              <div className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className="text-3xl font-black text-primary mb-1">{pendingLandlords.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Pending Approvals</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Landlords waiting for document review</div>
              </div>
              <div className="bg-gradient-to-br from-white to-surface-container/70 dark:from-surface-container dark:to-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/30 editorial-shadow shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className="text-3xl font-black text-error mb-1">{reviews.filter(r => r.isComplaint && r.status === 'pending').length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Active Complaints</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Issues that need a moderator response</div>
              </div>
              <div className="bg-gradient-to-br from-tertiary to-tertiary/85 text-on-tertiary p-8 rounded-[2.5rem] editorial-shadow shadow-xl shadow-tertiary/20 relative overflow-hidden">
                <div className="text-3xl font-black mb-1">MK 15.2M</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Platform Volume</div>
                <div className="text-[10px] font-medium opacity-80">Gross booking value processed this period</div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex-1 p-8 bg-surface-container-lowest min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-primary">
            {activeView === 'dashboard' ? 'Admin Panel' : 
             activeView === 'approvals' ? 'Approval Queue' :
             activeView === 'complaints' ? 'Complaints' :
             activeView === 'moderation' ? 'Moderation' : 'Settings'}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">Control center for platform safety and verification.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-surface-container p-2 rounded-2xl border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">AD</div>
          <div className="pr-4">
            <div className="text-base font-bold text-primary">System Admin</div>
            <div className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Admin Status: Active</div>
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};
