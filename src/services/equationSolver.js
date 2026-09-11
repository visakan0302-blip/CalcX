/**
 * CalcX Equation Solver Service
 * Rigorous symbolic parser and step-by-step solver for linear and quadratic equations in one variable (x).
 */

// Helper to format fractions or numbers cleanly
function formatNum(n, maxDecimals = 6) {
  if (Math.abs(n) < 1e-12) return '0';
  const rounded = Number(n.toFixed(maxDecimals));
  return rounded.toString();
}

/**
 * Parses an algebraic expression string (like "2x^2 - 5x + 6") into polynomial coefficients:
 * returns { 2: a, 1: b, 0: c } for degree 2, 1, 0
 */
function parseSide(sideStr) {
  const terms = { 2: 0, 1: 0, 0: 0 };
  let str = sideStr.trim().replace(/\s+/g, '').replace(/\*([xX])/g, '$1');
  if (!str) return terms;

  // Insert leading '+' if needed
  if (str[0] !== '+' && str[0] !== '-') {
    str = '+' + str;
  }

  // Regex to match terms: ([+-])(\d*\.?\d*)?(x(\^2)?)?
  const regex = /([+-])(\d*\.?\d*)?(?:(x)(?:\^(\d+))?)?/gi;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const sign = match[1];
    const coeffStr = match[2];
    const hasVar = Boolean(match[3]);
    const expStr = match[4];

    if (!sign && !coeffStr && !hasVar) continue;
    // Skip empty matches
    if (match[0] === '') continue;

    let coeff = 1;
    if (coeffStr !== undefined && coeffStr !== '') {
      coeff = parseFloat(coeffStr);
      if (isNaN(coeff)) coeff = 1;
    }
    if (sign === '-') {
      coeff = -coeff;
    }

    let degree = 0;
    if (hasVar) {
      if (expStr) {
        degree = parseInt(expStr, 10);
      } else {
        degree = 1;
      }
    }

    if (degree > 2) {
      throw new Error(`Degree ${degree} polynomial detected. This solver currently supports linear and quadratic equations (degree 1 or 2).`);
    }

    terms[degree] = (terms[degree] || 0) + coeff;
  }

  return terms;
}

/**
 * Solves a one-variable equation string (e.g. "2x + 5 = 15", "x^2 - 5x + 6 = 0")
 */
