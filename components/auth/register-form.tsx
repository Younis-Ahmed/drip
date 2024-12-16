'use client'

import type { z } from 'zod'
import { cn } from '@/lib/utils'
import { emailRegister } from '@/server/actions/email-register'
import { RegisterSchema } from '@/types/register-schema'
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

export function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  type DataResponse =
    | { success: string, error?: undefined }
    | { error: string, success?: undefined }
    | undefined

  const isErrorResponse = (data: DataResponse): data is { error: string } => {
    return !!data && typeof data.error === 'string'
  }

  const isSuccessResponse = (data: DataResponse): data is { success: string } => {
    return !!data && typeof data.success === 'string'
  }

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { status, execute } = useAction(emailRegister, {
    onSuccess({ data }) {
      if (isErrorResponse(data)) {
        setError(data.error)
      }
      else if (isSuccessResponse(data)) {
        setSuccess(data.success)
      }
    },
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values)
  }

  return (
    <AuthCard
      cardTitle="Create an account"
      backBtnHref="/auth/login"
      backBtnLabel="Already have an account? Login"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action="">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john doe" type="name" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
