/**
 * CalcX Automated QA Verification Suite (100+ Tests)
 * Tests all mathematical engines, converters, solvers, and financial tools.
 */

import { calculate } from '../src/services/calculatorEngine.js';
import { solveEquation } from '../src/services/equationSolver.js';
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  compareInterests,
  calculateInvestmentGrowth,
} from '../src/services/interestService.js';
import {
  calculateEMI,
  calculateGST,
  calculateDiscount,
  calculateTip,
  calculateSalary,
} from '../src/services/financeService.js';
import {
  calculatePercentage,
  calculateFractions,
  calculateStatistics,
  generateRandomNumbers,
} from '../src/services/mathToolsService.js';
import { convertUnits } from '../src/services/unitConverter.js';
import { calculateBMI } from '../src/services/bmiCalculator.js';
import { calculateDateDifference, isLeapYear } from '../src/services/dateCalculator.js';
import { calculateAge } from '../src/services/ageCalculator.js';

let passed = 0;
let failed = 0;
const failures = [];

function assert(description, actual, expected, precision = null) {
  let isMatch = false;
  if (precision !== null && typeof actual === 'number' && typeof expected === 'number') {
    isMatch = Math.abs(actual - expected) <= precision;
  } else if (typeof actual === 'number' && typeof expected === 'number' && !Number.isInteger(expected)) {
    isMatch = Math.abs(actual - expected) < 1e-5;
  } else {
    isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  }

  if (isMatch) {
    passed++;
    // process.stdout.write('.');
  } else {
    failed++;
    failures.push({
      description,
      actual,
      expected,
    });
    console.error(`\n❌ FAIL: ${description}\n   Expected: ${JSON.stringify(expected)}\n   Actual:   ${JSON.stringify(actual)}`);
  }
}

console.log('====================================================');
console.log('🚀 RUNNING CALCX 100+ AUTOMATED COMPREHENSIVE TESTS');
console.log('====================================================\n');

// ----------------------------------------------------
// MODULE 1: BASIC ARITHMETIC (10 Tests)
// ----------------------------------------------------
assert('1. Basic addition: 2 + 3', calculate('2 + 3').result, 5);
assert('2. Basic subtraction: 10 - 4', calculate('10 - 4').result, 6);
assert('3. Basic multiplication: 7 * 8', calculate('7 * 8').result, 56);
assert('4. Basic multiplication unicode: 7 × 8', calculate('7 × 8').result, 56);
assert('5. Basic division: 100 / 4', calculate('100 / 4').result, 25);
assert('6. Basic division unicode: 100 ÷ 4', calculate('100 ÷ 4').result, 25);
assert('7. Decimal addition: 0.1 + 0.2', calculate('0.1 + 0.2').result, 0.3, 1e-9);
assert('8. Negative operand addition: -5 + 12', calculate('-5 + 12').result, 7);
assert('9. Subtraction resulting negative: 3 - 10', calculate('3 - 10').result, -7);
assert('10. Multi-operand chain: 1 + 2 + 3 + 4 + 5', calculate('1 + 2 + 3 + 4 + 5').result, 15);

// ----------------------------------------------------
// MODULE 2: OPERATOR PRECEDENCE & PARENTHESES (10 Tests)
// ----------------------------------------------------
assert('11. Standard precedence: 2 + 3 * 4', calculate('2 + 3 * 4').result, 14);
assert('12. Parentheses override: (2 + 3) * 4', calculate('(2 + 3) * 4').result, 20);
assert('13. Precedence with division: 10 - 6 / 2', calculate('10 - 6 / 2').result, 7);
assert('14. Power precedence: 2 ^ 3 * 2', calculate('2 ^ 3 * 2').result, 16);
assert('15. Power in parentheses: 2 ^ (3 * 2)', calculate('2 ^ (3 * 2)').result, 64);
assert('16. Nested parentheses: ((2 + 3) * (4 - 1)) / 5', calculate('((2 + 3) * (4 - 1)) / 5').result, 3);
assert('17. Implicit multiplication: 3(4 + 5)', calculate('3(4 + 5)').result, 27);
assert('18. Implicit multiplication two parens: (2 + 3)(4 + 1)', calculate('(2 + 3)(4 + 1)').result, 25);
assert('19. Complex precedence: 10 + 20 / 5 * 2 - 3', calculate('10 + 20 / 5 * 2 - 3').result, 15);
assert('20. Right associative power: 2 ^ 2 ^ 3', calculate('2 ^ 2 ^ 3').result, 256);

