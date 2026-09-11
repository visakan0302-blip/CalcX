import React, { useState, useEffect } from 'react';
import { Coins, ArrowLeftRight, RefreshCw, AlertCircle, CheckCircle2, Search, Clock } from 'lucide-react';
import { CURRENCIES, fetchExchangeRates, convertCurrency } from '../services/currencyService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';

export function CurrencyPage() {
  const [ratesData, setRatesData] = useState({
    status: 'loading',
    rates: null,
    lastUpdated: null,
    source: null,
    errorMsg: null,
  });

  const [amount, setAmount] = useState('100');
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial fetch
  const loadRates = async () => {
    setIsRefreshing(true);
    const data = await fetchExchangeRates();
    setRatesData(data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const fromCurr = CURRENCIES.find((c) => c.code === fromCode) || CURRENCIES[0];
  const toCurr = CURRENCIES.find((c) => c.code === toCode) || CURRENCIES[1];

  const conversion = convertCurrency(amount, fromCode, toCode, ratesData.rates);

  // Filter currencies for list/selector
  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Currency Converter"
        description="Real-time global foreign exchange rates with offline fallback and reciprocal rates."
        icon={Coins}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadRates}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Updating...' : 'Refresh Rates'}
          </Button>
        }
      />

      {/* Rate Status Alert Banner */}
      {ratesData.status === 'live' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--success)',
            fontSize: '0.88rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>
            <strong>Live Rates Connected:</strong> Data updated as of {ratesData.lastUpdated}.
          </span>
        </div>
      )}

      {ratesData.status === 'cached' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--warning)',
            fontSize: '0.88rem',
          }}
        >
          <AlertCircle size={18} />
          <span>
            <strong>Live exchange rates unavailable:</strong> Showing cached rates from {ratesData.lastUpdated}.
          </span>
        </div>
      )}

      {ratesData.status === 'unavailable' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: '0.88rem',
          }}
        >
          <AlertCircle size={18} />
          <span>
            <strong>Live exchange rates unavailable:</strong> Network connection error and no cache found.
          </span>
        </div>
      )}

      <ToolLayout>
        {/* Converter Controls */}
        <Card title="Exchange Settings" icon={Coins}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              id="currency-amount"
              label="Amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              suffix={fromCurr.symbol}
              mono
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="from-currency">From</label>
                <div className="form-input-wrapper">
                  <select
                    id="from-currency"
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    className="form-select"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} — {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ paddingBottom: 4 }}>
                <Button
                  variant="secondary"
                  size="md"
                  icon={ArrowLeftRight}
                  onClick={handleSwap}
                  title="Swap Currencies"
                  className="calcx-btn-icon"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="to-currency">To</label>
                <div className="form-input-wrapper">
                  <select
                    id="to-currency"
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    className="form-select"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} — {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Currency Selectors */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Popular Pairs
              </span>
              <div className="chip-list" style={{ marginTop: 8 }}>
                {[
                  ['USD', 'EUR'],
                  ['USD', 'GBP'],
                  ['USD', 'INR'],
                  ['EUR', 'GBP'],
                  ['USD', 'JPY'],
                  ['USD', 'CAD'],
                ].map(([f, t]) => (
                  <button
                    key={`${f}-${t}`}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setFromCode(f);
                      setToCode(t);
                    }}
                  >
                    {f} / {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ResultCard
            label="Converted Total"
            value={`${toCurr.symbol} ${conversion.formatted}`}
            unit={toCurr.code}
            copyValue={`${conversion.formatted} ${toCurr.code}`}
            badge={ratesData.status === 'live' ? 'Live Rate' : 'Offline Rate'}
            badgeType={ratesData.status === 'live' ? 'success' : 'warning'}
            secondary={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Direct Exchange Rate:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>
                    1 {fromCurr.code} = {conversion.rate.toFixed(4)} {toCurr.code}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Inverse Rate:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>
                    1 {toCurr.code} = {conversion.inverseRate.toFixed(4)} {fromCurr.code}
                  </strong>
                </div>
                {ratesData.lastUpdated && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <Clock size={13} />
                    <span>Last market sync: {ratesData.lastUpdated}</span>
                  </div>
                )}
              </div>
            }
          />

          {/* Quick Currency Rates Table with search */}
          <Card title="Live Market Overview" icon={Search}>
            <Input
              id="search-currency"
              placeholder="Filter currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="calcx-btn-sm"
              style={{ marginBottom: 12 }}
            />

            <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredCurrencies.map((c) => {
                const singleRate = ratesData.rates ? convertCurrency(1, fromCode, c.code, ratesData.rates).rate : 0;
                return (
                  <div
                    key={c.code}
                    onClick={() => setToCode(c.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: toCode === c.code ? 'var(--bg-card-subtle)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{c.flag}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{c.code}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {singleRate ? singleRate.toFixed(4) : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </ToolLayout>
    </div>
  );
}
