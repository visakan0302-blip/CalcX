import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, PlusCircle, MinusCircle, CheckCircle, CalendarDays } from 'lucide-react';
import {
  calculateDateDifference,
  addSubtractDate,
  getDayOfWeekDetails,
  formatToISODate,
} from '../services/dateCalculator';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { ResultCard } from '../components/common/ResultCard';
import { ToolLayout } from '../components/common/ToolLayout';

export function DatePage() {
  const [activeTab, setActiveTab] = useState('diff'); // 'diff' | 'offset' | 'dayofweek'

  // Function A state
  const todayISO = formatToISODate(new Date());
  const [startDate, setStartDate] = useState(todayISO);
  // Default end date: 1 year from now
  const nextYearDate = new Date();
  nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
  const [endDate, setEndDate] = useState(formatToISODate(nextYearDate));

  // Function B state
  const [baseDate, setBaseDate] = useState(todayISO);
  const [offsetAmount, setOffsetAmount] = useState('30');
  const [offsetUnit, setOffsetUnit] = useState('days'); // 'days' | 'weeks' | 'months' | 'years'
  const [offsetOp, setOffsetOp] = useState('add'); // 'add' | 'subtract'

  // Function C state
  const [singleDate, setSingleDate] = useState(todayISO);

  // Computations
  let diffResult = null;
  let diffError = '';
  try {
    diffResult = calculateDateDifference(startDate, endDate);
  } catch (err) {
    diffError = err.message;
  }

  let offsetResult = null;
  let offsetError = '';
  try {
    offsetResult = addSubtractDate(baseDate, offsetAmount, offsetUnit, offsetOp);
  } catch (err) {
    offsetError = err.message;
  }

  let dowResult = null;
  let dowError = '';
  try {
    dowResult = getDayOfWeekDetails(singleDate);
  } catch (err) {
    dowError = err.message;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Date Calculator"
        description="Compute intervals, add/subtract calendar periods, and analyze weekdays with leap year precision."
        icon={CalendarIcon}
      />

      {/* Function Sub-Tabs */}
      <div className="tab-group" style={{ maxWidth: 600 }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
          onClick={() => setActiveTab('diff')}
        >
          <CalendarDays size={16} />
          <span>Date Difference</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'offset' ? 'active' : ''}`}
          onClick={() => setActiveTab('offset')}
        >
          <Clock size={16} />
          <span>Add / Subtract Time</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'dayofweek' ? 'active' : ''}`}
          onClick={() => setActiveTab('dayofweek')}
        >
          <CalendarIcon size={16} />
          <span>Day of Week</span>
        </button>
      </div>

      {/* Function A: Date Difference */}
      {activeTab === 'diff' && (
        <ToolLayout>
          <Card title="Interval Selection" icon={CalendarDays}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                id="diff-start-date"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <Input
                id="diff-end-date"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStartDate(todayISO);
                  }}
                >
                  Set Start to Today
                </Button>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {diffResult && (
              <>
                <ResultCard
                  label="Calendar Span"
                  value={`${diffResult.years}y ${diffResult.months}m ${diffResult.days}d`}
                  copyValue={`${diffResult.years} years, ${diffResult.months} months, ${diffResult.days} days (${diffResult.totalDays} total days)`}
                  badge={`${diffResult.totalDays.toLocaleString()} Total Days`}
                  badgeType="primary"
                  secondary={
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Weeks:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {diffResult.totalWeeks} weeks, {diffResult.remainingDaysInWeek} days
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Hours:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {diffResult.totalHours.toLocaleString()} hrs
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Minutes:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {diffResult.totalMinutes.toLocaleString()} mins
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Direction:</span>
                        <div style={{ fontWeight: 600, color: diffResult.isReversed ? 'var(--warning)' : 'var(--success)' }}>
                          {diffResult.isReversed ? 'Backwards in time' : 'Forward in time'}
                        </div>
                      </div>
                    </div>
                  }
                />
              </>
            )}
          </div>
        </ToolLayout>
      )}

      {/* Function B: Add/Subtract Time */}
      {activeTab === 'offset' && (
        <ToolLayout>
          <Card title="Time Offset Settings" icon={Clock}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                id="offset-base-date"
                label="Starting Date"
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
              />

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className={`calcx-btn ${offsetOp === 'add' ? 'calcx-btn-primary' : 'calcx-btn-secondary'}`}
                  onClick={() => setOffsetOp('add')}
                  style={{ flex: 1 }}
                >
                  <PlusCircle size={16} />
                  <span>Add (+)</span>
                </button>
                <button
                  type="button"
                  className={`calcx-btn ${offsetOp === 'subtract' ? 'calcx-btn-primary' : 'calcx-btn-secondary'}`}
                  onClick={() => setOffsetOp('subtract')}
                  style={{ flex: 1 }}
                >
                  <MinusCircle size={16} />
                  <span>Subtract (−)</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  id="offset-amount"
                  label="Number of Units"
                  type="number"
                  min="0"
                  value={offsetAmount}
                  onChange={(e) => setOffsetAmount(e.target.value)}
                  mono
                />

                <Select
                  id="offset-unit"
                  label="Time Unit"
                  value={offsetUnit}
                  onChange={(e) => setOffsetUnit(e.target.value)}
                  options={[
                    { value: 'days', label: 'Days' },
                    { value: 'weeks', label: 'Weeks' },
                    { value: 'months', label: 'Months' },
                    { value: 'years', label: 'Years' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {offsetResult && (
              <ResultCard
                label="Calculated Result Date"
                value={offsetResult.formatted}
                copyValue={offsetResult.formatted}
                badge={offsetResult.dayOfWeek}
                badgeType="success"
                secondary={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span>
                      Formula: {offsetOp === 'add' ? '+' : '−'} {offsetAmount} {offsetUnit} from {baseDate}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      ISO Format: <strong>{offsetResult.isoString}</strong>
                    </span>
                  </div>
                }
              />
            )}
          </div>
        </ToolLayout>
      )}

      {/* Function C: Day of Week */}
      {activeTab === 'dayofweek' && (
        <ToolLayout>
          <Card title="Select Date" icon={CalendarIcon}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                id="dow-single-date"
                label="Pick Any Date"
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSingleDate(todayISO)}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 1);
                    setSingleDate(formatToISODate(d));
                  }}
                >
                  Yesterday
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setSingleDate(formatToISODate(d));
                  }}
                >
                  Tomorrow
                </Button>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dowResult && (
              <ResultCard
                label="Day of the Week"
                value={dowResult.dayOfWeek}
                copyValue={`${dowResult.dayOfWeek}, ${dowResult.formatted}`}
                badge={dowResult.isWeekend ? 'Weekend' : 'Weekday'}
                badgeType={dowResult.isWeekend ? 'warning' : 'primary'}
                secondary={
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Full Date:</span>
                      <div style={{ fontWeight: 600 }}>{dowResult.formatted}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Day of Year:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        Day {dowResult.dayOfYear} of 365/366
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Week Number:</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        Week #{dowResult.weekNumber}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Leap Year:</span>
                      <div style={{ fontWeight: 600, color: dowResult.isLeapYear ? 'var(--info)' : 'var(--text-secondary)' }}>
                        {dowResult.isLeapYear ? 'Yes (Leap Year)' : 'No (Standard Year)'}
                      </div>
                    </div>
                  </div>
                }
              />
            )}
          </div>
        </ToolLayout>
      )}
    </div>
  );
}
