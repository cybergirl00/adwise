'use client';

import { useRouter } from 'next/navigation';
import Hero from '@/components/landing/hero';
import { UserRole } from '@/lib/types';

export default function Home() {
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    router.push(`/auth?role=${role}`);
  };

  return <Hero onRoleSelect={handleRoleSelect} />;
}