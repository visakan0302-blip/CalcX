import React, { useState } from 'react';
import { BadgePercent, PlusCircle, MinusCircle, Split } from 'lucide-react';
import { calculateGST } from '../services/financeService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { ResetButton } from '../components/common/ResetButton';
import { SeoSection } from '../components/common/SeoSection';
import { logCalculation } from '../utils/unifiedHistory';

export function GSTPage({ onSelectTool }) {
  const [amount, setAmount] = useState('1000');
  const [selectedRate, setSelectedRate] = useState(18);
  const [customRate, setCustomRate] = useState('');
  const [mode, setMode] = useState('add'); // 'add' | 'remove'

  const handleReset = () => {
    setAmount('1000');
    setSelectedRate(18);
    setCustomRate('');
    setMode('add');
  };

  const activeRate = customRate !== '' ? parseFloat(customRate) || 0 : selectedRate;
  const gstData = calculateGST(amount, activeRate, mode);

  const formatRupee = (val) => {
    return `₹${Number(val.toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleLog = () => {
    logCalculation({
      toolId: 'gst',
      toolName: 'GST Calculator',
      input: `₹${amount} (${mode === 'add' ? 'Exclusive' : 'Inclusive'} ${activeRate}%)`,
      result: `Base: ${formatRupee(gstData.basePrice)}, GST: ${formatRupee(gstData.gstAmount)}, Final: ${formatRupee(gstData.finalPrice)}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="GST Calculator — Inclusive & Exclusive GST"
        description="Calculate Goods and Services Tax (GST) online. Add or remove 5%, 12%, 18%, or 28% GST with exact CGST and SGST splits."
        icon={BadgePercent}
      />

      <ToolLayout>
        {/* Input Settings */}
        <Card
          title="GST Parameters"
          icon={BadgePercent}
          action={<ResetButton onReset={handleReset} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Mode selection */}
            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Calculation Mode:</span>
              <div className="tab-group">
                <button
                  type="button"
                  className={`tab-btn ${mode === 'add' ? 'active' : ''}`}
                  onClick={() => setMode('add')}
                >
                  <PlusCircle size={15} />
                  <span>Add GST (Exclusive)</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${mode === 'remove' ? 'active' : ''}`}
                  onClick={() => setMode('remove')}
                >
                  <MinusCircle size={15} />
                  <span>Remove GST (Inclusive)</span>
                </button>
              </div>
            </div>

            <Input
              id="gst-amount"
              label={mode === 'add' ? 'Base Price (Net)' : 'Total Price (Gross with Tax)'}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              suffix="₹"
              mono
            />

            {/* GST Rate Chips */}
            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Standard GST Slabs:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[5, 12, 18, 28].map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    className={`calcx-btn ${customRate === '' && selectedRate === slab ? 'calcx-btn-primary' : 'calcx-btn-secondary'}`}
                    onClick={() => {
                      setSelectedRate(slab);
                      setCustomRate('');
                    }}
                    style={{ fontSize: '1rem', padding: '10px' }}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="custom-gst-rate"
              label="Or Custom Rate (%)"
              type="number"
              min="0"
              max="100"
              step="any"
              placeholder="e.g. 3, 0.25..."
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              suffix="%"
              mono
            />
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label={mode === 'add' ? 'Final Total (Gross Price)' : 'Pre-Tax Base Amount'}
            value={mode === 'add' ? formatRupee(gstData.finalPrice) : formatRupee(gstData.basePrice)}
            copyValue={mode === 'add' ? formatRupee(gstData.finalPrice) : formatRupee(gstData.basePrice)}
            badge={`${activeRate}% GST (${mode.toUpperCase()})`}
            badgeType="primary"
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Pre-Tax Price:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatRupee(gstData.basePrice)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Tax (GST):</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {formatRupee(gstData.gstAmount)}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Final Invoice Amount:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                    {formatRupee(gstData.finalPrice)}
                  </strong>
                </div>

                {/* CGST + SGST Split Breakdown */}
                <div
                  style={{
                    marginTop: 8,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    <Split size={13} />
                    <span>Intra-State GST Breakdown</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span>CGST ({gstData.halfRate}%):</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatRupee(gstData.cgst)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span>SGST ({gstData.halfRate}%):</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatRupee(gstData.sgst)}</span>
                  </div>
                </div>
              </div>
            }
          />

          <Button variant="secondary" size="sm" onClick={handleLog}>
            Save to Calculation History
          </Button>
        </div>
      </ToolLayout>

      <SeoSection toolId="gst" onSelectTool={onSelectTool} />
    </div>
  );
}
