'use client'

import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { reset } from '@/server/actions/password-reset'
import { ResetSchema } from '@/types/reset-schema'
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

export function ResetForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { execute, status } = useAction(reset, {
    onSuccess({ data }) {
      if (data?.error)
        setError(data.error)
      if (data?.success)
        setSuccess(data.success)
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values)
  }

  return (
    <AuthCard
      cardTitle="Forgot your password?"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="younis@example.com"
                        type="email"
                        disabled={status === 'executing'}
                        autoComplete="email"
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
