'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/auth/auth-form';
import { UserRole } from '@/lib/types';

function AuthFormWrapper() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as UserRole;

  return <AuthForm initialRole={role} />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFormWrapper />
    </Suspense>
  );
}