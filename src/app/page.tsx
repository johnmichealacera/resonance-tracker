'use client';

import { useState } from 'react';
import { useResonanceEntries } from '@/hooks/useResonanceEntries';
import ResonanceLogger from '@/components/ResonanceLogger';
import ResonanceList from '@/components/ResonanceList';
import ResonanceIndicator from '@/components/ResonanceIndicator';

export default function Home() {
  const { entries, loading, error, addEntry, deleteEntry } = useResonanceEntries();
  const [indicatorRefresh, setIndicatorRefresh] = useState(0);

  const handleAddEntry = async (note: string, type: 'positive' | 'negative') => {
    const success = await addEntry(note, type);
    if (success) {
      // Trigger indicator refresh
      setIndicatorRefresh(prev => prev + 1);
    }
    return success;
  };

  const handleDeleteEntry = async (id: string) => {
    const success = await deleteEntry(id);
    if (success) {
      // Trigger indicator refresh
      setIndicatorRefresh(prev => prev + 1);
    }
    return success;
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-2">
              Please check your database connection and try refreshing the page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Resonance Tracker
          </h1>
          <p className="text-gray-600 font-light">
            A simple journal to track what raises your resonance
            {loading && (
              <span className="ml-2 text-blue-500 text-sm">Loading...</span>
            )}
          </p>
        </header>

        <div className="space-y-8">
          <ResonanceIndicator triggerRefresh={indicatorRefresh} />
          <ResonanceLogger onAddEntry={handleAddEntry} loading={loading} />
          <ResonanceList entries={entries} onDeleteEntry={handleDeleteEntry} loading={loading} />
        </div>
      </div>
    </main>
  );
}
