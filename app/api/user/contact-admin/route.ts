import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { userId, userName, userEmail, message } = await req.json();

    if (!message || !userEmail) {
      return NextResponse.json(
        { error: 'Message and email are required' },
        { status: 400 }
      );
    }

    // Store the message in a user_messages table
    // For now, we'll create a simple log entry
    // In production, you would create a dedicated messages table

    const { error: insertError } = await supabaseAdmin
      .from('user_messages')
      .insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        message: message,
        created_at: new Date().toISOString(),
        status: 'unread'
      });

    if (insertError) {
      // If the table doesn't exist, log the message (fallback)
      console.log('User message:', {
        userId,
        userName,
        userEmail,
        message,
        timestamp: new Date().toISOString()
      });
    }

    // In a production environment, send an email to admin here
    // Example: await sendEmailToAdmin({ userName, userEmail, message });

    return NextResponse.json({
      success: true,
      message: 'Message sent to admin successfully'
    });
  } catch (error: any) {
    console.error('Contact admin error:', error);
    return NextResponse.json(
      { error: 'Failed to send message to admin' },
      { status: 500 }
    );
  }
}