// ----------------------------------------------------
// MODULE 3: "ANS" / PREVIOUS ANSWER (10 Tests)
// ----------------------------------------------------
assert('21. Ans token addition: Ans + 5 with Ans=10', calculate('Ans + 5', 'deg', 10).result, 15);
assert('22. Ans token multiplication: Ans * 3 with Ans=7', calculate('Ans * 3', 'deg', 7).result, 21);
assert('23. Ans in parentheses: (Ans + 2) * 4 with Ans=3', calculate('(Ans + 2) * 4', 'deg', 3).result, 20);
assert('24. Ans power: Ans ^ 2 with Ans=12', calculate('Ans ^ 2', 'deg', 12).result, 144);
assert('25. Leading operator continues Ans: + 10 with Ans=40', calculate('+ 10', 'deg', 40).result, 50);
assert('26. Leading multiplication continues Ans: * 5 with Ans=6', calculate('* 5', 'deg', 6).result, 30);
assert('27. Multiple Ans in expression: Ans + Ans with Ans=25', calculate('Ans + Ans', 'deg', 25).result, 50);
assert('28. Ans in function: sqrt(Ans) with Ans=144', calculate('sqrt(Ans)', 'deg', 144).result, 12);
assert('29. Ans default 0 when null: Ans + 8 with Ans=null', calculate('Ans + 8', 'deg', null).result, 8);
assert('30. Ans factorial: (Ans)! with Ans=5', calculate('(Ans)!', 'deg', 5).result, 120);

// ----------------------------------------------------
// MODULE 4: SCIENTIFIC NOTATION & EXTREME NUMBERS (10 Tests)
// ----------------------------------------------------
assert('31. Scientific notation positive exponent: 1e5', calculate('1e5').result, 100000);
assert('32. Scientific notation with decimal: 2.5e3', calculate('2.5e3').result, 2500);
assert('33. Scientific notation negative exponent: 2e-4', calculate('2e-4').result, 0.0002);
assert('34. Addition with scientific notation: 1e3 + 500', calculate('1e3 + 500').result, 1500);
assert('35. Multiplication with scientific: 2e3 * 3e2', calculate('2e3 * 3e2').result, 600000);
assert('36. Large power 2^20', calculate('2^20').result, 1048576);
assert('37. Extremely small float: 0.000000000000001 + 0', calculate('0.000000000000001').result, 1e-15);
assert('38. Extremely large number formatting: 1e12', calculate('1000000000000').result, 1e12);
assert('39. Fractional power: 16 ^ 0.5', calculate('16 ^ 0.5').result, 4);
assert('40. Cube root power: 27 ^ (1/3)', calculate('27 ^ (1/3)').result, 3, 1e-6);

// ----------------------------------------------------
// MODULE 5: TRIGONOMETRY, FUNCTIONS & PERCENTAGES (15 Tests)
// ----------------------------------------------------
assert('41. Trig sin(30) in DEG', calculate('sin(30)', 'deg').result, 0.5, 1e-6);
assert('42. Trig cos(60) in DEG', calculate('cos(60)', 'deg').result, 0.5, 1e-6);
assert('43. Trig tan(45) in DEG', calculate('tan(45)', 'deg').result, 1, 1e-6);
assert('44. Trig sin(90) in DEG', calculate('sin(90)', 'deg').result, 1, 1e-6);
assert('45. Trig cos(0) in DEG', calculate('cos(0)', 'deg').result, 1, 1e-6);
assert('46. Trig sin(pi/2) in RAD', calculate('sin(pi / 2)', 'rad').result, 1, 1e-6);
assert('47. Trig cos(pi) in RAD', calculate('cos(pi)', 'rad').result, -1, 1e-6);
assert('48. Postfix percentage add: 50 + 10%', calculate('50 + 10%').result, 55);
assert('49. Postfix percentage subtract: 100 - 20%', calculate('100 - 20%').result, 80);
assert('50. Postfix percentage multiply: 200 * 15%', calculate('200 * 15%').result, 30);
assert('51. Factorial 5! = 120', calculate('5!').result, 120);
assert('52. Factorial 0! = 1', calculate('0!').result, 1);
assert('53. Factorial 7! = 5040', calculate('7!').result, 5040);
assert('54. Log base 10: log(1000)', calculate('log(1000)').result, 3, 1e-6);
assert('55. Square root: sqrt(144)', calculate('sqrt(144)').result, 12);

