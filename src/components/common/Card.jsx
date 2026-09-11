import React from 'react';

export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  style = {},
}) {
  return (
    <div className={`calcx-card ${className}`} style={style}>
      {(title || Icon || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: subtitle ? 4 : 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {Icon && (
              <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                <Icon size={20} />
              </div>
            )}
            {title && <h3 className="calcx-card-title" style={{ margin: 0 }}>{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
