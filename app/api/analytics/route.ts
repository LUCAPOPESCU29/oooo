import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get all bookings and reviews
    const bookings = await db.getAllBookings();
    const reviews = await db.getAllReviews();

    // Calculate analytics based on time range
    const searchParams = req.nextUrl.searchParams;
    const range = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 1y

    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Filter bookings by date range
    const filteredBookings = bookings.filter(
      (b) => new Date(b.createdAt) >= startDate
    );

    // Revenue by month (last 6 months)
    const revenueByMonth = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      const monthStart = new Date(year, date.getMonth(), 1);
      const monthEnd = new Date(year, date.getMonth() + 1, 0);

      const monthRevenue = bookings
        .filter((b) => {
          const bookingDate = new Date(b.createdAt);
          return (
            bookingDate >= monthStart &&
            bookingDate <= monthEnd &&
            b.status !== 'cancelled'
          );
        })
        .reduce((sum, b) => sum + b.total, 0);

      revenueByMonth.push({
        month: monthName,
        revenue: Math.round(monthRevenue),
      });
    }

    // Bookings by day of week
    const bookingsByDay = [
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 0 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 0 },
      { day: 'Fri', count: 0 },
      { day: 'Sat', count: 0 },
      { day: 'Sun', count: 0 },
    ];

    filteredBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const dayIndex = date.getDay();
      // Convert Sunday (0) to index 6, Monday (1) to index 0, etc.
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      bookingsByDay[adjustedIndex].count++;
    });

    // Top performing cabins
    const cabinStats: Record<string, { revenue: number; bookings: number }> = {};

    filteredBookings.forEach((booking) => {
      if (booking.status !== 'cancelled') {
        if (!cabinStats[booking.cabinName]) {
          cabinStats[booking.cabinName] = { revenue: 0, bookings: 0 };
        }
        cabinStats[booking.cabinName].revenue += booking.total;
        cabinStats[booking.cabinName].bookings += 1;
      }
    });

    const topCabins = Object.entries(cabinStats)
      .map(([name, stats]) => ({
        name,
        revenue: Math.round(stats.revenue),
        bookings: stats.bookings,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate conversion rate (mock - in production, track visitors)
    const totalVisitors = filteredBookings.length * 1.5; // Simulate visitors
    const conversionRate = totalVisitors > 0
      ? ((filteredBookings.length / totalVisitors) * 100).toFixed(1)
      : 0;

    // Average booking value
    const totalRevenue = filteredBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.total, 0);

    const paidBookings = filteredBookings.filter((b) => b.status !== 'cancelled').length;
    const averageBookingValue = paidBookings > 0
      ? Math.round(totalRevenue / paidBookings)
      : 0;

    // Repeat customers (mock - in production, track by email)
    const emailCounts: Record<string, number> = {};
    filteredBookings.forEach((b) => {
      emailCounts[b.guestEmail] = (emailCounts[b.guestEmail] || 0) + 1;
    });
    const repeatCount = Object.values(emailCounts).filter((count) => count > 1).length;
    const repeatCustomers = filteredBookings.length > 0
      ? ((repeatCount / Object.keys(emailCounts).length) * 100).toFixed(0)
      : 0;

    return NextResponse.json({
      revenueByMonth,
      bookingsByDay,
      topCabins,
      conversionRate: Number(conversionRate),
      averageBookingValue,
      repeatCustomers: Number(repeatCustomers),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
