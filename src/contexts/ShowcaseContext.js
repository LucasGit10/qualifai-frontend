import React, { createContext, useContext } from 'react';

const ShowcaseContext = createContext({
  isGuestMode: false,
  openModal: () => {},
  plan: 'guest',
  canAccess: (featureKey) => false,
});

export const ShowcaseProvider = ShowcaseContext.Provider;
export const useShowcaseContext = () => useContext(ShowcaseContext);