/**
 * CalcX Money Interest Service
 * Rigorous financial mathematics for Simple Interest, Compound Interest,
 * Side-by-side comparison, and Regular Contribution (SIP) growth.
 */

/**
 * Calculates Simple Interest
 * @param {number} principal Principal amount P
 * @param {number} annualRate Annual interest rate R (e.g. 10 for 10%)
 * @param {number} timeValue Time quantity
 * @param {'years'|'months'|'days'} timeUnit Unit of time
 * @returns {{ interest: number, finalAmount: number, timeInYears: number }}
 */
export function calculateSimpleInterest(principal, annualRate, timeValue, timeUnit = 'years') {
  const P = Math.max(parseFloat(principal) || 0, 0);
  const R = Math.max(parseFloat(annualRate) || 0, 0);
  const T_raw = Math.max(parseFloat(timeValue) || 0, 0);

  let timeInYears = T_raw;
  if (timeUnit === 'months') {
    timeInYears = T_raw / 12;
  } else if (timeUnit === 'days') {
    timeInYears = T_raw / 365;
  }

  const interest = (P * R * timeInYears) / 100;
  const finalAmount = P + interest;

  return {
    principal: P,
    annualRate: R,
    timeInYears,
    interest,
    finalAmount,
  };
}

/**
 * Calculates Compound Interest
 * @param {number} principal Principal amount P
 * @param {number} annualRate Annual interest rate R (e.g. 10 for 10%)
 * @param {number} timeValue Time quantity
 * @param {'years'|'months'} timeUnit Unit of time
 * @param {'annually'|'semi-annually'|'quarterly'|'monthly'|'daily'} frequency
 * @returns {{ interest: number, finalAmount: number, periodsPerYear: number }}
 */
export function calculateCompoundInterest(
  principal,
  annualRate,
  timeValue,
  timeUnit = 'years',
  frequency = 'annually'
) {
  const P = Math.max(parseFloat(principal) || 0, 0);
  const R = Math.max(parseFloat(annualRate) || 0, 0);
  const T_raw = Math.max(parseFloat(timeValue) || 0, 0);

  const t = timeUnit === 'months' ? T_raw / 12 : T_raw;
  const r = R / 100;

  let n = 1;
  switch (frequency) {
    case 'daily':
      n = 365;
      break;
    case 'monthly':
      n = 12;
      break;
    case 'quarterly':
      n = 4;
      break;
    case 'semi-annually':
      n = 2;
      break;
    case 'annually':
    default:
      n = 1;
      break;
  }

  // A = P * (1 + r/n)^(n*t)
  const base = 1 + r / n;
  const exponent = n * t;
  const rawFinal = P * Math.pow(base, exponent);
  const finalAmount = Math.round(rawFinal * 100) / 100;
  const interest = Math.round((finalAmount - P) * 100) / 100;

  return {
    principal: P,
    annualRate: R,
    timeInYears: t,
    periodsPerYear: n,
    interest,
    finalAmount,
  };
}

/**
 * Compares Simple Interest vs Compound Interest for the same P, R, T
 */
export function compareInterests(principal, annualRate, timeYears, frequency = 'annually') {
  const si = calculateSimpleInterest(principal, annualRate, timeYears, 'years');
  const ci = calculateCompoundInterest(principal, annualRate, timeYears, 'years', frequency);

  const difference = Math.round((ci.interest - si.interest) * 100) / 100;

  return {
    principal: si.principal,
    rate: si.annualRate,
    timeYears: si.timeInYears,
    simpleInterest: si.interest,
    simpleFinal: si.finalAmount,
    compoundInterest: ci.interest,
    compoundFinal: ci.finalAmount,
    difference,
    compoundGainPct: si.interest > 0 ? (difference / si.interest) * 100 : 0,
  };
}

/**
 * Calculates investment growth with regular periodic contributions (SIP / Recurring Investment)
 * @param {number} initialInvestment Starting amount P0
 * @param {number} periodicContribution PMT added each period
 * @param {'monthly'|'yearly'} contributionFreq
 * @param {number} annualRate R (in %)
 * @param {number} durationYears Duration in years
 */
export function calculateInvestmentGrowth(
  initialInvestment,
  periodicContribution,
  contributionFreq = 'monthly',
  annualRate = 12,
  durationYears = 5
) {
  const P0 = Math.max(parseFloat(initialInvestment) || 0, 0);
  const PMT = Math.max(parseFloat(periodicContribution) || 0, 0);
  const R = Math.max(parseFloat(annualRate) || 0, 0);
  const t = Math.max(parseFloat(durationYears) || 0, 0);

  const n = contributionFreq === 'monthly' ? 12 : 1;
  const r = R / 100;
  const ratePerPeriod = r / n;
  const totalPeriods = n * t;

  // FV of initial principal: P0 * (1 + ratePerPeriod)^totalPeriods
  const fvInitial = P0 * Math.pow(1 + ratePerPeriod, totalPeriods);

  // FV of regular annuity contributions: PMT * [((1 + ratePerPeriod)^totalPeriods - 1) / ratePerPeriod]
  let fvContributions = 0;
  if (ratePerPeriod > 0) {
    fvContributions = PMT * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
  } else {
    fvContributions = PMT * totalPeriods;
  }

  const finalValue = fvInitial + fvContributions;
  const totalContributed = PMT * totalPeriods;
  const totalInvested = P0 + totalContributed;
  const interestEarned = finalValue - totalInvested;

  return {
    initialInvestment: P0,
    totalContributed,
    totalInvested,
    interestEarned,
    finalValue,
    totalPeriods,
  };
}
