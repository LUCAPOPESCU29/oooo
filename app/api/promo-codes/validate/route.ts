import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Promo code is required' },
        { status: 400 }
      );
    }

    // Get promo code from database
    const promoCode = await db.getPromoCodeByCode(code);

    if (!promoCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid promo code'
      });
    }

    // Check if active
    if (!promoCode.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'This promo code is no longer active'
      });
    }

    // Check if expired
    if (promoCode.validUntil) {
      const now = new Date();
      const validUntil = new Date(promoCode.validUntil);
      if (now > validUntil) {
        return NextResponse.json({
          valid: false,
          error: 'This promo code has expired'
        });
      }
    }

    // Check max uses
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'This promo code has reached its usage limit'
      });
    }

    // Valid promo code
    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        description: promoCode.description
      }
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
