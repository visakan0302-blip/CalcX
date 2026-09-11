import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/formatting';

export function CopyButton({ text, label = 'Copy', size = 'sm', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    const success = await copyToClipboard(String(text));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`calcx-btn calcx-btn-secondary ${size === 'sm' ? 'calcx-btn-sm' : ''} ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}
