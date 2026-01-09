
"use client";


import { jwtDecode } from "jwt-decode";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
const LOGIN_ENDPOINT = "/user/login";


const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";


const FORCE_LOGOUT_TIME = 150 * 60 * 1000;
const LOGIN_TIME_KEY = "loginTime";




interface LoginPayload {
  email: string;
  password: string;
}


// -------------------- TOKEN HELPERS --------------------


export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  // Try to get from cookie first (New System)
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  if (cookieValue) return cookieValue;

  // Fallback to localStorage (Legacy System - will eventually be phased out)
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};


export const syncTokenToLocalStorage = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());

  // Also ensure cookie is set if not already (though the server should handle this)
  document.cookie = `accessToken=${accessToken}; path=/; max-age=86400;`;
};


// -------------------- LOGOUT --------------------


export const logoutAdmin = () => {
  if (typeof window === "undefined") return;


  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  // Clear cookie as well
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";


  if (window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval);
    window.tokenCheckInterval = null;
  }


  window.location.href = "/dashboard/admin/login";
};


// -------------------- AUTH CHECK --------------------


export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;


  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // TOKEN EXPIRED
    if (decoded.exp <= currentTime) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return false;
    }

    // Role check - must be admin (case-insensitive)
    if (decoded.role?.toLowerCase() !== "admin") {
      console.warn("Access denied: User is not an admin");
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return false;
    }


    return true;
  } catch (error) {
    console.error("JWT decode failed", error);


    //INVALID TOKEN
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return false;
  }
};


// -------------------- TOKEN EXPIRY TIME --------------------


export const getTokenExpiryTime = (): number | null => {
  const token = getAccessToken();
  if (!token) return null;


  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(decoded.exp - currentTime, 0);
  } catch {
    return null;
  }
};


export const startTokenExpiryMonitor = () => {
  if (typeof window === "undefined") return;


  if (window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval);
  }


  // Immediate check
  if (!isAuthenticated()) {
    logoutAdmin();
    return;
  }

  // Check every 30 seconds
  window.tokenCheckInterval = setInterval(() => {
    if (!isAuthenticated()) {
      logoutAdmin();
    }
  }, 30000);
};


export const stopTokenExpiryMonitor = () => {
  if (typeof window !== "undefined" && window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval);
    window.tokenCheckInterval = null;
  }
};


export const startForceLogoutTimer = () => {
  if (typeof window === "undefined") return;


  const loginTime = localStorage.getItem(LOGIN_TIME_KEY);


  if (!loginTime) {
    console.warn(" loginTime not found");
    return;
  }


  const interval = setInterval(() => {
    const elapsedTime = Date.now() - Number(loginTime);
    const remainingTime = FORCE_LOGOUT_TIME - elapsedTime;


    // console.log(
    //   ` Remaining Time: ${Math.ceil(remainingTime / 1000)} seconds`
    // );


    if (remainingTime <= 0) {
      clearInterval(interval);
      console.warn(" Force logout triggered");
      logoutAdmin();
    }
  }, 1000);
};



export const loginAdmin = async (payload: LoginPayload) => {
  const url = `${BASE_URL}${LOGIN_ENDPOINT}`;
  // console.log(url, "debug url")
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });


    const result = await response.json();


    if (response.ok && result.data?.accessToken) {
      const decoded: any = jwtDecode(result.data.accessToken);

      // Verify role before saving token (case-insensitive)
      if (decoded.role?.toLowerCase() !== "admin") {
        return {
          success: false,
          message: "Access denied: You do not have administrator privileges.",
        };
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreashToken);
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());


      // Start expiry monitor
      startTokenExpiryMonitor();
      startForceLogoutTimer();


      return result;
    }


    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
    };
  }
};

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAccessToken();
  const url = `${BASE_URL}${endpoint}`;


  if (!isAuthenticated()) {
    logoutAdmin();
    throw new Error("Session expired. Please login again.");
  }


  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", token!);


  const response = await fetch(url, {
    ...options,
    headers,
  });


  if (response.status === 401 || response.status === 403) {
    logoutAdmin();
    throw new Error("Unauthorized access");
  }


  return response;
};


declare global {
  interface Window {
    tokenCheckInterval: NodeJS.Timeout | null;
  }
}

