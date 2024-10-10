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
import { RegisterSchema } from '@/types/register-schema';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { emailRegister } from '@/server/actions/email-register';

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const { status, execute } = useAction(emailRegister, {
    onSuccess(data) {
      if ('success' in data) {
        console.log(data.success);
      }
    } 
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle='Create an account'
      backBtnHref='/auth/login'
      backBtnLabel='Already have an account? Login'
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action=''>
            <div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='john doe'
                        type='name'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='younis@gmail.com'
                        type='email'
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button size={'sm'} variant={'link'} asChild>
                <Link href='/auth/reset'>Forgot your password</Link>
              </Button>
            </div>
            <Button
              type='submit'
              className={cn('w-full py-2', status === 'executing' ? 'animate-pulse' : '')}
            >
              {'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
