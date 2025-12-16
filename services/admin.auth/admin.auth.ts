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


const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';


interface LoginPayload {
  email: string;
  password: string;
}


interface UserData {
  accessToken: string;
  refreashToken: string;
}


interface LoginResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserData;
}


type ApiError = {
  success: false;
  message: string;
  statusCode?: number;
};


// --- Helper Functions ---


export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token ? token.trim() : null;
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
  return !!getAccessToken();
};


// --- Login Function ---


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
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreashToken);
      return result;
    }


    return { success: false, message: result.message || "Login failed due to unexpected server response." };


  } catch (err) {
    return { success: false, message: "Could not connect to the backend server. Please check your connection." };
  }
};


// --- Authenticated Fetch ---


export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
   
    const token = getAccessToken();
    const url = `${BASE_URL}${endpoint}`;


    if (!token) {
        throw new Error("No authentication token found. Please log in.");
    }
   
    const requestHeaders = new Headers(options.headers || {});
    requestHeaders.set('Content-Type', 'application/json');
   
    // FIX: Send token without 'Bearer ' prefix as required by your API
    requestHeaders.set('Authorization', token);
   
    const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
    });


    if (response.status === 401 || response.status === 403) {
        // Optionally add logoutAdmin() here if you want to clear tokens on 401
        // logoutAdmin();
        throw new Error("Session expired or unauthorized. Please log in again.");
    }
   
    return response;
};
