'use client';

import { useState } from 'react';
import { ResonanceType } from '@/types/resonance';

interface ResonanceLoggerProps {
  onAddEntry: (note: string, type: ResonanceType) => Promise<boolean>;
  loading?: boolean;
}

export default function ResonanceLogger({ onAddEntry, loading = false }: ResonanceLoggerProps) {
  const [note, setNote] = useState('');
  const [type, setType] = useState<ResonanceType>('positive');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim() && !submitting) {
      setSubmitting(true);
      const success = await onAddEntry(note, type);
      if (success) {
        setNote('');
        setType('positive'); // Reset to positive default
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-light text-gray-900 mb-4">
        Log Resonance
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resonance Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resonance Type
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setType('positive')}
              className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                type === 'positive'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">⬆️</span>
                Positive Resonance
              </span>
            </button>
            <button
              type="button"
              onClick={() => setType('negative')}
              className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                type === 'negative'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">⬇️</span>
                Negative Pattern
              </span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'positive' ? 'What raised your resonance?' : 'What pattern needs attention?'}
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={type === 'positive' 
              ? "Describe what resonated with you..." 
              : "Describe what lowered your vibration..."
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || submitting || !note.trim()}
          className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            type === 'positive'
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {submitting ? 'Logging...' : `Log ${type === 'positive' ? 'Positive' : 'Shadow'} Entry`}
        </button>
      </form>
    </div>
  );
}
