import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

// GET - Fetch all date change requests
export async function GET(req: NextRequest) {
  try {
    const { data: requests, error } = await supabaseAdmin
      .from('date_change_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update request status
export async function PATCH(req: NextRequest) {
  try {
    const { requestId, status } = await req.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    // Update the request status
    const { data, error } = await supabaseAdmin
      .from('date_change_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      );
    }

    // If approved, update the booking dates
    if (status === 'approved' && data) {
      const { error: bookingError } = await supabaseAdmin
        .from('bookings')
        .update({
          check_in: data.requested_check_in,
          check_out: data.requested_check_out,
          updated_at: new Date().toISOString()
        })
        .eq('booking_reference', data.booking_reference);

      if (bookingError) {
        console.error('Booking update error:', bookingError);
        // Don't fail the whole request, but log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
