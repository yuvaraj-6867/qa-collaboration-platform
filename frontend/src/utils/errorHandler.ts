interface ErrorResponse {
  error?: string;
  message?: string;
  errors?: string[];
}

export const getErrorMessage = (error: any): string => {
  // Handle axios errors
  if (error.response?.data) {
    const data: ErrorResponse = error.response.data;
    
    // Check for specific error message
    if (data.error) return data.error;
    if (data.message) return data.message;
    
    // Handle validation errors array
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(', ');
    }
  }
  
  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  // Handle 500 errors
  if (error.response?.status === 500) {
    return 'Server error occurred. Please try again later.';
  }
  
  // Handle 401 errors
  if (error.response?.status === 401) {
    return 'Authentication failed. Please login again.';
  }
  
  // Handle 403 errors
  if (error.response?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  // Handle 404 errors
  if (error.response?.status === 404) {
    return 'Resource not found.';
  }
  
  // Default fallback
  return error.message || 'An unexpected error occurred';
};