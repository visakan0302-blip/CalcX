/**
 * Automated Verification Script for CalcX Calculation Engines
 */

import { calculate } from '../src/services/calculatorEngine.js';
import { convertUnits } from '../src/services/unitConverter.js';
import { solveEquation } from '../src/services/equationSolver.js';
import { calculateBMI } from '../src/services/bmiCalculator.js';
import { calculateDateDifference, addSubtractDate } from '../src/services/dateCalculator.js';
import { calculateAge } from '../src/services/ageCalculator.js';

let passed = 0;
let failed = 0;

function assert(description, condition, actualInfo) {
  if (condition) {
    console.log(`✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${description} | Info: ${JSON.stringify(actualInfo)}`);
    failed++;
  }
}

console.log('--- TESTING CALCULATOR ENGINE ---');
const c1 = calculate('2 + 3 * 4');
assert('2 + 3 * 4 = 14', c1.result === 14, c1);

const c2 = calculate('(2 + 3) * 4');
assert('(2 + 3) * 4 = 20', c2.result === 20, c2);

const c3 = calculate('sqrt(144)');
assert('sqrt(144) = 12', c3.result === 12, c3);

const c4 = calculate('sin(90)', 'deg');
assert('sin(90) deg = 1', Math.abs(c4.result - 1) < 1e-9, c4);

const c5 = calculate('5!');
assert('5! = 120', c5.result === 120, c5);

console.log('\n--- TESTING UNIT CONVERTER ---');
const u1 = convertUnits('length', 'km', 'm', 1);
assert('1 km = 1000 m', u1.result === 1000, u1);

const u2 = convertUnits('mass', 'kg', 'g', 1);
assert('1 kg = 1000 g', u2.result === 1000, u2);

const u3 = convertUnits('temperature', 'c', 'f', 0);
assert('0 °C = 32 °F', u3.result === 32, u3);

const u4 = convertUnits('digital', 'gb', 'mb', 1);
assert('1 GB = 1024 MB', u4.result === 1024, u4);

console.log('\n--- TESTING EQUATION SOLVER ---');
const eq1 = solveEquation('2x + 5 = 15');
assert('2x + 5 = 15 => x = 5', eq1.solutions.some(s => s.includes('5')), eq1.solutions);

const eq2 = solveEquation('x^2 - 5x + 6 = 0');
assert('x^2 - 5x + 6 = 0 => x = 2 and x = 3',
  eq2.solutions.some(s => s.includes('2')) && eq2.solutions.some(s => s.includes('3')),
  eq2.solutions);

const eq3 = solveEquation('3x + 2 = 11');
assert('3x + 2 = 11 => x = 3', eq3.solutions.some(s => s.includes('3')), eq3.solutions);

const eq4 = solveEquation('x² + 4x + 4 = 0');
assert('x² + 4x + 4 = 0 => x = -2 (double root)', eq4.solutions.some(s => s.includes('-2')), eq4.solutions);

console.log('\n--- TESTING BMI CALCULATOR ---');
const bmi1 = calculateBMI({
  heightUnit: 'cm',
  heightVal1: 175,
  weightUnit: 'kg',
  weightVal: 70,
});
assert('175cm, 70kg is Normal weight (~22.9)', bmi1.category.label === 'Normal weight' && bmi1.formattedBMI === '22.9', bmi1);

const bmi2 = calculateBMI({
  heightUnit: 'ft_in',
  heightVal1: 5,
  heightVal2: 10,
  weightUnit: 'lb',
  weightVal: 180,
});
assert('5ft 10in, 180lb is Overweight (~25.8)', bmi2.category.label === 'Overweight' && bmi2.formattedBMI === '25.8', bmi2);

console.log('\n--- TESTING DATE CALCULATOR ---');
const dDiff = calculateDateDifference('2024-01-01', '2024-03-01'); // 2024 is a leap year (Feb has 29 days)
assert('2024 leap year Jan 1 to Mar 1 is 60 days', dDiff.totalDays === 60, dDiff);

const dAdd = addSubtractDate('2024-02-28', 1, 'days', 'add');
assert('2024-02-28 + 1 day = 2024-02-29 (leap day)', dAdd.isoString === '2024-02-29', dAdd);

console.log('\n--- TESTING AGE CALCULATOR ---');
const age1 = calculateAge('2000-01-01', '2026-09-11');
assert('Born 2000-01-01 as of 2026-09-11 is 26 years', age1.years === 26 && age1.months === 8, age1);

console.log(`\n=============================`);
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`=============================`);

if (failed > 0) process.exit(1);
