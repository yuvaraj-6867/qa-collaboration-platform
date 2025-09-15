// Utility functions to trigger notifications

export const triggerUserCreated = (username: string) => {
  window.dispatchEvent(new CustomEvent('userCreated', { 
    detail: { username } 
  }));
};

export const triggerUserAssigned = (taskName: string, assignee: string) => {
  window.dispatchEvent(new CustomEvent('userAssigned', { 
    detail: { taskName, assignee } 
  }));
};

export const triggerUserLoggedIn = (username: string) => {
  window.dispatchEvent(new CustomEvent('userLoggedIn', { 
    detail: { username } 
  }));
};

export const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  if ((window as any).addNotification) {
    (window as any).addNotification(title, message, type);
  }
};