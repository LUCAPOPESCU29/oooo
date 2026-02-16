import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, guestName, guestEmail, message } = await req.json();

    if (!bookingId || !message) {
      return NextResponse.json(
        { error: 'Booking ID and message are required' },
        { status: 400 }
      );
    }

    // Verify booking exists
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, cabin_name, check_in, check_out')
      .eq('booking_reference', bookingId.toUpperCase())
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Store the message in special_requests field for admin to see
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        special_requests: message
      })
      .eq('booking_reference', bookingId.toUpperCase());

    if (updateError) {
      console.error('Error updating booking with message:', updateError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // In a production environment, you would also send an email to admin here
    // Example: await sendEmailToAdmin({ bookingId, guestName, guestEmail, message, booking });

    return NextResponse.json({
      success: true,
      message: 'Message sent to admin successfully'
    });
  } catch (error: any) {
    console.error('Contact admin error:', error);
    return NextResponse.json(
      { error: 'Failed to send message to admin' },
      { status: 500 }
    );
  }
}