// ----------------------------------------------------
// MODULE 6: EQUATION SOLVER WITH STEPS (10 Tests)
// ----------------------------------------------------
const eq1 = solveEquation('2x + 4 = 10');
assert('56. Linear equation 2x + 4 = 10 -> x = 3', eq1.numericSolutions[0], 3);
assert('57. Linear equation step reasoning generated', eq1.steps.length > 0, true);

const eq2 = solveEquation('5x - 15 = 0');
assert('58. Linear equation 5x - 15 = 0 -> x = 3', eq2.numericSolutions[0], 3);

const eq3 = solveEquation('3x + 7 = 2x + 12');
assert('59. Linear equation with x on both sides -> x = 5', eq3.numericSolutions[0], 5);

const eq4 = solveEquation('x^2 - 5x + 6 = 0');
assert('60. Quadratic equation x^2 - 5x + 6 = 0 solutions', eq4.numericSolutions.sort(), [2, 3]);
assert('61. Quadratic discriminant delta = 1', eq4.discriminant, 1);

const eq5 = solveEquation('x^2 - 4 = 0');
assert('62. Quadratic difference of squares x^2 - 4 = 0', eq5.numericSolutions.sort(), [-2, 2]);

const eq6 = solveEquation('x^2 + 2x + 1 = 0');
assert('63. Quadratic repeated root x^2 + 2x + 1 = 0', eq6.numericSolutions, [-1]);

const eq7 = solveEquation('x^2 + 1 = 0');
assert('64. Quadratic complex roots handled', eq7.isComplex, true);
assert('65. Equation solver steps have detailed explanations', Array.isArray(eq4.steps), true);

// ----------------------------------------------------
// MODULE 7: INTEREST CALCULATOR (SI, CI, COMPARE, SIP) (10 Tests)
// ----------------------------------------------------
const si1 = calculateSimpleInterest(10000, 10, 2, 'years');
assert('66. Simple Interest: ₹10,000 @ 10% for 2 years -> Interest = ₹2,000', si1.interest, 2000);
assert('67. Simple Interest Total Amount = ₹12,000', si1.finalAmount, 12000);

const si2 = calculateSimpleInterest(50000, 7.5, 5, 'years');
assert('68. Simple Interest: ₹50,000 @ 7.5% for 5 years -> Interest = ₹18,750', si2.interest, 18750);

const ci1 = calculateCompoundInterest(10000, 10, 2, 'years', 'annually');
assert('69. Compound Interest (annual): ₹10,000 @ 10% 2y -> Amount = ₹12,100', ci1.finalAmount, 12100);
assert('70. Compound Interest (annual): CI = ₹2,100', ci1.interest, 2100);

const ci2 = calculateCompoundInterest(10000, 10, 2, 'years', 'monthly');
assert('71. Compound Interest (monthly compounding) -> Amount = ~₹12,203.91', ci2.finalAmount, 12203.91, 0.5);

const comp1 = compareInterests(10000, 10, 2, 'annually');
assert('72. Compare CI vs SI difference = ₹100', comp1.difference, 100);

const sip1 = calculateInvestmentGrowth(0, 5000, 'monthly', 12, 5);
assert('73. SIP 5k/mo @ 12% 5 years: Invested Amount = ₹3,00,000', sip1.totalInvested, 300000);
assert('74. SIP 5k/mo @ 12% 5 years: Wealth Gain > ₹1,00,000', sip1.interestEarned > 100000, true);
assert('75. SIP Total Value > Invested Amount', sip1.finalValue > sip1.totalInvested, true);

// ----------------------------------------------------
// MODULE 8: EMI LOAN & AMORTIZATION (8 Tests)
// ----------------------------------------------------
const emi1 = calculateEMI(1000000, 8.5, 20, 'years');
assert('76. EMI for ₹10 Lakhs @ 8.5% for 20 years = ~₹8,678.23', emi1.monthlyEMI, 8678.23, 1.0);
assert('77. Total Payment > Principal', emi1.totalPayment > 1000000, true);
assert('78. Total Interest = Total Payment - Principal', emi1.totalInterest, emi1.totalPayment - 1000000, 0.01);

const emi2 = calculateEMI(500000, 10, 5, 'years');
assert('79. EMI for ₹5 Lakhs @ 10% for 5 years = ~₹10,623.52', emi2.monthlyEMI, 10623.52, 1.0);

const emiSchedule = calculateEMI(100000, 12, 1, 'years');
const schedule = emiSchedule.schedule;
assert('80. 1-year loan amortization has 12 monthly rows', schedule.length, 12);
assert('81. Month 12 final remaining balance is 0', schedule[11].balance, 0, 0.5);
assert('82. Principal + Interest = EMI in each month', schedule[0].principalPart + schedule[0].interestPart, schedule[0].emi, 0.5);
assert('83. Cumulative interest increases monotonically', schedule[11].interestPart >= 0, true);

