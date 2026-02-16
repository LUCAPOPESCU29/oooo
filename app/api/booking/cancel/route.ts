import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('booking_reference', bookingId.toUpperCase())
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to cancel booking. Please check your booking ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
