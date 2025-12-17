import React, { useEffect } from 'react';
import useApiTelemetryBuffer from './hooks/useApiTelemetryBuffer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings, TabComponent } from './components';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import DynamicFormDemo from './pages/DynamicFormDemo/DynamicFormDemo';
import HtmlComponentsDemo from './pages/HtmlComponentsDemo';
import FunctionEditor from './pages/FunctionEditor';
import TransformBuilder from './pages/TransformBuilder';
import Builder from './pages/Builder';

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  // Start telemetry buffer; enable POST when REACT_APP_ENABLE_METRICS === 'true'
  const [enableMetrics, setEnableMetrics] = React.useState(process.env.REACT_APP_ENABLE_METRICS === 'true' || localStorage.getItem('enable_metrics') === 'true');
  React.useEffect(() => {
    const handler = (e) => setEnableMetrics(!!e.detail?.enabled);
    window.addEventListener('metrics-toggle', handler);
    return () => window.removeEventListener('metrics-toggle', handler);
  }, []);
  useApiTelemetryBuffer({ flushIntervalMs: 20000, maxBuffer: 40, post: enableMetrics });

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-md text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div
              className="w-60 fixed  sidebar dark:bg-secondary-dark-bg "
              style={{ backgroundColor: 'white' }}
            >
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-60 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg bg-white navbar w-full ">
              <Navbar />
            </div>

            <div id="main-content" role="main">
              {themeSettings && <ThemeSettings />}

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={<TabComponent />} />
                <Route path="/management-dashboard" element={<TabComponent />} />
                <Route path="/dynamic-form" element={<DynamicFormDemo />} />
                <Route path="/dynamic-html-components" element={<HtmlComponentsDemo />} />
                <Route path="/functions" element={<FunctionEditor />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/transforms" element={<TransformBuilder />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
