import React, { useState } from 'react';
import { Receipt, Users, ArrowRight } from 'lucide-react';
import { calculateTip } from '../services/financeService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { ResetButton } from '../components/common/ResetButton';
import { logCalculation } from '../utils/unifiedHistory';

export function TipPage() {
  const [bill, setBill] = useState('1500');
  const [selectedTip, setSelectedTip] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [people, setPeople] = useState('2');
  const [currency, setCurrency] = useState('₹');

  const handleReset = () => {
    setBill('1500');
    setSelectedTip(15);
    setCustomTip('');
    setPeople('2');
  };

  const activeTip = customTip !== '' ? parseFloat(customTip) || 0 : selectedTip;
  const tipData = calculateTip(bill, activeTip, people);

  const formatMoney = (val) => {
    return `${currency}${Number(val.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleLog = () => {
    logCalculation({
      toolId: 'tip',
      toolName: 'Tip Calculator',
      input: `Bill ${currency}${bill}, ${activeTip}% tip, split by ${people}`,
      result: `Total: ${formatMoney(tipData.totalBill)}, Per Person: ${formatMoney(tipData.perPersonTotal)}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Tip & Bill Splitter"
        description="Calculate dining tips and split totals evenly across any group size."
        icon={Receipt}
        actions={
          <Select
            id="tip-currency"
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
        {/* Bill Settings */}
        <Card
          title="Bill Details"
          icon={Receipt}
          action={<ResetButton onReset={handleReset} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="bill-amount"
              label="Bill Amount"
              type="number"
              min="0"
              step="any"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              suffix={currency}
              mono
            />

            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Tip Percentage:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[5, 10, 15, 18, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`calcx-btn ${customTip === '' && selectedTip === pct ? 'calcx-btn-primary' : 'calcx-btn-secondary'}`}
                    onClick={() => {
                      setSelectedTip(pct);
                      setCustomTip('');
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="custom-tip"
              label="Or Custom Tip (%)"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 12.5"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              suffix="%"
              mono
            />

            <Input
              id="num-people"
              label="Number of People Splitting"
              type="number"
              min="1"
              step="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              suffix="persons"
              mono
            />
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Amount Per Person"
            value={formatMoney(tipData.perPersonTotal)}
            unit="/ person"
            copyValue={`Total: ${formatMoney(tipData.totalBill)}, Tip: ${formatMoney(tipData.tipAmount)}, Per Person: ${formatMoney(tipData.perPersonTotal)}`}
            badge={`${tipData.numPeople} ${tipData.numPeople === 1 ? 'person' : 'people'}`}
            badgeType="primary"
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Bill:</span>
                  <strong>{formatMoney(tipData.bill)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Tip ({tipData.tipPercent}%):</span>
                  <strong style={{ color: 'var(--primary)' }}>{formatMoney(tipData.tipAmount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Bill to Pay:</span>
                  <strong style={{ fontSize: '1.1rem' }}>{formatMoney(tipData.totalBill)}</strong>
                </div>
                {tipData.numPeople > 1 && (
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem',
                    }}
                  >
                    <span>Tip Share Per Person:</span>
                    <span>{formatMoney(tipData.perPersonTip)}</span>
                  </div>
                )}
              </div>
            }
          />

          <Button variant="secondary" size="sm" onClick={handleLog}>
            Save to Calculation History
          </Button>
        </div>
      </ToolLayout>
    </div>
  );
}
