'use server'

import process from 'node:process'
import { EmailTemplate } from '@/components/ui/email-template'
import getBaseURL from '@/lib/base-url'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESNED_API_KEY)
const domain = getBaseURL()

export async function sendTwoFactorTokenByEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: process.env.EMAIL || email,
    subject: 'Drip - Two Factor Token',
    react: EmailTemplate({
      confirmLink,
      title: 'Hi There',
      linkContent: 'Click here to confirm your email address',
    }),
  })

  if (error) {
    return console.error(JSON.stringify(error), `from email.ts line 41`)
  }

  return data
}

export async function sendVerficationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: process.env.EMAIL || email,
    subject: 'Drip - Confirmation Email',
    react: EmailTemplate({
      confirmLink,
      title: 'Hi There',
      linkContent: 'Click here to confirm your email address',
    }),
  })

  if (error) {
    return console.error(JSON.stringify(error), `from email.ts line 41`)
  }

  return data
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-password?token=${token}`
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: process.env.EMAIL!,
    subject: 'Drip - Confirmation Email',
    react: EmailTemplate({
      confirmLink,
      title: 'Hi There',
      linkContent: 'Click here to reset your password',
    }),
  })

  if (error) {
    return console.error(JSON.stringify(error), `from email.ts line 41`)
  }

  return data
}
