import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

// GET - Fetch public system settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      // Return default settings if table doesn't exist yet
      return NextResponse.json({
        settings: {
          cleaning_fee: 50,
          service_fee_percentage: 10,
          tax_vat_percentage: 19,
          currency: 'RON',
          minimum_booking_days: 2,
          maximum_booking_days: 30,
          advance_booking_limit_days: 365,
          check_in_time: '15:00',
          check_out_time: '11:00',
          require_deposit: false,
          deposit_amount_percentage: 30,
          accept_credit_debit: true,
          accept_bank_transfer: true,
          accept_cash: false
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
