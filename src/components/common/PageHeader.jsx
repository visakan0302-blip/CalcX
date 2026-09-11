import React from 'react';

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  badgeType = 'primary',
  actions,
}) {
  return (
    <div className="page-header">
      <div className="page-header-main">
        {Icon && (
          <div className="page-header-icon">
            <Icon size={24} />
          </div>
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">{title}</h1>
            {badge && <span className={`calcx-badge calcx-badge-${badgeType}`}>{badge}</span>}
          </div>
          {description && <p className="page-description">{description}</p>}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{actions}</div>}
    </div>
  );
}
