import React, { useState } from 'react';
import { Wallet, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { calculateSalary } from '../services/financeService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { ResetButton } from '../components/common/ResetButton';
import { logCalculation } from '../utils/unifiedHistory';

export function SalaryPage() {
  const [salaryInput, setSalaryInput] = useState('1200000');
  const [inputType, setInputType] = useState('annual'); // 'annual' | 'monthly'
  const [customDeductions, setCustomDeductions] = useState('0');

  const handleReset = () => {
    setSalaryInput('1200000');
    setInputType('annual');
    setCustomDeductions('0');
  };

  const salaryData = calculateSalary(salaryInput, inputType, customDeductions);

  const formatRupee = (val) => {
    return `₹${Number(val.toFixed(0)).toLocaleString('en-IN')}`;
  };

  const handleLog = () => {
    logCalculation({
      toolId: 'salary',
      toolName: 'Salary Calculator',
      input: `CTC ₹${salaryInput} (${inputType})`,
      result: `Take-home: ${formatRupee(salaryData.monthlyTakeHome)}/mo (${formatRupee(salaryData.annualTakeHome)}/yr)`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Salary & Income Calculator"
        description="Estimate monthly take-home salary, EPF, professional tax, and tax deductions from annual CTC."
        icon={Wallet}
      />

      <ToolLayout>
        {/* Input Parameters */}
        <Card
          title="Salary Parameters"
          icon={Wallet}
          action={<ResetButton onReset={handleReset} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Input Income As:</span>
              <div className="tab-group">
                <button
                  type="button"
                  className={`tab-btn ${inputType === 'annual' ? 'active' : ''}`}
                  onClick={() => setInputType('annual')}
                >
                  <span>Annual Package (CTC)</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${inputType === 'monthly' ? 'active' : ''}`}
                  onClick={() => setInputType('monthly')}
                >
                  <span>Monthly Gross</span>
                </button>
              </div>
            </div>

            <Input
              id="salary-value"
              label={inputType === 'annual' ? 'Annual CTC Amount' : 'Monthly Gross Amount'}
              type="number"
              min="0"
              step="any"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              suffix="₹"
              mono
            />

            <Input
              id="custom-deductions"
              label="Additional Monthly Deductions (Insurance, Loan, etc.)"
              type="number"
              min="0"
              step="any"
              value={customDeductions}
              onChange={(e) => setCustomDeductions(e.target.value)}
              suffix="₹/mo"
              mono
            />

            {/* Quick Slabs */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Preset Annual CTCs
              </span>
              <div className="chip-list" style={{ marginTop: 6 }}>
                {[600000, 1000000, 1500000, 2500000].map((ctc) => (
                  <button
                    key={ctc}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setInputType('annual');
                      setSalaryInput(ctc.toString());
                    }}
                  >
                    ₹{(ctc / 100000).toFixed(0)} Lakhs
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Estimated In-Hand Take-Home"
            value={formatRupee(salaryData.monthlyTakeHome)}
            unit="/ month"
            copyValue={`${formatRupee(salaryData.monthlyTakeHome)} per month (${formatRupee(salaryData.annualTakeHome)}/year)`}
            badge="Estimated Take-Home"
            badgeType="success"
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Monthly Gross Income:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatRupee(salaryData.monthlyGross)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Total Deductions:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>
                    -{formatRupee(salaryData.totalMonthlyDeductions)}
                  </strong>
                </div>

                {/* Monthly Deductions Breakdown */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: '0.86rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>EPF Contribution:</span>
                    <span>{formatRupee(salaryData.monthlyEPF)} / mo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Professional Tax:</span>
                    <span>{formatRupee(salaryData.monthlyPT)} / mo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Income Tax (TDS):</span>
                    <span>{formatRupee(salaryData.monthlyTax)} / mo</span>
                  </div>
                  {salaryData.customDeductions > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Custom Deductions:</span>
                      <span>{formatRupee(salaryData.customDeductions)} / mo</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Annual In-Hand Projection:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {formatRupee(salaryData.annualTakeHome)} / year
                  </strong>
                </div>
              </div>
            }
          />

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{salaryData.disclaimer}</span>
          </div>

          <Button variant="secondary" size="sm" onClick={handleLog}>
            Save to Calculation History
          </Button>
        </div>
      </ToolLayout>
    </div>
  );
}
