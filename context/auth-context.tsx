'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { useSignUp, useSignIn, useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/zustand';
import { getUserbyId } from '@/actions/users.actions';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  showOtpModal: boolean;
  setShowOtpModal: (show: boolean) => void;
  otpEmail: string;
  verifyOtp: (code: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  tempUserData: { firstName: string; lastName: string; role: UserRole } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
   const [tempUserData, setTempUserData] = useState<{ firstName: string; lastName: string; role: UserRole } | null>(null);

     const { userdata: user, setUser } = useUserStore()
  
  const { signUp, isLoaded: isSignUpLoaded, setActive: setActiveSignUp } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded, setActive: setActiveSignIn } = useSignIn();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // const router = useRouter();



  useEffect(() => {
    const loadUserData = async () => {
      if (clerkUser) {
        try {
          const response = await getUserbyId({ clerkId: clerkUser.id });
          
          if (response?.status === 200) {
            const mappedUser: User = {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              firstName: clerkUser.firstName || '',
              lastName: clerkUser.lastName || '',
              role: (clerkUser.unsafeMetadata?.role as UserRole) || 'creator',
              userType: clerkUser.unsafeMetadata?.userType as number || 0,
              avatar: response.data.user.imageUrl || getDefaultAvatar((clerkUser.unsafeMetadata?.role as UserRole) || 'creator'),
              clerkId: clerkUser.id,
              balance: response.data.user.balance || 0,
              specialties: response.data.user.specialties || [],
              bio: response.data.user.bio,
              portfolio: response.data.user.portfolio,
              rate: response.data.user.rate,
              profile: response.data.user.profile
            };
            setUser(mappedUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [clerkUser, setUser]);

  const getDefaultAvatar = (role: UserRole) => {
    return role === 'developer' 
      ? 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      : role === 'business'
      ? 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    if (!isSignUpLoaded) return;
    setIsLoading(true);
    
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      const userType = {
        'business': 1,
        'developer': 2,
        'creator': 3
      }[role] || 0;

      await signUp.update({
        unsafeMetadata: { role, userType }
      });

      setOtpEmail(email);
      setTempUserData({ firstName, lastName, role });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setShowOtpModal(true);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!isSignInLoaded) return;
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
        
      });
      console.log(result)

      if(result.status === 'complete') {
        setActiveSignIn({ session: result.createdSessionId })
        router.push('/dashboard')
      }
      
      // if (result.status === 'needs_first_factor') {
      //   setOtpEmail(email);
      //   setShowOtpModal(true);
      // }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      if (signUp) {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });
        
        if (completeSignUp.status === 'complete') {
          // if (tempUserData) {
          //   await signUp.update({
          //     firstName: tempUserData.name,
          //     unsafeMetadata: { role: tempUserData.role }
          //   });
          // }
          await setActiveSignUp({ session: completeSignUp.createdSessionId });
          setShowOtpModal(false);
          setTempUserData(null);
          router.push('/dashboard');
        }
      } else if (signIn) {
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        });
        
        if (completeSignIn.status === 'complete') {
          await setActiveSignIn({ session: completeSignIn.createdSessionId });
          setShowOtpModal(false);

          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      if (signUp) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else if (signIn) {
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: otpEmail
        });
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading,
      showOtpModal,
      setShowOtpModal,
      otpEmail,
      verifyOtp,
      resendOtp,
      tempUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}



export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}