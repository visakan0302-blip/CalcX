import React, { useState } from 'react';
import { TrendingUp, Percent, Calendar, DollarSign, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  compareInterests,
  calculateInvestmentGrowth,
} from '../services/interestService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { SeoSection } from '../components/common/SeoSection';
import { logCalculation } from '../utils/unifiedHistory';

export function InterestPage({ onSelectTool }) {
  const [activeTab, setActiveTab] = useState('simple'); // 'simple' | 'compound' | 'compare' | 'sip'
  const [currency, setCurrency] = useState('₹');

  // Simple Interest State
  const [siPrincipal, setSiPrincipal] = useState('10000');
  const [siRate, setSiRate] = useState('10');
  const [siTime, setSiTime] = useState('2');
  const [siTimeUnit, setSiTimeUnit] = useState('years'); // 'years' | 'months' | 'days'

  // Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState('10000');
  const [ciRate, setCiRate] = useState('10');
  const [ciTime, setCiTime] = useState('2');
  const [ciFreq, setCiFreq] = useState('annually'); // 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily'

  // Compare State
  const [cmpPrincipal, setCmpPrincipal] = useState('10000');
  const [cmpRate, setCmpRate] = useState('10');
  const [cmpTime, setCmpTime] = useState('2');
  const [cmpFreq, setCmpFreq] = useState('annually');

  // Regular Contribution / SIP State
  const [sipInitial, setSipInitial] = useState('10000');
  const [sipPeriodic, setSipPeriodic] = useState('5000');
  const [sipFreq, setSipFreq] = useState('monthly');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('5');

  const formatMoney = (val) => {
    return `${currency} ${Number(val.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculations
  const siResult = calculateSimpleInterest(siPrincipal, siRate, siTime, siTimeUnit);
  const ciResult = calculateCompoundInterest(ciPrincipal, ciRate, ciTime, 'years', ciFreq);
  const cmpResult = compareInterests(cmpPrincipal, cmpRate, cmpTime, cmpFreq);
  const sipResult = calculateInvestmentGrowth(sipInitial, sipPeriodic, sipFreq, sipRate, sipYears);

  const logCurrent = () => {
    if (activeTab === 'simple') {
      logCalculation({
        toolId: 'interest',
        toolName: 'Simple Interest',
        input: `${currency}${siPrincipal} at ${siRate}% for ${siTime} ${siTimeUnit}`,
        result: `Interest: ${formatMoney(siResult.interest)}, Final: ${formatMoney(siResult.finalAmount)}`,
      });
    } else if (activeTab === 'compound') {
      logCalculation({
        toolId: 'interest',
        toolName: 'Compound Interest',
        input: `${currency}${ciPrincipal} at ${ciRate}% (${ciFreq}) for ${ciTime} yrs`,
        result: `Interest: ${formatMoney(ciResult.interest)}, Final: ${formatMoney(ciResult.finalAmount)}`,
      });
    } else if (activeTab === 'sip') {
      logCalculation({
        toolId: 'interest',
        toolName: 'Investment Growth',
        input: `Initial: ${currency}${sipInitial}, +${currency}${sipPeriodic}/${sipFreq} at ${sipRate}% for ${sipYears} yrs`,
        result: `Final Value: ${formatMoney(sipResult.finalValue)} (Earned: ${formatMoney(sipResult.interestEarned)})`,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Simple & Compound Interest Calculator"
        description="Calculate Simple Interest (SI) and Compound Interest (CI) with flexible compounding options, side-by-side comparison, and regular SIP growth."
        icon={TrendingUp}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              id="currency-selector"
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
          </div>
        }
      />

      {/* Mode Tabs */}
      <div className="tab-group" style={{ maxWidth: 680 }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'simple' ? 'active' : ''}`}
          onClick={() => setActiveTab('simple')}
        >
          <span>Simple Interest</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'compound' ? 'active' : ''}`}
          onClick={() => setActiveTab('compound')}
        >
          <span>Compound Interest</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <span>Compare Simple vs Compound</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'sip' ? 'active' : ''}`}
          onClick={() => setActiveTab('sip')}
        >
          <span>Regular Contributions</span>
        </button>
      </div>

      {/* Tab 1: Simple Interest */}
      {activeTab === 'simple' && (
        <ToolLayout>
          <Card title="Simple Interest Parameters" icon={TrendingUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                id="si-principal"
                label="Principal Amount (P)"
                type="number"
                min="0"
                step="any"
                value={siPrincipal}
                onChange={(e) => setSiPrincipal(e.target.value)}
                suffix={currency}
                mono
              />

              <Input
                id="si-rate"
                label="Annual Interest Rate (%)"
                type="number"
                min="0"
                step="any"
                value={siRate}
                onChange={(e) => setSiRate(e.target.value)}
                suffix="%"
                mono
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  id="si-time"
                  label="Time Period (T)"
                  type="number"
                  min="0"
                  step="any"
                  value={siTime}
                  onChange={(e) => setSiTime(e.target.value)}
                  mono
                />
                <Select
                  id="si-time-unit"
                  label="Time Unit"
                  value={siTimeUnit}
                  onChange={(e) => setSiTimeUnit(e.target.value)}
                  options={[
                    { value: 'years', label: 'Years' },
                    { value: 'months', label: 'Months' },
                    { value: 'days', label: 'Days' },
                  ]}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setSiPrincipal('10000');
                    setSiRate('10');
                    setSiTime('2');
                    setSiTimeUnit('years');
                  }}
                >
                  {currency}10k @ 10% (2 yrs)
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setSiPrincipal('50000');
                    setSiRate('7.5');
                    setSiTime('5');
                    setSiTimeUnit('years');
                  }}
                >
                  {currency}50k @ 7.5% (5 yrs)
                </button>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ResultCard
              label="Total Interest Earned"
              value={formatMoney(siResult.interest)}
              copyValue={formatMoney(siResult.interest)}
              badge="Simple Interest"
              badgeType="success"
              secondary={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Initial Principal:</span>
                    <strong>{formatMoney(siResult.principal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Final Maturity Amount:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {formatMoney(siResult.finalAmount)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Formula:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>I = (P × R × T) / 100</span>
                  </div>
                </div>
              }
            />

            <Button variant="secondary" size="sm" onClick={logCurrent}>
              Save to Calculation History
            </Button>
          </div>
        </ToolLayout>
      )}

      {/* Tab 2: Compound Interest */}
      {activeTab === 'compound' && (
        <ToolLayout>
          <Card title="Compound Interest Parameters" icon={TrendingUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                id="ci-principal"
                label="Principal Amount (P)"
                type="number"
                min="0"
                step="any"
                value={ciPrincipal}
                onChange={(e) => setCiPrincipal(e.target.value)}
                suffix={currency}
                mono
              />

              <Input
                id="ci-rate"
                label="Annual Interest Rate (%)"
                type="number"
                min="0"
                step="any"
                value={ciRate}
                onChange={(e) => setCiRate(e.target.value)}
                suffix="%"
                mono
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  id="ci-time"
                  label="Time in Years (T)"
                  type="number"
                  min="0"
                  step="any"
                  value={ciTime}
                  onChange={(e) => setCiTime(e.target.value)}
                  mono
                />
                <Select
                  id="ci-freq"
                  label="Compounding Frequency"
                  value={ciFreq}
                  onChange={(e) => setCiFreq(e.target.value)}
                  options={[
                    { value: 'annually', label: 'Annually (1x/yr)' },
                    { value: 'semi-annually', label: 'Semi-annually (2x/yr)' },
                    { value: 'quarterly', label: 'Quarterly (4x/yr)' },
                    { value: 'monthly', label: 'Monthly (12x/yr)' },
                    { value: 'daily', label: 'Daily (365x/yr)' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ResultCard
              label="Compound Interest Earned"
              value={formatMoney(ciResult.interest)}
              copyValue={formatMoney(ciResult.interest)}
              badge={`Compounded ${ciFreq}`}
              badgeType="primary"
              secondary={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Initial Principal:</span>
                    <strong>{formatMoney(ciResult.principal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Final Maturity Amount:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {formatMoney(ciResult.finalAmount)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Formula:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>A = P × (1 + r/n)^(n×t)</span>
                  </div>
                </div>
              }
            />

            <Button variant="secondary" size="sm" onClick={logCurrent}>
              Save to Calculation History
            </Button>
          </div>
        </ToolLayout>
      )}

      {/* Tab 3: Compare Simple vs Compound */}
      {activeTab === 'compare' && (
        <ToolLayout>
          <Card title="Comparison Parameters" icon={Layers}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                id="cmp-principal"
                label="Principal Amount"
                type="number"
                min="0"
                step="any"
                value={cmpPrincipal}
                onChange={(e) => setCmpPrincipal(e.target.value)}
                suffix={currency}
                mono
              />

              <Input
                id="cmp-rate"
                label="Annual Interest Rate (%)"
                type="number"
                min="0"
                step="any"
                value={cmpRate}
                onChange={(e) => setCmpRate(e.target.value)}
                suffix="%"
                mono
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  id="cmp-time"
                  label="Time in Years"
                  type="number"
                  min="0"
                  step="any"
                  value={cmpTime}
                  onChange={(e) => setCmpTime(e.target.value)}
                  mono
                />
                <Select
                  id="cmp-freq"
                  label="Compound Frequency"
                  value={cmpFreq}
                  onChange={(e) => setCmpFreq(e.target.value)}
                  options={[
                    { value: 'annually', label: 'Annually' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ResultCard
              label="Extra Earned with Compound Interest"
              value={formatMoney(cmpResult.difference)}
              copyValue={`Simple Interest: ${formatMoney(cmpResult.simpleInterest)}, Compound: ${formatMoney(cmpResult.compoundInterest)}, Difference: ${formatMoney(cmpResult.difference)}`}
              badge={`+${cmpResult.compoundGainPct.toFixed(1)}% Extra`}
              badgeType="success"
              secondary={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Simple Interest:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {formatMoney(cmpResult.simpleInterest)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Final: {formatMoney(cmpResult.simpleFinal)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compound Interest:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                        {formatMoney(cmpResult.compoundInterest)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Final: {formatMoney(cmpResult.compoundFinal)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Over {cmpTime} years, compounding generates {formatMoney(cmpResult.difference)} more wealth due to interest earning interest.
                  </p>
                </div>
              }
            />
          </div>
        </ToolLayout>
      )}

      {/* Tab 4: Regular Contribution (SIP) */}
      {activeTab === 'sip' && (
        <ToolLayout>
          <Card title="Periodic Investment Setup" icon={TrendingUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                id="sip-initial"
                label="Initial Investment"
                type="number"
                min="0"
                step="any"
                value={sipInitial}
                onChange={(e) => setSipInitial(e.target.value)}
                suffix={currency}
                mono
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <Input
                  id="sip-periodic"
                  label="Regular Contribution"
                  type="number"
                  min="0"
                  step="any"
                  value={sipPeriodic}
                  onChange={(e) => setSipPeriodic(e.target.value)}
                  suffix={currency}
                  mono
                />
                <Select
                  id="sip-freq"
                  label="Frequency"
                  value={sipFreq}
                  onChange={(e) => setSipFreq(e.target.value)}
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  id="sip-rate"
                  label="Expected Return (%)"
                  type="number"
                  min="0"
                  step="any"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  suffix="%"
                  mono
                />
                <Input
                  id="sip-years"
                  label="Duration in Years"
                  type="number"
                  min="1"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  mono
                />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ResultCard
              label="Projected Future Value"
              value={formatMoney(sipResult.finalValue)}
              copyValue={formatMoney(sipResult.finalValue)}
              badge={`${sipYears} Year Outlook`}
              badgeType="primary"
              secondary={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Amount Invested:</span>
                    <strong>{formatMoney(sipResult.totalInvested)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estimated Wealth Gain:</span>
                    <strong style={{ color: 'var(--success)' }}>{formatMoney(sipResult.interestEarned)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Total Deposits Made:</span>
                    <span>{sipResult.totalPeriods} payments</span>
                  </div>
                </div>
              }
            />

            <Button variant="secondary" size="sm" onClick={logCurrent}>
              Save to Calculation History
            </Button>
          </div>
        </ToolLayout>
      )}

      <SeoSection toolId="interest" onSelectTool={onSelectTool} />
    </div>
  );
}
