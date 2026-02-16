import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { messageId, userEmail, replyText } = await req.json();

    if (!messageId || !userEmail || !replyText) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Update message with reply and status
    const { error: updateError } = await supabaseAdmin
      .from('user_messages')
      .update({
        status: 'replied',
        admin_reply: replyText,
        replied_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (updateError) {
      console.error('Error updating message status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update message' },
        { status: 500 }
      );
    }

    // In production, you would send an email here
    // Example: await sendEmail({
    //   to: userEmail,
    //   subject: 'Reply to your message',
    //   body: replyText
    // });

    console.log('Reply sent to:', userEmail);
    console.log('Message:', replyText);

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error: any) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
