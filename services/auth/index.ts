/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { jwtDecode } from "jwt-decode";
import { getValidToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: Record<string, any>) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/signup`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to register: ${res.statusText}`);
    }
    const user = await res.json();

    return user;
  } catch (error: any) {
    console.log({ error });
    return { error: error.message };
  }
};

//Login User
export const loginUser = async (userData: FieldValues) => {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    // console.log("login user", result);

    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.accessToken);

      // Save user in cookies
      const decodedUser: any = jwtDecode(result?.data?.accessToken);
      cookieStore.set("user", JSON.stringify(decodedUser), {
        httpOnly: false,
        secure: false,
        path: "/",
      });
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const loginUserWithToken = async (token: any) => {
  const cookieStore = await cookies();
  console.log({ token });
  try {
    // Prepare the request URL with the accessToken in the query
    const url = `${process.env.NEXT_PUBLIC_BASE_API}/user/login-with-token`;

    const res = await fetch(url, {
      method: "POST", // Assuming it's a GET request for login with token
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await res.json();
    console.log({ result });
    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.accessToken);

      // Save user in cookies
      const decodedUser: any = jwtDecode(result?.data?.accessToken);
      cookieStore.set("user", JSON.stringify(decodedUser), {
        httpOnly: false,
        secure: true,
        path: "/",
      });
    }

    return result;
  } catch (error: any) {
    console.error("Login with token failed:", error);
    return { error: error.message };
  }
};

//Logout User
export const logout = async () => {
  const cookieStore = await cookies();

  // Remove token and user from cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
};

//Change Password

//Get Current User
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (accessToken && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return { ...user, accessToken };
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return null;
    }
  }

  return null;
};

export const changePassword = async (userData: any) => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/change-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    return new Error(error);
  }
};

// Forget Password: Send OTP to Email
export const forgetPassword = async ({ email }: { email: string }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/forget-password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const result = await res.json();
    console.log(result);
    return result;
  } catch (error: any) {
    console.log("Forget Password Error:", error);
    return { success: false, message: error.message };
  }
};

// Verify OTP
export const verifyForgetOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/verify-forget-password-otp`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log("Verify OTP Error:", error);
    return { success: false, message: error.message };
  }
};

// Reset Password
export const resetPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/reset-password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log("Reset Password Error:", error);
    return { success: false, message: error.message };
  }
};
