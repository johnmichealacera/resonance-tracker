export type ResonanceType = 'positive' | 'negative';

export interface ResonanceEntry {
  _id: string;
  timestamp: Date;
  note: string;
  type: ResonanceType;
  createdAt?: Date;
  updatedAt?: Date;
}

// For backward compatibility with localStorage
export interface LocalResonanceEntry {
  id: string;
  timestamp: Date;
  note: string;
  type?: ResonanceType; // Optional for migration
}

export interface ResonanceLevel {
  currentLevel: number;
  totalEntries: number;
  positiveEntries: number;
  negativeEntries: number;
  levelPercentage: number; // 0-100, where 50 is neutral
}
