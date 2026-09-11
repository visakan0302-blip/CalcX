import React, { useState } from 'react';
import { Divide, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { calculateFractions } from '../services/mathToolsService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { logCalculation } from '../utils/unifiedHistory';

export function FractionPage() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [operator, setOperator] = useState('+');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('4');

  let fracResult = null;
  let errorMsg = '';
  try {
    fracResult = calculateFractions(num1, den1, operator, num2, den2);
  } catch (err) {
    errorMsg = err.message;
  }

  const handleLog = () => {
    if (!fracResult) return;
    logCalculation({
      toolId: 'fraction',
      toolName: 'Fraction Calculator',
      input: `${num1}/${den1} ${operator} ${num2}/${den2}`,
      result: `${fracResult.fractionStr} (${fracResult.decimalValue.toFixed(4)})`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Fraction Calculator"
        description="Add, subtract, multiply, and divide fractions with automated GCD simplification and decimal conversion."
        icon={Divide}
      />

      <ToolLayout>
        {/* Fraction Input Expression */}
        <Card title="Fraction Arithmetic" icon={Divide}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: '24px 16px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-lg)',
                flexWrap: 'wrap',
              }}
            >
              {/* Fraction 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', width: 72, gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="form-input form-input-mono"
                  style={{ textAlign: 'center', height: 42 }}
                  aria-label="Numerator 1"
                />
                <div style={{ height: 2, background: 'var(--text-primary)', width: '100%' }} />
                <input
                  type="number"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  className="form-input form-input-mono"
                  style={{ textAlign: 'center', height: 42 }}
                  aria-label="Denominator 1"
                />
              </div>

              {/* Operator Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['+', '-', '*', '/'].map((op) => (
                  <button
                    key={op}
                    type="button"
                    className={`calcx-btn ${operator === op ? 'calcx-btn-primary' : 'calcx-btn-secondary'}`}
                    onClick={() => setOperator(op)}
                    style={{ width: 40, height: 34, padding: 0, fontSize: '1.1rem' }}
                  >
                    {op === '*' ? '×' : op === '/' ? '÷' : op}
                  </button>
                ))}
              </div>

              {/* Fraction 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', width: 72, gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="form-input form-input-mono"
                  style={{ textAlign: 'center', height: 42 }}
                  aria-label="Numerator 2"
                />
                <div style={{ height: 2, background: 'var(--text-primary)', width: '100%' }} />
                <input
                  type="number"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  className="form-input form-input-mono"
                  style={{ textAlign: 'center', height: 42 }}
                  aria-label="Denominator 2"
                />
              </div>
            </div>

            {/* Quick Examples */}
            <div>
              <span className="form-label" style={{ marginBottom: 6 }}>Examples from Math Standards:</span>
              <div className="chip-list">
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setNum1('1');
                    setDen1('2');
                    setOperator('+');
                    setNum2('1');
                    setDen2('4');
                  }}
                >
                  1/2 + 1/4 = 3/4
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setNum1('2');
                    setDen1('3');
                    setOperator('*');
                    setNum2('3');
                    setDen2('5');
                  }}
                >
                  2/3 × 3/5 = 2/5
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setNum1('3');
                    setDen1('4');
                    setOperator('/');
                    setNum2('2');
                    setDen2('3');
                  }}
                >
                  3/4 ÷ 2/3 = 9/8
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fracResult && !errorMsg && (
            <>
              <ResultCard
                label="Simplified Fraction Result"
                value={fracResult.fractionStr}
                copyValue={fracResult.fractionStr}
                badge={`Decimal: ${fracResult.decimalValue.toFixed(4)}`}
                badgeType="primary"
                secondary={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {fracResult.mixedStr !== fracResult.fractionStr && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mixed Number Form:</span>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{fracResult.mixedStr}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Decimal Equivalent:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{fracResult.decimalValue.toString()}</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Step Explanation:
                      </span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                        {fracResult.stepExplanation}
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
            <Card title="Calculation Error">
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{errorMsg}</p>
            </Card>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
