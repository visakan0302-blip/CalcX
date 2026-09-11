import React from 'react';
import { RotateCcw } from 'lucide-react';

export function ResetButton({ onReset, label = 'Reset', size = 'sm', className = '' }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className={`calcx-btn calcx-btn-ghost ${size === 'sm' ? 'calcx-btn-sm' : ''} ${className}`}
      title="Reset fields"
    >
      <RotateCcw size={14} />
      <span>{label}</span>
    </button>
  );
}
