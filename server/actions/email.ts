"use server"

import { EmailTemplate } from "@/components/ui/email-template";
import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESNED_API_KEY);
const domain = getBaseURL();

export const sendVerficationEmail = async (email: string, token: string) => {

    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [email],
        subject: 'Drip - Confirmation Email',
        react: EmailTemplate({ confirmLink }),
      });
    
      if (error) {
        return console.error(`${error} from email.ts line 41`);
      }
    
      return data;

};