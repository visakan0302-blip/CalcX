import React from 'react';

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  suffix,
  mono = false,
  error,
  helperText,
  className = '',
  id,
  min,
  max,
  step,
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
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`form-input ${mono ? 'form-input-mono' : ''} ${error ? 'border-danger' : ''}`}
          {...props}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 14, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{helperText}</span>
      )}
    </div>
  );
}
