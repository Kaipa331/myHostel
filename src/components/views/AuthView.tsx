import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, LogIn, UserPlus, Search } from 'lucide-react';
import { AppView } from '../../types';

interface AuthViewProps {
  mode: 'login' | 'signup';
  loginRole: 'student' | 'landlord';
  signupRole: 'student' | 'landlord';
  email: string;
  password: string;
  name: string;
  authLoading: boolean;
  authError: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onLoginRoleChange: (value: 'student' | 'landlord') => void;
  onSignupRoleChange: (value: 'student' | 'landlord') => void;
  onLogin: (e: React.FormEvent) => void;
  onSignup: (e: React.FormEvent) => void;
  onGoogleAuth: (role: 'student' | 'landlord') => void;
  onBack: () => void;
  onViewChange: (view: AppView) => void;
}

export const AuthView = ({
  mode,
  loginRole,
  signupRole,
  email,
  password,
  name,
  authLoading,
  authError,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onLoginRoleChange,
  onSignupRoleChange,
  onLogin,
  onSignup,
  onGoogleAuth,
  onBack,
  onViewChange,
}: AuthViewProps) => {
  const isLogin = mode === 'login';

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-primary font-bold hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={() => onViewChange('home')}
          className="text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary"
        >
          Return Home
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="rounded-[3rem] overflow-hidden relative min-h-[420px] editorial-shadow">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1400"
            alt="Student housing"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 text-white h-full flex flex-col justify-end">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-fixed mb-4">
              Verified Living for Malawi
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.05] max-w-md">
              {isLogin ? 'Welcome back to myHostel' : 'Create your myHostel account'}
            </h1>
            <p className="mt-4 max-w-md text-white/80">
              Search, book, and manage student accommodation with one secure account.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-container rounded-[3rem] editorial-shadow p-8 md:p-12 border border-outline-variant/30">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-primary">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-sm text-on-surface-variant font-medium">
                {isLogin ? 'Use your existing account details.' : 'Join as a student or landlord.'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLogin ? 'bg-primary/10 text-primary' : 'bg-secondary-fixed/10 text-secondary-fixed'}`}>
              {isLogin ? 'Secure Login' : 'Quick Signup'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => (isLogin ? onLoginRoleChange('student') : onSignupRoleChange('student'))}
              className={`py-3 rounded-2xl font-bold transition-all ${((isLogin ? loginRole : signupRole) === 'student')
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => (isLogin ? onLoginRoleChange('landlord') : onSignupRoleChange('landlord'))}
              className={`py-3 rounded-2xl font-bold transition-all ${((isLogin ? loginRole : signupRole) === 'landlord')
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Landlord
            </button>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-2xl bg-error/10 text-error text-sm font-medium border border-error/20">
              {authError}
            </div>
          )}

          <form onSubmit={isLogin ? onLogin : onSignup} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 rounded-2xl bg-primary text-on-primary font-black text-lg hover-lift shadow-xl shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onGoogleAuth(isLogin ? loginRole : signupRole)}
              disabled={authLoading}
              className="w-full py-4 rounded-2xl bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-on-surface-variant">
            {isLogin ? (
              <button
                type="button"
                onClick={() => onViewChange('signup')}
                className="font-bold text-primary hover:underline"
              >
                Need an account? Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onViewChange('login')}
                className="font-bold text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
