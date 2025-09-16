import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ResonanceEntry from '@/models/ResonanceEntry';

// GET - Fetch all resonance entries
export async function GET() {
  try {
    await connectDB();
    
    const entries = await ResonanceEntry.find({})
      .sort({ timestamp: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: entries 
    });
  } catch (error) {
    console.error('Error fetching resonance entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST - Create a new resonance entry
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { note, timestamp, type = 'positive' } = body;
    
    if (!note || !note.trim()) {
      return NextResponse.json(
        { success: false, error: 'Note is required' },
        { status: 400 }
      );
    }
    
    if (!['positive', 'negative'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resonance type' },
        { status: 400 }
      );
    }
    
    const entry = await ResonanceEntry.create({
      note: note.trim(),
      type,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      data: entry 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating resonance entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
