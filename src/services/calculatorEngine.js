/**
 * CalcX Smart Scientific Calculator Engine
 * Evaluates expressions safely using a Shunting-Yard Parser & AST / RPN evaluator.
 * Strictly NO eval().
 * Supports Ans (previous answer), scientific notation, extreme number handling, and DEG/RAD trig.
 */

// Format numbers nicely, avoiding IEEE 754 precision artifacts and handling extreme numbers
export function cleanNumber(val, maxDecimals = 10) {
  if (typeof val !== 'number' || isNaN(val)) return 'Error';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  const absVal = Math.abs(val);

  // Extremely large or extremely small numbers -> clean scientific notation
  if (absVal !== 0 && (absVal >= 1e14 || absVal <= 1e-6)) {
    const expStr = val.toExponential(8);
    const [mantissa, exponent] = expStr.split('e');
    const cleanMantissa = parseFloat(mantissa).toString();
    return `${cleanMantissa}e${exponent}`;
  }

  // Round standard precision errors (e.g. 0.1 + 0.2 = 0.3)
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round(val * factor) / factor;
  return rounded.toString();
}

// Compute factorial
export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial only defined for non-negative integers');
  if (n > 170) return Infinity; // JS max float limit
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Tokenizes math expressions into structured tokens
 * @param {string} expr Math expression string
 * @param {{ ans?: number }} options Previous answer
 */
export function tokenize(expr, options = {}) {
  const tokens = [];
  const ansValue = typeof options.ans === 'number' && !isNaN(options.ans) ? options.ans : 0;
  let i = 0;

  // Normalize symbols
  let cleanExpr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .trim();

  // If expression begins with a binary operator and ans is provided, continue with Ans
  if (/^[+*\/^%]/.test(cleanExpr) && options.ans !== undefined && options.ans !== null) {
    cleanExpr = 'Ans ' + cleanExpr;
  }

  while (i < cleanExpr.length) {
    const char = cleanExpr[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (integers, decimals, or scientific notation like 1.5e6, 2e-4)
    if (/\d/.test(char) || (char === '.' && /\d/.test(cleanExpr[i + 1] || ''))) {
      let numStr = '';
      while (i < cleanExpr.length && /[\d.]/.test(cleanExpr[i])) {
        numStr += cleanExpr[i];
        i++;
      }

      // Check for scientific notation: e.g. 1.5e6 or 2e-4 or 1e+10
      if (i < cleanExpr.length && (cleanExpr[i] === 'e' || cleanExpr[i] === 'E')) {
        const nextChar = cleanExpr[i + 1];
        if (nextChar === '+' || nextChar === '-' || /\d/.test(nextChar)) {
          numStr += cleanExpr[i];
          i++;
          if (cleanExpr[i] === '+' || cleanExpr[i] === '-') {
            numStr += cleanExpr[i];
            i++;
          }
          while (i < cleanExpr.length && /\d/.test(cleanExpr[i])) {
            numStr += cleanExpr[i];
            i++;
          }
        }
      }

      tokens.push({ type: 'number', value: parseFloat(numStr) });
      continue;
    }

    // Multi-letter identifiers (functions, constants, or Ans)
    if (/[a-zA-Z]/.test(char)) {
      let idStr = '';
      while (i < cleanExpr.length && /[a-zA-Z]/.test(cleanExpr[i])) {
        idStr += cleanExpr[i].toLowerCase();
        i++;
      }

      if (idStr === 'ans') {
        tokens.push({ type: 'number', value: ansValue });
      } else if (idStr === 'pi') {
        tokens.push({ type: 'constant', value: Math.PI });
      } else if (idStr === 'e') {
        tokens.push({ type: 'constant', value: Math.E });
      } else if (['sqrt', 'cbrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'abs'].includes(idStr)) {
        tokens.push({ type: 'function', value: idStr });
      } else {
        throw new Error(`Unknown identifier: ${idStr}`);
      }
      continue;
    }

    // Postfix factorial or percentage operators
    if (char === '!' || char === '%') {
      tokens.push({ type: 'postfix', value: char });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(' || char === ')') {
      tokens.push({ type: char === '(' ? 'lparen' : 'rparen', value: char });
      i++;
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '^'].includes(char)) {
      // Check if minus is unary
      if (char === '-') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'operator' || prev.type === 'lparen') {
          tokens.push({ type: 'unary', value: 'u-' });
          i++;
          continue;
        }
      }
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  // Handle implicit multiplication, e.g.: 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2pi -> 2*pi, 2sqrt(4) -> 2*sqrt(4), 2ans -> 2*ans
  const result = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const current = tokens[idx];
    const next = tokens[idx + 1];
    result.push(current);

    if (next) {
      const isCurrentValue =
        current.type === 'number' || current.type === 'constant' || current.type === 'rparen' || current.type === 'postfix';
      const isNextValueOrFn =
        next.type === 'number' || next.type === 'constant' || next.type === 'function' || next.type === 'lparen';

      if (isCurrentValue && isNextValueOrFn) {
        result.push({ type: 'operator', value: '*' });
      }
    }
  }

  return result;
}

const PRECEDENCE = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
  'u-': 4,
};

const RIGHT_ASSOCIATIVE = {
  '^': true,
  'u-': true,
};

/**
 * Shunting-Yard Algorithm to convert infix tokens to RPN
 */
