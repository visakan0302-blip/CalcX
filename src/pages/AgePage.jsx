import React, { useState } from 'react';
import { Cake, Calendar, Gift, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { calculateAge } from '../services/ageCalculator';
import { formatToISODate } from '../services/dateCalculator';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';

export function AgePage() {
  const todayISO = formatToISODate(new Date());
  const [dob, setDob] = useState('2000-01-01');
  const [asOfOption, setAsOfOption] = useState('today'); // 'today' | 'custom'
  const [customAsOf, setCustomAsOf] = useState(todayISO);

  const asOfDate = asOfOption === 'today' ? todayISO : customAsOf;

  let ageResult = null;
  let errorMsg = '';

  try {
    ageResult = calculateAge(dob, asOfDate);
  } catch (err) {
    errorMsg = err.message;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Age Calculator"
        description="Calculate precise chronological age, milestone breakdowns, and next birthday countdowns."
        icon={Cake}
      />

      <ToolLayout>
        {/* Input Card */}
        <Card title="Birth Date Details" icon={Cake}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              id="dob-input"
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Sample Dates of Birth
              </span>
              <div className="chip-list" style={{ marginTop: 6 }}>
                <button type="button" className="chip-btn" onClick={() => setDob('2005-08-15')}>
                  15 Aug 2005
                </button>
                <button type="button" className="chip-btn" onClick={() => setDob('2000-01-01')}>
                  1 Jan 2000
                </button>
                <button type="button" className="chip-btn" onClick={() => setDob('2004-02-29')}>
                  29 Feb 2004 (Leap Baby)
                </button>
              </div>
            </div>

            <div>
              <span className="form-label" style={{ marginBottom: 8 }}>Calculate Age As Of:</span>
              <div className="tab-group">
                <button
                  type="button"
                  className={`tab-btn ${asOfOption === 'today' ? 'active' : ''}`}
                  onClick={() => setAsOfOption('today')}
                >
                  <span>Today ({todayISO})</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${asOfOption === 'custom' ? 'active' : ''}`}
                  onClick={() => setAsOfOption('custom')}
                >
                  <span>Custom Target Date</span>
                </button>
              </div>
            </div>

            {asOfOption === 'custom' && (
              <Input
                id="custom-asof-input"
                label="Target Date"
                type="date"
                value={customAsOf}
                onChange={(e) => setCustomAsOf(e.target.value)}
              />
            )}
          </div>
        </Card>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ageResult && (
            <>
              {/* Primary Age Result */}
              <ResultCard
                label="Exact Chronological Age"
                value={`${ageResult.years} Years`}
                unit={`${ageResult.months} months, ${ageResult.days} days`}
                copyValue={`${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days`}
                badge={`Born on a ${ageResult.dayOfBirth}`}
                badgeType="primary"
                secondary={
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Days Lived:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {ageResult.totalDays.toLocaleString()} days
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Weeks Lived:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {ageResult.totalWeeks.toLocaleString()} weeks
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Hours Lived:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {ageResult.totalHours.toLocaleString()} hours
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Minutes:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {ageResult.totalMinutes.toLocaleString()} mins
                      </div>
                    </div>
                  </div>
                }
              />

              {/* Next Birthday Banner Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    <Gift size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a855f7', textTransform: 'uppercase' }}>
                      Next Birthday
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {ageResult.nextBirthdayFormatted} ({ageResult.nextBirthdayDayOfWeek})
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: '#a855f7' }}>
                    {ageResult.isBirthdayToday ? (
                      <span style={{ color: 'var(--success)' }}>🎉 Happy Birthday!</span>
                    ) : (
                      `${ageResult.daysToNextBirthday} Days`
                    )}
                  </div>
                  {!ageResult.isBirthdayToday && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      remaining until next celebration
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
