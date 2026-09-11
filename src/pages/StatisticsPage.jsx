import React, { useState } from 'react';
import { BarChart3, Calculator, Copy, RotateCcw } from 'lucide-react';
import { calculateStatistics } from '../services/mathToolsService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { logCalculation } from '../utils/unifiedHistory';

export function StatisticsPage() {
  const [dataInput, setDataInput] = useState('10, 20, 30, 40, 50');

  let stats = null;
  let errorMsg = '';
  try {
    stats = calculateStatistics(dataInput);
  } catch (err) {
    errorMsg = err.message;
  }

  const handleLog = () => {
    if (!stats) return;
    logCalculation({
      toolId: 'statistics',
      toolName: 'Statistics Calculator',
      input: `Dataset (N=${stats.count})`,
      result: `Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median}, StdDev: ${stats.sampleStdDev.toFixed(2)}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Statistics Calculator"
        description="Compute summary statistics, central tendencies, and dispersions for any dataset."
        icon={BarChart3}
      />

      <ToolLayout>
        {/* Dataset Input */}
        <Card title="Dataset Input" icon={BarChart3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="dataset-input" className="form-label">
                Enter Numbers (Comma or Space Separated)
              </label>
              <textarea
                id="dataset-input"
                rows={5}
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="e.g. 12, 15, 18, 22, 29, 31, 35"
                className="form-input form-input-mono"
                style={{ height: 'auto', padding: '12px', resize: 'vertical' }}
              />
            </div>

            {/* Quick Samples */}
            <div>
              <span className="form-label" style={{ marginBottom: 6 }}>Sample Datasets:</span>
              <div className="chip-list">
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setDataInput('10, 20, 30, 40, 50')}
                >
                  Sequential: 10 to 50
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setDataInput('4, 8, 6, 5, 3, 2, 8, 9, 2, 5')}
                >
                  Repeated Modes (10 values)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => setDataInput('98, 85, 92, 88, 76, 95, 89, 94')}
                >
                  Exam Scores
                </button>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setDataInput('')}>
              Clear Dataset
            </Button>
          </div>
        </Card>

        {/* Results Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {stats && !errorMsg && (
            <>
              <ResultCard
                label="Sample Mean (Average)"
                value={stats.mean.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                badge={`Sample Size: ${stats.count}`}
                badgeType="primary"
                secondary={
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sum (Σx):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {stats.sum.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Median:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                        {stats.median}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mode:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Range (Max − Min):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {stats.range} ({stats.min} to {stats.max})
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sample Std Dev (s):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--success)' }}>
                        {stats.sampleStdDev.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sample Variance (s²):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {stats.sampleVariance.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Population Std Dev (σ):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {stats.populationStdDev.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Population Variance (σ²):</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {stats.populationVariance.toFixed(4)}
                      </div>
                    </div>
                  </div>
                }
              />

              <Button variant="secondary" size="sm" onClick={handleLog}>
                Save to Calculation History
              </Button>
            </>
          )}

          {errorMsg && (
            <Card title="Input Error">
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errorMsg}</p>
            </Card>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
