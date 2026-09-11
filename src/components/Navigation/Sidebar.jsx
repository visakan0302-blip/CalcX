import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Search,
  Star,
  X,
  ChevronDown,
  ChevronRight,
  Settings as SettingsIcon,
  LayoutGrid,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from './toolsConfig';
import { getFavorites, toggleFavorite } from '../../utils/favoritesManager';

export function Sidebar({
  activeTool,
  onSelectTool,
  theme,
  onToggleTheme,
  onOpenAbout,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(getFavorites());
  const [collapsedCategories, setCollapsedCategories] = useState({});

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

  const toggleCategory = (catId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  // Filtered tools when searching
  const filteredTools = isSearching
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      )
    : [];

  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand" onClick={() => onSelectTool('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <div className="brand-info">
            <span className="brand-title">CalcX</span>
            <span className="brand-subtitle">Commercial Suite</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '12px 14px 4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
          }}
        >
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search all 18 tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 0,
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {isSearching ? (
          <div>
            <div className="nav-section-title">Search Results ({filteredTools.length})</div>
            {filteredTools.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '12px 14px' }}>
                No tools found for "{searchQuery}"
              </p>
            ) : (
              filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                const isFav = favorites.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onSelectTool(tool.id);
                      setSearchQuery('');
                    }}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div className="nav-item-icon">
                        <Icon size={18} />
                      </div>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tool.name}
                      </span>
                    </div>
                    {tool.id !== 'dashboard' && (
                      <span
                        onClick={(e) => handleToggleFav(e, tool.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 2,
                          color: isFav ? '#f59e0b' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                        title={isFav ? 'Unpin favorite' : 'Pin to favorites'}
                      >
                        <Star size={14} fill={isFav ? '#f59e0b' : 'none'} />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <button
              type="button"
              onClick={() => onSelectTool('dashboard')}
              className={`nav-item ${activeTool === 'dashboard' ? 'active' : ''}`}
            >
              <div className="nav-item-icon">
                <LayoutGrid size={18} />
              </div>
              <span>Suite Dashboard</span>
            </button>

            {/* Pinned Favorites */}
            {favoriteTools.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <div
                  className="nav-section-title"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}
                >
                  <Star size={12} fill="#f59e0b" />
                  <span>Favorites</span>
                </div>
                {favoriteTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={`fav-${tool.id}`}
                      type="button"
                      onClick={() => onSelectTool(tool.id)}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="nav-item-icon">
                        <Icon size={18} />
                      </div>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tool.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Categorized Tools */}
            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter(
                (t) => t.category === cat.id && !t.isNavOverview
              );
              if (catTools.length === 0) return null;

              const isCollapsed = collapsedCategories[cat.id];

              return (
                <div key={cat.id} style={{ marginBottom: 4 }}>
                  <div
                    onClick={() => toggleCategory(cat.id)}
                    className="nav-section-title"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{ opacity: 0.7 }}>
                      {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>

                  {!isCollapsed &&
                    catTools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTool === tool.id;
                      const isFav = favorites.includes(tool.id);

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => onSelectTool(tool.id)}
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          style={{ justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div className="nav-item-icon">
                              <Icon size={18} />
                            </div>
                            <span
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {tool.name}
                            </span>
                          </div>
                          <span
                            onClick={(e) => handleToggleFav(e, tool.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: 2,
                              color: isFav ? '#f59e0b' : 'var(--text-muted)',
                              cursor: 'pointer',
                              opacity: isFav || isActive ? 1 : 0.4,
                            }}
                            title={isFav ? 'Unpin favorite' : 'Pin to favorites'}
                          >
                            <Star size={13} fill={isFav ? '#f59e0b' : 'none'} />
                          </span>
                        </button>
                      );
                    })}
                </div>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer / Settings */}
      <div className="sidebar-footer">
        <button
          type="button"
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title="Toggle Light/Dark Theme"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="calcx-badge calcx-badge-primary" style={{ textTransform: 'capitalize' }}>
            {theme}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('settings')}
          className={`calcx-btn ${activeTool === 'settings' ? 'calcx-btn-primary' : 'calcx-btn-secondary'} calcx-btn-sm`}
          style={{ width: '100%', justifyContent: 'flex-start', marginTop: 6 }}
        >
          <SettingsIcon size={15} />
          <span>Settings & About</span>
        </button>
      </div>
    </aside>
  );
}
