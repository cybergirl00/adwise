'use client';

import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/auth/auth-form';
import { UserRole } from '@/lib/types';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as UserRole;

  return <AuthForm initialRole={role} mode="signup" />;
}