import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertySummary } from '../types';

interface CompareContextType {
  compareList: PropertySummary[];
  addToCompare: (property: PropertySummary) => boolean;
  removeFromCompare: (propertyId: number) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<PropertySummary[]>(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (property: PropertySummary) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 properties at a time.');
      return false;
    }
    if (compareList.some((p) => p.id === property.id)) {
      return false;
    }
    setCompareList([...compareList, property]);
    return true;
  };

  const removeFromCompare = (propertyId: number) => {
    setCompareList(compareList.filter((p) => p.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId: number) => {
    return compareList.some((p) => p.id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
};
