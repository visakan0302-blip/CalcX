/**
 * CalcX Finance Service
 * EMI, Loan Amortization, Indian GST, Salary, Discount, and Tip calculations.
 */

/**
 * Calculates monthly EMI and amortization schedule
 * @param {number} loanAmount Principal P
 * @param {number} annualRate Annual rate in %
 * @param {number} tenureValue Number of periods
 * @param {'years'|'months'} tenureUnit
 */
export function calculateEMI(loanAmount, annualRate, tenureValue, tenureUnit = 'years') {
  const P = Math.max(parseFloat(loanAmount) || 0, 0);
  const R = Math.max(parseFloat(annualRate) || 0, 0);
  const tenure = Math.max(parseFloat(tenureValue) || 0, 0);

  const n = Math.round(tenureUnit === 'years' ? tenure * 12 : tenure);
  if (P <= 0 || n <= 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalPct: 100,
      interestPct: 0,
      schedule: [],
    };
  }

  const r = R / (12 * 100);

  let emi = 0;
  if (r > 0) {
    // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + r, n);
    emi = (P * r * factor) / (factor - 1);
  } else {
    emi = P / n;
  }

  const totalPayment = emi * n;
  const totalInterest = Math.max(totalPayment - P, 0);

  const principalPct = totalPayment > 0 ? (P / totalPayment) * 100 : 100;
  const interestPct = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Generate monthly amortization schedule (capped to first 360 months)
  const schedule = [];
  let balance = P;
  for (let month = 1; month <= Math.min(n, 360); month++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month,
      emi,
      principalPart,
      interestPart,
      balance,
    });
  }

  return {
    monthlyEMI: emi,
    totalInterest,
    totalPayment,
    principalPct,
    interestPct,
    totalMonths: n,
    schedule,
  };
}

/**
 * Calculates Indian Goods and Services Tax (GST)
 * @param {number} amount Base or inclusive price
 * @param {number} ratePercent e.g. 5, 12, 18, 28
 * @param {'add'|'remove'} mode 'add' = exclusive, 'remove' = inclusive
 */
export function calculateGST(amount, ratePercent = 18, mode = 'add') {
  const price = Math.max(parseFloat(amount) || 0, 0);
  const rate = Math.max(parseFloat(ratePercent) || 0, 0);

  let basePrice = 0;
  let gstAmount = 0;
  let finalPrice = 0;

  if (mode === 'add') {
    // Exclusive: base is price, add GST
    basePrice = price;
    gstAmount = (basePrice * rate) / 100;
    finalPrice = basePrice + gstAmount;
  } else {
    // Inclusive: final is price, remove GST
    // Base = price / (1 + rate/100)
    basePrice = price / (1 + rate / 100);
    gstAmount = price - basePrice;
    finalPrice = price;
  }

  // CGST and SGST split (50% each for intrastate)
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const halfRate = rate / 2;

  return {
    mode,
    rate,
    halfRate,
    basePrice,
    gstAmount,
    cgst,
    sgst,
    finalPrice,
  };
}

/**
 * Calculates Discounts and Savings
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @param {number} taxPercent Optional sales tax
 */
export function calculateDiscount(originalPrice, discountPercent, taxPercent = 0) {
  const orig = Math.max(parseFloat(originalPrice) || 0, 0);
  const disc = Math.min(Math.max(parseFloat(discountPercent) || 0, 0), 100);
  const tax = Math.max(parseFloat(taxPercent) || 0, 0);

  const discountAmount = (orig * disc) / 100;
  const discountedPrice = orig - discountAmount;
  const taxAmount = (discountedPrice * tax) / 100;
  const finalPrice = discountedPrice + taxAmount;

  return {
    originalPrice: orig,
    discountPercent: disc,
    discountAmount,
    discountedPrice,
    taxPercent: tax,
    taxAmount,
    finalPrice,
    totalSaved: discountAmount,
  };
}

/**
 * Calculates Tip and Split Bill
 * @param {number} billAmount
 * @param {number} tipPercent
 * @param {number} numPeople
 */
export function calculateTip(billAmount, tipPercent = 15, numPeople = 1) {
  const bill = Math.max(parseFloat(billAmount) || 0, 0);
  const tipPct = Math.max(parseFloat(tipPercent) || 0, 0);
  const people = Math.max(parseInt(numPeople, 10) || 1, 1);

  const tipAmount = (bill * tipPct) / 100;
  const totalBill = bill + tipAmount;
  const perPersonTotal = totalBill / people;
  const perPersonTip = tipAmount / people;
  const perPersonBill = bill / people;

  return {
    bill,
    tipPercent: tipPct,
    tipAmount,
    totalBill,
    numPeople: people,
    perPersonTotal,
    perPersonTip,
    perPersonBill,
  };
}

/**
 * Calculates Estimated Salary and Take-home Breakdown
 * @param {number} annualOrMonthly
 * @param {'annual'|'monthly'} inputType
 * @param {number} customDeductions Monthly additional deductions
 */
export function calculateSalary(annualOrMonthly, inputType = 'annual', customDeductions = 0) {
  const val = Math.max(parseFloat(annualOrMonthly) || 0, 0);
  const custom = Math.max(parseFloat(customDeductions) || 0, 0);

  const annualCTC = inputType === 'annual' ? val : val * 12;
  const monthlyGross = annualCTC / 12;

  // Basic salary estimate (~50% of gross)
  const monthlyBasic = monthlyGross * 0.5;

  // Employee Provident Fund (EPF): 12% of basic (capped at ₹1800/mo or 12% of basic)
  const monthlyEPF = Math.min(monthlyBasic * 0.12, 1800);

  // Professional Tax: ₹200 / month
  const monthlyPT = monthlyGross > 15000 ? 200 : 0;

  // Simplified Indian New Tax Regime FY 2024-25 estimation:
  // Standard deduction: ₹75,000
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, annualCTC - standardDeduction);

  let annualTax = 0;
  // Rebate u/s 87A: If taxable income <= 7,00,000, tax is nil
  if (taxableIncome > 700000) {
    if (taxableIncome > 1500000) {
      annualTax += (taxableIncome - 1500000) * 0.30;
      annualTax += 300000 * 0.20;
      annualTax += 300000 * 0.15;
      annualTax += 300000 * 0.10;
      annualTax += 300000 * 0.05;
    } else if (taxableIncome > 1200000) {
      annualTax += (taxableIncome - 1200000) * 0.20;
      annualTax += 300000 * 0.15;
      annualTax += 300000 * 0.10;
      annualTax += 300000 * 0.05;
    } else if (taxableIncome > 900000) {
      annualTax += (taxableIncome - 900000) * 0.15;
      annualTax += 300000 * 0.10;
      annualTax += 300000 * 0.05;
    } else {
      annualTax += (taxableIncome - 600000) * 0.10;
      annualTax += 300000 * 0.05;
    }
    // 4% Health and Education Cess
    annualTax *= 1.04;
  }

  const monthlyTax = annualTax / 12;
  const totalMonthlyDeductions = monthlyEPF + monthlyPT + monthlyTax + custom;
  const monthlyTakeHome = Math.max(0, monthlyGross - totalMonthlyDeductions);
  const annualTakeHome = monthlyTakeHome * 12;

  return {
    annualCTC,
    monthlyGross,
    monthlyEPF,
    monthlyPT,
    monthlyTax,
    annualTax,
    customDeductions: custom,
    totalMonthlyDeductions,
    monthlyTakeHome,
    annualTakeHome,
    disclaimer:
      'This calculation is an estimate based on the standard new tax regime and typical EPF deduction. Actual take-home may vary by employer structure.',
  };
}
