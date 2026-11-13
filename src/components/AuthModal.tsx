import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Package, 
  MapPin, 
  ArrowRight,
  UserPlus,
  LogIn,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, Order } from '../types';
import { useLanguage } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  orders: Order[];
  onUpdateUser: (user: UserProfile) => void;
  onOpenTrackOrder: () => void;
  onReorder?: (order: Order) => void;
}

interface StoredAccount {
  name: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  onUpdateUser,
  onOpenTrackOrder,
  onReorder,
}) => {
  const { t } = useLanguage();
  // Modes: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback / Error messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Retrieve saved accounts from localStorage
  const getRegisteredUsers = (): StoredAccount[] => {
    try {
      const saved = localStorage.getItem('tejas_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Save account to localStorage
  const saveRegisteredUser = (account: StoredAccount) => {
    try {
      const users = getRegisteredUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === account.email.toLowerCase());
      if (existingIdx >= 0) {
        users[existingIdx] = account;
      } else {
        users.push(account);
      }
      localStorage.setItem('tejas_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Login with Email & Password
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const registeredUsers = getRegisteredUsers();
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      // Check password
      if (existingUser.password !== loginPassword) {
        setErrorMessage('Incorrect password. Please verify and try again.');
        return;
      }
      // Successful login for registered user
      onUpdateUser({
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone || '',
        isLoggedIn: true,
        savedAddress: 'Suriyawan, Bhadohi, Uttar Pradesh - 221404',
      });
      setSuccessMessage('Welcome back! Logging you in...');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      // Allow instant access with entered credentials and register them
      const derivedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ') || 'Valued Customer';
      const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      
      const newAccount: StoredAccount = {
        name: capitalized,
        email: cleanEmail,
        password: loginPassword,
        createdAt: new Date().toISOString(),
      };
      saveRegisteredUser(newAccount);

      onUpdateUser({
        name: capitalized,
        email: cleanEmail,
        phone: '',
        isLoggedIn: true,
        savedAddress: 'Suriyawan, Bhadohi, Uttar Pradesh - 221404',
      });
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  // Handle New Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regFullName.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    const registeredUsers = getRegisteredUsers();
    const alreadyExists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);

    if (alreadyExists) {
      setErrorMessage('An account with this email already exists. Please sign in instead.');
      return;
    }

    // Create and save new account
    const newAccount: StoredAccount = {
      name: cleanName,
      email: cleanEmail,
      phone: regPhone.trim(),
      password: regPassword,
      createdAt: new Date().toISOString(),
    };
    saveRegisteredUser(newAccount);

    // Update logged in user profile
    onUpdateUser({
      name: cleanName,
      email: cleanEmail,
      phone: regPhone.trim(),
      isLoggedIn: true,
      savedAddress: 'Suriyawan, Bhadohi, Uttar Pradesh - 221404',
    });

    setSuccessMessage('Account created successfully! Welcome to Tejas Spices.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleLogout = () => {
    onUpdateUser({
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
    });
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                {user.isLoggedIn ? (
                  <User className="w-4 h-4" />
                ) : mode === 'login' ? (
                  <LogIn className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {user.isLoggedIn
                    ? 'My Account Profile'
                    : mode === 'login'
                    ? 'Sign In (लॉगिन करें)'
                    : 'Create Account (नया रजिस्ट्रेशन)'}
                </h2>
                <div className="text-[11px] text-slate-500 font-medium">
                  {user.isLoggedIn
                    ? 'Tejas Spices Member'
                    : mode === 'login'
                    ? 'Login with Email & Password'
                    : 'Register with Email & Password'}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {user.isLoggedIn ? (
              /* LOGGED IN USER PROFILE VIEW */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    {user.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                    <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{user.email || 'No email registered'}</span>
                    </p>
                    {user.phone && (
                      <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{user.phone}</span>
                      </p>
                    )}
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-1.5">
                      Verified Member · 10% Coupon Active
                    </span>
                  </div>
                </div>

                {/* Default delivery info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Default Delivery Zone</span>
                  </div>
                  <p className="pl-5 text-slate-600">Suriyawan, Bhadohi, Uttar Pradesh - 221404</p>
                </div>

                {/* Orders History Summary with 1-Tap Reorder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{t(`Recent Orders (${orders.length})`, `पिछले ऑर्डर (${orders.length})`)}</span>
                    <button onClick={onOpenTrackOrder} className="text-emerald-700 hover:text-emerald-800 underline cursor-pointer">
                      {t('Track Live', 'लाइव ट्रैक करें')}
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-2 max-h-60 overflow-y-auto space-y-1">
                    {orders.length === 0 ? (
                      <div className="text-xs text-slate-400 text-center py-3">
                        {t('No orders placed yet.', 'अभी तक कोई ऑर्डर नहीं है।')}
                      </div>
                    ) : (
                      orders.map((ord) => (
                        <div key={ord.orderId} className="py-2.5 px-2 flex flex-col gap-1.5 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-slate-900">#{ord.orderId}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize font-semibold">
                                  {ord.status.replace(/_/g, ' ')}
                                </span>
                                {ord.paymentVerified && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    UPI Paid
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                {ord.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                              </div>
                            </div>
                            <span className="font-mono font-extrabold text-emerald-700 shrink-0">
                              ₹{ord.total}
                            </span>
                          </div>

                          {onReorder && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => onReorder(ord)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{t('1-Tap Reorder', 'दोबारा ऑर्डर करें')}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {t('Log Out (खाते से बाहर निकलें)', 'लॉग आउट करें')}
                </button>
              </div>
            ) : (
              /* AUTHENTICATION FORMS: SIGN IN vs REGISTER */
              <div className="space-y-4">
                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In (लॉगिन)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    New User (नया रजिस्ट्रेशन)
                  </button>
                </div>

                {/* Inline Alert / Feedback */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* MODE 1: LOGIN FORM */}
                {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Email Address (ईमेल)</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Password (पासवर्ड)</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-slate-50 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In with Email</span>
                    </button>

                    <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                      <span>Don't have an account yet? </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage('');
                        }}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer ml-1"
                      >
                        New Registration (नया खाता बनाएं)
                      </button>
                    </div>
                  </form>
                ) : (
                  /* MODE 2: REGISTER FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Full Name (पूरा नाम)</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Email Address (ईमेल)</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Create Password (पासवर्ड)</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min. 4 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3.5 py-2 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mobile Number (फोन नंबर)</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">वैकल्पिक (Optional)</span>
                      </div>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-xs font-bold font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="98765 43210 (Optional)"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-r-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account & Sign In</span>
                    </button>

                    <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                      <span>Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMessage('');
                        }}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer ml-1"
                      >
                        Sign In (लॉगिन करें)
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
