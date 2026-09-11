/**
 * CalcX Mathematics & Statistics Service
 * Percentage, Fraction arithmetic with GCD simplification, Statistics, and Random numbers.
 */

// Greatest Common Divisor
export function gcd(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

/**
 * Simplifies a fraction n / d
 */
export function simplifyFraction(numerator, denominator) {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  const sign = (numerator < 0) ^ (denominator < 0) ? -1 : 1;
  const num = Math.abs(numerator);
  const den = Math.abs(denominator);

  const divisor = gcd(num, den);
  const simpNum = (num / divisor) * sign;
  const simpDen = den / divisor;

  // Format as mixed fraction if improper
  let mixedStr = '';
  if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
    const whole = Math.trunc(simpNum / simpDen);
    const rem = Math.abs(simpNum % simpDen);
    mixedStr = rem !== 0 ? `${whole} ${rem}/${simpDen}` : `${whole}`;
  }

  const fractionStr = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
  const decimalValue = numerator / denominator;

  return {
    numerator: simpNum,
    denominator: simpDen,
    fractionStr,
    mixedStr: mixedStr || fractionStr,
    decimalValue,
  };
}

/**
 * Performs arithmetic on two fractions
 * @param {number} n1 Numerator 1
 * @param {number} d1 Denominator 1
 * @param {'+'|'-'|'*'|'/'} operator
 * @param {number} n2 Numerator 2
 * @param {number} d2 Denominator 2
 */
export function calculateFractions(n1, d1, operator, n2, d2) {
  const num1 = parseInt(n1, 10);
  const den1 = parseInt(d1, 10);
  const num2 = parseInt(n2, 10);
  const den2 = parseInt(d2, 10);

  if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
    throw new Error('All numerators and denominators must be valid integers');
  }
  if (den1 === 0 || den2 === 0) {
    throw new Error('Denominator cannot be zero');
  }

  let resNum = 0;
  let resDen = 1;
  let stepExplanation = '';

  switch (operator) {
    case '+': {
      resNum = num1 * den2 + num2 * den1;
      resDen = den1 * den2;
      stepExplanation = `(${num1} × ${den2} + ${num2} × ${den1}) / (${den1} × ${den2}) = ${resNum}/${resDen}`;
      break;
    }
    case '-': {
      resNum = num1 * den2 - num2 * den1;
      resDen = den1 * den2;
      stepExplanation = `(${num1} × ${den2} − ${num2} × ${den1}) / (${den1} × ${den2}) = ${resNum}/${resDen}`;
      break;
    }
    case '*': {
      resNum = num1 * num2;
      resDen = den1 * den2;
      stepExplanation = `(${num1} × ${num2}) / (${den1} × ${den2}) = ${resNum}/${resDen}`;
      break;
    }
    case '/': {
      if (num2 === 0) throw new Error('Cannot divide by zero fraction');
      resNum = num1 * den2;
      resDen = den1 * num2;
      stepExplanation = `(${num1} × ${den2}) / (${den1} × ${num2}) = ${resNum}/${resDen}`;
      break;
    }
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  const simplified = simplifyFraction(resNum, resDen);
  return {
    ...simplified,
    stepExplanation,
  };
}

/**
 * Percentage calculation modes
 */
export function calculatePercentage(mode, val1, val2) {
  const v1 = parseFloat(val1) || 0;
  const v2 = parseFloat(val2) || 0;

  switch (mode) {
    case 'what_is_x_pct_of_y': {
      // What is X% of Y?
      const result = (v1 * v2) / 100;
      return {
        result,
        formula: `${v1}% × ${v2} = (${v1} / 100) × ${v2} = ${result}`,
        label: `${v1}% of ${v2}`,
      };
    }
    case 'x_is_what_pct_of_y': {
      // X is what % of Y?
      if (v2 === 0) throw new Error('Cannot divide by zero');
      const result = (v1 / v2) * 100;
      return {
        result,
        formula: `(${v1} / ${v2}) × 100 = ${result.toFixed(2)}%`,
        label: `${v1} of ${v2}`,
      };
    }
    case 'percentage_increase':
    case 'pct_increase': {
      // From X to Y
      if (v1 === 0) throw new Error('Base value cannot be zero');
      const diff = v2 - v1;
      const result = (diff / v1) * 100;
      return {
        result,
        diff,
        isIncrease: diff >= 0,
        formula: `((${v2} − ${v1}) / ${v1}) × 100 = ${result.toFixed(2)}%`,
        label: `${v1} → ${v2}`,
      };
    }
    case 'percentage_decrease':
    case 'pct_decrease': {
      // From X to Y
      if (v1 === 0) throw new Error('Base value cannot be zero');
      const diff = v1 - v2;
      const result = (diff / v1) * 100;
      return {
        result,
        diff,
        isDecrease: diff >= 0,
        formula: `((${v1} − ${v2}) / ${v1}) × 100 = ${result.toFixed(2)}%`,
        label: `${v1} → ${v2}`,
      };
    }
    default:
      throw new Error(`Unknown percentage mode: ${mode}`);
  }
}

/**
 * Statistics calculation on numbers array
 */
export function calculateStatistics(inputStringOrArray) {
  let nums = [];
  if (Array.isArray(inputStringOrArray)) {
    nums = inputStringOrArray;
  } else if (typeof inputStringOrArray === 'string') {
    nums = inputStringOrArray
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));
  }

  if (nums.length === 0) {
    throw new Error('Please enter at least one valid number');
  }

  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  // Sorted copy
  const sorted = [...nums].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  // Median
  let median = 0;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  // Mode
  const counts = {};
  let maxFreq = 0;
  for (const n of nums) {
    counts[n] = (counts[n] || 0) + 1;
    if (counts[n] > maxFreq) maxFreq = counts[n];
  }
  let mode = [];
  if (maxFreq > 1) {
    mode = Object.keys(counts)
      .filter((k) => counts[k] === maxFreq)
      .map(Number);
  }

  // Variance & Standard Deviation
  const sumSquaredDiffs = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const populationVariance = sumSquaredDiffs / count;
  const populationStdDev = Math.sqrt(populationVariance);

  const sampleVariance = count > 1 ? sumSquaredDiffs / (count - 1) : 0;
  const sampleStdDev = Math.sqrt(sampleVariance);

  return {
    count,
    sum,
    mean,
    median,
    mode: mode.length > 0 ? mode : ['No unique mode'],
    min,
    max,
    range,
    sampleVariance,
    sampleStdDev,
    populationVariance,
    populationStdDev,
  };
}

/**
 * Random Number Generator
 */
export function generateRandomNumbers(min, max, count = 1, unique = false) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);

  if (minimum > maximum) {
    throw new Error('Minimum value cannot exceed maximum value');
  }

  const availableCount = maximum - minimum + 1;
  const totalNeeded = Math.min(Math.max(parseInt(count, 10) || 1, 1), 1000);

  if (unique && totalNeeded > availableCount) {
    throw new Error(`Cannot generate ${totalNeeded} unique numbers in a range of ${availableCount} possible values`);
  }

  const results = [];
  const used = new Set();

  while (results.length < totalNeeded) {
    const rand = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    if (unique) {
      if (!used.has(rand)) {
        used.add(rand);
        results.push(rand);
      }
    } else {
      results.push(rand);
    }
  }

  return results;
}
