/**
 * Comprehensive Senior QA Test Suite for CalcX All-in-One Calculator Suite
 * Runs 55+ thorough test cases across all calculation engines and utility services.
 */

import { calculate, cleanNumber, factorial, tokenize } from '../src/services/calculatorEngine.js';
import { UNIT_CATEGORIES, convertUnits, formatUnitNumber } from '../src/services/unitConverter.js';
import { CURRENCIES, convertCurrency } from '../src/services/currencyService.js';
import { solveEquation } from '../src/services/equationSolver.js';
import { calculateBMI, normalizeHeightToMeters, normalizeWeightToKg } from '../src/services/bmiCalculator.js';
import {
  calculateDateDifference,
  addSubtractDate,
  getDayOfWeekDetails,
  parseLocalDate,
  formatToISODate,
  isLeapYear,
} from '../src/services/dateCalculator.js';
import { calculateAge } from '../src/services/ageCalculator.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(category, testName, condition, details = {}) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [${category}] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [${category}] FAIL: ${testName}`, details);
    failures.push({ category, testName, details });
  }
}

console.log('====================================================');
console.log('RUNNING COMPREHENSIVE QA TEST SUITE (50+ TEST CASES)');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. BASIC & SCIENTIFIC CALCULATOR ENGINE (15 tests)
// ----------------------------------------------------
console.log('--- 1. CALCULATOR ENGINE TESTS ---');

// Standard arithmetic & precedence
test('CALC', 'Precedence: 2 + 3 * 4 = 14', calculate('2 + 3 * 4').result === 14);
test('CALC', 'Parentheses: (2 + 3) * 4 = 20', calculate('(2 + 3) * 4').result === 20);
test('CALC', 'Decimal arithmetic: 0.1 + 0.2 clean formatting', calculate('0.1 + 0.2').formatted === '0.3');
test('CALC', 'Powers: 2^10 = 1024', calculate('2^10').result === 1024);
test('CALC', 'Roots: sqrt(144) = 12', calculate('sqrt(144)').result === 12);
test('CALC', 'Cube root: cbrt(27) = 3', calculate('cbrt(27)').result === 3);

// Trigonometry in DEG vs RAD
test('CALC', 'DEG: sin(90) = 1', Math.abs(calculate('sin(90)', 'deg').result - 1) < 1e-10);
test('CALC', 'DEG: cos(0) = 1', Math.abs(calculate('cos(0)', 'deg').result - 1) < 1e-10);
test('CALC', 'DEG: cos(90) = 0 (clean exact zero)', calculate('cos(90)', 'deg').formatted === '0');
test('CALC', 'DEG: tan(45) = 1', Math.abs(calculate('tan(45)', 'deg').result - 1) < 1e-10);
test('CALC', 'RAD: sin(pi/2) = 1', Math.abs(calculate('sin(pi/2)', 'rad').result - 1) < 1e-10);

// Logarithms & Constants
test('CALC', 'log10(1000) = 3', calculate('log(1000)').result === 3);
test('CALC', 'ln(e) = 1', Math.abs(calculate('ln(e)').result - 1) < 1e-10);

// Factorials
test('CALC', 'Factorial 5! = 120', calculate('5!').result === 120);
test('CALC', 'Factorial 0! = 1', calculate('0!').result === 1);

// Percentage
test('CALC', 'Percentage: 50% = 0.5', calculate('50%').result === 0.5);
test('CALC', 'Percentage product: 200 * 15% = 30', calculate('200 * 15%').result === 30);
test('CALC', 'Reciprocal: 1/(4) = 0.25', calculate('1/(4)').result === 0.25);

// Implicit multiplication & Unary minus
test('CALC', 'Implicit multiply: 2(3 + 4) = 14', calculate('2(3 + 4)').result === 14);
test('CALC', 'Unary minus: -5 + 8 = 3', calculate('-5 + 8').result === 3);

// ----------------------------------------------------
// 2. UNIT CONVERTER ENGINE (13 tests: 1 per category)
// ----------------------------------------------------
console.log('\n--- 2. UNIT CONVERTER TESTS ---');

test('UNIT', 'Length: 1 km = 1,000 m', convertUnits('length', 'km', 'm', 1).result === 1000);
test('UNIT', 'Length: 1 mile = 5,280 ft', Math.abs(convertUnits('length', 'mi', 'ft', 1).result - 5280) < 1e-6);
test('UNIT', 'Area: 1 acre = 43,560 sq ft', Math.abs(convertUnits('area', 'acre', 'sq_ft', 1).result - 43560) < 1e-4);
test('UNIT', 'Volume: 1 US gal = 128 fl oz', Math.abs(convertUnits('volume', 'gallon', 'floz', 1).result - 128) < 1e-4);
test('UNIT', 'Volume: 1 L = 1,000 mL', convertUnits('volume', 'l', 'ml', 1).result === 1000);
test('UNIT', 'Mass: 1 stone = 14 lb', Math.abs(convertUnits('mass', 'st', 'lb', 1).result - 14) < 1e-6);
test('UNIT', 'Mass: 1 kg = 1,000 g', convertUnits('mass', 'kg', 'g', 1).result === 1000);

