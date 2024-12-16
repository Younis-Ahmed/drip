'use client'

import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { newPassword } from '@/server/actions/new-password-form'
import { newPasswordSchema } from '@/types/new-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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

export function NewPassowordForm() {
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { execute, status } = useAction(newPassword, {
    onSuccess({ data }) {
      if (data?.error)
        setError(data.error)
      if (data?.success)
        setSuccess(data.success)
    },
  })

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    execute({
      password: values.password,
      token,
    })
  }

  return (
    <AuthCard
      cardTitle="Enter a new password"
      backBtnHref="/auth/login"
      backBtnLabel="Back to login"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action="">
            <div>
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
                        disabled={status === 'executing'}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success ?? undefined} />
              <FormError message={error ?? undefined} />
              <Button size="sm" variant="link" asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn('w-full py-2', status === 'executing' ? 'animate-pulse' : '')}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
