import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ResonanceEntry from '@/models/ResonanceEntry';
import mongoose from 'mongoose';

// DELETE - Delete a specific resonance entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid entry ID' },
        { status: 400 }
      );
    }
    
    const deletedEntry = await ResonanceEntry.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Entry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting resonance entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific resonance entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { note } = body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid entry ID' },
        { status: 400 }
      );
    }
    
    if (!note || !note.trim()) {
      return NextResponse.json(
        { success: false, error: 'Note is required' },
        { status: 400 }
      );
    }
    
    const updatedEntry = await ResonanceEntry.findByIdAndUpdate(
      id,
      { note: note.trim() },
      { new: true, runValidators: true }
    );
    
    if (!updatedEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedEntry 
    });
  } catch (error) {
    console.error('Error updating resonance entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}
