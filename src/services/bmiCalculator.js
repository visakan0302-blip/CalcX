/**
 * CalcX BMI Calculator Service
 * Accurate BMI calculations supporting metric and imperial units,
 * health classifications, ideal weight ranges, and visual gauge values.
 */

export const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Underweight', color: '#38bdf8', description: 'Below standard body weight' },
  { min: 18.5, max: 24.9, label: 'Normal weight', color: '#10b981', description: 'Healthy weight range' },
  { min: 25.0, max: 29.9, label: 'Overweight', color: '#f59e0b', description: 'Above standard body weight' },
  { min: 30.0, max: 34.9, label: 'Obesity Class I', color: '#f97316', description: 'Moderate health risk' },
  { min: 35.0, max: 39.9, label: 'Obesity Class II', color: '#ef4444', description: 'Severe health risk' },
  { min: 40.0, max: Infinity, label: 'Obesity Class III', color: '#dc2626', description: 'Very high health risk' },
];

export const BMI_DISCLAIMER =
  'BMI is a general screening measure and does not account for every factor of individual health.';

/**
 * Normalizes height to meters
 */
export function normalizeHeightToMeters(heightUnit, val1, val2 = 0) {
  const h1 = parseFloat(val1) || 0;
  const h2 = parseFloat(val2) || 0;

  if (heightUnit === 'cm') {
    return h1 / 100;
  }
  if (heightUnit === 'm') {
    return h1;
  }
  if (heightUnit === 'ft_in') {
    // h1 is feet, h2 is inches
    const totalInches = h1 * 12 + h2;
    return totalInches * 0.0254;
  }
  return 0;
}

/**
 * Normalizes weight to kilograms
 */
export function normalizeWeightToKg(weightUnit, val) {
  const w = parseFloat(val) || 0;
  if (weightUnit === 'kg') {
    return w;
  }
  if (weightUnit === 'lb') {
    return w * 0.45359237;
  }
  return 0;
}

/**
 * Computes BMI, category, healthy weight range, and gauge percentage
 */
export function calculateBMI({ heightUnit, heightVal1, heightVal2, weightUnit, weightVal }) {
  const heightM = normalizeHeightToMeters(heightUnit, heightVal1, heightVal2);
  const weightKg = normalizeWeightToKg(weightUnit, weightVal);

  if (heightM <= 0 || weightKg <= 0) {
    return null;
  }

  const bmi = weightKg / (heightM * heightM);
  const formattedBMI = bmi.toFixed(1);

  // Determine category
  let category = BMI_CATEGORIES[0];
  for (const cat of BMI_CATEGORIES) {
    if (bmi >= cat.min && bmi < cat.max) {
      category = cat;
      break;
    }
  }

  // Calculate healthy weight range (18.5 to 24.9)
  const minHealthyKg = 18.5 * heightM * heightM;
  const maxHealthyKg = 24.9 * heightM * heightM;

  let healthyWeightRangeStr = '';
  if (weightUnit === 'kg') {
    healthyWeightRangeStr = `${minHealthyKg.toFixed(1)} kg - ${maxHealthyKg.toFixed(1)} kg`;
  } else {
    const minHealthyLb = minHealthyKg / 0.45359237;
    const maxHealthyLb = maxHealthyKg / 0.45359237;
    healthyWeightRangeStr = `${minHealthyLb.toFixed(1)} lb - ${maxHealthyLb.toFixed(1)} lb`;
  }

  // Gauge percentage: map BMI between 15 and 40 to 0% - 100%
  const gaugePercent = Math.min(Math.max(((bmi - 15) / (40 - 15)) * 100, 0), 100);

  return {
    bmi,
    formattedBMI,
    category,
    healthyWeightRange: healthyWeightRangeStr,
    gaugePercent,
    heightM,
    weightKg,
    disclaimer: BMI_DISCLAIMER,
  };
}
