import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendBookingConfirmation } from '@/lib/resend';
import { getBookingConfirmationEmail } from '@/lib/email-templates';

function initStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('placeholder') || key.trim() === '') {
    return null;
  }
  try {
    return new Stripe(key, {
      apiVersion: '2026-01-28.clover',
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
}

const stripe = initStripe();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook endpoint called but Stripe is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Payment successful!', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      });

      // Send confirmation email
      try {
        const metadata = session.metadata!;
        const language = (metadata.language || 'en') as 'en' | 'ro';

        const emailData = {
          guestName: metadata.guestName,
          cabinName: metadata.cabinName,
          checkIn: metadata.checkIn,
          checkOut: metadata.checkOut,
          guests: parseInt(metadata.guests),
          nights: parseInt(metadata.nights),
          basePrice: parseFloat(metadata.basePrice),
          cleaningFee: parseFloat(metadata.cleaningFee),
          serviceFee: parseFloat(metadata.serviceFee),
          total: parseFloat(metadata.total),
          language,
        };

        const { subject, html } = getBookingConfirmationEmail(emailData);

        const emailResult = await sendBookingConfirmation(
          session.customer_email!,
          subject,
          html
        );

        if (emailResult.success) {
          console.log('Confirmation email sent successfully to:', session.customer_email);
        } else {
          console.error('Failed to send confirmation email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Error preparing confirmation email:', emailError);
      }

      // Example: Save to Supabase
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .insert({
      //     cabin_id: session.metadata.cabinId,
      //     guest_name: session.metadata.guestName,
      //     guest_email: session.customer_email,
      //     check_in: session.metadata.checkIn,
      //     check_out: session.metadata.checkOut,
      //     guests: parseInt(session.metadata.guests),
      //     total_price: session.amount_total / 100,
      //     stripe_payment_id: session.payment_intent,
      //     status: 'confirmed',
      //   });

      break;

    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded');
      break;

    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed');
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
