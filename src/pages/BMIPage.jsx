import React, { useState } from 'react';
import { Scale, RotateCcw, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { calculateBMI, BMI_DISCLAIMER, BMI_CATEGORIES } from '../services/bmiCalculator';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { SeoSection } from '../components/common/SeoSection';

export function BMIPage({ onSelectTool }) {
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' | 'm' | 'ft_in'
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' | 'lb'

  const [heightCm, setHeightCm] = useState('175');
  const [heightM, setHeightM] = useState('1.75');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');

  const [weightVal, setWeightVal] = useState('70');

  const handleReset = () => {
    setHeightCm('175');
    setHeightM('1.75');
    setHeightFt('5');
    setHeightIn('9');
    setWeightVal('70');
  };

  // Determine current height values to pass
  let h1 = heightCm;
  let h2 = 0;
  if (heightUnit === 'm') {
    h1 = heightM;
  } else if (heightUnit === 'ft_in') {
    h1 = heightFt;
    h2 = heightIn;
  }

  const result = calculateBMI({
    heightUnit,
    heightVal1: h1,
    heightVal2: h2,
    weightUnit,
    weightVal,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Free Online BMI Calculator"
        description="Calculate your Body Mass Index (BMI) and check your healthy weight range with instant WHO classifications, metric and imperial units."
        icon={Scale}
        actions={
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset
          </Button>
        }
      />

      <ToolLayout>
        {/* Form Inputs */}
        <Card title="Body Metrics" icon={Scale}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Height section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="form-label" style={{ margin: 0 }}>Height</span>
                <div className="tab-group" style={{ width: 'auto' }}>
                  <button
                    type="button"
                    className={`tab-btn ${heightUnit === 'cm' ? 'active' : ''}`}
                    onClick={() => setHeightUnit('cm')}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${heightUnit === 'm' ? 'active' : ''}`}
                    onClick={() => setHeightUnit('m')}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    m
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${heightUnit === 'ft_in' ? 'active' : ''}`}
                    onClick={() => setHeightUnit('ft_in')}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    ft / in
                  </button>
                </div>
              </div>

              {heightUnit === 'cm' && (
                <Input
                  id="bmi-height-cm"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Height in cm (e.g. 175)"
                  suffix="cm"
                  mono
                />
              )}

              {heightUnit === 'm' && (
                <Input
                  id="bmi-height-m"
                  type="number"
                  step="0.01"
                  value={heightM}
                  onChange={(e) => setHeightM(e.target.value)}
                  placeholder="Height in meters (e.g. 1.75)"
                  suffix="m"
                  mono
                />
              )}

              {heightUnit === 'ft_in' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input
                    id="bmi-height-ft"
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="Feet"
                    suffix="ft"
                    mono
                  />
                  <Input
                    id="bmi-height-in"
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="Inches"
                    suffix="in"
                    mono
                  />
                </div>
              )}
            </div>

            {/* Weight section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="form-label" style={{ margin: 0 }}>Weight</span>
                <div className="tab-group" style={{ width: 'auto' }}>
                  <button
                    type="button"
                    className={`tab-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                    onClick={() => setWeightUnit('kg')}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${weightUnit === 'lb' ? 'active' : ''}`}
                    onClick={() => setWeightUnit('lb')}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    lb
                  </button>
                </div>
              </div>

              <Input
                id="bmi-weight"
                type="number"
                value={weightVal}
                onChange={(e) => setWeightVal(e.target.value)}
                placeholder={`Weight in ${weightUnit}`}
                suffix={weightUnit}
                mono
              />
            </div>
          </div>
        </Card>

        {/* Results & Visual Scale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {result ? (
            <>
              <ResultCard
                label="Body Mass Index (BMI)"
                value={result.formattedBMI}
                unit="kg/m²"
                copyValue={`BMI: ${result.formattedBMI} (${result.category.label})`}
                badge={result.category.label}
                secondary={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Classification:</span>
                      <strong style={{ color: result.category.color }}>{result.category.label}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Healthy Weight Range:</span>
                      <strong>{result.healthyWeightRange}</strong>
                    </div>
                  </div>
                }
              >
                {/* Visual Scale Meter */}
                <div className="bmi-gauge-container">
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Visual BMI Spectrum
                  </span>
                  <div className="bmi-track">
                    <div
                      className="bmi-needle"
                      style={{ left: `${result.gaugePercent}%` }}
                      title={`BMI: ${result.formattedBMI}`}
                    />
                  </div>
                  <div className="bmi-markers">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25.0</span>
                    <span>30.0</span>
                    <span>40+</span>
                  </div>
                </div>
              </ResultCard>

              {/* BMI Categories Reference */}
              <Card title="WHO Weight Categories">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {BMI_CATEGORIES.map((cat) => {
                    const isCurrent = cat.label === result.category.label;
                    return (
                      <div
                        key={cat.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isCurrent ? 'var(--bg-card-subtle)' : 'transparent',
                          border: isCurrent ? `1px solid ${cat.color}` : '1px solid transparent',
                          fontSize: '0.86rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: cat.color,
                              display: 'inline-block',
                            }}
                          />
                          <strong style={{ color: isCurrent ? cat.color : 'var(--text-primary)' }}>
                            {cat.label}
                          </strong>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {cat.min} {cat.max === Infinity ? '+' : `- ${cat.max}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Disclaimer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                }}
              >
                <Info size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span>{BMI_DISCLAIMER}</span>
              </div>
            </>
          ) : (
            <Card title="BMI Analysis" icon={Scale}>
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Scale size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Enter Height & Weight
                </p>
                <p style={{ fontSize: '0.88rem', maxWidth: 360, margin: '0 auto' }}>
                  Provide positive values above to view your real-time Body Mass Index, WHO classification, and visual health meter.
                </p>
              </div>
            </Card>
          )}
        </div>
      </ToolLayout>

      <SeoSection toolId="bmi" onSelectTool={onSelectTool} />
    </div>
  );
}
