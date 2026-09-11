import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Moon,
  Sun,
  LayoutGrid,
  Calculator,
  ArrowLeftRight,
  Landmark,
  MoreHorizontal,
  Search,
  Star,
  Settings as SettingsIcon,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from './toolsConfig';
import { getFavorites, toggleFavorite } from '../../utils/favoritesManager';

export function MobileNav({
  activeTool,
  onSelectTool,
  theme,
  onToggleTheme,
  onOpenAbout,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(getFavorites());

  useEffect(() => {
    const handleStorage = () => setFavorites(getFavorites());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const currentToolObj = TOOLS.find((t) => t.id === activeTool) || TOOLS[0];

  const handleSelect = (toolId) => {
    onSelectTool(toolId);
    setIsDrawerOpen(false);
    setSearchQuery('');
  };

  const handleToggleFav = (e, toolId) => {
    e.stopPropagation();
    const updated = toggleFavorite(toolId);
    setFavorites(updated);
  };

  const primaryMobileTools = [
    { id: 'dashboard', label: 'Home', icon: LayoutGrid },
    { id: 'calculator', label: 'Calc', icon: Calculator },
    { id: 'emi', label: 'EMI', icon: Landmark },
    { id: 'unit', label: 'Units', icon: ArrowLeftRight },
  ];

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

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
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="calcx-btn calcx-btn-ghost calcx-btn-icon"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => handleSelect('dashboard')}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sparkles size={16} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
              CalcX
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {currentToolObj.shortName || currentToolObj.name}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={onToggleTheme}
            className="calcx-btn calcx-btn-ghost calcx-btn-icon"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            type="button"
            onClick={() => handleSelect('settings')}
            className="calcx-btn calcx-btn-ghost calcx-btn-icon"
            aria-label="Open settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="mobile-bottom-nav">
        {primaryMobileTools.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`mobile-nav-btn ${
            !primaryMobileTools.some((t) => t.id === activeTool) ? 'active' : ''
          }`}
        >
          <MoreHorizontal size={20} />
          <span>All (18)</span>
        </button>
      </nav>

      {/* Slide-out Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          style={{ display: 'block' }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <aside className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand" onClick={() => handleSelect('dashboard')}>
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <div className="brand-info">
              <span className="brand-title">CalcX</span>
              <span className="brand-subtitle">Commercial Suite</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="calcx-btn calcx-btn-ghost calcx-btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar in Drawer */}
        <div style={{ padding: '10px 14px' }}>
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
              placeholder="Search tools..."
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
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {isSearching ? (
            <div>
              <div className="nav-section-title">Search Results ({filteredTools.length})</div>
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelect(tool.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-item-icon">
                      <Icon size={18} />
                    </div>
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              {favoriteTools.length > 0 && (
                <div style={{ marginBottom: 8 }}>
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
                        key={`mob-fav-${tool.id}`}
                        type="button"
                        onClick={() => handleSelect(tool.id)}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="nav-item-icon">
                          <Icon size={18} />
                        </div>
                        <span>{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {CATEGORIES.map((cat) => {
                const catTools = TOOLS.filter((t) => t.category === cat.id);
                if (catTools.length === 0) return null;

                return (
                  <div key={cat.id} style={{ marginBottom: 6 }}>
                    <div className="nav-section-title">{cat.label}</div>
                    {catTools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTool === tool.id;
                      const isFav = favorites.includes(tool.id);

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelect(tool.id)}
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          style={{ justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="nav-item-icon">
                              <Icon size={18} />
                            </div>
                            <span>{tool.name}</span>
                          </div>
                          {tool.id !== 'dashboard' && (
                            <span
                              onClick={(e) => handleToggleFav(e, tool.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                color: isFav ? '#f59e0b' : 'var(--text-muted)',
                              }}
                            >
                              <Star size={13} fill={isFav ? '#f59e0b' : 'none'} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
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
            onClick={() => handleSelect('settings')}
            className="calcx-btn calcx-btn-secondary calcx-btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', marginTop: 6 }}
          >
            <SettingsIcon size={16} />
            <span>Settings & About</span>
          </button>
        </div>
      </aside>
    </>
  );
}
