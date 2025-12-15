// src/contexts/TourContext.js

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { COMMON_TOUR_ROUTES, MANAGER_TOUR_ROUTES, ADMIN_TOUR_ROUTES } from '../config/tour-config';

const TourContext = createContext(null);

export function TourProvider({ children }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const masterTour = useMemo(() => {
    if (!user?.role) return [];
    let tourConfig = [...COMMON_TOUR_ROUTES];
    if (user.role === 'manager') tourConfig.push(...MANAGER_TOUR_ROUTES);
    if (user.role === 'admin') tourConfig.push(...MANAGER_TOUR_ROUTES, ...ADMIN_TOUR_ROUTES);
    return tourConfig;
  }, [user]);

  useEffect(() => {
    if (isTourActive) {
      const stage = masterTour[currentStageIndex];
      if (stage) {
        navigate(stage.path);
      } else {
        // O tour terminou
        setIsTourActive(false);
      }
    }
  }, [currentStageIndex, isTourActive, navigate, masterTour]);
  
  const runStepTour = useCallback((steps, onComplete) => {
    if (!window.driver) return;

    let autoplayTimer = null;
    let userInteracted = false; // Flag para saber se o usuário clicou em algo

    const driver = window.driver.js.driver;
    const driverObj = driver({
      showProgress: false,
      allowClose: true,
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Ok, entendi!',
      steps: steps,

      onHighlightStarted: (element, step, options) => {
        clearTimeout(autoplayTimer);
        
        if (!userInteracted) {
            autoplayTimer = setTimeout(() => {
                const currentState = driverObj.getState();
                const isLastStepOnPage = currentState.activeStep === steps.length - 1;

                if (isLastStepOnPage) {
                    onComplete(); 
                } 
                else {
                    driverObj.moveNext();
                }
            }, 3000);
        }
      },
      
      onNextClick: () => {
        userInteracted = true;
        clearTimeout(autoplayTimer);
      },
      
      onPrevClick: () => {
        userInteracted = true;
        clearTimeout(autoplayTimer);
      },

      onDestroyed: () => {
        clearTimeout(autoplayTimer);
        if (isTourActive) setIsTourActive(false);
      },
    });

    driverObj.drive();
  }, [isTourActive, currentStageIndex, masterTour]);

  const startSiteTour = () => {
    if (masterTour.length > 0) {
      setCurrentStageIndex(0);
      setIsTourActive(true);
    } else {
      console.warn("Nenhum roteiro de tour disponível para este usuário.");
    }
  };

  const advanceTour = () => {
    setCurrentStageIndex(prev => prev + 1);
  };
  
  const value = { 
    startSiteTour, 
    isTourActive, 
    currentStage: masterTour[currentStageIndex],
    runStepTour,
    advanceTour
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour deve ser usado dentro de um TourProvider');
  }
  return context;
}