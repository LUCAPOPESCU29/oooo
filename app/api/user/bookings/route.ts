import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's bookings - db.getUserBookings handles conversion from snake_case to camelCase
    const bookings = await db.getUserBookings(decoded.email);

    // Convert to format expected by frontend (camelCase to snake_case for the UI)
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      booking_reference: booking.bookingReference,
      cabin_name: booking.cabinName,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      guests: booking.guests,
      nights: booking.nights,
      total: booking.total,
      status: booking.status,
      payment_status: booking.paymentStatus,
      payment_method: 'N/A', // Add payment method if needed
      created_at: booking.createdAt
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings
    });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
