import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cabinId,
      cabinName,
      checkIn,
      checkOut,
      guests,
      nights,
      basePrice,
      cleaningFee,
      serviceFee,
      total,
      guestEmail,
      guestName,
      language = 'en'
    } = body;

    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron', // Romanian Lei
            product_data: {
              name: `${cabinName} - ${nights} night${nights > 1 ? 's' : ''}`,
              description: `Check-in: ${checkIn} | Check-out: ${checkOut} | Guests: ${guests}`,
              images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80'],
            },
            unit_amount: Math.round(basePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: 'Cleaning Fee',
              description: 'One-time cleaning fee',
            },
            unit_amount: Math.round(cleaningFee * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: 'Service Fee',
              description: 'Platform service fee',
            },
            unit_amount: Math.round(serviceFee * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cabins/${cabinId}`,
      customer_email: guestEmail,
      metadata: {
        cabinId,
        cabinName,
        checkIn,
        checkOut,
        guests: guests.toString(),
        nights: nights.toString(),
        basePrice: basePrice.toString(),
        cleaningFee: cleaningFee.toString(),
        serviceFee: serviceFee.toString(),
        total: total.toString(),
        guestName,
        language,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
