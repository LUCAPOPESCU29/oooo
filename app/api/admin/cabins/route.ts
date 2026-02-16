import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Fetch all cabins
export async function GET(request: NextRequest) {
  try {
    const { data: cabins, error } = await supabaseAdmin
      .from('cabins')
      .select('*')
      .order('cabin_id');

    if (error) {
      console.error('Error fetching cabins:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cabins' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cabins });
  } catch (error) {
    console.error('Cabins fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update cabin (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { cabin_id, updates } = await request.json();

    if (!cabin_id) {
      return NextResponse.json(
        { error: 'Cabin ID is required' },
        { status: 400 }
      );
    }

    // Update cabin
    const { data, error } = await supabaseAdmin
      .from('cabins')
      .update(updates)
      .eq('cabin_id', cabin_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cabin:', error);
      return NextResponse.json(
        { error: 'Failed to update cabin' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cabin: data,
      message: 'Cabin updated successfully'
    });
  } catch (error) {
    console.error('Cabin update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
