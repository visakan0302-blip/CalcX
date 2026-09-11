# CalcX — Commercial-Grade All-in-One Calculator Suite

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-140%2F140%20passing-success.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg)
![Security](https://img.shields.io/badge/Security-Zero%20eval%28%29-brightgreen.svg)

**CalcX** is a modern, responsive, precision calculation and conversion platform built for engineers, financial analysts, traders, students, and everyday professionals. It features 18 specialized calculation tools, offline PWA support, light/dark themes, and full keyboard navigation.

---

## ✨ Features & Included Tools

### 🧮 Core Calculators
- **Smart Calculator**: Natural expression input, operator precedence (BODMAS/PEMDAS), `Ans` previous result chaining, arbitrary precision, and floating-point error sanitization ($0.1 + 0.2 = 0.3$).
- **Scientific Calculator**: Full trigonometric suite (DEG/RAD), logarithms ($\ln, \log_{10}$), factorials, power exponents ($x^y$), roots ($\sqrt{x}, \sqrt[3]{x}$), reciprocals ($1/x$), and constants ($\pi, e$).

### 🔄 Converters
- **Unit Converter**: 13 conversion categories (Length, Area, Volume, Mass, Temperature, Speed, Time, Digital Storage, Pressure, Energy, Power, Frequency, Angle) supporting over 80 standard units with instantaneous reciprocal calculation.
- **Currency Converter**: Over 30 global currencies powered by an open client-side exchange rate API with automated localStorage caching and transparent offline fallback.

### 💰 Financial Suite
- **EMI & Loan Calculator**: Loan payment calculator with total interest and amortization schedule breakdown.
- **Interest Calculator**: Simple Interest, Compound Interest, and SIP/Investment compounding comparison.
- **GST / Sales Tax Calculator**: Forward GST (Add GST) and Reverse GST (Remove GST) with CGST/SGST breakdowns.
- **Discount & Markup**: Stacked discounts, sale price determination, and savings tracking.
- **Tip & Bill Split**: Custom gratuity percentages, rounding options, and per-person bill splitting.
- **Salary & Take-Home**: Gross-to-net salary estimator with configurable tax and deduction modeling.

### 📐 Mathematics & Analytics
- **Equation Solver**: Step-by-step linear equations ($ax + b = c$) and quadratic equations ($ax^2 + bx + c = 0$) with real and complex root support.
- **Percentage Calculator**: 5 dedicated modes (Percentage of value, percentage change, increase/decrease, reverse percentage).
- **Fraction Calculator**: Arithmetic, reduction/simplification, and mixed number conversions.
- **Statistics Calculator**: Mean, median, mode, standard deviation, variance, and IQR calculations.
- **Random Number Generator**: Integer ranges, cryptographically seeded random generation, and dice rolling.

### 🩺 Health & Lifestyle
- **BMI Calculator**: Metric and Imperial Body Mass Index with WHO categorization and visual scale.
- **Date Calculator**: Calendar difference counter, business days, and date addition/subtraction.
- **Age Calculator**: Exact age breakdown (years, months, days), leap-baby handling, and birthday countdown.

---

## 🔒 Security & Privacy

- **Zero `eval()` Policy**: Calculations are parsed through a custom, deterministic **Shunting-Yard RPN (Reverse Polish Notation)** tokenizer and evaluator. No string execution or runtime evaluation vulnerabilities.
- **No Private Credentials / Secrets**: Client-side currency conversion utilizes public, unauthenticated open endpoints (`open.er-api.com`). No private API keys, secrets, or bearer tokens are stored or exposed.
- **100% Client-Side Execution**: User calculations, history records, and preferences remain local in browser storage (`localStorage`). No telemetry or remote tracking.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/calcx.git

# Navigate into project directory
cd calcx

# Install dependencies
npm install
```

### Development
```bash
# Start local development server with Vite HMR
npm run dev
```

### Production Build
```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Automated Tests
```bash
# Run all 140 comprehensive unit & precision tests
npm test
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript (ES2022+)
- **Build Tool**: Vite 8
- **Icons**: Lucide React
- **Design System**: Vanilla CSS with custom glassmorphism design tokens (Dark / Light / System OS auto-sync)
- **Offline / PWA**: Web App Manifest & Service Worker Cache API

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
