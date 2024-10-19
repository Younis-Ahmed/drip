'use client';

import { newVerification } from '@/server/actions/tokens';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthCard } from './auth-card';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';

export const EmailVerificationForm = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerification = useCallback(() => {
    if (success || error) {
      return;
    }
    if (!token) {
      setError('No token found');
      return;
    }
    newVerification(token).then(response => {
      if (response.error) {
        setError(response.error);
      }
      if (response.success) {
        setSuccess(response.success);
        router.push('/auth/login');
      }
    });
  }, [error, router, success, token]);

  useEffect(() => {
    handleVerification();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthCard backBtnLabel='Back to login' backBtnHref='/auth/login' cardTitle='Verify your email'>
      <div className='flex w-full flex-col items-center justify-center'>
        <p>{!success && !error ? 'Verifying email...' : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
