import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const promoCodes = await db.getAllPromoCodes();
    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, discountType, discountValue, maxUses, validFrom, validUntil, description } = body;

    // Validation
    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { error: 'Code, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    if (discountType === 'percentage' && (discountValue < 1 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Create promo code
    const promoCode = await db.createPromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      maxUses: maxUses ? Number(maxUses) : undefined,
      validFrom: validFrom || new Date().toISOString(),
      validUntil: validUntil || undefined,
      isActive: true,
      description: description || undefined
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Failed to create promo code (code may already exist)' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, promoCode }, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive, currentUses, maxUses } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      );
    }

    const promoCode = await db.updatePromoCode(id, {
      isActive,
      currentUses,
      maxUses
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Failed to update promo code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, promoCode });
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      );
    }

    const success = await db.deletePromoCode(Number(id));

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete promo code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    );
  }
}
