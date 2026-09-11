/**
 * CalcX Unified History Service
 * Central logging for all calculators, converters, finance tools, and math solvers.
 */

import { getItem, setItem } from './storage';

const HISTORY_KEY = 'calcx_unified_history_v1';
const MAX_HISTORY = 100;

export function getUnifiedHistory() {
  return getItem(HISTORY_KEY, []);
}

export function logCalculation({ toolId, toolName, input, result }) {
  try {
    const existing = getUnifiedHistory();
    const newEntry = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      toolId,
      toolName,
      input: String(input),
      result: String(result),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };

    const updated = [newEntry, ...existing.slice(0, MAX_HISTORY - 1)];
    setItem(HISTORY_KEY, updated);
    return newEntry;
  } catch (err) {
    console.warn('Failed to log calculation history:', err);
    return null;
  }
}

export function deleteHistoryItem(id) {
  const existing = getUnifiedHistory();
  const updated = existing.filter((item) => item.id !== id);
  setItem(HISTORY_KEY, updated);
  return updated;
}

export function clearUnifiedHistory() {
  setItem(HISTORY_KEY, []);
  return [];
}
