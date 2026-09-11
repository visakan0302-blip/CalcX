import React, { useState } from 'react';
import { Dices, RefreshCw, Copy, RotateCcw } from 'lucide-react';
import { generateRandomNumbers } from '../services/mathToolsService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { CopyButton } from '../components/common/CopyButton';
import { logCalculation } from '../utils/unifiedHistory';

export function RandomPage() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState([7, 23, 42, 68, 89]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = () => {
    setErrorMsg('');
    try {
      const generated = generateRandomNumbers(min, max, count, unique);
      setResults(generated);
      logCalculation({
        toolId: 'random',
        toolName: 'Random Generator',
        input: `Range ${min} to ${max} (N=${count})`,
        result: generated.join(', '),
      });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleClear = () => {
    setResults([]);
    setErrorMsg('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Random Number Generator"
        description="Generate cryptographically robust random integers, lottery numbers, and randomized sequences."
        icon={Dices}
      />

      <ToolLayout>
        {/* Generator Controls */}
        <Card title="Range & Settings" icon={Dices}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                id="random-min"
                label="Minimum Value"
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                mono
              />
              <Input
                id="random-max"
                label="Maximum Value"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                mono
              />
            </div>

            <Input
              id="random-count"
              label="Quantity of Random Numbers"
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              mono
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={unique}
                onChange={(e) => setUnique(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <span>Ensure All Numbers Are Unique (No Duplicates)</span>
            </label>

            {/* Quick Presets */}
            <div>
              <span className="form-label" style={{ marginBottom: 6 }}>Quick Presets:</span>
              <div className="chip-list">
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setMin('1');
                    setMax('6');
                    setCount('1');
                    setUnique(false);
                  }}
                >
                  Standard 6-Sided Die (1-6)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setMin('1');
                    setMax('100');
                    setCount('1');
                    setUnique(false);
                  }}
                >
                  Single (1-100)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setMin('1');
                    setMax('50');
                    setCount('6');
                    setUnique(true);
                  }}
                >
                  Lottery 6 of 50
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <Button variant="primary" size="md" icon={RefreshCw} onClick={handleGenerate} style={{ flex: 1 }}>
                Generate Numbers
              </Button>
              <Button variant="ghost" size="md" icon={RotateCcw} onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Generated Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {errorMsg ? (
            <Card title="Generation Error">
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errorMsg}</p>
            </Card>
          ) : results.length > 0 ? (
            <Card
              title={`Generated Numbers (${results.length})`}
              action={<CopyButton text={results.join(', ')} />}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '12px 0' }}>
                {results.map((num, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Range: [{min}, {max}]</span>
                <span>Type: {unique ? 'Unique values' : 'Duplicates allowed'}</span>
              </div>
            </Card>
          ) : (
            <Card title="Random Numbers">
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Dices size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p>Click "Generate Numbers" to produce randomized values.</p>
              </div>
            </Card>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