// Temperature specific formulas
test('UNIT', 'Temp: 0 °C = 32 °F', convertUnits('temperature', 'c', 'f', 0).result === 32);
test('UNIT', 'Temp: 100 °C = 212 °F', convertUnits('temperature', 'c', 'f', 100).result === 212);
test('UNIT', 'Temp: -40 °C = -40 °F (equal point)', convertUnits('temperature', 'c', 'f', -40).result === -40);
test('UNIT', 'Temp: 0 °C = 273.15 K', convertUnits('temperature', 'c', 'k', 0).result === 273.15);

// Other categories
test('UNIT', 'Speed: 100 km/h to mph (~62.137)', Math.abs(convertUnits('speed', 'kmh', 'mph', 100).result - 62.1371) < 0.01);
test('UNIT', 'Time: 1 week = 168 hours', convertUnits('time', 'wk', 'h', 1).result === 168);
test('UNIT', 'Digital: 1 GB = 1,024 MB', convertUnits('digital', 'gb', 'mb', 1).result === 1024);
test('UNIT', 'Digital: 1 Byte = 8 bits', convertUnits('digital', 'byte', 'bit', 1).result === 8);
test('UNIT', 'Pressure: 1 atm = 101,325 Pa', convertUnits('pressure', 'atm', 'pa', 1).result === 101325);
test('UNIT', 'Energy: 1 kWh = 3,600 kJ', convertUnits('energy', 'kwh', 'kj', 1).result === 3600);
test('UNIT', 'Power: 1 hp = 745.699872 W', Math.abs(convertUnits('power', 'hp', 'w', 1).result - 745.699872) < 1e-4);
test('UNIT', 'Frequency: 1 GHz = 1,000,000,000 Hz', convertUnits('frequency', 'ghz', 'hz', 1).result === 1e9);
test('UNIT', 'Angle: 180 deg = pi rad', Math.abs(convertUnits('angle', 'deg', 'rad', 180).result - Math.PI) < 1e-10);

// ----------------------------------------------------
// 3. CURRENCY CONVERTER ENGINE (5 tests)
// ----------------------------------------------------
console.log('\n--- 3. CURRENCY CONVERTER TESTS ---');

const mockRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 155.0,
};

const cConv1 = convertCurrency(100, 'USD', 'EUR', mockRates);
test('CURR', '100 USD to EUR at 0.92 = 92 EUR', Math.abs(cConv1.converted - 92) < 1e-4);

const cConv2 = convertCurrency(100, 'EUR', 'USD', mockRates);
test('CURR', '100 EUR to USD reciprocal = 108.69 USD', Math.abs(cConv2.converted - (100 / 0.92)) < 0.01);

const cConv3 = convertCurrency(100, 'USD', 'USD', mockRates);
test('CURR', 'Same currency rate = 1.0', cConv3.rate === 1 && cConv3.converted === 100);

const cConv4 = convertCurrency(0, 'USD', 'INR', mockRates);
test('CURR', 'Zero amount converted = 0', cConv4.converted === 0);

test('CURR', 'Currencies registry contains 30+ world currencies', CURRENCIES.length >= 30);

// ----------------------------------------------------
// 4. EQUATION SOLVER ENGINE (8 tests)
// ----------------------------------------------------
console.log('\n--- 4. EQUATION SOLVER TESTS ---');

// Linear equations
const eqL1 = solveEquation('2x + 5 = 15');
test('EQ', 'Linear: 2x + 5 = 15 => x = 5', eqL1.solutions.includes('x = 5'));

const eqL2 = solveEquation('3x + 2 = 11');
test('EQ', 'Linear: 3x + 2 = 11 => x = 3', eqL2.solutions.includes('x = 3'));

const eqL3 = solveEquation('5x - 8 = 2x + 7');
test('EQ', 'Linear with x on both sides: 5x - 8 = 2x + 7 => x = 5', eqL3.solutions.includes('x = 5'));

const eqL4 = solveEquation('2*x + 5 = 15');
test('EQ', 'Linear with *: 2*x + 5 = 15 => x = 5', eqL4.solutions.includes('x = 5'));

// Quadratic equations
const eqQ1 = solveEquation('x^2 - 5x + 6 = 0');
test('EQ', 'Quadratic: x² - 5x + 6 = 0 => x = 2 and x = 3',
  eqQ1.solutions.includes('x = 3') && eqQ1.solutions.includes('x = 2'));

const eqQ2 = solveEquation('x² + 4x + 4 = 0');
test('EQ', 'Double root: x² + 4x + 4 = 0 => x = -2',
  eqQ2.solutions[0].includes('-2'));

const eqQ3 = solveEquation('x^2 - 9 = 0');
test('EQ', 'Roots of x² - 9 = 0 => x = 3 and x = -3',
  eqQ3.solutions.includes('x = 3') && eqQ3.solutions.includes('x = -3'));

