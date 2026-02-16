import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const { data: cabin, error } = await supabaseAdmin
      .from('cabins')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !cabin) {
      return NextResponse.json(
        { error: 'Cabin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cabin });
  } catch (error) {
    console.error('Cabin fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
