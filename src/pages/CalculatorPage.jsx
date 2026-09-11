import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Delete, History, Trash2, ArrowUpRight } from 'lucide-react';
import { calculate } from '../services/calculatorEngine';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CopyButton } from '../components/common/CopyButton';
import { getItem, setItem } from '../utils/storage';

const HISTORY_KEY = 'calcx_calc_history_v1';

export function CalculatorPage() {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [lastAnswer, setLastAnswer] = useState(0);
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' | 'rad'
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState(() => getItem(HISTORY_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  // Sync history to storage
  useEffect(() => {
    setItem(HISTORY_KEY, history);
  }, [history]);

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
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, displayValue, justCalculated, angleMode, lastAnswer]);

  const appendChar = (char) => {
    if (justCalculated) {
      if (['+', '-', '×', '÷', '^', '%', '!'].includes(char)) {
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
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated) {
      handleClear();
      return;
    }
    setExpression((prev) => {
      if (prev.endsWith('Ans')) return prev.slice(0, -3);
      return prev.slice(0, -1);
    });
  };

  const handleEquals = () => {
    if (!expression.trim()) return;

    try {
      const res = calculate(expression, angleMode, lastAnswer);
      setDisplayValue(res.formatted);
      setLastAnswer(res.result);
      setJustCalculated(true);

      // Add to local history
      const newEntry = {
        id: Date.now(),
        expression,
        result: res.formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 29)]);

      // Add to global unified history
      logCalculation({
        toolId: 'calculator',
        toolName: 'Calculator',
        input: expression,
        result: res.formatted,
      });
    } catch (err) {
      setDisplayValue(err.message ? err.message.slice(0, 28) : 'Error');
      setJustCalculated(true);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Scientific Calculator"
        description="High-precision arithmetic, trigonometry, logarithms, and powers with Shunting-yard safety."
        icon={CalcIcon}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              variant={showHistory ? 'primary' : 'secondary'}
              size="sm"
              icon={History}
              onClick={() => setShowHistory(!showHistory)}
            >
              History ({history.length})
            </Button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: showHistory ? '1fr 320px' : '1fr', gap: 24 }}>
        {/* Main Calculator */}
        <div className="calc-wrapper">
          <div className="calc-display">
            <div className="calc-expression">{expression || '\u00A0'}</div>
            <div className="calc-main-value">{displayValue}</div>
          </div>

          <div className="calc-top-bar">
            {/* Degree / Radian Toggle */}
            <div className="tab-group" style={{ width: 'auto' }}>
              <button
                type="button"
                className={`tab-btn ${angleMode === 'deg' ? 'active' : ''}`}
                onClick={() => setAngleMode('deg')}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                DEG
              </button>
              <button
                type="button"
                className={`tab-btn ${angleMode === 'rad' ? 'active' : ''}`}
                onClick={() => setAngleMode('rad')}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
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
              <CopyButton text={displayValue} />
            </div>
          </div>

          {/* Scientific Keypad */}
          <div className="calc-keypad-sci" style={{ marginBottom: 8 }}>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sin')}>sin</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('cos')}>cos</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('tan')}>tan</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('(')}>(</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar(')')}>)</button>

            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('sqrt')}>√</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('^')}>xʸ</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('log')}>log</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('ln')}>ln</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('!')}>n!</button>

            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('π')}>π</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('e')}>e</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={handleToggleSign}>±</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={handleReciprocal}>1/x</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendFunction('abs')}>|x|</button>
          </div>

          {/* Standard Keypad */}
          <div className="calc-keypad">
            {/* Row 1: Memory */}
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryClear}>MC</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryRecall}>MR</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memoryAdd}>M+</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={memorySubtract}>M−</button>

            {/* Row 2: Control & Divide */}
            <button type="button" className="calc-btn calc-btn-clear" onClick={handleClear}>C</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={handleBackspace} title="Backspace">
              <Delete size={20} />
            </button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('%')}>%</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('÷')}>÷</button>

            {/* Row 3 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('7')}>7</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('8')}>8</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('9')}>9</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('×')}>×</button>

            {/* Row 4 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('4')}>4</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('5')}>5</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('6')}>6</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('-')}>−</button>

            {/* Row 5 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('1')}>1</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('2')}>2</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('3')}>3</button>
            <button type="button" className="calc-btn calc-btn-op" onClick={() => appendChar('+')}>+</button>

            {/* Row 6 */}
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('0')}>0</button>
            <button type="button" className="calc-btn calc-btn-num" onClick={() => appendChar('.')}>.</button>
            <button type="button" className="calc-btn calc-btn-fn" onClick={() => appendChar('Ans')} title="Previous Answer">Ans</button>
            <button type="button" className="calc-btn calc-btn-equals" onClick={handleEquals}>=</button>
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
                  onClick={() => setHistory([])}
                  title="Clear history"
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
                    }}
                    onClick={() => {
                      setExpression(item.result);
                      setDisplayValue(item.result);
                    }}
                    title="Click to load result into calculator"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{item.timestamp}</span>
                      <ArrowUpRight size={12} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.expression} =
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
    </div>
  );
}
