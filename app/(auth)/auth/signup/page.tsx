'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/auth/auth-form';
import { UserRole } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

function SignUpForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as UserRole;

  return <AuthForm initialRole={role} mode="signup" />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}