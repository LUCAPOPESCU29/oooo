import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Query booking from database
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_reference', bookingId.toUpperCase())
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found. Please check your booking ID and try again.' },
        { status: 404 }
      );
    }

    // Return booking details
    return NextResponse.json({
      success: true,
      booking: {
        bookingReference: booking.booking_reference,
        cabinName: booking.cabin_name,
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        guestPhone: booking.guest_phone,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        nights: booking.nights,
        basePrice: booking.base_price,
        cleaningFee: booking.cleaning_fee,
        serviceFee: booking.service_fee,
        total: booking.total,
        status: booking.status,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
        specialRequests: booking.special_requests || ''
      }
    });
  } catch (error: any) {
    console.error('Booking lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve booking information' },
      { status: 500 }
    );
  }
}
