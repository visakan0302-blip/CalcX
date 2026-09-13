import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';
import { calculatePercentage } from '../services/mathToolsService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { SeoSection } from '../components/common/SeoSection';
import { logCalculation } from '../utils/unifiedHistory';

export function PercentagePage({ onSelectTool }) {
  const [mode, setMode] = useState('what_is_x_pct_of_y');

  // Values for Mode A: What is X% of Y?
  const [val1A, setVal1A] = useState('20');
  const [val2A, setVal2A] = useState('500');

  // Values for Mode B: X is what % of Y?
  const [val1B, setVal1B] = useState('100');
  const [val2B, setVal2B] = useState('500');

  // Values for Mode C: % Increase
  const [val1C, setVal1C] = useState('500');
  const [val2C, setVal2C] = useState('600');

  // Values for Mode D: % Decrease
  const [val1D, setVal1D] = useState('600');
  const [val2D, setVal2D] = useState('500');

  let activeV1 = val1A;
  let activeV2 = val2A;
  if (mode === 'x_is_what_pct_of_y') {
    activeV1 = val1B;
    activeV2 = val2B;
  } else if (mode === 'percentage_increase') {
    activeV1 = val1C;
    activeV2 = val2C;
  } else if (mode === 'percentage_decrease') {
    activeV1 = val1D;
    activeV2 = val2D;
  }

  let resultData = null;
  let errorMsg = '';
  try {
    resultData = calculatePercentage(mode, activeV1, activeV2);
  } catch (err) {
    errorMsg = err.message;
  }

  const handleLog = () => {
    if (!resultData) return;
    logCalculation({
      toolId: 'percentage',
      toolName: 'Percentage Calculator',
      input: resultData.label,
      result: `${resultData.result.toFixed(2)}${mode.includes('is_what') || mode.includes('increase') || mode.includes('decrease') ? '%' : ''}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Percentage Calculator — Free Online Tool"
        description="Calculate what is X% of Y, find what percentage X is of Y, and calculate percentage increase or decrease instantly with clear steps."
        icon={Percent}
      />

      {/* Mode Tabs */}
      <div className="tab-group" style={{ maxWidth: 740, overflowX: 'auto' }}>
        <button
          type="button"
          className={`tab-btn ${mode === 'what_is_x_pct_of_y' ? 'active' : ''}`}
          onClick={() => setMode('what_is_x_pct_of_y')}
        >
          <span>What is X% of Y?</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'x_is_what_pct_of_y' ? 'active' : ''}`}
          onClick={() => setMode('x_is_what_pct_of_y')}
        >
          <span>X is what % of Y?</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'percentage_increase' ? 'active' : ''}`}
          onClick={() => setMode('percentage_increase')}
        >
          <span>Percentage Increase</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'percentage_decrease' ? 'active' : ''}`}
          onClick={() => setMode('percentage_decrease')}
        >
          <span>Percentage Decrease</span>
        </button>
      </div>

      <ToolLayout>
        {/* Input Parameters */}
        <Card title="Input Values" icon={Percent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'what_is_x_pct_of_y' && (
              <>
                <Input
                  id="pct-x-a"
                  label="Percentage (X)"
                  type="number"
                  step="any"
                  value={val1A}
                  onChange={(e) => setVal1A(e.target.value)}
                  suffix="%"
                  mono
                />
                <Input
                  id="pct-y-a"
                  label="Base Number (Y)"
                  type="number"
                  step="any"
                  value={val2A}
                  onChange={(e) => setVal2A(e.target.value)}
                  placeholder="Total value"
                  mono
                />
              </>
            )}

            {mode === 'x_is_what_pct_of_y' && (
              <>
                <Input
                  id="pct-x-b"
                  label="Part Value (X)"
                  type="number"
                  step="any"
                  value={val1B}
                  onChange={(e) => setVal1B(e.target.value)}
                  mono
                />
                <Input
                  id="pct-y-b"
                  label="Total Value (Y)"
                  type="number"
                  step="any"
                  value={val2B}
                  onChange={(e) => setVal2B(e.target.value)}
                  mono
                />
              </>
            )}

            {mode === 'percentage_increase' && (
              <>
                <Input
                  id="pct-x-c"
                  label="Initial Starting Value (From)"
                  type="number"
                  step="any"
                  value={val1C}
                  onChange={(e) => setVal1C(e.target.value)}
                  mono
                />
                <Input
                  id="pct-y-c"
                  label="Final New Value (To)"
                  type="number"
                  step="any"
                  value={val2C}
                  onChange={(e) => setVal2C(e.target.value)}
                  mono
                />
              </>
            )}

            {mode === 'percentage_decrease' && (
              <>
                <Input
                  id="pct-x-d"
                  label="Original Initial Value (From)"
                  type="number"
                  step="any"
                  value={val1D}
                  onChange={(e) => setVal1D(e.target.value)}
                  mono
                />
                <Input
                  id="pct-y-d"
                  label="Reduced New Value (To)"
                  type="number"
                  step="any"
                  value={val2D}
                  onChange={(e) => setVal2D(e.target.value)}
                  mono
                />
              </>
            )}
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {resultData && !errorMsg && (
            <>
              <ResultCard
                label="Result"
                value={
                  mode === 'what_is_x_pct_of_y'
                    ? resultData.result.toLocaleString()
                    : `${resultData.result.toFixed(2)}%`
                }
                copyValue={
                  mode === 'what_is_x_pct_of_y'
                    ? resultData.result.toString()
                    : `${resultData.result.toFixed(2)}%`
                }
                badge={
                  mode === 'percentage_increase'
                    ? 'Increase'
                    : mode === 'percentage_decrease'
                    ? 'Decrease'
                    : 'Percentage'
                }
                badgeType="primary"
                secondary={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Calculation Formula:
                      </span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: 2 }}>
                        {resultData.formula}
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

      <SeoSection toolId="percentage" onSelectTool={onSelectTool} />
    </div>
  );
}
