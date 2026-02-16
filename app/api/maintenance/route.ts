import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const issues = await db.getAllMaintenanceIssues();
    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Error fetching maintenance issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance issues' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cabin, title, description, priority, reportedBy, reportedByEmail } = body;

    // Validation
    if (!cabin || !title || !description || !reportedBy || !reportedByEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create maintenance issue
    const issue = await db.createMaintenanceIssue({
      cabin,
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
      reportedBy,
      reportedByEmail,
      assignedTo: undefined,
      dueDate: undefined
    });

    if (!issue) {
      return NextResponse.json(
        { error: 'Failed to create maintenance issue' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, issue }, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance issue:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance issue' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing issue ID' },
        { status: 400 }
      );
    }

    const issue = await db.updateMaintenanceIssue(id, updates);

    if (!issue) {
      return NextResponse.json(
        { error: 'Failed to update maintenance issue' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, issue });
  } catch (error) {
    console.error('Error updating maintenance issue:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance issue' },
      { status: 500 }
    );
  }
}
