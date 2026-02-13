"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
export interface IFilters {
  search: string;
  role: string;
  isMembership: string;
  isBlocked: string;
  limit: number;
  page: number;
}
export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
export interface IUserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    email: string;
    phone: string | null;
    username: string;
    name: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isDeleted: boolean;
    isVerified: boolean;
    isPartner: boolean;
    isMembership: boolean;
    accessCode?: string;
    membershipId?: string;
    membershipExpiry?: number;
    accessCode?: string;
    isBlocked: boolean;
    isResettingPassword: boolean;
    avatarUrl: string;
    role: "user" | "admin";
    signUpMethod: "EMAIL" | "GOOGLE" | "GITHUB" | "FACEBOOK";
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  meta: IMeta;
}

export interface IUserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  role?: "user" | "admin";
  membershipId?: string;      // <-- add this
  membershipExpiry?: number;
  isVerified?: boolean;
  isMembership?: boolean;
  isPartner?: boolean;
}

export const getAllUsers = async (
  filters: IFilters
): Promise<
  // CORRECTED RETURN TYPE: Includes 'meta'
  { data: IUserResponse["data"][]; meta: IMeta } | { error: string }
> => {
  const stringifiedFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    },
    {} as Record<string, string>
  );

  try {
    const queryParams = new URLSearchParams(stringifiedFilters);
    const res = await fetch(`${BASE_URL}/user/all-users?${queryParams}`);
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch users" };
    }

    // FIX: Ensure you return the entire pagination object
    return {
      data: json.data,
      meta: json.meta,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

// GET SINGLE USER BY ID
export const getUserById = async (
  userId: string
): Promise<IUserResponse["data"] | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}`);
    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to fetch user" };

    return json.data;
  } catch (error: any) {
    return { error: error.message };
  }
};

// Service to update a user by ID
export const updateUserById = async (
  userId: string,
  payload: IUserUpdatePayload
): Promise<IUserResponse["data"] | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/user/update-user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Include authorization header if needed
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) return { error: json.message || "Failed to update user" };

    return json.data; // Return updated user data
  } catch (error: any) {
    return { error: error.message };
  }
};
export interface IAdminStats {
  totalCategory: number;
  totalMemberShippedUser: any[];
  totalPartner: number;
  totalUser: number;
}

export interface IAdminStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAdminStats;
}
// GET ADMIN STATS
export const getAdminStats = async (): Promise<
  IAdminStats | { error: string }
> => {
  try {
    const res = await fetch(`${BASE_URL}/user/admin-stat`);
    const json: IAdminStatsResponse = await res.json();

    if (!res.ok) {
      // Use 'json.message' or a default error message
      return { error: json.message || "Failed to fetch admin stats" };
    }

    return json.data;
  } catch (error: any) {
    // Handle network errors or other exceptions
    return { error: error.message || "An unexpected error occurred" };
  }
};
