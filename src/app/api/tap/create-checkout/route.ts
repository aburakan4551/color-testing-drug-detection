import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/tap-service';
import { auth } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, planId, userName } = await request.json();

    if (!userId || !userEmail || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { url, chargeId } = await createCheckoutSession(
      userId,
      userEmail,
      planId,
      userName
    );

    return NextResponse.json({
      url,
      chargeId,
      success: true
    });

  } catch (error) {
    console.error('Error creating Tap checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
