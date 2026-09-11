/**
 * CalcX Favorites Manager
 * Allows pinning/starring frequently used tools.
 */

import { getItem, setItem } from './storage';

const FAVORITES_KEY = 'calcx_favorites_v1';
const DEFAULT_FAVORITES = ['calculator', 'emi', 'interest', 'gst', 'unit', 'currency'];

export function getFavorites() {
  return getItem(FAVORITES_KEY, DEFAULT_FAVORITES);
}

export function toggleFavorite(toolId) {
  const current = getFavorites();
  let updated = [];
  if (current.includes(toolId)) {
    updated = current.filter((id) => id !== toolId);
  } else {
    updated = [...current, toolId];
  }
  setItem(FAVORITES_KEY, updated);
  return updated;
}

export function isFavorite(toolId) {
  const current = getFavorites();
  return current.includes(toolId);
}
