import React, { useState } from 'react';
import { X, User, Phone, Mail, CheckCircle2, Package, MapPin } from 'lucide-react';
import { UserProfile, Order } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  orders: Order[];
  onUpdateUser: (user: UserProfile) => void;
  onOpenTrackOrder: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  onUpdateUser,
  onOpenTrackOrder,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: fullName || 'Valued Customer',
      phone: phoneNumber,
      email: email || 'customer@example.com',
      isLoggedIn: true,
      savedAddress: 'Suriyawan, Bhadohi, Uttar Pradesh - 221404',
    });
    setStep('form');
    onClose();
  };

  const handleLogout = () => {
    onUpdateUser({
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {user.isLoggedIn ? 'My Account Profile' : 'Sign In to Tejas Spices'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {user.isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                    <p className="text-xs text-slate-600">{user.phone}</p>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Verified Member (10% Discount Active)
                    </span>
                  </div>
                </div>

                {/* Orders History Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Recent Orders ({orders.length})</span>
                    <button onClick={onOpenTrackOrder} className="text-emerald-700 underline cursor-pointer">
                      Track Live
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-2 max-h-40 overflow-y-auto">
                    {orders.map((ord) => (
                      <div key={ord.orderId} className="py-2 px-1 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-mono font-bold text-slate-900">#{ord.orderId}</div>
                          <div className="text-[10px] text-slate-400">{ord.status.replace('_', ' ')}</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">₹{ord.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : step === 'form' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Enter your mobile number to receive instantaneous OTP login and view your spice orders.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-xs font-bold font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-r-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Continue with OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  📱
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enter Verification Code</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter any 4-digit code to log in as {phoneNumber}
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-32 mx-auto text-center tracking-[0.5em] text-lg font-bold py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono"
                />

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Verify & Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
