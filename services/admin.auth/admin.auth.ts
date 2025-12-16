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

// Assuming your backend URL is set in .env.local like this:
// NEXT_PUBLIC_BASE_API=http://82.25.109.232:5000/api
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
const LOGIN_ENDPOINT = "/user/login"; 
// Assuming a refresh endpoint exists, e.g., '/user/refresh'
const REFRESH_ENDPOINT = "/user/refresh"; 

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
// --- 2. Login Function (Stores Both Tokens) -----------------------------
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

  } catch (error) {
    console.error("Network or parsing error during login:", error);
    return { success: false, message: "Could not connect to the backend server. Please check your connection." };
  }
};


// ----------------------------------------------------------------------
// --- 3. Refresh Token Logic (New) -------------------------------------
// ----------------------------------------------------------------------

/**
 * Attempts to use the Refresh Token to obtain a new Access Token.
 */
const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        // If no refresh token exists, we cannot proceed.
        logoutAdmin();
        throw new Error("No refresh token available. User must log in.");
    }
    
    try {
        const response = await fetch(`${BASE_URL}${REFRESH_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            // Refresh failed (e.g., refresh token expired or invalid)
            logoutAdmin(); 
            throw new Error("Failed to refresh token. Session has expired.");
        }

        const data = await response.json();
        const newAccessToken = data.data?.accessToken;

        if (newAccessToken) {
            // Update the stored access token
            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
            return newAccessToken;
        } else {
            logoutAdmin();
            throw new Error("Refresh token response was missing new access token.");
        }

    } catch (error) {
        // Network error during refresh, or parsing error
        logoutAdmin();
        throw new Error("Failed to communicate with token refresh service.");
    }
};


// ----------------------------------------------------------------------
// --- 4. Logic to USE the Access Token (fetchWithAuth) -----------------
// ----------------------------------------------------------------------

/**
 * A wrapper around the native fetch API that automatically handles 
 * Access Token injection and refresh attempts upon 401/403 errors.
 */
export const fetchWithAuth = async (
  endpoint: string, 
  options: RequestInit = {} 
): Promise<Response> => {
    
    let token = getAccessToken();
    const url = `${BASE_URL}${endpoint}`;

    if (!token) {
        // If no token exists, try to get one via refresh or fail immediately.
        try {
            token = await refreshAccessToken();
        } catch (e) {
            throw new Error("User must log in. Failed to retrieve or refresh token.");
        }
    }

    // Attempt 1: Fetch with current (or newly refreshed) token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
        ...options.headers, 
    };

    let response = await fetch(url, { ...options, headers });

    // Handle token expiration/invalidity (401 or 403)
    if (response.status === 401 || response.status === 403) {
        try {
            console.log("Access Token expired. Attempting refresh...");
            // Attempt to get a new access token
            const newToken = await refreshAccessToken(); 

            // Attempt 2: Retry the original request with the new token
            const retryHeaders = {
                ...headers,
                'Authorization': `Bearer ${newToken}`, 
            };

            response = await fetch(url, { ...options, headers: retryHeaders });
            
            // If the retry also fails, it will be caught below
            if (!response.ok) {
                 throw new Error(`Retry failed with status: ${response.status}`);
            }

        } catch (e) {
            // Refresh failed or retry failed (user must be redirected to login)
            console.error(e.message);
            // Throwing an error here forces the calling component to handle the final failure.
            throw new Error("Session invalid. Please log in again.");
        }
    }

    return response;
};