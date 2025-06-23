import logger from './logger';

export const reportError = async (errorData) => {
  try {
    // Example: Send to error tracking service
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(errorData)
    });
    
    if (!response.ok) throw new Error('Error reporting failed');
    
    return response.json();
  } catch (error) {
    logger.error('Error reporting failed:', error);
    throw error;
  }
};
