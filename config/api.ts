// Backend API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    VERIFY: `${API_BASE_URL}/api/v1/auth/verify`,
  },
  HEALTH: `${API_BASE_URL}/api/v1/health`,
};

export default API_BASE_URL;

