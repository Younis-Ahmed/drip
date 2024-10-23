'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../ui/form';
import { AuthCard } from './auth-card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { newPasswordSchema } from '@/types/new-password-schema';
import { newPassword } from '@/server/actions/new-password-form';

export const NewPassowordForm = () => {
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { execute, status } = useAction(newPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle='Enter a new password'
      backBtnHref='/auth/login'
      backBtnLabel="Back to login"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action=''>
            <div>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='********'
                        type='password'
                        autoComplete='current-password'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success ?? undefined} />
              <FormError message={error ?? undefined} />
              <Button size={'sm'} variant={'link'} asChild>
                <Link href='/auth/reset'>Forgot your password</Link>
              </Button>
            </div>
            <Button
              type='submit'
              className={cn('w-full py-2', status === 'executing' ? 'animate-pulse' : '')}
            >
              {'Reset Password'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
