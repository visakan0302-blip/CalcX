/**
 * CalcX SEO Configuration & Structured Data
 * Contains indexable metadata, canonical URLs, introductory educational content,
 * mathematical formulas, FAQs, and Schema.org structured data.
 */

export const SITE_URL = 'https://visakan0302-blip.github.io/CalcX';

export const DEFAULT_SEO = {
  title: 'CalcX — Free Online Calculators & Math Tools',
  description: 'CalcX is a free online calculator suite for EMI, GST, BMI, age, percentage, interest, discount, salary, currency conversion, fractions, statistics and more.',
  canonical: `${SITE_URL}/`,
  h1: 'CalcX Commercial Calculator Suite',
};

export const SEO_PAGES = {
  bmi: {
    toolId: 'bmi',
    slug: 'bmi-calculator',
    path: 'bmi-calculator/',
    title: 'Free BMI Calculator — CalcX',
    description: 'Calculate your Body Mass Index (BMI) online for free. Check your healthy weight range with instant WHO classifications, metric and imperial units on CalcX.',
    canonical: `${SITE_URL}/bmi-calculator/`,
    h1: 'Free Online BMI Calculator',
    shortIntro: 'Calculate Body Mass Index (BMI) and visualize your health category on the WHO standard scale with instant metric and imperial unit conversions.',
    overview: 'Body Mass Index (BMI) is an internationally recognized screening metric established by the World Health Organization (WHO) to evaluate whether an adult has a healthy proportion of body weight for their height. While BMI does not directly measure body fat percentage, it correlates strongly with metabolic health and weight-related clinical conditions across population groups.',
    formula: {
      metric: 'BMI = weight (kg) / [height (m)]²',
      imperial: 'BMI = [weight (lbs) / [height (inches)]²] × 703',
      explanation: 'To calculate BMI in metric units, divide body weight in kilograms by height in meters squared. In imperial units, divide weight in pounds by height in inches squared and multiply by 703.',
    },
    applicationCategory: 'HealthApplication',
    faqs: [
      {
        question: 'What is a normal healthy BMI according to WHO standards?',
        answer: 'The World Health Organization classifies a BMI between 18.5 and 24.9 kg/m² as Normal Weight. Under 18.5 is considered Underweight, 25.0 to 29.9 is Overweight, and 30.0 or higher is categorized as Obese.',
      },
      {
        question: 'How accurate is BMI for athletes and bodybuilders?',
        answer: 'BMI measures total body mass relative to height, so it does not distinguish between lean muscle mass and adipose fat tissue. Muscular athletes often register an Overweight or Obese BMI despite having low body fat levels.',
      },
      {
        question: 'Can I calculate BMI using feet and inches or pounds?',
        answer: 'Yes. CalcX supports metric (centimeters and kilograms) as well as imperial (feet, inches, and pounds) with real-time conversion and automatic gauge tracking.',
      },
    ],
    relatedToolIds: ['age', 'percentage', 'unit', 'calculator'],
  },

  age: {
    toolId: 'age',
    slug: 'age-calculator',
    path: 'age-calculator/',
    title: 'Age Calculator — Calculate Your Exact Age | CalcX',
    description: 'Calculate your exact age in years, months, weeks, days, hours, and minutes from date of birth. Find your next birthday countdown and lifetime milestones on CalcX.',
    canonical: `${SITE_URL}/age-calculator/`,
    h1: 'Age Calculator — Calculate Your Exact Age',
    shortIntro: 'Calculate precise chronological age, milestone breakdowns, and next birthday countdowns factoring in varying month lengths and leap years.',
    overview: 'Chronological age represents the precise duration of time elapsed between a person’s date of birth and the current date or an arbitrary reference date. Unlike simple year subtractions, our high-precision age calculator accounts for leap years, variable calendar month lengths, and exact day differences.',
    formula: {
      metric: 'Age = Target Date − Date of Birth',
      explanation: 'Calendar-accurate subtraction borrows days from the previous month and months from the previous year according to the Gregorian calendar to ensure exact day, month, and year totals.',
    },
    applicationCategory: 'UtilityApplication',
    faqs: [
      {
        question: 'How does the calculator handle leap years and February 29 birthdays?',
        answer: 'The calculator accounts for leap year rules (every 4 years, except century years unless divisible by 400). Leap babies celebrating on common years have their milestone countdown adjusted to February 28 or March 1 depending on calendar conventions.',
      },
      {
        question: 'Can I calculate age as of a past or future date?',
        answer: 'Yes. CalcX allows you to compute age as of today or select any custom reference date to determine age at the time of graduation, job eligibility, or future retirement.',
      },
      {
        question: 'What lifetime statistics does the Age Calculator provide?',
        answer: 'In addition to years, months, and days, CalcX displays total elapsed months, weeks, days, approximate hours, and minutes lived, plus a countdown to your next birthday.',
      },
    ],
    relatedToolIds: ['date', 'bmi', 'percentage', 'calculator'],
  },

  percentage: {
    toolId: 'percentage',
    slug: 'percentage-calculator',
    path: 'percentage-calculator/',
    title: 'Percentage Calculator — Free Online Tool | CalcX',
    description: 'Free online percentage calculator. Calculate percentage increase, decrease, what percent of X is Y, and percentage of a number with clear step-by-step math.',
    canonical: `${SITE_URL}/percentage-calculator/`,
    h1: 'Percentage Calculator — Free Online Tool',
    shortIntro: 'Instantly solve all standard percentage problems: X% of Y, X as what % of Y, percentage growth/increase, and percentage decline/decrease.',
    overview: 'Percentages represent dimensionless fractions with a denominator of 100, used widely across finance, science, education, and retail pricing. Whether you are analyzing revenue growth, comparing test scores, or calculating price changes, this tool automates all four fundamental percentage computations with full decimal precision.',
    formula: {
      metric: 'What is X% of Y? = (X / 100) × Y',
      explanation: 'For percentage change from Value 1 to Value 2, the formula is: [(Value 2 − Value 1) / |Value 1|] × 100%. A positive value indicates an increase; a negative value indicates a decrease.',
    },
    applicationCategory: 'CalculatorApplication',
    faqs: [
      {
        question: 'How do you calculate percentage increase or markup?',
        answer: 'Subtract the original value from the new value, divide the difference by the original value, and multiply by 100. For example, from 50 to 75: (75 − 50) / 50 = 0.50 × 100 = 50% increase.',
      },
      {
        question: 'How do you calculate what percent one number is of another?',
        answer: 'Divide the part by the total whole and multiply by 100. For example, 25 out of 200 is: (25 / 200) × 100 = 12.5%.',
      },
      {
        question: 'Does this calculator support negative numbers and decimals?',
        answer: 'Yes. CalcX handles fractional values, high decimals, and negative inputs accurately with automatic division-by-zero protection.',
      },
    ],
    relatedToolIds: ['discount', 'gst', 'fraction', 'emi'],
  },

  emi: {
    toolId: 'emi',
    slug: 'emi-calculator',
    path: 'emi-calculator/',
    title: 'EMI Calculator — Loan & Home Loan EMI | CalcX',
    description: 'Calculate monthly loan EMI, total interest payable, and complete amortization schedule for home loans, car loans, and personal loans with CalcX.',
    canonical: `${SITE_URL}/emi-calculator/`,
    h1: 'EMI Calculator — Loan & Home Loan EMI',
    shortIntro: 'Calculate equated monthly installments (EMI), total interest charges, and view a complete month-by-month loan repayment amortization schedule.',
    overview: 'An Equated Monthly Installment (EMI) is the fixed monthly payment made by a borrower to a lender on a specified calendar day. Each EMI consists of both interest on the remaining principal balance and a repayment portion toward the loan principal itself, calculated using reducing balance methodology.',
    formula: {
      metric: 'E = P × r × (1 + r)ⁿ / [(1 + r)ⁿ − 1]',
      explanation: 'Where E is the monthly EMI, P is Principal loan amount, r is monthly interest rate (Annual Rate / 12 / 100), and n is the total number of monthly installments.',
    },
    applicationCategory: 'FinanceApplication',
    faqs: [
      {
        question: 'How is loan interest calculated in reducing balance EMI?',
        answer: 'Under reducing balance amortization, interest is calculated solely on the outstanding principal at the start of each month. As more principal is paid down, the monthly interest portion decreases while the principal repayment portion increases.',
      },
      {
        question: 'Can I use this for home loans, auto loans, and personal loans?',
        answer: 'Yes. This universal EMI formula applies to all amortizing fixed-rate loans including home mortgages, auto financing, business loans, and personal credit lines.',
      },
      {
        question: 'What is an amortization schedule?',
        answer: 'An amortization schedule is an itemized table listing every periodic payment throughout the loan term, showing the exact division between principal repayment, interest charge, and remaining loan balance.',
      },
    ],
    relatedToolIds: ['interest', 'gst', 'salary', 'percentage'],
  },

  gst: {
    toolId: 'gst',
    slug: 'gst-calculator',
    path: 'gst-calculator/',
    title: 'GST Calculator — Inclusive & Exclusive GST | CalcX',
    description: 'Calculate Goods and Services Tax (GST) online. Add or remove GST at 5%, 12%, 18%, or 28% with exact CGST, SGST, and IGST breakdowns on CalcX.',
    canonical: `${SITE_URL}/gst-calculator/`,
    h1: 'GST Calculator — Inclusive & Exclusive GST',
    shortIntro: 'Add or remove Goods and Services Tax (GST) with preset tax slabs (5%, 12%, 18%, 28%) or custom rates, including intra-state CGST + SGST splits.',
    overview: 'Goods and Services Tax (GST) is a comprehensive indirect consumption tax levied on the sale of goods and services. CalcX provides fast dual-mode calculation for both GST Exclusive pricing (adding tax onto net base costs) and GST Inclusive pricing (extracting the embedded tax component from gross retail prices).',
    formula: {
      metric: 'GST Amount (Add) = Base Price × (GST Rate / 100)',
      explanation: 'For GST Inclusive (Remove GST): Base Price = Gross Price / (1 + GST Rate / 100), and GST Amount = Gross Price − Base Price. For intra-state transactions, CGST = SGST = GST Amount / 2.',
    },
    applicationCategory: 'FinanceApplication',
    faqs: [
      {
        question: 'What is the difference between GST Inclusive and GST Exclusive?',
        answer: 'GST Exclusive means the initial price excludes tax, so GST is added on top. GST Inclusive means the sticker price already contains tax, and the base price plus tax component must be separated.',
      },
      {
        question: 'How are CGST and SGST split in India?',
        answer: 'For intra-state sales within the same state, GST is split equally (50% Central GST and 50% State GST). For inter-state sales, Integrated GST (IGST) is charged at the full rate.',
      },
      {
        question: 'What are the standard GST tax slabs?',
        answer: 'The standard Indian GST slabs are 0% (essential commodities), 5% (basic essentials), 12% (processed goods), 18% (most consumer goods and services), and 28% (luxury and demerit goods).',
      },
    ],
    relatedToolIds: ['discount', 'percentage', 'emi', 'salary'],
  },

  interest: {
    toolId: 'interest',
    slug: 'interest-calculator',
    path: 'interest-calculator/',
    title: 'Simple & Compound Interest Calculator | CalcX',
    description: 'Calculate Simple Interest (SI) and Compound Interest (CI) with compounding frequency options, side-by-side comparison, and SIP investment returns on CalcX.',
    canonical: `${SITE_URL}/interest-calculator/`,
    h1: 'Simple & Compound Interest Calculator',
    shortIntro: 'Compute Simple Interest, Compound Interest with variable compounding frequencies, side-by-side growth comparison, and Systematic Investment Plan (SIP) returns.',
    overview: 'Understanding the mechanics of interest is fundamental to smart saving, lending, and investing. Simple Interest earns a flat return only on the initial principal, whereas Compound Interest reinvests accumulated interest so earnings grow exponentially over time. CalcX allows you to compare both models and project mutual fund SIP investments.',
    formula: {
      metric: 'Compound: A = P(1 + r/n)ⁿᵗ  |  Simple: I = (P × R × T) / 100',
      explanation: 'In Compound Interest, P is principal, r is decimal rate, n is compounding frequency per year, and t is time in years. In Simple Interest, interest accumulates linearly.',
    },
    applicationCategory: 'FinanceApplication',
    faqs: [
      {
        question: 'How does compounding frequency affect total returns?',
        answer: 'More frequent compounding (monthly or daily vs. annually) generates higher final returns because interest starts earning interest sooner. Even a small increase in frequency compounds into substantial wealth over long timeframes.',
      },
      {
        question: 'What is the difference between SI and CI?',
        answer: 'Simple Interest computes gains strictly on the starting principal. Compound Interest calculates gains on both the initial principal and all accumulated interest from prior periods.',
      },
      {
        question: 'What is a Systematic Investment Plan (SIP)?',
        answer: 'A SIP is an investment method where a fixed amount is invested at regular intervals (usually monthly) into an asset, benefiting from compounding growth and rupee cost averaging.',
      },
    ],
    relatedToolIds: ['emi', 'percentage', 'gst', 'calculator'],
  },

  discount: {
    toolId: 'discount',
    slug: 'discount-calculator',
    path: 'discount-calculator/',
    title: 'Discount Calculator — Sale Savings & Price | CalcX',
    description: 'Calculate sale discounts, money saved, final discounted price, and optional sales tax instantly. Perfect for shopping, retail sales, and clearance deals.',
    canonical: `${SITE_URL}/discount-calculator/`,
    h1: 'Discount Calculator — Sale Savings & Price',
    shortIntro: 'Determine markdown savings, net purchase prices, and post-tax totals with instant preset discount buttons and customizable rates.',
    overview: 'When shopping online or during seasonal retail promotions (Black Friday, festive clearances, store discounts), knowing the true final price after percentage markdowns and local sales tax helps avoid checkout surprises. CalcX provides instant calculations of both total dollars saved and net final price.',
    formula: {
      metric: 'Final Price = Original Price − [Original Price × (Discount % / 100)]',
      explanation: 'Total savings equal Original Price multiplied by (Discount % / 100). If sales tax applies, tax is computed on the discounted subtotal.',
    },
    applicationCategory: 'ShoppingApplication',
    faqs: [
      {
        question: 'How do you calculate a 20% discount on $100?',
        answer: 'Multiply $100 by 0.20 to get savings of $20. Subtract $20 from $100 to get the discounted price of $80.',
      },
      {
        question: 'Is sales tax applied before or after the discount?',
        answer: 'In most retail jurisdictions, sales tax is assessed on the final discounted price rather than the original manufacturer suggested retail price (MSRP).',
      },
      {
        question: 'Can I calculate stacked or successive discounts?',
        answer: 'Successive discounts (e.g. 20% off plus an extra 10% off) apply sequentially rather than additively. 20% off $100 leaves $80, and 10% off $80 leaves $72 (total 28% discount, not 30%).',
      },
    ],
    relatedToolIds: ['percentage', 'gst', 'tip', 'calculator'],
  },

  fraction: {
    toolId: 'fraction',
    slug: 'fraction-calculator',
    path: 'fraction-calculator/',
    title: 'Fraction Calculator — Add, Subtract, Multiply & Divide | CalcX',
    description: 'Free fraction calculator with step-by-step reduction. Add, subtract, multiply, and divide fractions and mixed numbers with automated GCD simplification.',
    canonical: `${SITE_URL}/fraction-calculator/`,
    h1: 'Fraction Calculator — Add, Subtract, Multiply & Divide',
    shortIntro: 'Perform arithmetic on proper, improper, and mixed fractions with automated greatest common divisor (GCD) reduction and decimal conversions.',
    overview: 'Working with fractions requires careful handling of numerators, denominators, and common multiples. CalcX computes addition, subtraction, multiplication, and division of fractions, automatically reducing results to lowest terms and displaying both mixed number and decimal representations.',
    formula: {
      metric: 'a/b + c/d = (ad + bc) / bd  |  a/b × c/d = ac / bd',
      explanation: 'For division, invert the second fraction and multiply: (a/b) ÷ (c/d) = (ad) / (bc). Results are simplified by dividing numerator and denominator by their greatest common divisor (GCD).',
    },
    applicationCategory: 'CalculatorApplication',
    faqs: [
      {
        question: 'How do you add fractions with different denominators?',
        answer: 'Find a common denominator (often the least common multiple), convert both fractions into equivalent fractions with that denominator, add the numerators, and simplify.',
      },
      {
        question: 'What is a mixed number versus an improper fraction?',
        answer: 'An improper fraction has a numerator greater than or equal to its denominator (e.g., 7/4). A mixed number combines an integer and a proper fraction (e.g., 1 3/4).',
      },
      {
        question: 'How does fraction division work?',
        answer: 'To divide fractions, multiply the first fraction by the reciprocal (flipped version) of the second fraction: 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2 (or 1 1/2).',
      },
    ],
    relatedToolIds: ['calculator', 'percentage', 'equation', 'statistics'],
  },

  calculator: {
    toolId: 'calculator',
    slug: 'scientific-calculator',
    path: 'scientific-calculator/',
    title: 'Free Online Scientific Calculator | CalcX',
    description: 'Free online scientific calculator with trigonometric functions, logarithms, roots, powers, Ans memory, and BODMAS precedence. Fast, accurate, and works offline.',
    canonical: `${SITE_URL}/scientific-calculator/`,
    h1: 'Free Online Scientific Calculator',
    shortIntro: 'Advanced scientific calculator with natural mathematical expressions, trigonometric functions in DEG and RAD, logs, roots, Ans chaining, and unified history.',
    overview: 'The CalcX Smart Scientific Calculator evaluates complex mathematical expressions with strict adherence to algebraic order of operations (BODMAS / PEMDAS). Featuring zero eval() client-side parsing, it supports advanced trigonometry, inverse functions, hyperbolic calculations, combinatorics (nCr, nPr), exponentiation, and persistent history.',
    formula: {
      metric: 'BODMAS Precedence: Brackets → Orders → Division & Multiplication → Addition & Subtraction',
      explanation: 'Expressions are evaluated through a robust tokenization and shunting-yard algorithm that handles implicit multiplication, nested parentheses, and function calls with float precision.',
    },
    applicationCategory: 'CalculatorApplication',
    faqs: [
      {
        question: 'How does the Ans button work?',
        answer: 'The Ans button recalls the result of your immediately preceding calculation. You can use it inside parentheses, apply functions like sqrt(Ans), or start an equation with an operator (+, ×) to chain directly from Ans.',
      },
      {
        question: 'How do I switch between Degree (DEG) and Radian (RAD) mode?',
        answer: 'Toggle the DEG / RAD button in the calculator interface. In DEG mode, sin(30) = 0.5. In RAD mode, sin(π/2) = 1.',
      },
      {
        question: 'Does this calculator support scientific notation and factorials?',
        answer: 'Yes. You can enter scientific numbers such as 1e5 (100,000) or 2.5e-3 (0.0025) and calculate factorials using the n! button or typing ! after any non-negative integer.',
      },
    ],
    relatedToolIds: ['fraction', 'equation', 'statistics', 'unit'],
  },
};

/**
 * Returns SEO data for a given toolId or slug
 */
export function getSeoForTool(toolIdOrSlug) {
  if (!toolIdOrSlug) return DEFAULT_SEO;
  if (SEO_PAGES[toolIdOrSlug]) return SEO_PAGES[toolIdOrSlug];
  const found = Object.values(SEO_PAGES).find(
    (p) => p.slug === toolIdOrSlug || p.path === toolIdOrSlug || p.toolId === toolIdOrSlug
  );
  return found || DEFAULT_SEO;
}
