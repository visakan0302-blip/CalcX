import React, { useState } from 'react';
import { Tag, Percent, ArrowRight } from 'lucide-react';
import { calculateDiscount } from '../services/financeService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';
import { ResetButton } from '../components/common/ResetButton';
import { logCalculation } from '../utils/unifiedHistory';

export function DiscountPage() {
  const [originalPrice, setOriginalPrice] = useState('2000');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [taxPercent, setTaxPercent] = useState('0');
  const [currency, setCurrency] = useState('₹');

  const handleReset = () => {
    setOriginalPrice('2000');
    setDiscountPercent('20');
    setTaxPercent('0');
  };

  const discountData = calculateDiscount(originalPrice, discountPercent, taxPercent);

  const formatMoney = (val) => {
    return `${currency}${Number(val.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleLog = () => {
    logCalculation({
      toolId: 'discount',
      toolName: 'Discount Calculator',
      input: `${currency}${originalPrice} with ${discountPercent}% off`,
      result: `Saved: ${formatMoney(discountData.totalSaved)}, Final: ${formatMoney(discountData.finalPrice)}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Discount Calculator"
        description="Calculate promotional savings, discounted sale prices, and optional post-discount sales taxes."
        icon={Tag}
        actions={
          <Select
            id="discount-currency"
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
          title="Sale Details"
          icon={Tag}
          action={<ResetButton onReset={handleReset} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="original-price"
              label="Original Price"
              type="number"
              min="0"
              step="any"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              suffix={currency}
              mono
            />

            <Input
              id="discount-pct"
              label="Discount Percentage"
              type="number"
              min="0"
              max="100"
              step="any"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              suffix="%"
              mono
            />

            {/* Quick Discount Chips */}
            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Common Discounts:</span>
              <div className="chip-list">
                {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`chip-btn ${parseFloat(discountPercent) === pct ? 'active' : ''}`}
                    onClick={() => setDiscountPercent(pct.toString())}
                  >
                    {pct}% OFF
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="tax-pct"
              label="Optional Sales Tax (%)"
              type="number"
              min="0"
              step="any"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              suffix="%"
              mono
            />
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Final Price to Pay"
            value={formatMoney(discountData.finalPrice)}
            copyValue={`Original: ${formatMoney(discountData.originalPrice)}, Discount: ${discountData.discountPercent}%, Final: ${formatMoney(discountData.finalPrice)}, Saved: ${formatMoney(discountData.totalSaved)}`}
            badge={`Saved ${formatMoney(discountData.totalSaved)}`}
            badgeType="success"
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Original Price:</span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    {formatMoney(discountData.originalPrice)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Discount ({discountData.discountPercent}%):</span>
                  <strong style={{ color: 'var(--success)' }}>-{formatMoney(discountData.discountAmount)}</strong>
                </div>
                {discountData.taxPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sales Tax ({discountData.taxPercent}%):</span>
                    <strong>+{formatMoney(discountData.taxAmount)}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
                  <span>Net Savings:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                    {formatMoney(discountData.totalSaved)}
                  </strong>
                </div>
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
