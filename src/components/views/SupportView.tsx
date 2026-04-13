import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export const SupportView = () => {
  return (
    <motion.div
      key="support"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-8 leading-tight">
            We're here to <span className="text-secondary-fixed">help</span> you settle in.
          </h2>
          <p className="text-on-surface-variant text-xl mb-12 leading-relaxed">
            Whether you're a student looking for a room or a landlord with questions, our team is ready to assist.
          </p>

          <div className="space-y-6">
            {[
              { q: 'How do I book a room?', a: "Simply find a hostel you like, click 'Reserve Now', and our team will contact you to finalize the details." },
              { q: 'Is my payment secure?', a: 'Yes, we use industry-standard encryption and verified payment gateways for all transactions.' },
              { q: "What does 'Verified' mean?", a: 'It means our team has physically visited the property to ensure it meets our safety and quality standards.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer group">
                <h4 className="font-bold text-primary mb-2 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-tertiary" />
                  {faq.q}
                </h4>
                <p className="text-on-surface-variant text-sm group-hover:text-on-surface transition-colors">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-container/10 p-12 rounded-[3rem] border border-primary/10">
          <h3 className="text-2xl font-bold text-primary mb-8">Send us a message</h3>
          <form className="space-y-6">
            <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary" />
            <input type="email" placeholder="Your Email" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary" />
            <textarea placeholder="How can we help?" className="w-full p-4 rounded-xl bg-white dark:bg-surface-container border-none focus:ring-2 focus:ring-primary h-40" />
            <button className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold hover-lift interactive-scale flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
