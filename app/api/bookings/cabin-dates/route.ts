import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cabinName = searchParams.get('cabinName');

    if (!cabinName) {
      return NextResponse.json(
        { error: 'Cabin name is required' },
        { status: 400 }
      );
    }

    // Query all confirmed bookings for this cabin
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('check_in, check_out')
      .eq('cabin_name', cabinName)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      console.error('Error fetching cabin bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cabin bookings' },
        { status: 500 }
      );
    }

    // Generate array of all booked dates
    const bookedDates: string[] = [];

    bookings?.forEach((booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);

      // Add all dates from check-in to check-out (inclusive)
      for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (!bookedDates.includes(dateString)) {
          bookedDates.push(dateString);
        }
      }
    });

    return NextResponse.json({
      success: true,
      bookedDates
    });
  } catch (error: any) {
    console.error('Cabin dates lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cabin booking dates' },
      { status: 500 }
    );
  }
}
