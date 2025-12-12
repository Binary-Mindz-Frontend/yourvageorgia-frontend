"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
        username: string; // I'm keeping 'username' but using 'firstName' and 'lastName' below
        name: string;
        firstName: string; // Used in your columns
        lastName: string; // <-- New field
        dateOfBirth: string; // <-- New field (assuming string, adjust if date)
        isDeleted: boolean; // <-- New field
        isVerified: boolean; // <-- New field
        isPartner: boolean; // <-- New field
        isMembership: boolean;
        isBlocked: boolean;
        isResettingPassword: boolean; // <-- New field
        avatarUrl: string;
        role: 'user' | 'admin'; // <-- Changed to lowercase
        signUpMethod: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'FACEBOOK';
        createdAt: string;
        updatedAt: string;
        __v: number; // <-- New field
    };
    meta: IMeta; // <-- Now correctly typed
}



export const getAllUsers = async (filters: IFilters): Promise<
    // CORRECTED RETURN TYPE: Includes 'meta'
    { data: IUserResponse["data"][]; meta: IMeta } | { error: string }
> => {
    const stringifiedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
    }, {} as Record<string, string>);

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
            meta: json.meta
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

// VIEW SINGLE USER DETAILS (if needed for a separate view page)
export const viewUser = async (
    userId: string
): Promise<IUserResponse["data"] | { error: string }> => {
    try {
        const res = await fetch(`${BASE_URL}/user/${userId}`);
        const json = await res.json();
        if (!res.ok) return { error: json.message || "Failed to fetch user details" };

        return json.data;
    } catch (error: any) {
        return { error: error.message };
    }
};