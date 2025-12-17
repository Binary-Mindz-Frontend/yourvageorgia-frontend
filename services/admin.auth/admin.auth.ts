/* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";


// const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
// const LOGIN_ENDPOINT = "/user/login";


// const ACCESS_TOKEN_KEY = 'accessToken';
// const REFRESH_TOKEN_KEY = 'refreshToken';


// interface LoginPayload {
//   email: string;
//   password: string;
// }


// interface UserData {
//   accessToken: string;
//   refreashToken: string;
// }


// interface LoginResponseData {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: UserData;
// }


// type ApiError = {
//   success: false;
//   message: string;
//   statusCode?: number;
// };


// // --- Helper Functions ---


// export const getAccessToken = (): string | null => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem(ACCESS_TOKEN_KEY);
//     return token ? token.trim() : null;
//   }
//   return null;
// };


// export const getRefreshToken = (): string | null => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem(REFRESH_TOKEN_KEY);
//   }
//   return null;
// };


// export const logoutAdmin = () => {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//   }
// };


// export const isAuthenticated = (): boolean => {
//   return !!getAccessToken();
// };


// // --- Login Function ---


// export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponseData | ApiError> => {
//   const url = `${BASE_URL}${LOGIN_ENDPOINT}`;


//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });


//     if (!response.ok) {
//       const errorBody = await response.json().catch(() => ({}));
//       return {
//         success: false,
//         message: errorBody.message || `Login failed with status: ${response.status}`,
//         statusCode: response.status
//       };
//     }


//     const result: LoginResponseData = await response.json();


//     if (result.success && result.data?.accessToken) {
//       localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
//       localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreashToken);
//       return result;
//     }


//     return { success: false, message: result.message || "Login failed due to unexpected server response." };


//   } catch (err) {
//     return { success: false, message: "Could not connect to the backend server. Please check your connection." };
//   }
// };


// // --- Authenticated Fetch ---


// export const fetchWithAuth = async (
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<Response> => {
   
//     const token = getAccessToken();
//     const url = `${BASE_URL}${endpoint}`;


//     if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//     }
   
//     const requestHeaders = new Headers(options.headers || {});
//     requestHeaders.set('Content-Type', 'application/json');
   
//     // FIX: Send token without 'Bearer ' prefix as required by your API
//     requestHeaders.set('Authorization', token);
   
//     const response = await fetch(url, {
//         ...options,
//         headers: requestHeaders,
//     });


//     if (response.status === 401 || response.status === 403) {
//         // Optionally add logoutAdmin() here if you want to clear tokens on 401
//         // logoutAdmin();
//         throw new Error("Session expired or unauthorized. Please log in again.");
//     }
   
//     return response;
// };


"use client";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
const LOGIN_ENDPOINT = "/user/login";
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

interface LoginPayload {
  email: string;
  password: string;
}

// --- Helper Functions ---

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

export const logoutAdmin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Redirect to login page
    window.location.href = "/dashboard/admin/login";
  }
};

/**
 * Validates if the token exists and is still chronologically valid
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired (with a 10-second buffer)
    if (decoded.exp < currentTime + 10) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Token validation failed", error);
    return false;
  }
};

// --- Login Function ---

export const loginAdmin = async (payload: LoginPayload) => {
  const url = `${BASE_URL}${LOGIN_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreashToken);
      return result;
    }

    return { success: false, message: result.message || "Login failed" };
  } catch (err) {
    return { success: false, message: "Network error occurred." };
  }
};

// --- Authenticated Fetch ---

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  const url = `${BASE_URL}${endpoint}`;

  // 1. Client-side check BEFORE sending the request
  if (!isAuthenticated()) {
    logoutAdmin();
    throw new Error("Session expired.");
  }

  const requestHeaders = new Headers(options.headers || {});
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Authorization', token!);

  const response = await fetch(url, { ...options, headers: requestHeaders });

  // 2. Server-side check: If the server says the token is invalid (401)
  if (response.status === 401 || response.status === 403) {
    logoutAdmin();
    throw new Error("Unauthorized access.");
  }

  return response;
};