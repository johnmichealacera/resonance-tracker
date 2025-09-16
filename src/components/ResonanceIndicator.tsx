'use client';

import { useEffect, useState } from 'react';
import { ResonanceLevel } from '@/types/resonance';

interface ResonanceIndicatorProps {
  onLevelUpdate?: (level: ResonanceLevel) => void;
  triggerRefresh?: number; // Used to trigger refresh when new entries are added
}

export default function ResonanceIndicator({ onLevelUpdate, triggerRefresh }: ResonanceIndicatorProps) {
  const [level, setLevel] = useState<ResonanceLevel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLevel = async () => {
    try {
      const response = await fetch('/api/resonance/level');
      const result = await response.json();
      
      if (result.success) {
        setLevel(result.data);
        onLevelUpdate?.(result.data);
      }
    } catch (error) {
      console.error('Error fetching resonance level:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevel();
  }, [triggerRefresh]);

  const getLevelDescription = (currentLevel: number) => {
    if (currentLevel >= 90) return { text: 'Christ-like Awareness', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (currentLevel >= 80) return { text: 'Tesla-level Genius', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (currentLevel >= 70) return { text: 'High Resonance', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (currentLevel >= 60) return { text: 'Rising Awareness', color: 'text-green-600', bg: 'bg-green-50' };
    if (currentLevel >= 50) return { text: 'Balanced State', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (currentLevel >= 40) return { text: 'Seeking Balance', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (currentLevel >= 30) return { text: 'Lower Vibration', color: 'text-red-600', bg: 'bg-red-50' };
    return { text: 'Shadow Work Needed', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const getProgressColor = (currentLevel: number) => {
    if (currentLevel >= 70) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    if (currentLevel >= 60) return 'bg-gradient-to-r from-green-500 to-blue-500';
    if (currentLevel >= 50) return 'bg-gray-400';
    if (currentLevel >= 40) return 'bg-gradient-to-r from-orange-500 to-yellow-500';
    return 'bg-gradient-to-r from-red-500 to-orange-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Unable to load resonance level</p>
      </div>
    );
  }

  const description = getLevelDescription(level.currentLevel);
  const progressColor = getProgressColor(level.currentLevel);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light text-gray-900">
          Resonance Level
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${description.color} ${description.bg}`}>
          {description.text}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Level {level.currentLevel.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            {level.levelPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${level.levelPercentage}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-light text-gray-900">{level.totalEntries}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
        </div>
        <div>
          <div className="text-2xl font-light text-green-600">+{level.positiveEntries}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Positive</div>
        </div>
        <div>
          <div className="text-2xl font-light text-red-600">-{level.negativeEntries}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Negative</div>
        </div>
      </div>

      {/* Inspirational Message */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 text-center italic">
          {level.currentLevel >= 70 
            ? "You're radiating high-frequency energy ✨" 
            : level.currentLevel >= 50 
            ? "Every positive thought raises your vibration 🌟"
            : "Shadow work leads to light - keep going 🌱"
          }
        </p>
      </div>
    </div>
  );
}
