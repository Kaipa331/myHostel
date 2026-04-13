import React, { useState } from 'react';
import { 
  Star, 
  ShieldAlert, 
  AlertTriangle, 
  Send 
} from 'lucide-react';
import { 
  UserProfile, 
  Review, 
  Hostel 
} from '../../types';
import { supabase } from '../../supabase';

interface ReviewSectionProps {
  hostel: Hostel;
  user: UserProfile | null;
  reviews: Review[];
}

export const ReviewSection = ({ hostel, user, reviews }: ReviewSectionProps) => {
  const [isComplaint, setIsComplaint] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hostelReviews = reviews.filter(r => r.hostelId === hostel.id && !r.isComplaint);
  const averageRating = hostelReviews.length > 0 
    ? (hostelReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / hostelReviews.length).toFixed(1)
    : (hostel?.rating || 5.0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to leave a review or report an issue.");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Insert review
      const { error } = await supabase.from('reviews').insert({
        hostel_id: hostel.id,
        hostel_name: hostel.name,
        student_id: user.uid,
        student_name: user.name,
        rating: isComplaint ? 1 : rating,
        comment,
        is_complaint: isComplaint,
        status: 'pending'
      });
      
      if (error) throw error;

      // 2. Update hostel stats (Increment count and average rating)
      const { data: updatedHostel } = await supabase.from('hostels').select('rating, reviews_count').eq('id', hostel.id).single();
      if (updatedHostel && !isComplaint) {
        const newCount = (updatedHostel.reviews_count || 0) + 1;
        const newRating = ((Number(updatedHostel.rating) * (newCount - 1)) + rating) / newCount;
        
        await supabase.from('hostels').update({
          reviews_count: newCount,
          rating: Number(newRating.toFixed(1))
        }).eq('id', hostel.id);
      }

      setComment('');
      setIsComplaint(false);
      alert(isComplaint ? "Your complaint has been sent to the admin for review." : "Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-primary mb-2">Reviews & Feedback</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary-fixed/20 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
              <span className="text-sm font-black text-secondary">{averageRating}</span>
            </div>
            <span className="text-sm text-on-surface-variant font-medium">{hostelReviews.length} Verified Reviews</span>
          </div>
        </div>
        {user?.role === 'student' && (
          <button 
            onClick={() => setIsComplaint(!isComplaint)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isComplaint ? 'bg-error text-on-error' : 'bg-surface-container text-primary hover:bg-primary/5'}`}
          >
            {isComplaint ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isComplaint ? 'Cancel Report' : 'Report an Issue'}
          </button>
        )}
      </div>

      {user?.role === 'student' && (
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/30 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-primary">{isComplaint ? 'File a Complaint' : 'Write a Review'}</h4>
            {!isComplaint && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={`review-star-${s}`} type="button" onClick={() => setRating(s)} className="p-1">
                    <Star className={`w-6 h-6 ${s <= rating ? 'text-secondary fill-secondary' : 'text-on-surface-variant/30'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder={isComplaint ? "Describe the issue you're facing with this hostel..." : "Share your experience living here..."}
            className="w-full p-4 rounded-2xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary h-32"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black hover-lift interactive-scale shadow-lg flex items-center justify-center gap-2 ${isComplaint ? 'bg-error text-on-error shadow-error/20' : 'bg-primary text-on-primary shadow-primary/20'}`}
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
              <>
                {isComplaint ? <ShieldAlert className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {isComplaint ? 'Submit Complaint to Admin' : 'Post Review'}
              </>
            )}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {hostelReviews.length > 0 ? hostelReviews.map((review) => (
          <div key={review.id} className="p-6 bg-white dark:bg-surface-container rounded-3xl border border-outline-variant/20 editorial-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {review.studentName ? review.studentName[0] : 'U'}
                </div>
                <div>
                  <div className="font-bold text-primary">{review.studentName || 'Unknown User'}</div>
                  <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Verified Resident</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={`review-item-star-${review.id}-${i}`} className={`w-3 h-3 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-on-surface-variant/20'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed italic">"{review.comment}"</p>
          </div>
        )) : (
          <div className="text-center py-12 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
            <Star className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};