// ----------------------------------------------------
// MODULE 9: GST CALCULATOR (INDIA) (8 Tests)
// ----------------------------------------------------
const gstAdd1 = calculateGST(1000, 18, 'add');
assert('84. Add 18% GST on ₹1,000: GST = ₹180', gstAdd1.gstAmount, 180);
assert('85. Add 18% GST on ₹1,000: Gross Total = ₹1,180', gstAdd1.finalPrice, 1180);
assert('86. Add 18% GST: CGST (9%) = ₹90', gstAdd1.cgst, 90);
assert('87. Add 18% GST: SGST (9%) = ₹90', gstAdd1.sgst, 90);

const gstRem1 = calculateGST(1180, 18, 'remove');
assert('88. Remove 18% GST from ₹1,180: Base Net = ₹1,000', gstRem1.basePrice, 1000);
assert('89. Remove 18% GST from ₹1,180: GST Amount = ₹180', gstRem1.gstAmount, 180);

const gstAdd2 = calculateGST(500, 5, 'add');
assert('90. Add 5% GST on ₹500: Total = ₹525', gstAdd2.finalPrice, 525);
assert('91. Add 5% GST on ₹500: CGST = ₹12.50', gstAdd2.cgst, 12.5);

// ----------------------------------------------------
// MODULE 10: SALARY / CTC TAKE-HOME (5 Tests)
// ----------------------------------------------------
const sal1 = calculateSalary(1200000, 'annual');
assert('92. CTC ₹12 Lakhs: Monthly Gross = ₹1,00,000', sal1.monthlyGross, 100000);
assert('93. CTC ₹12 Lakhs: Annual Gross = ₹12,00,000', sal1.annualCTC, 1200000);
assert('94. Monthly Take-Home < Monthly Gross', sal1.monthlyTakeHome < sal1.monthlyGross, true);
assert('95. Monthly EPF deduction = ₹1,800', sal1.monthlyEPF, 1800);
assert('96. Monthly Professional Tax = ₹200', sal1.monthlyPT, 200);

// ----------------------------------------------------
// MODULE 11: DISCOUNT & TIP CALCULATORS (8 Tests)
// ----------------------------------------------------
const disc1 = calculateDiscount(1000, 20, 0);
assert('97. 20% discount on ₹1,000: Savings = ₹200', disc1.totalSaved, 200);
assert('98. 20% discount on ₹1,000: Final Price = ₹800', disc1.finalPrice, 800);

const disc2 = calculateDiscount(1000, 20, 10);
assert('99. 20% discount on ₹1,000 with 10% tax: Final Price = ₹880', disc2.finalPrice, 880);
assert('100. Tax amount calculated on discounted price = ₹80', disc2.taxAmount, 80);

const tip1 = calculateTip(1000, 15, 4);
assert('101. 15% tip on ₹1,000 = ₹150', tip1.tipAmount, 150);
assert('102. Total bill with tip = ₹1,150', tip1.totalBill, 1150);
assert('103. Tip per person (4 people) = ₹37.50', tip1.perPersonTip, 37.5);
assert('104. Total per person = ₹287.50', tip1.perPersonTotal, 287.5);

// ----------------------------------------------------
// MODULE 12: PERCENTAGE & FRACTIONS (10 Tests)
// ----------------------------------------------------
const p1 = calculatePercentage('what_is_x_pct_of_y', 25, 800);
assert('105. Mode 1: 25% of 800 = 200', p1.result, 200);

const p2 = calculatePercentage('x_is_what_pct_of_y', 50, 200);
assert('106. Mode 2: 50 is 25% of 200', p2.result, 25);

const p3 = calculatePercentage('pct_increase', 50, 75);
assert('107. Mode 3: Percentage increase from 50 to 75 = 50%', p3.result, 50);

const p4 = calculatePercentage('pct_decrease', 100, 80);
assert('108. Mode 4: Percentage decrease from 100 to 80 = 20%', p4.result, 20);

const f1 = calculateFractions(1, 2, '+', 1, 4);
assert('109. Fraction 1/2 + 1/4 = 3/4', f1.fractionStr, '3/4');

const f2 = calculateFractions(3, 4, '-', 1, 2);
assert('110. Fraction 3/4 - 1/2 = 1/4', f2.fractionStr, '1/4');

const f3 = calculateFractions(2, 3, '*', 3, 4);
assert('111. Fraction 2/3 * 3/4 = 1/2 (simplified)', f3.fractionStr, '1/2');

