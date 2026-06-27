import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  User,
  Lock,
  Mail,
  ChevronRight,
  Info,
  Check,
  HelpCircle,
  BookOpen,
  Globe,
  Phone,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { User as UserType, Role } from '../types';
import { API_URL } from '../data/dbStore';

interface LoginViewProps {
  users: UserType[];
  onLogin: (email: string, passwordHash: string) => boolean;
  onRegister: (name: string, email: string, passwordHash: string, role: Role) => void;
  onGoogleLogin: (email: string, name?: string, role?: Role) => boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}

export default function LoginView({ users, onLogin, onRegister, onGoogleLogin, errorMsg, setErrorMsg }: LoginViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [rememberMe, setRememberMe] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Google SSO state variables
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<'account_select' | 'new_profile_setup' | 'submitting'>('account_select');
  const [googleSelectedEmail, setGoogleSelectedEmail] = useState('');
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [googleCustomRole, setGoogleCustomRole] = useState<Role>('STUDENT');
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Suggested Google Accounts list matching existing seed users
  const googlePredefinedAccounts = [
    { email: 'admin@college.edu', name: 'Dr. Jane Admin', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
    { email: 'turing@college.edu', name: 'Prof. Alan Turing', role: 'TEACHER', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    { email: 'john@college.edu', name: 'John Doe', role: 'STUDENT', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' }
  ];

  const handleGoogleAccountSelect = (selectedEmail: string, selectedName?: string, selectedRole?: Role) => {
    setGoogleError(null);
    const emailLower = selectedEmail.toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === emailLower);

    if (existing) {
      // Sign in directly
      setGoogleStep('submitting');
      setTimeout(() => {
        onGoogleLogin(existing.email, existing.name, existing.role);
        setShowGoogleModal(false);
      }, 800);
    } else {
      // First time Google user -> Profile setup step
      setGoogleSelectedEmail(emailLower);
      setGoogleCustomName(selectedName || '');
      setGoogleCustomRole(selectedRole || 'STUDENT');
      setGoogleStep('new_profile_setup');
    }
  };

  const handleGoogleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError(null);
    if (!googleCustomEmail) {
      setGoogleError('Please enter a valid Google account email.');
      return;
    }
    const emailLower = googleCustomEmail.trim().toLowerCase();
    // Validate email format basic
    if (!emailLower.includes('@')) {
      setGoogleError('Please enter a valid email address.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === emailLower);
    if (existing) {
      // Log in directly
      setGoogleStep('submitting');
      setTimeout(() => {
        onGoogleLogin(existing.email, existing.name, existing.role);
        setShowGoogleModal(false);
      }, 800);
    } else {
      // First time Google user -> Profile setup step
      setGoogleSelectedEmail(emailLower);
      setGoogleCustomName('');
      setGoogleCustomRole('STUDENT');
      setGoogleStep('new_profile_setup');
    }
  };

  const handleGoogleProfileCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError(null);
    if (!googleCustomName.trim()) {
      setGoogleError('Please enter your full name to complete your profile.');
      return;
    }

    setGoogleStep('submitting');
    setTimeout(() => {
      onGoogleLogin(googleSelectedEmail, googleCustomName.trim(), googleCustomRole);
      setShowGoogleModal(false);
    }, 800);
  };

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'none' | 'input' | 'success'>('none');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isRegistering) {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all registration fields.');
        return;
      }
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg('This academic email address is already registered.');
        return;
      }
      onRegister(name, email, password, role);
      setSuccessMsg(`Institutional account registration submitted! Awaiting administrator approval.`);
      setIsRegistering(false);
      setPassword('');
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter your credentials to log in.');
        return;
      }

      // Real university role checking and validation helper
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched && matched.role !== role) {
        setErrorMsg(`Access denied: The account is registered as ${matched.role}. Please select the matching role tab above.`);
        return;
      }

      try {
        const res = await fetch(API_URL + "/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          window.location.reload();
        } else {
          setErrorMsg(data.message);
        }
      } catch (err) {
        setErrorMsg("Server not responding");
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStep('success');
  };

  const hasAdmin = users.some(u => u.role === 'ADMIN');

  return (
    <div className="min-h-screen w-full bg-[#070b15] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Decorative ambient background lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* LEFT COLUMN: Campus Information Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0c1223] border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* University Header */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-widest uppercase">Smart Campus</h1>
            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase leading-none">University Systems</p>
          </div>
        </div>

        {/* Central Information Widget */}
        <div className="z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold tracking-wide">
              Official ERP Portal
            </span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Unified Academic Administration & Governance
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Welcome to the central command hub of Smart Campus University. Securely manage course catalogs, timetables, academic evaluations, and direct teacher-student communications.
            </p>
          </div>

          {/* Institutional Highlights */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-200">Session 2026-2027 Calendar Live</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">Midterm schedules, class timetables, and session parameters are fully updated for the Fall Semester.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-200">Institutional SSO Active</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">Your access is encrypted using state-of-the-art token security. Avoid sharing credentials under any circumstances.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact Footer */}
        <div className="z-10 text-xs text-slate-500 space-y-2">
          <p>© {new Date().getFullYear()} Smart Campus University. Authorized personnel only.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Login Box Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-md space-y-8">

          {/* Logo on Mobile (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-black text-white tracking-widest uppercase">Smart Campus</h1>
              <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase leading-none">University Systems</p>
            </div>
          </div>

          {/* Heading Section */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Please sign in with your institutional credentials to access your portal.</p>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-300 rounded-xl text-xs font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 rounded-xl text-xs font-semibold leading-relaxed">
              {successMsg}
            </div>
          )}

          {forgotStep === 'none' ? (
            <div className="space-y-6">

              {/* Role Selection Segmented Control */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center lg:text-left">
                  SELECT INSTITUTIONAL REALM
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-slate-800">
                  {([
                    { value: 'STUDENT', label: 'Student', icon: User },
                    { value: 'TEACHER', label: 'Teacher', icon: BookOpen },
                    { value: 'ADMIN', label: 'Admin', icon: Shield }
                  ] as const).map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all gap-1 cursor-pointer select-none ${isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`} />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secure Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {isRegistering && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Full Academic Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="YOUR NAME"
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    {role === 'STUDENT' ? 'Student Email / Roll ID' : 'Institutional Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOUR MAIL"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Portal Access Password
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                {!isRegistering && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
                      />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setForgotStep('input'); setErrorMsg(null); setSuccessMsg(null); }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer active:scale-[0.99]"
                >
                  <span>{isRegistering ? 'Register Access Profile' : 'Sign In'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Google Sign In Removed */}
            </div>
          ) : forgotStep === 'input' ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-100">Reset Portal Password</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Enter your registered academic email address below. We will send you instructions to safely reset your password credentials.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="YOUR MAIL"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep('none')}
                  className="flex-1 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Return to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-5 bg-slate-900/30 p-8 rounded-3xl border border-slate-800/80">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/25">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-100">Recovery Instructions Sent</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We've successfully processed your request. Please check your inbox at <span className="font-semibold text-slate-200">{forgotEmail}</span> to securely finalize your recovery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setForgotStep('none'); setForgotEmail(''); }}
                className="w-full py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Back to Login Screen
              </button>
            </div>
          )}

          {/* Toggle Login/Registration Mode */}
          <div className="border-t border-slate-800/50 pt-6">
            <p className="text-center text-xs text-slate-400">
              {isRegistering ? (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(false); setErrorMsg(null); setSuccessMsg(null); }}
                    className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    Return to Login
                  </button>
                </>
              ) : (
                <>
                  New teacher, staff or student?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(true); setErrorMsg(null); setSuccessMsg(null); }}
                    className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    Activate / Register Account
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Mobile Footer (Hidden on Desktop) */}
          <div className="lg:hidden text-center text-[11px] text-slate-500 pt-4">
            <p>© {new Date().getFullYear()} Smart Campus University.</p>
          </div>

        </div>
      </div>

      {/* GOOGLE ACCOUNTS AUTHENTICATION MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col relative">

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Google Logo */}
            <div className="pt-8 pb-4 flex flex-col items-center">
              <svg className="w-10 h-10 mb-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>

              {googleStep === 'account_select' && (
                <>
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">Sign in with Google</h3>
                  <p className="text-sm text-slate-500 mt-1">to continue to Smart Campus ERP</p>
                </>
              )}

              {googleStep === 'new_profile_setup' && (
                <>
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">Set up your ERP Profile</h3>
                  <p className="text-sm text-slate-500 mt-1">First-time Google Sign-In registration</p>
                </>
              )}

              {googleStep === 'submitting' && (
                <>
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">Connecting account...</h3>
                  <p className="text-sm text-slate-500 mt-1">Verifying institutional credentials</p>
                </>
              )}
            </div>

            {/* Error Message inside Google Modal */}
            {googleError && (
              <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium leading-relaxed">
                {googleError}
              </div>
            )}

            {/* STEP 1: ACCOUNT SELECTION */}
            {googleStep === 'account_select' && (
              <div className="px-6 pb-8 flex-1 flex flex-col justify-between">
                <div>
                  {!showCustomEmailInput ? (
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                      {googlePredefinedAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => handleGoogleAccountSelect(acc.email, acc.name, acc.role as Role)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={acc.avatar}
                              alt={acc.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{acc.name}</p>
                              <p className="text-xs text-slate-500">{acc.email}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider ${acc.role === 'ADMIN' ? 'bg-red-50 text-red-700 border border-red-200' :
                              acc.role === 'TEACHER' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                            {acc.role}
                          </span>
                        </button>
                      ))}

                      {/* Use Custom Email Button */}
                      <button
                        type="button"
                        onClick={() => setShowCustomEmailInput(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-left cursor-pointer text-slate-600 hover:text-slate-900"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Use another account</p>
                          <p className="text-xs text-slate-400">Sign in with any other Google email</p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleGoogleCustomEmailSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Email or phone
                        </label>
                        <input
                          type="email"
                          required
                          value={googleCustomEmail}
                          onChange={(e) => setGoogleCustomEmail(e.target.value)}
                          placeholder="YOUR MAIL"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => { setShowCustomEmailInput(false); setGoogleError(null); }}
                          className="flex-1 py-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Back to Accounts
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 leading-relaxed">
                  To continue, Google will share your name, email address, language preference, and profile picture with Smart Campus ERP.
                </div>
              </div>
            )}

            {/* STEP 2: PROFILE SETUP (FIRST TIME GOOGLE USER) */}
            {googleStep === 'new_profile_setup' && (
              <form onSubmit={handleGoogleProfileCompleteSubmit} className="px-6 pb-8 space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 leading-relaxed">
                  Authorized as <strong className="text-emerald-950 font-bold">{googleSelectedEmail}</strong>. Complete the enrollment form below to establish your profile.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="YOUR NAME"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Your Institutional Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'STUDENT', label: 'Student' },
                      { value: 'TEACHER', label: 'Teacher' },
                      { value: 'ADMIN', label: 'Admin' }
                    ] as const).map((r) => {
                      const isSelected = googleCustomRole === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setGoogleCustomRole(r.value)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                            }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => { setGoogleStep('account_select'); setGoogleError(null); }}
                    className="flex-1 py-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Complete Sign In
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUBMITTING / LOADER */}
            {googleStep === 'submitting' && (
              <div className="px-6 pb-12 pt-4 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-700">Synchronizing database handshake...</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
