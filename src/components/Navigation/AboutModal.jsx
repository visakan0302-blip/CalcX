import React from 'react';
import { X, CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800 }}>
                CalcX Suite
              </h2>
              <span className="calcx-badge calcx-badge-primary">v2.0 Professional</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="calcx-btn calcx-btn-ghost calcx-btn-icon"
            style={{ width: 36, height: 36 }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          CalcX is a unified, high-precision calculation suite designed for students, engineers, and everyday professionals. Every tool follows the same unified design system with zero compromises on mathematical correctness.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span><strong>7 Unified Tools:</strong> Standard/Scientific Calc, Units, Currency, Equations, BMI, Dates, Age.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span><strong>Safe Architecture:</strong> Evaluates mathematical expressions with a Shunting-yard engine (strictly zero <code>eval()</code>).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
            <Zap size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span><strong>Live & Offline Ready:</strong> Real-time exchange rate sync with offline localStorage caching.</span>
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          All computations run client-side in real-time. Fast, secure, and private.
        </div>

        <button
          type="button"
          onClick={onClose}
          className="calcx-btn calcx-btn-primary"
          style={{ width: '100%' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
