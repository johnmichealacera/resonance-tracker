'use client';

import { useState, useEffect } from 'react';
import { ResonanceEntry, LocalResonanceEntry, ResonanceType } from '@/types/resonance';

export function useResonanceEntries() {
  const [entries, setEntries] = useState<ResonanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Migrate localStorage data to database if needed
  const migrateLocalStorageData = async () => {
    const localData = localStorage.getItem('resonance-entries');
    if (localData) {
      try {
        const localEntries: LocalResonanceEntry[] = JSON.parse(localData);
        
        // Convert and upload each entry
        for (const entry of localEntries) {
          await fetch('/api/resonance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              note: entry.note,
              type: entry.type || 'positive', // Default to positive for migrated entries
              timestamp: entry.timestamp,
            }),
          });
        }
        
        // Clear localStorage after successful migration
        localStorage.removeItem('resonance-entries');
        console.log('Successfully migrated localStorage data to database');
      } catch (error) {
        console.error('Error migrating localStorage data:', error);
      }
    }
  };

  // Fetch entries from database
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/resonance');
      const result = await response.json();
      
      if (result.success) {
        const entriesWithDates = result.data.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
          updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        }));
        setEntries(entriesWithDates);
      } else {
        setError(result.error || 'Failed to fetch entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add new entry
  const addEntry = async (note: string, type: ResonanceType = 'positive') => {
    try {
      setError(null);
      
      const response = await fetch('/api/resonance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: note.trim(),
          type,
          timestamp: new Date(),
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newEntry = {
          ...result.data,
          timestamp: new Date(result.data.timestamp),
          createdAt: result.data.createdAt ? new Date(result.data.createdAt) : undefined,
          updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt) : undefined,
        };
        setEntries(prev => [newEntry, ...prev]);
        return true;
      } else {
        setError(result.error || 'Failed to add entry');
        return false;
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      setError('Network error occurred');
      return false;
    }
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/resonance/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEntries(prev => prev.filter(entry => entry._id !== id));
        return true;
      } else {
        setError(result.error || 'Failed to delete entry');
        return false;
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Network error occurred');
      return false;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      // First migrate any localStorage data
      await migrateLocalStorageData();
      // Then fetch from database
      await fetchEntries();
    };
    
    initializeData();
  }, []);

  return {
    entries,
    loading,
    error,
    addEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}
