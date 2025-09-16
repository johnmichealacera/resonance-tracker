import mongoose from 'mongoose';

export interface IResonanceEntry {
  _id?: string;
  note: string;
  type: 'positive' | 'negative';
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResonanceEntrySchema = new mongoose.Schema<IResonanceEntry>(
  {
    note: {
      type: String,
      required: [true, 'Note is required'],
      trim: true,
      maxlength: [1000, 'Note cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['positive', 'negative'],
      required: [true, 'Resonance type is required'],
      default: 'positive',
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
ResonanceEntrySchema.index({ timestamp: -1 });

const ResonanceEntry = 
  mongoose.models.ResonanceEntry || 
  mongoose.model<IResonanceEntry>('ResonanceEntry', ResonanceEntrySchema);

export default ResonanceEntry;
