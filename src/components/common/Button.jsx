import React from 'react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | icon
  size = 'md', // sm | md | lg
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  title,
  ...props
}) {
  const variantClass = `calcx-btn-${variant}`;
  const sizeClass = size === 'sm' ? 'calcx-btn-sm' : '';
  const iconOnlyClass = variant === 'icon' ? 'calcx-btn-icon' : '';

  return (
    <button
      type={type}
      className={`calcx-btn ${variantClass} ${sizeClass} ${iconOnlyClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
}
