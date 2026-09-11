import React, { useState } from 'react';
import { Sigma, Check, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { solveEquation } from '../services/equationSolver';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';

export function EquationPage() {
  const [equationInput, setEquationInput] = useState('2x + 5 = 15');
  const [solutionResult, setSolutionResult] = useState(() => {
    try {
      return solveEquation('2x + 5 = 15');
    } catch {
      return null;
    }
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSolve = () => {
    setErrorMessage('');
    try {
      const res = solveEquation(equationInput);
      setSolutionResult(res);
    } catch (err) {
      setErrorMessage(err.message);
      setSolutionResult(null);
    }
  };

  const sampleEquations = [
    '2x + 5 = 15',
    'x² - 5x + 6 = 0',
    '3x + 2 = 11',
    'x² + 4x + 4 = 0',
    '2x² - 4x - 6 = 0',
    '5x - 8 = 2x + 7',
    'x² + 9 = 0',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Equation Solver"
        description="Solve linear and quadratic equations with step-by-step algebraic transformations."
        icon={Sigma}
      />

      <ToolLayout>
        {/* Equation Input Card */}
        <Card title="Input Equation" icon={Sigma}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              id="equation-input"
              label="Enter Single-Variable Equation (x)"
              value={equationInput}
              onChange={(e) => setEquationInput(e.target.value)}
              placeholder="e.g. 2x + 5 = 15 or x² - 5x + 6 = 0"
              mono
              error={errorMessage}
              helperText="Supports linear (ax + b = c) and quadratic (ax² + bx + c = 0) equations."
            />

            <Button variant="primary" size="md" icon={ArrowRight} onClick={handleSolve}>
              Solve Equation
            </Button>

            {/* Quick Example Chips */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Preset Examples
              </span>
              <div className="chip-list" style={{ marginTop: 8 }}>
                {sampleEquations.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setEquationInput(sample);
                      setErrorMessage('');
                      try {
                        const res = solveEquation(sample);
                        setSolutionResult(res);
                      } catch (err) {
                        setErrorMessage(err.message);
                      }
                    }}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Solution Card & Step-by-Step Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {solutionResult && (
            <>
              <ResultCard
                label="Solution"
                value={solutionResult.solutions.join(' ,  ')}
                copyValue={solutionResult.solutions.join(', ')}
                badge={solutionResult.type === 'linear' ? 'Linear' : 'Quadratic'}
                badgeType="primary"
                secondary={
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    Original Equation: <strong>{solutionResult.equation}</strong>
                  </span>
                }
              />

              {/* Step-by-step walkthrough */}
              <Card title="Step-by-Step Solution" icon={Check}>
                <div className="steps-list">
                  {solutionResult.steps.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <div className="step-num">Step {idx + 1}: {step.title}</div>
                      <div className="step-text">{step.detail}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!solutionResult && !errorMessage && (
            <Card title="How to use">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Type any linear equation (e.g. <code>2x + 5 = 15</code>) or quadratic equation (e.g. <code>x² - 5x + 6 = 0</code>) with variable <strong>x</strong> and click <strong>Solve Equation</strong>. The solver will expand terms, compute the discriminant, and show you every mathematical step!
              </p>
            </Card>
          )}

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '16px',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Solver Error:</strong> {errorMessage}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
