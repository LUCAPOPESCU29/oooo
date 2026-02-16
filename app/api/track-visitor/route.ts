import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    // Get IP address from request
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';

    // Get other tracking data
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    const body = await request.json();
    const { pageUrl } = body;

    // Check if visitor exists (by IP)
    const { data: existingVisitor } = await supabase
      .from('visitor_logs')
      .select('*')
      .eq('ip_address', ip)
      .single();

    if (existingVisitor) {
      // Update existing visitor
      await supabase
        .from('visitor_logs')
        .update({
          visit_count: existingVisitor.visit_count + 1,
          last_visit: new Date().toISOString(),
          page_url: pageUrl,
          user_agent: userAgent,
          referrer: referrer
        })
        .eq('ip_address', ip);
    } else {
      // Insert new visitor
      await supabase
        .from('visitor_logs')
        .insert({
          ip_address: ip,
          user_agent: userAgent,
          referrer: referrer,
          page_url: pageUrl
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Visitor tracked',
      ip: ip // Return IP for debugging (remove in production)
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
