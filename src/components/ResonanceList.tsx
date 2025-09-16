'use client';

import { useState } from 'react';
import { ResonanceEntry } from '@/types/resonance';

interface ResonanceListProps {
  entries: ResonanceEntry[];
  onDeleteEntry: (id: string) => Promise<boolean>;
  loading?: boolean;
}

export default function ResonanceList({ entries, onDeleteEntry, loading = false }: ResonanceListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    setDeletingIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    const success = await onDeleteEntry(id);
    if (!success) {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-light text-gray-900 mb-4">
          Your Resonance Entries
        </h2>
        <p className="text-gray-500 text-center py-8">
          No entries yet. Start by logging what raises your resonance above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-light text-gray-900 mb-4">
        Your Resonance Entries
      </h2>
      
      <div className="space-y-4">
        {entries.map((entry) => {
          const isDeleting = deletingIds.has(entry._id);
          const isPositive = entry.type === 'positive';
          return (
            <div
              key={entry._id}
              className={`border-l-4 pl-4 py-3 transition-colors ${
                isPositive 
                  ? 'border-green-300 bg-green-50/50 hover:border-green-400' 
                  : 'border-red-300 bg-red-50/50 hover:border-red-400'
              } ${isDeleting ? 'opacity-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg mt-0.5">
                      {isPositive ? '⬆️' : '⬇️'}
                    </span>
                    <p className="text-gray-900 leading-relaxed flex-1">
                      {entry.note}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatDate(entry.timestamp)}</span>
                    <span className="text-xs">•</span>
                    <span className={`text-xs font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? 'Positive Resonance' : 'Shadow Work'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(entry._id)}
                  disabled={isDeleting || loading}
                  className="ml-4 text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isDeleting ? 'Deleting...' : 'Delete entry'}
                >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
