import React from 'react';

export function ToolLayout({
  children,
  singleColumn = false,
  className = '',
}) {
  return (
    <div className={`${singleColumn ? 'tool-grid-single' : 'tool-grid'} ${className}`}>
      {children}
    </div>
  );
}