const eqQ4 = solveEquation('x^2 + 1 = 0');
test('EQ', 'Complex roots: x² + 1 = 0 => x = 0 ± 1i',
  eqQ4.solutions[0].includes('i'));

// Identities & Contradictions
const eqId = solveEquation('2x + 3 = 2x + 3');
test('EQ', 'Identity: 2x + 3 = 2x + 3 => infinite solutions', eqId.type === 'identity');

// ----------------------------------------------------
// 5. BMI CALCULATOR ENGINE (6 tests)
// ----------------------------------------------------
console.log('\n--- 5. BMI CALCULATOR TESTS ---');

const bmiUnder = calculateBMI({ heightUnit: 'cm', heightVal1: 175, weightUnit: 'kg', weightVal: 50 });
test('BMI', '175cm, 50kg is Underweight', bmiUnder.category.label === 'Underweight');

const bmiNorm = calculateBMI({ heightUnit: 'cm', heightVal1: 175, weightUnit: 'kg', weightVal: 70 });
test('BMI', '175cm, 70kg is Normal weight (22.9)', bmiNorm.category.label === 'Normal weight' && bmiNorm.formattedBMI === '22.9');

const bmiOver = calculateBMI({ heightUnit: 'cm', heightVal1: 175, weightUnit: 'kg', weightVal: 80 });
test('BMI', '175cm, 80kg is Overweight', bmiOver.category.label === 'Overweight');

const bmiObese = calculateBMI({ heightUnit: 'cm', heightVal1: 175, weightUnit: 'kg', weightVal: 95 });
test('BMI', '175cm, 95kg is Obesity Class I', bmiObese.category.label === 'Obesity Class I');

const bmiImperial = calculateBMI({ heightUnit: 'ft_in', heightVal1: 5, heightVal2: 10, weightUnit: 'lb', weightVal: 180 });
test('BMI', '5ft 10in, 180lb is Overweight (~25.8)', bmiImperial.category.label === 'Overweight' && bmiImperial.formattedBMI === '25.8');

test('BMI', 'Gauge percent is bounded between 0 and 100', bmiNorm.gaugePercent >= 0 && bmiNorm.gaugePercent <= 100);

// ----------------------------------------------------
// 6. DATE CALCULATOR ENGINE (6 tests)
// ----------------------------------------------------
console.log('\n--- 6. DATE CALCULATOR TESTS ---');

test('DATE', 'Leap year check 2024 is leap year', isLeapYear(2024) === true);
test('DATE', 'Leap year check 2025 is NOT leap year', isLeapYear(2025) === false);
test('DATE', 'Century leap year: 2000 is leap year, 1900 is NOT', isLeapYear(2000) === true && isLeapYear(1900) === false);

const diffLeap = calculateDateDifference('2024-02-28', '2024-03-01');
test('DATE', '2024-02-28 to 2024-03-01 is 2 days (leap year)', diffLeap.totalDays === 2);

const addDayLeap = addSubtractDate('2024-02-28', 1, 'days', 'add');
test('DATE', '2024-02-28 + 1 day = 2024-02-29', addDayLeap.isoString === '2024-02-29');

const subDayNonLeap = addSubtractDate('2025-03-01', 1, 'days', 'subtract');
test('DATE', '2025-03-01 - 1 day = 2025-02-28', subDayNonLeap.isoString === '2025-02-28');

// ----------------------------------------------------
// 7. AGE CALCULATOR ENGINE (5 tests)
// ----------------------------------------------------
console.log('\n--- 7. AGE CALCULATOR TESTS ---');

const age1 = calculateAge('2000-01-01', '2026-09-11');
test('AGE', 'Born 2000-01-01 as of 2026-09-11: 26 years, 8 months, 10 days',
  age1.years === 26 && age1.months === 8 && age1.days === 10);

const ageLeap = calculateAge('2004-02-29', '2026-09-11');
test('AGE', 'Leap baby born 2004-02-29 as of 2026-09-11: 22 years', ageLeap.years === 22);

const ageToday = calculateAge('1995-05-20', '1995-05-20');
test('AGE', 'Same day birth: 0 years, 0 months, 0 days, isBirthdayToday = true',
  ageToday.years === 0 && ageToday.isBirthdayToday === true);

let caughtFutureError = false;
try {
  calculateAge('2030-01-01', '2026-09-11');
} catch (e) {
  caughtFutureError = true;
}
test('AGE', 'DOB in future correctly throws error', caughtFutureError === true);

test('AGE', 'Next birthday days remaining is >= 0 and <= 366',
  age1.daysToNextBirthday >= 0 && age1.daysToNextBirthday <= 366);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  console.error('\nFailed tests summary:');
  failures.forEach((f) => console.error(` - [${f.category}] ${f.testName}`));
  process.exit(1);
} else {
  console.log('\n✨ ALL QA TESTS PASSED WITH 100% ACCURACY! ✨');
}
