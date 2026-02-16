import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await db.getAllBookings();
    const reviews = await db.getAllReviews();

    // Group bookings by customer email
    const customerMap = new Map<string, {
      email: string;
      name: string;
      phone: string;
      totalBookings: number;
      totalSpent: number;
      lastBooking: string;
      vipStatus: boolean;
    }>();

    bookings.forEach((booking) => {
      const email = booking.guestEmail.toLowerCase();

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email: booking.guestEmail,
          name: booking.guestName,
          phone: booking.guestPhone || '',
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: booking.createdAt,
          vipStatus: false, // Will be determined by total bookings
        });
      }

      const customer = customerMap.get(email)!;

      // Only count non-cancelled bookings
      if (booking.status !== 'cancelled') {
        customer.totalBookings += 1;
        customer.totalSpent += booking.total;
      }

      // Update last booking if this one is more recent
      if (new Date(booking.createdAt) > new Date(customer.lastBooking)) {
        customer.lastBooking = booking.createdAt;
        customer.name = booking.guestName; // Update to most recent name
        customer.phone = booking.guestPhone || customer.phone;
      }
    });

    // Convert to array and calculate additional data
    const customers = Array.from(customerMap.values()).map((customer) => {
      // VIP status: customers with 3+ bookings
      const vipStatus = customer.totalBookings >= 3;

      // Calculate average rating from reviews
      const customerReviews = reviews.filter(
        (r) => r.email.toLowerCase() === customer.email.toLowerCase()
      );
      const averageRating = customerReviews.length > 0
        ? customerReviews.reduce((sum, r) => sum + r.rating, 0) / customerReviews.length
        : 0;

      return {
        id: customer.email,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        totalBookings: customer.totalBookings,
        totalSpent: Math.round(customer.totalSpent),
        averageRating: Math.round(averageRating * 10) / 10,
        lastBooking: customer.lastBooking,
        vipStatus,
        status: 'active' as const,
      };
    });

    // Sort by total spent (highest first)
    customers.sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
