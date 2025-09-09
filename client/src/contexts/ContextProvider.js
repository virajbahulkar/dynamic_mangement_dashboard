import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#3881B5');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [currentTab, setCurrentTab] = useState(0);
  const [filters, setFilters] = useState({
    flag: 'ISSUANCE',
    dim_dt: 'YTD',
    lob: 'GROUP',
    yoy: '2023',
    channel: 'DIGITAL',
    premiumFilters: 'wpi',
  });

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  const fireBaseProviderValue = useMemo(
    () => ({
      currentColor,
      currentMode,
      activeMenu,
      screenSize,
      setScreenSize,
      handleClick,
      isClicked,
      initialState,
      setIsClicked,
      setActiveMenu,
      setCurrentColor,
      setCurrentMode,
      setMode,
      setColor,
      themeSettings,
      setThemeSettings,
      currentTab,
      setCurrentTab,
      filters,
      setFilters,
    }),
    [
      currentColor,
      currentMode,
      activeMenu,
      screenSize,
      setScreenSize,
      isClicked,
      themeSettings,
      currentTab,
      filters,
    ],
  );

  return (
  // ...existing code...
    <StateContext.Provider value={fireBaseProviderValue}>{children}</StateContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useStateContext = () => useContext(StateContext);
