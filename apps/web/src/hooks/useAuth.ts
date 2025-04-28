import { ApiResponse } from '@/types/api';
import { CompleteSignUpResponse, InitiateSignUpResponse, VerifySignUpResponse } from '@/types/auth';
import { useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const initiateSignUp = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/auth/initiate-sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const res: ApiResponse<InitiateSignUpResponse> = await response.json();

      setState(prev => ({ 
        ...prev, 
        user: { id: '', email: res.data.email }, 
        isAuthenticated: false, 
        isLoading: false 
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign up failed', 
        isLoading: false 
      }));
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { token, user } = data;
      
      setAuthToken(token);
      setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, [setAuthToken]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifySignUp = useCallback(async (email: string, otp: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/auth/verify-sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const res: ApiResponse<VerifySignUpResponse> = await response.json();

      setState(prev => ({ 
        ...prev, 
        user: { id: '', email: res.data.email }, 
        isAuthenticated: false, 
        isLoading: false 
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      return false;
    }
  }, []);

  const completeSignUp = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/auth/complete-sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Sign up completion failed');
      }

      const res: ApiResponse<CompleteSignUpResponse> = await response.json();

      setState(prev => ({ 
        ...prev, 
        user: { id: res.data.id, email: res.data.email }, 
        isAuthenticated: true, 
        isLoading: false 
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up completion failed';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (password: string, token: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    ...state,
    login,
    forgotPassword,
    initiateSignUp,
    verifySignUp,
    completeSignUp,
    resendOtp,
    resetPassword,
  };
}
