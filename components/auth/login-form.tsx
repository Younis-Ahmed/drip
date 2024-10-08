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
import { loginSchema } from '@/types/login-schema';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
  };

  return (
    <AuthCard
      cardTitle='Welcome back!'
      backBtnHref='/auth/register'
      backBtnLabel="Don't have an account? Sign up"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action=''>
            <div >
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
            <Button type='submit' className='w-full my-2'>{'Login'}</Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
