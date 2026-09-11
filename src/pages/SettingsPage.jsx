import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor, Trash2, Star, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { clearUnifiedHistory } from '../utils/unifiedHistory';
import { getFavorites, toggleFavorite } from '../utils/favoritesManager';
import { TOOLS } from '../components/Navigation/toolsConfig';

export function SettingsPage({
  theme = 'dark',
  effectiveTheme = 'dark',
  onSetTheme = () => {},
  onToggleTheme = () => {},
  onOpenAbout = () => {},
}) {
  const [favorites, setFavorites] = useState(getFavorites());
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleToggleFav = (toolId) => {
    const updated = toggleFavorite(toolId);
    setFavorites([...updated]);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all logged calculation history?')) {
      clearUnifiedHistory();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  const toolList = TOOLS.filter((t) => !t.isNavOverview && t.id !== 'settings' && t.id !== 'history');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Settings & About"
        description="Customize themes, manage pinned tools, and configure CalcX platform preferences."
        icon={Settings}
      />

      {/* Theme Settings */}
      <Card title="Appearance & Theme" icon={Sparkles}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="form-label">Theme Mode:</span>
          <div className="tab-group" style={{ maxWidth: 440 }}>
            <button
              type="button"
              className={`tab-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onSetTheme('dark')}
            >
              <Moon size={16} />
              <span>Dark</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onSetTheme('light')}
            >
              <Sun size={16} />
              <span>Light</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${theme === 'system' ? 'active' : ''}`}
              onClick={() => onSetTheme('system')}
            >
              <Monitor size={16} />
              <span>System</span>
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Active theme: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{effectiveTheme}</strong>
            {theme === 'system' ? ' (automatically matching device OS preference)' : ''}.
          </p>
        </div>
      </Card>

      {/* Favorites Manager */}
      <Card title="Manage Pinned Favorites" icon={Star}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Star the calculators you use daily to pin them to the top of your Dashboard and mobile quick bar:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {toolList.map((tool) => {
              const isFav = favorites.includes(tool.id);
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToggleFav(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isFav ? 'var(--bg-card-subtle)' : 'transparent',
                    border: isFav ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} style={{ color: tool.color }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{tool.name}</span>
                  </div>
                  <Star
                    size={16}
                    fill={isFav ? '#f59e0b' : 'none'}
                    color={isFav ? '#f59e0b' : 'var(--text-muted)'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* History & Storage */}
      <Card title="History & Local Storage" icon={Trash2}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              Calculation Logs
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Erase all cached computations across every tool from local storage.
            </p>
          </div>
          <Button variant="secondary" size="sm" icon={Trash2} onClick={handleClearHistory}>
            {clearedNotice ? 'History Cleared!' : 'Clear All History'}
          </Button>
        </div>
      </Card>

      {/* About CalcX Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
          border: '1px solid var(--primary-glow)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800 }}>
                CALCX
              </h2>
              <span className="calcx-badge calcx-badge-primary">v2.5 Pro Edition</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              "Calculate anything. Convert everything."
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 4 }}>
          A professional commercial-grade calculation suite delivering 18 unified tools: Smart & Scientific Math, 13-category Unit Conversions, Live Currency Exchange, Symbolic Equation Solving, Indian Finance (GST & EMI), Money Interest, Income & Taxes, Health, Time, and Statistical Analysis.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
          <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
          <span>100% Client-Side Privacy: No calculations or financial numbers leave your device.</span>
        </div>
      </div>
    </div>
  );
}