export function toRPN(tokens) {
  const output = [];
  const operatorStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'number' || token.type === 'constant') {
      output.push(token);
    } else if (token.type === 'function') {
      operatorStack.push(token);
    } else if (token.type === 'postfix') {
      output.push(token);
    } else if (token.type === 'operator' || token.type === 'unary') {
      const o1 = token.value;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'function') {
          output.push(operatorStack.pop());
          continue;
        }
        if (top.type === 'operator' || top.type === 'unary') {
          const o2 = top.value;
          const p1 = PRECEDENCE[o1] || 0;
          const p2 = PRECEDENCE[o2] || 0;
          if ((!RIGHT_ASSOCIATIVE[o1] && p1 <= p2) || (RIGHT_ASSOCIATIVE[o1] && p1 < p2)) {
            output.push(operatorStack.pop());
            continue;
          }
        }
        break;
      }
      operatorStack.push(token);
    } else if (token.type === 'lparen') {
      operatorStack.push(token);
    } else if (token.type === 'rparen') {
      let foundMatching = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top.type === 'lparen') {
          foundMatching = true;
          break;
        }
        output.push(top);
      }
      if (!foundMatching) {
        throw new Error('Mismatched parentheses');
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'function') {
        output.push(operatorStack.pop());
      }
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op.type === 'lparen' || op.type === 'rparen') {
      throw new Error('Mismatched parentheses');
    }
    output.push(op);
  }

  return output;
}

/**
 * Evaluates RPN tokens with angle mode ('deg' or 'rad')
 */
export function evaluateRPN(rpn, angleMode = 'deg') {
  const stack = [];

  const toRad = (val) => (angleMode === 'deg' ? (val * Math.PI) / 180 : val);
  const fromRad = (val) => (angleMode === 'deg' ? (val * 180) / Math.PI : val);

  for (let i = 0; i < rpn.length; i++) {
    const token = rpn[i];

    if (token.type === 'number' || token.type === 'constant') {
      stack.push(token.value);
    } else if (token.type === 'unary' && token.value === 'u-') {
      if (stack.length < 1) throw new Error('Invalid syntax for unary minus');
      const a = stack.pop();
      stack.push(-a);
    } else if (token.type === 'postfix' && token.value === '!') {
      if (stack.length < 1) throw new Error('Invalid syntax for factorial');
      const a = stack.pop();
      stack.push(factorial(a));
    } else if (token.type === 'postfix' && token.value === '%') {
      if (stack.length < 1) throw new Error('Invalid syntax for percentage');
      const b = stack.pop();
      const nextOp = rpn[i + 1];
      if (stack.length >= 1 && nextOp && nextOp.type === 'operator' && (nextOp.value === '+' || nextOp.value === '-')) {
        const a = stack[stack.length - 1];
        stack.push(a * (b * 0.01));
      } else {
        stack.push(b * 0.01);
      }
    } else if (token.type === 'operator') {
      if (stack.length < 2) throw new Error('Invalid expression syntax');
      const b = stack.pop();
      const a = stack.pop();

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by zero');
          stack.push(a / b);
          break;
        case '%':
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
    } else if (token.type === 'function') {
      if (stack.length < 1) throw new Error(`Missing argument for function ${token.value}`);
      const a = stack.pop();

      switch (token.value) {
        case 'sqrt':
          if (a < 0) throw new Error('Cannot take square root of a negative number');
          stack.push(Math.sqrt(a));
          break;
        case 'cbrt':
          stack.push(Math.cbrt(a));
          break;
        case 'sin': {
          const rad = toRad(a);
          const res = Math.sin(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'cos': {
          const rad = toRad(a);
          const res = Math.cos(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'tan': {
          const rad = toRad(a);
          const cosVal = Math.cos(rad);
          if (Math.abs(cosVal) < 1e-15) throw new Error('Tangent undefined at 90° / 270°');
          const res = Math.tan(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'asin':
          if (a < -1 || a > 1) throw new Error('Domain error: asin argument must be between -1 and 1');
          stack.push(fromRad(Math.asin(a)));
          break;
        case 'acos':
          if (a < -1 || a > 1) throw new Error('Domain error: acos argument must be between -1 and 1');
          stack.push(fromRad(Math.acos(a)));
          break;
        case 'atan':
          stack.push(fromRad(Math.atan(a)));
          break;
        case 'log':
          if (a <= 0) throw new Error('Domain error: log argument must be > 0');
          stack.push(Math.log10(a));
          break;
        case 'ln':
          if (a <= 0) throw new Error('Domain error: ln argument must be > 0');
          stack.push(Math.log(a));
          break;
        case 'abs':
          stack.push(Math.abs(a));
          break;
        default:
          throw new Error(`Unknown function: ${token.value}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression syntax');
  }

  return stack[0];
}

/**
 * Main evaluation entry point
 * @param {string} expression e.g. "2 + 3 * 4", "Ans * 5", "sqrt(144)", "2^20"
 * @param {string} angleMode 'deg' | 'rad'
 * @param {number} ans Previous calculation result
 * @returns {{ result: number, formatted: string }}
 */
export function calculate(expression, angleMode = 'deg', ans = 0) {
  if (!expression || !expression.trim()) {
    return { result: 0, formatted: '0' };
  }

  const tokens = tokenize(expression, { ans });
  const rpn = toRPN(tokens);
  const rawResult = evaluateRPN(rpn, angleMode);
  const formatted = cleanNumber(rawResult);

  return {
    result: rawResult,
    formatted,
  };
}
