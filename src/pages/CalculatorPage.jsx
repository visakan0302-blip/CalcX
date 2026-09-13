import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Delete, History, Trash2, ArrowUpRight } from 'lucide-react';
import { calculate, toFraction, cleanNumber, formatCalculatorError } from '../services/calculatorEngine';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CopyButton } from '../components/common/CopyButton';
import { SeoSection } from '../components/common/SeoSection';
import { getUnifiedHistory, logCalculation, clearToolHistory } from '../utils/unifiedHistory';

export function CalculatorPage({ onSelectTool }) {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [lastAnswer, setLastAnswer] = useState(0);
  const [lastCalcDetails, setLastCalcDetails] = useState(null);
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' | 'rad'
  const [memory, setMemory] = useState(0);
  const [isSecond, setIsSecond] = useState(false);
  const [history, setHistory] = useState(() => getUnifiedHistory().filter((item) => item.toolId === 'calculator'));
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  // Character & Function appenders
  const appendChar = (char) => {
    if (justCalculated) {
      if (['+', '-', '×', '÷', '^', '%', '!', ' mod '].includes(char)) {
        setExpression('Ans' + char);
      } else {
        setExpression(char);
      }
      setJustCalculated(false);
    } else {
      setExpression((prev) => prev + char);
    }
  };

  const appendFunction = (fnName) => {
    if (justCalculated) {
      setExpression(`${fnName}(Ans)`);
      setJustCalculated(false);
    } else {
      setExpression((prev) => prev + `${fnName}(`);
    }
  };

  const handleClear = () => {
    setExpression('');
    setDisplayValue('0');
    setLastCalcDetails(null);
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated) {
      handleClear();
      return;
    }
    setExpression((prev) => {
      if (prev.endsWith('Ans')) return prev.slice(0, -3);
      if (prev.endsWith(' mod ')) return prev.slice(0, -5);
      if (prev.endsWith(' nCr ')) return prev.slice(0, -5);
      if (prev.endsWith(' nPr ')) return prev.slice(0, -5);
      return prev.slice(0, -1);
    });
  };

  const handleEquals = () => {
    if (!expression.trim()) return;

    try {
      const res = calculate(expression, angleMode, lastAnswer);
      setDisplayValue(res.formatted);
      setLastAnswer(res.result);
      setLastCalcDetails(res);
      setJustCalculated(true);

      // Add to global unified history
      const entry = logCalculation({
        toolId: 'calculator',
        toolName: 'Smart Calculator',
        input: expression,
        result: res.formatted,
      });

      if (entry) {
        setHistory((prev) => [entry, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      setDisplayValue(formatCalculatorError(err));
      setJustCalculated(true);
    }
  };

  // Fraction / Decimal conversion toggle
  const handleToggleFractionDecimal = () => {
    if (lastCalcDetails && lastCalcDetails.result !== undefined) {
      const { result, fraction, mixed } = lastCalcDetails;
      const decStr = cleanNumber(result);

      if (fraction && (displayValue === decStr || displayValue === mixed)) {
        setDisplayValue(displayValue === fraction && mixed && mixed !== fraction ? mixed : fraction);
      } else if (fraction && displayValue === fraction) {
        if (mixed && mixed !== fraction) {
          setDisplayValue(mixed);
        } else {
          setDisplayValue(decStr);
        }
      } else {
        setDisplayValue(decStr);
      }
      return;
    }

    // Attempt converting arbitrary numerical displayValue
    const num = parseFloat(displayValue);
    if (!isNaN(num) && isFinite(num)) {
      const frac = toFraction(num);
      if (frac && frac.d > 1) {
        const fracStr = `${frac.n}/${frac.d}`;
        if (displayValue === fracStr) {
          setDisplayValue(cleanNumber(num));
        } else {
          setDisplayValue(fracStr);
        }
      }
    }
  };

  // Memory operations
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    appendChar(memory.toString());
  };
  const memoryAdd = () => {
    try {
      const val = parseFloat(displayValue);
      if (!isNaN(val)) setMemory((prev) => prev + val);
    } catch {
      // ignore
    }
  };
  const memorySubtract = () => {
    try {
      const val = parseFloat(displayValue);
      if (!isNaN(val)) setMemory((prev) => prev - val);
    } catch {
      // ignore
    }
  };

  const handleToggleSign = () => {
    if (justCalculated) {
      if (displayValue.startsWith('-')) {
        const positive = displayValue.slice(1);
        setDisplayValue(positive);
        setExpression(positive);
      } else if (displayValue !== '0' && displayValue !== 'Error') {
        const negative = '-' + displayValue;
        setDisplayValue(negative);
        setExpression(negative);
      }
      return;
    }

    if (!expression) {
      setExpression('-');
      return;
    }

    if (expression.endsWith('(-')) {
      setExpression((prev) => prev.slice(0, -2));
    } else if (expression.endsWith('-')) {
      setExpression((prev) => prev.slice(0, -1));
    } else {
      setExpression((prev) => prev + '(-');
    }
  };

  const handleReciprocal = () => {
    if (justCalculated && displayValue !== '0' && displayValue !== 'Error') {
      setExpression(`1/(${displayValue})`);
      setJustCalculated(false);
    } else if (expression) {
      setExpression(`1/(${expression})`);
    }
  };

  const handleClearHistory = () => {
    clearToolHistory('calculator');
    setHistory([]);
  };

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        appendChar(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        appendChar(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'x' || key === 'X') {
        appendChar('×');
      } else if (key === 'a' || key === 'A') {
        appendChar('Ans');
      } else if (key === 'e' || key === 'E') {
        appendChar('e');
      } else if (key === 'p' || key === 'P') {
        appendChar('π');
      } else if (key === '.' || key === '(' || key === ')' || key === '^' || key === '!' || key === '%') {
        appendChar(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Delete' || key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, displayValue, justCalculated, angleMode, lastAnswer, lastCalcDetails]);

  // Responsive font size for long expressions and values
  const getDisplayFontSize = (text) => {
    if (!text) return '2.5rem';
    if (text.length > 24) return '1.35rem';
    if (text.length > 18) return '1.65rem';
    if (text.length > 12) return '2.05rem';
    return '2.5rem';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Free Online Scientific Calculator"
        description="Scientific calculator with natural expressions, Ans memory recall, trigonometric functions in DEG and RAD, logs, powers, and calculation history."
        icon={CalcIcon}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              variant={showHistory ? 'primary' : 'secondary'}
              size="sm"
              icon={History}
              onClick={() => setShowHistory(!showHistory)}
              aria-label="Toggle calculation history panel"
            >
              History ({history.length})
            </Button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: showHistory ? '1fr 320px' : '1fr', gap: 24 }}>
        {/* Main Calculator */}
        <div className="calc-wrapper">
          <div className="calc-display" aria-live="polite">
            <div className="calc-expression">{expression || '\u00A0'}</div>
            <div className="calc-main-value" style={{ fontSize: getDisplayFontSize(displayValue) }}>
              {displayValue}
            </div>
          </div>

          <div className="calc-top-bar">
            {/* Degree / Radian Toggle */}
            <div className="tab-group" style={{ width: 'auto' }}>
              <button
                type="button"
                className={`tab-btn ${angleMode === 'deg' ? 'active' : ''}`}
                onClick={() => setAngleMode('deg')}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                aria-label="Degrees angle mode"
              >
                DEG
              </button>
              <button
                type="button"
                className={`tab-btn ${angleMode === 'rad' ? 'active' : ''}`}
                onClick={() => setAngleMode('rad')}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                aria-label="Radians angle mode"
              >
                RAD
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {memory !== 0 && (
                <span className="calcx-badge calcx-badge-info" style={{ fontSize: '0.7rem' }}>
                  M = {memory}
                </span>
              )}
              <button
                type="button"
                className="calc-btn calc-btn-fn"
                onClick={handleToggleFractionDecimal}
                style={{ padding: '4px 10px', fontSize: '0.78rem', height: 'auto', minWidth: 'unset' }}
                title="Toggle Fraction / Decimal (F↔D)"
                aria-label="Toggle Fraction and Decimal view"
              >
                F↔D
              </button>
              <CopyButton text={displayValue} />
            </div>
          </div>

          {/* Scientific Keypad */}
          <div className="calc-keypad-sci" style={{ marginBottom: 8 }}>
            {!isSecond ? (
              <>
                {/* Row 1 */}
                <button
                  type="button"
                  className={`calc-btn calc-btn-fn ${isSecond ? 'active' : ''}`}
                  onClick={() => setIsSecond(!isSecond)}
                  style={isSecond ? { background: 'var(--primary)', color: '#fff' } : {}}
                  aria-label="Toggle secondary scientific functions"
                >
                  2nd
                </button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sin')} aria-label="Sine">sin</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('cos')} aria-label="Cosine">cos</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('tan')} aria-label="Tangent">tan</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('(')} aria-label="Open parenthesis">(</button>

                {/* Row 2 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(')')} aria-label="Close parenthesis">)</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sqrt')} aria-label="Square root">√</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('^')} aria-label="Power x to y">xʸ</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('log')} aria-label="Logarithm base 10">log</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('ln')} aria-label="Natural logarithm">ln</button>

                {/* Row 3 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('!')} aria-label="Factorial">n!</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(' nCr ')} aria-label="Combinations nCr">nCr</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(' nPr ')} aria-label="Permutations nPr">nPr</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(' mod ')} aria-label="Modulo">mod</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={handleReciprocal} aria-label="Reciprocal 1/x">1/x</button>

                {/* Row 4 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('π')} aria-label="Pi constant">π</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('e')} aria-label="Euler constant e">e</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={handleToggleSign} aria-label="Toggle sign ±">±</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('abs')} aria-label="Absolute value">|x|</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={handleToggleFractionDecimal} aria-label="Fraction to Decimal toggle">F↔D</button>
              </>
            ) : (
              <>
                {/* 2nd Row 1 */}
                <button
                  type="button"
                  className={`calc-btn calc-btn-fn ${isSecond ? 'active' : ''}`}
                  onClick={() => setIsSecond(!isSecond)}
                  style={{ background: 'var(--primary)', color: '#fff' }}
                  aria-label="Toggle secondary scientific functions"
                >
                  2nd
                </button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('asin')} aria-label="Arc sine">sin⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('acos')} aria-label="Arc cosine">cos⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('atan')} aria-label="Arc tangent">tan⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('(')} aria-label="Open parenthesis">(</button>

                {/* 2nd Row 2 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(')')} aria-label="Close parenthesis">)</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('cbrt')} aria-label="Cube root">∛</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sinh')} aria-label="Hyperbolic sine">sinh</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('cosh')} aria-label="Hyperbolic cosine">cosh</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('tanh')} aria-label="Hyperbolic tangent">tanh</button>

                {/* 2nd Row 3 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('asinh')} aria-label="Inverse hyperbolic sine">sinh⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('acosh')} aria-label="Inverse hyperbolic cosine">cosh⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('atanh')} aria-label="Inverse hyperbolic tangent">tanh⁻¹</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('floor')} aria-label="Floor function">floor</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('ceil')} aria-label="Ceil function">ceil</button>

                {/* 2nd Row 4 */}
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('round')} aria-label="Round function">round</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sign')} aria-label="Sign function">sign</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={handleToggleSign} aria-label="Toggle sign ±">±</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(' mod ')} aria-label="Modulo">mod</button>
                <button type="button" className="calc-btn calc-btn-fn" onClick={handleToggleFractionDecimal} aria-label="Fraction to Decimal toggle">F↔D</button>
              </>
            )}
          </div>

          {/* Standard Keypad */}
          <div className="calc-keypad">
            {/* Row 1: Memory */}
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryClear} aria-label="Clear memory">MC</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryRecall} aria-label="Recall memory">MR</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryAdd} aria-label="Add to memory">M+</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memorySubtract} aria-label="Subtract from memory">M−</button>

            {/* Row 2: Control & Divide */}
            <button type="button" className="calc-btn calc-btn-clear" onClick={handleClear} aria-label="Clear all">C</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={handleBackspace} title="Backspace" aria-label="Backspace">
              <Delete size={20} />
            </button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('%')} aria-label="Percentage">%</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('÷')} aria-label="Divide">÷</button>

            {/* Row 3 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('7')} aria-label="Digit 7">7</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('8')} aria-label="Digit 8">8</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('9')} aria-label="Digit 9">9</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('×')} aria-label="Multiply">×</button>

            {/* Row 4 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('4')} aria-label="Digit 4">4</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('5')} aria-label="Digit 5">5</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('6')} aria-label="Digit 6">6</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('-')} aria-label="Subtract">−</button>

            {/* Row 5 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('1')} aria-label="Digit 1">1</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('2')} aria-label="Digit 2">2</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('3')} aria-label="Digit 3">3</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('+')} aria-label="Add">+</button>

            {/* Row 6 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('0')} aria-label="Digit 0">0</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('.')} aria-label="Decimal point">.</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('Ans')} title="Previous Answer" aria-label="Previous answer">Ans</button>
            <button type="button" className="calc-btn calc-btn-equals" onClick={handleEquals} aria-label="Equals calculate">=</button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <Card
            title="History"
            icon={History}
            action={
              history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={handleClearHistory}
                  title="Clear history"
                  aria-label="Clear calculator history"
                >
                  Clear
                </Button>
              )
            }
          >
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '24px 0' }}>
                No calculations yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 460, overflowY: 'auto' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'border-color 0.15s ease',
                    }}
                    onClick={() => {
                      setExpression(item.input);
                      setDisplayValue(item.result);
                      setJustCalculated(true);
                    }}
                    title="Click to load expression & result into calculator"
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpression(item.input);
                        setDisplayValue(item.result);
                        setJustCalculated(true);
                      }
                    }}
                    aria-label={`Load calculation: ${item.input} = ${item.result}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{item.timestamp}</span>
                      <ArrowUpRight size={12} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.input} =
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {item.result}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <SeoSection toolId="calculator" onSelectTool={onSelectTool} />
    </div>
  );
}