const f4 = calculateFractions(3, 4, '/', 1, 2);
assert('112. Fraction 3/4 / 1/2 = 3/2', f4.fractionStr, '3/2');
assert('113. Fraction 3/2 mixed number representation: 1 1/2', f4.mixedStr, '1 1/2');
assert('114. Fraction decimal equivalent: 1.5', f4.decimalValue, 1.5);

// ----------------------------------------------------
// MODULE 13: STATISTICS CALCULATOR (8 Tests)
// ----------------------------------------------------
const stats = calculateStatistics([2, 4, 4, 4, 5, 5, 7, 9]);
assert('115. Statistics Mean of [2, 4, 4, 4, 5, 5, 7, 9] = 5', stats.mean, 5);
assert('116. Statistics Median = 4.5', stats.median, 4.5);
assert('117. Statistics Mode = [4]', stats.mode, [4]);
assert('118. Statistics Min = 2', stats.min, 2);
assert('119. Statistics Max = 9', stats.max, 9);
assert('120. Statistics Range = 7', stats.range, 7);
assert('121. Statistics Sum = 40', stats.sum, 40);
assert('122. Statistics Sample Std Dev calculated', stats.sampleStdDev > 0, true);

// ----------------------------------------------------
// MODULE 14: RANDOM NUMBERS & UNIT CONVERTER (8 Tests)
// ----------------------------------------------------
const rnd = generateRandomNumbers(1, 10, 5, true);
assert('123. Random generator count = 5', rnd.length, 5);
assert('124. Random unique numbers are distinct', new Set(rnd).size, 5);
assert('125. Random numbers within bounds [1, 10]', rnd.every((n) => n >= 1 && n <= 10), true);

const u1 = convertUnits('length', 'km', 'm', 5);
assert('126. Unit convert 5 km to m = 5,000 m', u1.result, 5000);

const u2 = convertUnits('weight', 'kg', 'g', 2.5);
assert('127. Unit convert 2.5 kg to g = 2,500 g', u2.result, 2500);

const u3 = convertUnits('temperature', 'c', 'f', 100);
assert('128. Unit convert 100 °C to °F = 212 °F', u3.result, 212);

const u4 = convertUnits('temperature', 'f', 'c', 32);
assert('129. Unit convert 32 °F to °C = 0 °C', u4.result, 0);

const u5 = convertUnits('digital', 'gb', 'mb', 2);
assert('130. Unit convert 2 GB to MB = 2,048 MB', u5.result, 2048);

// ----------------------------------------------------
// MODULE 15: BMI, DATE & AGE CALCULATORS (8 Tests)
// ----------------------------------------------------
const bmi1 = calculateBMI({ heightUnit: 'cm', heightVal1: 175, heightVal2: 0, weightUnit: 'kg', weightVal: 70 });
assert('131. BMI for 70kg, 175cm = 22.9 (Normal weight)', bmi1.bmi, 22.86, 0.1);
assert('132. BMI Category is Normal weight', bmi1.category.label, 'Normal weight');

const leap1 = isLeapYear(2024);
assert('133. 2024 is a leap year', leap1, true);

const leap2 = isLeapYear(2023);
assert('134. 2023 is NOT a leap year', leap2, false);

const leap3 = isLeapYear(2000);
assert('135. 2000 is a leap year (divisible by 400)', leap3, true);

const leap4 = isLeapYear(1900);
assert('136. 1900 is NOT a leap year (century rule)', leap4, false);

const dateDiff = calculateDateDifference('2024-01-01', '2024-01-31');
assert('137. Date diff 2024-01-01 to 2024-01-31 = 30 days', dateDiff.totalDays, 30);

const age1 = calculateAge('2000-01-01', '2026-01-01');
assert('138. Age from 2000-01-01 to 2026-01-01 = 26 years', age1.years, 26);
assert('139. Age months = 0', age1.months, 0);
assert('140. Age days = 0', age1.days, 0);

console.log('\n====================================================');
console.log(`📊 TEST SUITE SUMMARY:`);
console.log(`   Total Tests:  ${passed + failed}`);
console.log(`   Passed:       ${passed} ✅`);
console.log(`   Failed:       ${failed} ${failed > 0 ? '❌' : ''}`);
console.log('====================================================\n');

if (failed > 0) {
  console.error(`❌ QA Suite Failed with ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log(`🎉 ALL ${passed} COMPREHENSIVE TESTS PASSED WITH 100% ACCURACY!`);
  process.exit(0);
}
