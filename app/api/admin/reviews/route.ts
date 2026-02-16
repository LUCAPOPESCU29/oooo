import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Return ALL reviews for admin (not just approved)
    const reviews = await db.getAllReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
