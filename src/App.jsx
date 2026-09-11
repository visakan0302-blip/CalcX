import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { AboutModal } from './components/Navigation/AboutModal';

// Existing Pages
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { UnitConverterPage } from './pages/UnitConverterPage';
import { CurrencyPage } from './pages/CurrencyPage';
import { EquationPage } from './pages/EquationPage';
import { BMIPage } from './pages/BMIPage';
import { DatePage } from './pages/DatePage';
import { AgePage } from './pages/AgePage';

// New Commercial Suite Pages
import { EMIPage } from './pages/EMIPage';
import { InterestPage } from './pages/InterestPage';
import { GSTPage } from './pages/GSTPage';
import { SalaryPage } from './pages/SalaryPage';
import { DiscountPage } from './pages/DiscountPage';
import { TipPage } from './pages/TipPage';
import { PercentagePage } from './pages/PercentagePage';
import { FractionPage } from './pages/FractionPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { RandomPage } from './pages/RandomPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

import { getItem, setItem } from './utils/storage';
import { TOOLS } from './components/Navigation/toolsConfig';
import { WifiOff } from 'lucide-react';

const THEME_KEY = 'calcx_theme_v1';
const LAST_TOOL_KEY = 'calcx_last_tool_v1';

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return getItem(THEME_KEY, 'dark');
  });

  const [systemIsLight, setSystemIsLight] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => setSystemIsLight(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveTheme = themeMode === 'system' ? (systemIsLight ? 'light' : 'dark') : themeMode;

  const [activeTool, setActiveTool] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramTool = params.get('tool');
      if (paramTool && TOOLS.some((t) => t.id === paramTool)) {
        return paramTool;
      }
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash && TOOLS.some((t) => t.id === hash)) {
        return hash;
      }
    } catch {
      // ignore
    }
    return getItem(LAST_TOOL_KEY, 'dashboard');
  });

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen to URL changes (back/forward, hash changes)
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paramTool = params.get('tool');
        if (paramTool && TOOLS.some((t) => t.id === paramTool)) {
          setActiveTool(paramTool);
          return;
        }
        const hash = window.location.hash.replace(/^#\/?/, '');
        if (hash && TOOLS.some((t) => t.id === hash)) {
          setActiveTool(hash);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Apply theme class to <body> and root
  useEffect(() => {
    document.documentElement.className = `theme-${effectiveTheme}`;
    document.body.className = `theme-${effectiveTheme}`;
    setItem(THEME_KEY, themeMode);
  }, [effectiveTheme, themeMode]);

  // Persist last active tool and dynamically update SEO document title
  useEffect(() => {
    setItem(LAST_TOOL_KEY, activeTool);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const currentTool = TOOLS.find((t) => t.id === activeTool);
    if (activeTool === 'dashboard' || !currentTool) {
      document.title = 'CalcX — Free Online Calculators & Math Tools';
    } else {
      document.title = `${currentTool.name} — CalcX`;
    }
  }, [activeTool]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderActiveToolPage = () => {
    switch (activeTool) {
      case 'dashboard':
        return <DashboardPage onSelectTool={setActiveTool} />;
      case 'calculator':
        return <CalculatorPage />;
      case 'unit':
        return <UnitConverterPage />;
      case 'currency':
        return <CurrencyPage />;
      case 'equation':
        return <EquationPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'emi':
        return <EMIPage />;
      case 'interest':
        return <InterestPage />;
      case 'gst':
        return <GSTPage />;
      case 'salary':
        return <SalaryPage />;
      case 'discount':
        return <DiscountPage />;
      case 'tip':
        return <TipPage />;
      case 'bmi':
        return <BMIPage />;
      case 'date':
        return <DatePage />;
      case 'age':
        return <AgePage />;
      case 'percentage':
        return <PercentagePage />;
      case 'fraction':
        return <FractionPage />;
      case 'random':
        return <RandomPage />;
      case 'history':
        return <HistoryPage onSelectTool={setActiveTool} />;
      case 'settings':
        return (
          <SettingsPage
            theme={themeMode}
            effectiveTheme={effectiveTheme}
            onSetTheme={setThemeMode}
            onToggleTheme={toggleTheme}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        );
      default:
        return <DashboardPage onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className={`app-container theme-${effectiveTheme}`}>
      {/* Desktop Sidebar */}
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        theme={effectiveTheme}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Navigation Header & Drawer */}
        <MobileNav
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          theme={effectiveTheme}
          onToggleTheme={toggleTheme}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Page Content */}
        <main className="main-content">
          {!isOnline && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <WifiOff size={16} />
              <span>Offline Mode — All mathematical, conversion, and financial tools work 100% locally.</span>
            </div>
          )}

          {renderActiveToolPage()}
        </main>
      </div>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
