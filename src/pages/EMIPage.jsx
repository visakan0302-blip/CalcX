import React, { useState } from 'react';
import { Landmark, Calendar, PieChart, Table, ArrowRight, Check } from 'lucide-react';
import { calculateEMI } from '../services/financeService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { ResetButton } from '../components/common/ResetButton';
import { logCalculation } from '../utils/unifiedHistory';

export function EMIPage() {
  const [loanAmount, setLoanAmount] = useState('1000000');
  const [annualRate, setAnnualRate] = useState('8.5');
  const [tenure, setTenure] = useState('5');
  const [tenureUnit, setTenureUnit] = useState('years');
  const [currency, setCurrency] = useState('₹');
  const [showSchedule, setShowSchedule] = useState(false);

  const handleReset = () => {
    setLoanAmount('1000000');
    setAnnualRate('8.5');
    setTenure('5');
    setTenureUnit('years');
  };

  const emiData = calculateEMI(loanAmount, annualRate, tenure, tenureUnit);

  const formatMoney = (val) => {
    return `${currency} ${Number(val.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleLog = () => {
    logCalculation({
      toolId: 'emi',
      toolName: 'EMI Calculator',
      input: `${currency}${loanAmount} at ${annualRate}% for ${tenure} ${tenureUnit}`,
      result: `EMI: ${formatMoney(emiData.monthlyEMI)}/mo, Total Interest: ${formatMoney(emiData.totalInterest)}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="EMI / Loan Calculator"
        description="Calculate monthly installment (EMI), total interest, and full repayment amortization schedule."
        icon={Landmark}
        actions={
          <Select
            id="emi-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: '₹', label: 'INR (₹)' },
              { value: '$', label: 'USD ($)' },
              { value: '€', label: 'EUR (€)' },
              { value: '£', label: 'GBP (£)' },
            ]}
            style={{ width: 110 }}
          />
        }
      />

      <ToolLayout>
        {/* Input Parameters */}
        <Card
          title="Loan Details"
          icon={Landmark}
          action={<ResetButton onReset={handleReset} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="loan-amount"
              label="Loan Amount (Principal)"
              type="number"
              min="0"
              step="any"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              suffix={currency}
              mono
            />

            <Input
              id="interest-rate"
              label="Annual Interest Rate (%)"
              type="number"
              min="0"
              step="any"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              suffix="%"
              mono
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <Input
                id="loan-tenure"
                label="Loan Tenure"
                type="number"
                min="1"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                mono
              />
              <Select
                id="tenure-unit"
                label="Period"
                value={tenureUnit}
                onChange={(e) => setTenureUnit(e.target.value)}
                options={[
                  { value: 'years', label: 'Years' },
                  { value: 'months', label: 'Months' },
                ]}
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Common Loan Scenarios
              </span>
              <div className="chip-list" style={{ marginTop: 6 }}>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setLoanAmount('500000');
                    setAnnualRate('10.5');
                    setTenure('3');
                    setTenureUnit('years');
                  }}
                >
                  Personal: ₹5L @ 10.5% (3y)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setLoanAmount('800000');
                    setAnnualRate('8.9');
                    setTenure('5');
                    setTenureUnit('years');
                  }}
                >
                  Auto: ₹8L @ 8.9% (5y)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setLoanAmount('3500000');
                    setAnnualRate('8.4');
                    setTenure('20');
                    setTenureUnit('years');
                  }}
                >
                  Home: ₹35L @ 8.4% (20y)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Monthly Loan EMI"
            value={formatMoney(emiData.monthlyEMI)}
            unit="/ month"
            copyValue={formatMoney(emiData.monthlyEMI)}
            badge={`${emiData.totalMonths} Installments`}
            badgeType="primary"
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Interest Payable:</span>
                  <strong style={{ color: 'var(--danger)' }}>{formatMoney(emiData.totalInterest)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Payment (Principal + Interest):</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {formatMoney(emiData.totalPayment)}
                  </strong>
                </div>

                {/* Visual Ratio Bar */}
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--primary)' }}>Principal ({emiData.principalPct.toFixed(1)}%)</span>
                    <span style={{ color: 'var(--danger)' }}>Interest ({emiData.interestPct.toFixed(1)}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--danger)', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${emiData.principalPct}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
              </div>
            }
          />

          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant={showSchedule ? 'primary' : 'secondary'}
              size="sm"
              icon={Table}
              onClick={() => setShowSchedule(!showSchedule)}
              style={{ flex: 1 }}
            >
              {showSchedule ? 'Hide Amortization Table' : 'View Amortization Schedule'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLog}>
              Save History
            </Button>
          </div>
        </div>
      </ToolLayout>

      {/* Amortization Schedule Table */}
      {showSchedule && emiData.schedule.length > 0 && (
        <Card title="Monthly Amortization Schedule" icon={Table}>
          <div style={{ overflowX: 'auto', maxHeight: 400 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Month</th>
                  <th style={{ padding: '10px 12px' }}>EMI</th>
                  <th style={{ padding: '10px 12px' }}>Principal</th>
                  <th style={{ padding: '10px 12px' }}>Interest</th>
                  <th style={{ padding: '10px 12px' }}>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {emiData.schedule.map((row) => (
                  <tr
                    key={row.month}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: row.month % 2 === 0 ? 'var(--bg-card-subtle)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Month {row.month}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{formatMoney(row.emi)}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {formatMoney(row.principalPart)}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>
                      {formatMoney(row.interestPart)}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>
                      {formatMoney(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
