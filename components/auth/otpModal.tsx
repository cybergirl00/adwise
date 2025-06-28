// components/auth/OtpModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';

export function OtpModal() {
  const {
    showOtpModal,
    setShowOtpModal,
    otpEmail,
    verifyOtp,
    resendOtp,
    isLoading,
  } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await verifyOtp(otp);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp();
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  if (!showOtpModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Verify Your Email</h2>
          <button 
            onClick={() => setShowOtpModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          We've sent a 6-digit code to <strong>{otpEmail}</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value.slice(0, 6));
                }}
                placeholder="Enter 6-digit code"
                className="text-center text-xl tracking-widest h-12"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}
            
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                Resend Code
              </button>
              
              <Button 
                type="submit" 
                disabled={isLoading || otp.length !== 6}
                className="px-6"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}