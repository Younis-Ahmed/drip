'use client'

import type { z } from 'zod'
import {
  InputOTP,
  InputOTPGroup,
  // InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'
import { emailSignIn } from '@/server/actions/email-signin'
import { loginSchema } from '@/types/login-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { AuthCard } from './auth-card'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)

  const { execute, status } = useAction(emailSignIn, {
    onSuccess({ data }) {
      if (data?.error)
        setError(data.error)
      if (data?.success)
        setSuccess(data.success)
      if (data?.twoFactor)
        setShowTwoFactor(true)
    },
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    execute(values)
  }

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backBtnHref="/auth/register"
      backBtnLabel="Don't have an account? Sign up"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action="">
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>We&apos;ve sent you a two factor code to your email.</FormLabel>
                      <FormControl>
                        <InputOTP disabled={status === 'executing'} {...field} maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="younis@gmail.com"
                            type="email"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormSuccess message={success ?? undefined} />
              <FormError message={error ?? undefined} />
              <Button className="my-3 px-0" size="sm" variant="link" asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn('w-full py-2', status === 'executing' ? 'animate-pulse' : '')}
            >
              {showTwoFactor ? 'Verify' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
