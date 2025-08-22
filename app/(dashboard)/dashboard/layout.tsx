'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Sidebar from '@/components/dashboard/sidebar';
import { useClerk } from '@clerk/nextjs';
import { DashboardProvider } from '@/context/dashboard-context';
import { adwise, AdwiseClientProvider } from 'adwisesdk'
import { Button } from '@/components/ui/button';
import { AdBanner } from 'adwisesdk';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { isSignedIn, loaded } = useClerk();
  const router = useRouter();


  // useEffect(() => {
  //   if (!loaded && !isSignedIn) {
  //     router.push('/auth');
  //   }
  // }, [user, isLoading, router, loaded]);

//   useEffect(() => {
//   const initClient = async () => {
//     const client = await adwise._init({
//       apiKey: "ad_live_befd4e720_3efbff69d"
//     });
//     client.initiatePop();
//   };

//   initClient();
// }, []);

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (loaded && !user) {
  //  router.push('/auth');
  // }

  return (
    <DashboardProvider>
      {/* <AdwiseClientProvider apiKey='ad_live_befd4e720_3efbff69d'> */}
    <div className="min-h-screen  flex">
      <Sidebar />
      <main className="flex-1 md:ml-0 ml-0">
        <div className="p-6 md:p-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
{/* </AdwiseClientProvider> */}
    </DashboardProvider>
  );
}