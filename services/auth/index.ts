/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";
// import { useEffect } from "react";
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.token);

      // Save user in cookies
      cookieStore.set("user", JSON.stringify(result?.data?.user));
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

//Change Password
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

//Logout User
export const logout = async () => {
  const cookieStore = await cookies();

  // Remove token and user from cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
};
