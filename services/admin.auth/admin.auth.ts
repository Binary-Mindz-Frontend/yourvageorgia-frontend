// @/services/auth.ts
"use client";
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      email: string;
      role: string;
    };
  };
}

// Admin credentials (in production, these should come from env variables)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

console.log("Admin Email:", ADMIN_EMAIL, ADMIN_PASSWORD);
export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
  // Simulate a small delay to make it feel like a real API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if credentials match
  if (payload.email === ADMIN_EMAIL && payload.password === ADMIN_PASSWORD) {
    // Generate a simple token (in production, this would come from backend)
    const token = btoa(`${payload.email}:${Date.now()}`); // Base64 encoded token
    
    const userData = {
      token,
      user: {
        email: payload.email,
        role: 'admin',
      },
    };

    // Store token in localStorage
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData.user));

    return {
      success: true,
      data: userData,
    };
  }

  // Invalid credentials
  return {
    success: false,
    message: 'Invalid email or password',
  };
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken();
};

export const getAdminUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
};