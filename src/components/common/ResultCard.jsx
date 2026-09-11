import React from 'react';
import { CopyButton } from './CopyButton';

export function ResultCard({
  label = 'Result',
  value,
  unit,
  copyValue,
  secondary,
  badge,
  badgeType = 'primary', // primary | success | warning | danger
  children,
  className = '',
}) {
  const copyTarget = copyValue !== undefined ? copyValue : value;

  return (
    <div className={`result-card ${className}`}>
      <div className="result-header">
        <span className="result-label">{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge && <span className={`calcx-badge calcx-badge-${badgeType}`}>{badge}</span>}
          {copyTarget !== undefined && copyTarget !== null && copyTarget !== '' && (
            <CopyButton text={copyTarget} />
          )}
        </div>
      </div>

      <div className="result-value-box">
        <span className="result-value">{value}</span>
        {unit && <span className="result-unit">{unit}</span>}
      </div>

      {secondary && <div className="result-details">{secondary}</div>}

      {children}
    </div>
  );
}
