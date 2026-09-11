import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RotateCcw, Copy, History, Trash2, Check } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnits, formatUnitNumber } from '../services/unitConverter';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { getItem, setItem } from '../utils/storage';

const RECENT_KEY = 'calcx_unit_recents_v1';

export function UnitConverterPage() {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const catConfig = UNIT_CATEGORIES[selectedCategory];

  const [fromUnit, setFromUnit] = useState(catConfig.defaultFrom);
  const [toUnit, setToUnit] = useState(catConfig.defaultTo);
  const [inputValue, setInputValue] = useState('1');
  const [recentConversions, setRecentConversions] = useState(() => getItem(RECENT_KEY, []));

  // Switch units when category changes
  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    const newCat = UNIT_CATEGORIES[catKey];
    setFromUnit(newCat.defaultFrom);
    setToUnit(newCat.defaultTo);
  };

  // Compute conversion
  const conversion = convertUnits(selectedCategory, fromUnit, toUnit, inputValue);

  // Save recent conversion when inputValue is typed/settled
  useEffect(() => {
    if (!inputValue || isNaN(parseFloat(inputValue))) return;

    const timer = setTimeout(() => {
      const entry = {
        id: Date.now(),
        category: catConfig.name,
        fromText: `${inputValue} ${conversion.fromUnit.symbol}`,
        toText: `${conversion.formatted} ${conversion.toUnit.symbol}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRecentConversions((prev) => {
        const filtered = prev.filter(
          (p) => p.fromText !== entry.fromText || p.toText !== entry.toText
        );
        const updated = [entry, ...filtered.slice(0, 14)];
        setItem(RECENT_KEY, updated);
        return updated;
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const unitOptions = Object.entries(catConfig.units).map(([key, u]) => ({
    value: key,
    label: u.name,
    sublabel: u.symbol,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Unit Converter"
        description="Instant high-precision conversions across 13 engineering and scientific categories."
        icon={ArrowLeftRight}
      />

      {/* Category Tabs */}
      <div className="tab-group" style={{ overflowX: 'auto', padding: '6px' }}>
        {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            type="button"
            className={`tab-btn ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(key)}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <ToolLayout>
        {/* Input Form Card */}
        <Card title="Conversion Settings" icon={ArrowLeftRight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              id="unit-value-input"
              label="Value to Convert"
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter amount..."
              mono
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'flex-end' }}>
              <Select
                id="from-unit-select"
                label="From"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                options={unitOptions}
              />

              <div style={{ paddingBottom: 4 }}>
                <Button
                  variant="secondary"
                  size="md"
                  icon={ArrowLeftRight}
                  onClick={handleSwap}
                  title="Swap From and To units"
                  className="calcx-btn-icon"
                />
              </div>

              <Select
                id="to-unit-select"
                label="To"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                options={unitOptions}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleClear}>
                Clear Input
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Converted Value"
            value={conversion.formatted}
            unit={conversion.toUnit.symbol}
            copyValue={`${conversion.formatted} ${conversion.toUnit.symbol}`}
            badge={catConfig.name}
            secondary={
              conversion.formula && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Conversion Formula
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {conversion.formula}
                  </span>
                </div>
              )
            }
          />

          {/* Recent Conversions */}
          {recentConversions.length > 0 && (
            <Card
              title="Recent Conversions"
              icon={History}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    setRecentConversions([]);
                    setItem(RECENT_KEY, []);
                  }}
                >
                  Clear
                </Button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                {recentConversions.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      fontSize: '0.86rem',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {rec.fromText}
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rec.toText}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