export function solveEquation(equationInput) {
  if (!equationInput || !equationInput.trim()) {
    throw new Error('Please enter an equation to solve.');
  }

  let eq = equationInput
    .replace(/²/g, '^2')
    .replace(/X/g, 'x')
    .trim();

  const sides = eq.split('=');
  if (sides.length !== 2) {
    throw new Error("Equation must contain exactly one '=' sign (e.g., 2x + 5 = 15).");
  }

  const lhsStr = sides[0].trim();
  const rhsStr = sides[1].trim();

  if (!lhsStr || !rhsStr) {
    throw new Error('Both sides of the equation must contain expressions.');
  }

  // Parse LHS and RHS
  const lhs = parseSide(lhsStr);
  const rhs = parseSide(rhsStr);

  // Bring all to LHS: (lhs - rhs = 0)
  const a = (lhs[2] || 0) - (rhs[2] || 0);
  const b = (lhs[1] || 0) - (rhs[1] || 0);
  const c = (lhs[0] || 0) - (rhs[0] || 0);

  const steps = [];
  steps.push({
    title: 'Original Equation',
    detail: `${lhsStr} = ${rhsStr}`,
  });

  // Check if any variable is present
  if (Math.abs(a) < 1e-10 && Math.abs(b) < 1e-10) {
    if (Math.abs(c) < 1e-10) {
      return {
        type: 'identity',
        equation: eq,
        solutions: ['All real numbers (Infinite solutions)'],
        steps: [
          ...steps,
          { title: 'Simplify', detail: '0 = 0' },
          { title: 'Conclusion', detail: 'The statement is always true for any value of x.' },
        ],
      };
    } else {
      return {
        type: 'contradiction',
        equation: eq,
        solutions: ['No solution'],
        steps: [
          ...steps,
          { title: 'Simplify', detail: `${formatNum(c)} = 0` },
          { title: 'Conclusion', detail: 'The statement is false. No value of x satisfies the equation.' },
        ],
      };
    }
  }

  // 1. Linear Equation: a == 0, b != 0 -> bx + c = 0
  if (Math.abs(a) < 1e-10) {
    const bStr = formatNum(b);
    const varTerm = b === 1 ? 'x' : b === -1 ? '-x' : `${bStr}x`;
    const rhsVal = -c;

    // Check if original equation was of form mx + n = k
    if (lhs[1] && !rhs[1] && lhs[0] && rhs[0]) {
      const origConst = formatNum(lhs[0]);
      const targetConst = formatNum(rhs[0]);
      const signWord = lhs[0] > 0 ? '-' : '+';
      const absOrigConst = formatNum(Math.abs(lhs[0]));

      steps.push({
        title: 'Step 1: Isolate Variable Term',
        detail: `${varTerm} = ${targetConst} ${signWord} ${absOrigConst}`,
      });
      steps.push({
        title: 'Step 2: Simplify Constant Side',
        detail: `${varTerm} = ${formatNum(rhsVal)}`,
      });
    } else {
      steps.push({
        title: 'Step 1: Collect Terms',
        detail: `${varTerm} = ${formatNum(rhsVal)}`,
      });
    }

    const xSol = rhsVal / b;
    steps.push({
      title: 'Step 3: Divide by Coefficient',
      detail: `x = ${formatNum(rhsVal)} / ${bStr}\nx = ${formatNum(xSol)}`,
    });

    return {
      type: 'linear',
      equation: eq,
      solutions: [`x = ${formatNum(xSol)}`],
      numericSolutions: [xSol],
      steps,
    };
  }

  // 2. Quadratic Equation: ax^2 + bx + c = 0
  const standardForm = `${formatNum(a)}x² ${b >= 0 ? '+ ' + formatNum(b) : '- ' + formatNum(Math.abs(b))}x ${c >= 0 ? '+ ' + formatNum(c) : '- ' + formatNum(Math.abs(c))} = 0`;
  steps.push({
    title: 'Standard Quadratic Form',
    detail: `Rearrange all terms to one side (ax² + bx + c = 0):\n${standardForm}\nHere: a = ${formatNum(a)}, b = ${formatNum(b)}, c = ${formatNum(c)}`,
  });

  // Calculate Discriminant D = b^2 - 4ac
  const D = b * b - 4 * a * c;
  steps.push({
    title: 'Calculate Discriminant (D = b² − 4ac)',
    detail: `D = (${formatNum(b)})² − 4(${formatNum(a)})(${formatNum(c)})\nD = ${formatNum(b * b)} − ${formatNum(4 * a * c)}\nD = ${formatNum(D)}`,
  });

  steps.push({
    title: 'Apply Quadratic Formula',
    detail: `x = (−b ± √D) / (2a)\nx = (−(${formatNum(b)}) ± √(${formatNum(D)})) / (2 × ${formatNum(a)})`,
  });

  if (D > 1e-12) {
    // Two distinct real roots
    const sqrtD = Math.sqrt(D);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    steps.push({
      title: 'Compute Real Solutions',
      detail: `Since D > 0, there are two distinct real solutions:\nx₁ = (${formatNum(-b)} + ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x1)}\nx₂ = (${formatNum(-b)} − ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x2)}`,
    });

    return {
      type: 'quadratic',
      equation: eq,
      discriminant: D,
      isComplex: false,
      solutions: [`x = ${formatNum(x1)}`, `x = ${formatNum(x2)}`],
      numericSolutions: [x1, x2],
      steps,
    };
  } else if (Math.abs(D) <= 1e-12) {
    // One repeated root (double root)
    const x = -b / (2 * a);
    steps.push({
      title: 'Compute Repeated Solution',
      detail: `Since D = 0, there is exactly one repeated real root (double root):\nx = −b / (2a) = ${formatNum(-b)} / ${formatNum(2 * a)} = ${formatNum(x)}`,
    });

    return {
      type: 'quadratic',
      equation: eq,
      discriminant: D,
      isComplex: false,
      solutions: [`x = ${formatNum(x)} (double root)`],
      numericSolutions: [x],
      steps,
    };
  } else {
    // Two complex roots: D < 0
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-D) / (2 * Math.abs(a));

    const realStr = formatNum(realPart);
    const imagStr = formatNum(imagPart);

    steps.push({
      title: 'Compute Complex Solutions',
      detail: `Since D < 0, solutions are complex numbers with imaginary unit i (√-1):\nx = ${realStr} ± ${imagStr}i`,
    });

    return {
      type: 'quadratic',
      equation: eq,
      discriminant: D,
      isComplex: true,
      solutions: [`x = ${realStr} + ${imagStr}i`, `x = ${realStr} − ${imagStr}i`],
      numericSolutions: [],
      steps,
    };
  }
}
