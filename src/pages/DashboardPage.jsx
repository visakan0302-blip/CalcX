import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Star,
  Search,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../components/Navigation/toolsConfig';
import { getFavorites, toggleFavorite } from '../utils/favoritesManager';

export function DashboardPage({ onSelectTool }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(getFavorites());

  useEffect(() => {
    const handleStorage = () => setFavorites(getFavorites());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggleFav = (e, toolId) => {
    e.stopPropagation();
    const updated = toggleFavorite(toolId);
    setFavorites(updated);
  };

  // Exclude dashboard itself from cards
  const allTools = TOOLS.filter((t) => t.id !== 'dashboard');

  const query = searchQuery.trim().toLowerCase();
  const filteredTools = allTools.filter((tool) => {
    const matchesCat = activeCategory === 'ALL' || tool.category === activeCategory;
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const favoriteTools = allTools.filter((t) => favorites.includes(t.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Hero Header */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(16, 185, 129, 0.06) 100%)',
          border: '1px solid var(--primary-glow)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span className="calcx-badge calcx-badge-primary">
              <Sparkles size={13} />
              CalcX Commercial Calculator Suite
            </span>
            <span className="calcx-badge calcx-badge-info" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} />
              Zero eval() Security
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Calculate anything. Convert everything.
          </h1>

          <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            An all-in-one suite of 18 precision calculation, conversion, financial, and analytical tools.
            Designed for engineers, analysts, traders, and students with complete offline capability.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>18 Built-in Tools</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Zap size={16} color="#6366f1" />
              <span>Instant High Precision</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Layers size={16} color="#f59e0b" />
              <span>PWA Offline Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Favorites Quick Bar */}
      {favoriteTools.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
              Pinned Favorites
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({favoriteTools.length} pinned)
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
            {favoriteTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={`fav-card-${tool.id}`}
                  onClick={() => onSelectTool(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="favorite-chip"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        background: `linear-gradient(135deg, ${tool.color} 0%, #6366f1 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tool.name}
                    </span>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* Category Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              className={`tab-btn ${activeCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveCategory('ALL')}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              All ({allTools.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = allTools.filter((t) => t.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              minWidth: 240,
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                width: '100%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Tool Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
            {activeCategory === 'ALL'
              ? 'All Calculations & Utilities'
              : CATEGORIES.find((c) => c.id === activeCategory)?.label + ' Tools'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filteredTools.length} of {allTools.length} tools
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-medium)',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No tools match "{searchQuery}" in this category.
            </p>
            <button
              type="button"
              className="calcx-btn calcx-btn-secondary calcx-btn-sm"
              onClick={() => {
                setActiveCategory('ALL');
                setSearchQuery('');
              }}
              style={{ marginTop: 12 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const isFav = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className="tool-card"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        className="tool-card-icon"
                        style={{ background: `linear-gradient(135deg, ${tool.color} 0%, #6366f1 100%)` }}
                      >
                        <Icon size={24} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(e, tool.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 6,
                          color: isFav ? '#f59e0b' : 'var(--text-muted)',
                        }}
                        title={isFav ? 'Unpin favorite' : 'Pin to favorites'}
                      >
                        <Star size={18} fill={isFav ? '#f59e0b' : 'none'} />
                      </button>
                    </div>

                    <h3 className="tool-card-title">{tool.name}</h3>
                    <p className="tool-card-desc">{tool.description}</p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span className="calcx-badge calcx-badge-info" style={{ fontSize: '0.7rem' }}>
                      {tool.category}
                    </span>
                    <button
                      type="button"
                      className="calcx-btn calcx-btn-secondary calcx-btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(tool.id);
                      }}
                    >
                      <span>Open</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
