import React, { useState, useEffect } from 'react';
import { History, Trash2, Copy, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getUnifiedHistory, deleteHistoryItem, clearUnifiedHistory } from '../utils/unifiedHistory';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CopyButton } from '../components/common/CopyButton';

export function HistoryPage({ onSelectTool }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [filterTool, setFilterTool] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = () => {
    setHistoryItems(getUnifiedHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id) => {
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all calculation history? This action cannot be undone.')) {
      clearUnifiedHistory();
      setHistoryItems([]);
    }
  };

  // Unique tools present in history
  const uniqueTools = Array.from(new Set(historyItems.map((item) => item.toolName))).filter(Boolean);

  const filtered = historyItems.filter((item) => {
    const matchesTool = filterTool === 'all' || item.toolName === filterTool;
    const matchesSearch =
      searchTerm === '' ||
      item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.toolName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTool && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Unified Calculation History"
        description="Review, search, reuse, and copy past calculations across all CalcX tools."
        icon={History}
        actions={
          historyItems.length > 0 && (
            <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearAll}>
              Clear All History
            </Button>
          )
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              id="search-history"
              placeholder="Search history inputs or results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tab-group" style={{ width: 'auto', overflowX: 'auto' }}>
            <button
              type="button"
              className={`tab-btn ${filterTool === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTool('all')}
            >
              All ({historyItems.length})
            </button>
            {uniqueTools.map((t) => (
              <button
                key={t}
                type="button"
                className={`tab-btn ${filterTool === t ? 'active' : ''}`}
                onClick={() => setFilterTool(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <Card title="No History Entries">
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <History size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 4 }}>
                {historyItems.length === 0 ? 'No calculations recorded yet' : 'No entries matching search filter'}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Computations from any tool are automatically logged here for fast recall.
              </p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                className="calcx-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="calcx-badge calcx-badge-primary" style={{ fontSize: '0.72rem' }}>
                      {item.toolName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.date} at {item.timestamp}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    {item.input}
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    = {item.result}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CopyButton text={item.result} />
                  {item.toolId && onSelectTool && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={ArrowUpRight}
                      onClick={() => onSelectTool(item.toolId)}
                      title="Open Tool"
                    >
                      Open
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(item.id)}
                    title="Delete item"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
