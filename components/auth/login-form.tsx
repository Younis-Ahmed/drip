'use client';

import { AuthCard } from './auth-card';

export const LoginForm = () => {
  return (
    <AuthCard
      cardTitle='Welcome back!'
      backBtnHref='/auth/register'
      backBtnLabel="Don't have an account? Sign up"
      showSocials={true}
    >
      <div>
      </div>
    </AuthCard>
  );
};
