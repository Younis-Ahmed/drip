import { Buffer } from 'buffer'
import process from 'process'
import { db } from '@/server'
import { orders } from '@/server/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
  })
  const sig = req.headers.get('stripe-signature') || ''
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  // Read the request body as text
  const reqText = await req.text()
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText)

  let event


  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
  }
  catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
      errorMessage = 'Signature verification failed';
    } else if (err instanceof Stripe.errors.StripeInvalidRequestError) {
      errorMessage = 'Invalid request';
    } else if (err instanceof Stripe.errors.StripeAPIError) {
      errorMessage = 'Stripe API error';
    } else if (err instanceof Stripe.errors.StripeAuthenticationError) {
      errorMessage = 'Authentication error';
    } else if (err instanceof Stripe.errors.StripeRateLimitError) {
      errorMessage = 'Rate limit exceeded';
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    return new NextResponse(`Webhook Error: ${errorMessage}`, {
      status: 400,
    });
  }

  // Handle the event just an example!
  switch (event.type) {
    case 'payment_intent.succeeded':
    { const retrieveOrder = await stripe.paymentIntents.retrieve(
      event.data.object.id,
      { expand: ['latest_charge'] },
    )
    const charge = retrieveOrder.latest_charge as Stripe.Charge

    const customer = await db
      .update(orders)
      .set({
        status: 'succeeded',
        receiptURL: charge.receipt_url,
      })
      .where(eq(orders.paymentIntentId, event.data.object.id))
      .returning()

    console.log(`PaymentIntent for ${customer[0]} succeeded`)

    // Then define and call a function to handle the event product.created
    break }

    default:
      console.log(`${event.type}`)
  }

  return new Response('ok', { status: 200 })
}
