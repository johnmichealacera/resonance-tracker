import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ResonanceEntry from '@/models/ResonanceEntry';

// GET - Calculate and return current resonance level
export async function GET() {
  try {
    await connectDB();
    
    // Get all entries to calculate level
    const entries = await ResonanceEntry.find({}).lean();
    
    const totalEntries = entries.length;
    const positiveEntries = entries.filter(entry => entry.type === 'positive').length;
    const negativeEntries = entries.filter(entry => entry.type === 'negative').length;
    
    // Calculate resonance level (minimal but noticeable progression)
    // Each positive entry adds +0.5 points, each negative subtracts -0.3 points
    // This creates a gradual progression where you need consistent positive resonance
    const rawScore = (positiveEntries * 0.5) - (negativeEntries * 0.3);
    
    // Convert to a level system (0-100 scale, where 50 is neutral)
    // The progression is intentionally slow to represent the spiritual journey
    const baseLevel = 50; // Neutral starting point
    const levelModifier = Math.max(-50, Math.min(50, rawScore * 2)); // Cap at ±50
    const currentLevel = Math.max(0, Math.min(100, baseLevel + levelModifier));
    
    // Calculate percentage for visual representation
    const levelPercentage = currentLevel;
    
    const resonanceLevel = {
      currentLevel: Math.round(currentLevel * 10) / 10, // Round to 1 decimal
      totalEntries,
      positiveEntries,
      negativeEntries,
      levelPercentage: Math.round(levelPercentage * 10) / 10,
    };
    
    return NextResponse.json({ 
      success: true, 
      data: resonanceLevel 
    });
  } catch (error) {
    console.error('Error calculating resonance level:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate resonance level' },
      { status: 500 }
    );
  }
}
