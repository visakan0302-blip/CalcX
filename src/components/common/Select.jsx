import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  value,
  onChange,
  options = [], // [{ value, label, sublabel }]
  className = '',
  id,
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="form-input-wrapper">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="form-select"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="select-arrow" />
      </div>
    </div>
  );
}
