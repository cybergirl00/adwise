'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/zustand';
import { getAppdata, getUserbyId } from '@/actions/users.actions';
import { User, UserRole } from '@/lib/types';
import { getCreatorsRequest } from '@/actions/campaign.actions';
import { getPartners } from '@/actions/messages.actions';
import { getUserApps } from '@/actions/app.actions';

interface DashboardContextType {
  user: User | null;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { userdata, setUser } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!clerkLoaded) return;

      setIsLoading(true);

      try {
        if (clerkUser) {
          const response = await getUserbyId({ clerkId: clerkUser.id });

          const request = await getCreatorsRequest(  clerkUser?.id)

          const partners = await getPartners({clerkId: clerkUser?.id})

          const apps = await getUserApps({ clerkId: clerkUser?.id})

          const userdata = await getAppdata(clerkUser?.id)

          console.log('This is user data', userdata?.data.data)
          
          if (response?.status === 200) {
            const mappedUser: User = {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              firstName: clerkUser.firstName || '',
              lastName: clerkUser.lastName || '',
              role: (clerkUser.unsafeMetadata?.role as UserRole) || 'creator',
              userType: clerkUser.unsafeMetadata?.userType as number || 0,
              avatar: response.data.user.imageUrl ,
              clerkId: clerkUser.id,
              balance: response.data.user.balance || 0,
              specialties: response.data.user.specialties || [],
              bio: response.data.user.bio,
              portfolio: response.data.user.portfolio,
              rate: response.data.user.rate,
              profile: response.data.user.profile,
              requests: request?.data?.data,
              partners: partners?.data.data,
              apps: apps?.data.data,
              userData: userdata?.data.data
            };
            setUser(mappedUser);
          } else {
            setUser(null);
            router.push('/auth');
          }
        } else {
          setUser(null);
          router.push('/auth');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setUser(null);
        router.push('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [clerkUser, clerkLoaded, router, setUser]);

  // Protect dashboard routes
  useEffect(() => {
    if (!isLoading && !userdata && clerkLoaded) {
      router.push('/auth');
    }
  }, [userdata, isLoading, clerkLoaded, router]);

  return (
    <DashboardContext.Provider value={{ user: userdata, isLoading }}>
      {!isLoading && userdata ? children : null}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}