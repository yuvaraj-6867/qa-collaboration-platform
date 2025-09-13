export const clearAllLocalStorage = (): void => {
  localStorage.clear();
};

export const clearSpecificKeys = (): void => {
  const keys = [
    'token',
    'user', 
    'theme',
    'documents',
    'testCases',
    'automationScripts',
    'tickets'
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
};