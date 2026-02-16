import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, newCheckIn, newCheckOut, message } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get the booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_reference', bookingId.toUpperCase())
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Create a date change request in the database
    const { error: insertError } = await supabaseAdmin
      .from('date_change_requests')
      .insert({
        booking_reference: bookingId.toUpperCase(),
        original_check_in: booking.check_in,
        original_check_out: booking.check_out,
        requested_check_in: newCheckIn,
        requested_check_out: newCheckOut,
        message: message || null,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        cabin_name: booking.cabin_name,
        status: 'pending'
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit change request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Change request submitted successfully. An admin will contact you soon.'
    });
  } catch (error: any) {
    console.error('Change request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit change request' },
      { status: 500 }
    );
  }
}
