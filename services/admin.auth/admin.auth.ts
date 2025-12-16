/* eslint-disable @typescript-eslint/no-unused-vars */
// // @/services/auth.ts
// "use client";
// interface LoginPayload {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     token: string;
//     user: {
//       email: string;
//       role: string;
//     };
//   };
// }

// // Admin credentials (in production, these should come from env variables)
// const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
// const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
//   // Simulate a small delay to make it feel like a real API call
//   await new Promise(resolve => setTimeout(resolve, 500));

//   // Check if credentials match
//   if (payload.email === ADMIN_EMAIL && payload.password === ADMIN_PASSWORD) {
//     // Generate a simple token (in production, this would come from backend)
//     const token = btoa(`${payload.email}:${Date.now()}`); // Base64 encoded token
    
//     const userData = {
//       token,
//       user: {
//         email: payload.email,
//         role: 'admin',
//       },
//     };

//     // Store token in localStorage
//     localStorage.setItem('adminToken', token);
//     localStorage.setItem('adminUser', JSON.stringify(userData.user));

//     return {
//       success: true,
//       data: userData,
//     };
//   }

//   // Invalid credentials
//   return {
//     success: false,
//     message: 'Invalid email or password',
//   };
// };

// export const logoutAdmin = () => {
//   localStorage.removeItem('adminToken');
//   localStorage.removeItem('adminUser');
// };

// export const getAdminToken = (): string | null => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('adminToken');
//   }
//   return null;
// };

// export const isAdminAuthenticated = (): boolean => {
//   return !!getAdminToken();
// };

// export const getAdminUser = () => {
//   if (typeof window !== 'undefined') {
//     const user = localStorage.getItem('adminUser');
//     return user ? JSON.parse(user) : null;
//   }
//   return null;
// };

// @/services/auth.ts

"use client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
const LOGIN_ENDPOINT = "/user/login"; 

// --- Token Management Keys ---
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';


// --- Interfaces based on your ACTUAL API response ---

interface LoginPayload {
  email: string;
  password: string;
}

interface UserData {
  accessToken: string;
  refreashToken: string;
  // Add other user fields if needed
}

interface LoginResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserData;
}

// Custom error type for better client-side handling
type ApiError = {
  success: false;
  message: string;
  statusCode?: number;
};


// ----------------------------------------------------------------------
// --- 1. Helper Functions (Retrieve/Check Tokens) ----------------------
// ----------------------------------------------------------------------

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
};

export const logoutAdmin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  // A user is considered authenticated if they have an access token
  return !!getAccessToken();
};


// ----------------------------------------------------------------------
// --- 2. Login Function ------------------------------------------------
// ----------------------------------------------------------------------

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponseData | ApiError> => {
  const url = `${BASE_URL}${LOGIN_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        return {
            success: false,
            message: errorBody.message || `Login failed with status: ${response.status}`,
            statusCode: response.status
        };
    }
    
    const result: LoginResponseData = await response.json();
    
    if (result.success && result.data?.accessToken) {
      // Store both access and refresh tokens
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken); 
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreashToken); 
      
      return result;
    }
    
    return { success: false, message: result.message || "Login failed due to unexpected server response." };

  } catch (err) {
    console.error("Network or parsing error during login:", err);
    return { success: false, message: "Could not connect to the backend server. Please check your connection." };
  }
};


// ----------------------------------------------------------------------
// --- 3. Authenticated Fetch (Simple - No Auto Refresh) ----------------
// ----------------------------------------------------------------------

/**
 * Makes an authenticated request by adding the access token to headers.
 * If the token is invalid (401/403), logs out the user and throws an error.
 */
export const fetchWithAuth = async (
  endpoint: string, 
  options: RequestInit = {} 
): Promise<Response> => {
    
    const token = getAccessToken();
    const url = `${BASE_URL}${endpoint}`;

    // Check if token exists
    if (!token) {
        throw new Error("No authentication token found. Please log in.");
    }

    // Add authorization header
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
        ...options.headers, 
    };

    // Make the request
    const response = await fetch(url, { ...options, headers });

    // If unauthorized, clear tokens and throw error
    if (response.status === 401 || response.status === 403) {
        logoutAdmin();
        throw new Error("Session expired or unauthorized. Please log in again.");
    }

    return response;
};