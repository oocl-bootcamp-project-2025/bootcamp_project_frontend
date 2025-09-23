// context/AppProvider.jsx
import React, { createContext, useContext } from 'react';
import { useAppState, useModalState } from '../hooks';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const appState = useAppState();
  const modalState = useModalState();

  const value = {
    ...appState,
    ...modalState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
