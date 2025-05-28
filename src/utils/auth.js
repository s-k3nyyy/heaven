// utils/auth.js
// Authentication utility functions for managing tokens and API calls

const API_BASE_URL = 'https://ideal-sniffle-1y3k.onrender.com';

// Token management
export const AuthUtils = {
  // Get stored access token
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  // Get stored refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  // Get stored user data
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Store authentication data
  setAuthData: (accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
  },

  // Clear all authentication data
  clearAuthData: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('signupData');
    localStorage.removeItem('registrationSuccess');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = AuthUtils.getAccessToken();
    const userData = AuthUtils.getUserData();
    return !!(token && userData);
  },

  // Check if current user has specific role
  hasRole: (role) => {
    const userData = AuthUtils.getUserData();
    return userData?.role === role;
  },

  // Refresh access token
  refreshAccessToken: async () => {
    const refreshToken = AuthUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      return data.access_token;
    } catch (error) {
      // If refresh fails, clear all auth data
      AuthUtils.clearAuthData();
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    const token = AuthUtils.getAccessToken();
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    AuthUtils.clearAuthData();
  }
};

// API call wrapper with automatic token refresh
export const apiCall = async (endpoint, options = {}) => {
  let token = AuthUtils.getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  // Prepare request options
  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  try {
    // Make the API call
    let response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // If token is expired (401), try to refresh it
    if (response.status === 401) {
      try {
        token = await AuthUtils.refreshAccessToken();
        
        // Retry the request with new token
        requestOptions.headers['Authorization'] = `Bearer ${token}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Protected route wrapper component
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = AuthUtils.isAuthenticated();
  const userData = AuthUtils.getUserData();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (userData?.role === 'donor') {
      return <Navigate to="/home" replace />;
    } else if (userData?.role === 'admin') {
      return <Navigate to="/orphanageDashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Hook for authentication state
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = AuthUtils.getAccessToken();
        const user = AuthUtils.getUserData();

        if (token && user) {
          // Verify token is still valid
          const response = await apiCall('/auth/me');
          setUserData(response.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUserData(null);
        AuthUtils.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (accessToken, refreshToken, user) => {
    AuthUtils.setAuthData(accessToken, refreshToken, user);
    setIsAuthenticated(true);
    setUserData(user);
  };

  const logout = async () => {
    await AuthUtils.logout();
    setIsAuthenticated(false);
    setUserData(null);
  };

  return {
    isAuthenticated,
    userData,
    loading,
    login,
    logout,
    hasRole: (role) => userData?.role === role
  };
};

// Example usage in a component:
/*
import { useAuth, ProtectedRoute, apiCall } from './utils/auth';

// In your App.js or routing component:
<Route path="/home" element={
  <ProtectedRoute requiredRole="donor">
    <HomePage />
  </ProtectedRoute>
} />

<Route path="/orphanageDashboard" element={
  <ProtectedRoute requiredRole="admin">
    <OrphanageDashboard />
  </ProtectedRoute>
} />

// In any component that needs auth data:
const MyComponent = () => {
  const { isAuthenticated, userData, logout } = useAuth();
  
  const handleApiCall = async () => {
    try {
      const data = await apiCall('/some-endpoint', {
        method: 'POST',
        body: JSON.stringify({ someData: 'value' })
      });
      console.log(data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
*/