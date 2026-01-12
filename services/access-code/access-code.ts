/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchWithAuth } from "../admin.auth/admin.auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface IAccessCode {
    _id: string;
    code: string;
    expiresAt: string;
    maxUses?: number;
    currentUses: number;
    isActive: boolean;
    isUsed: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface IAccessCodeResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IAccessCode;
}

export interface IAccessCodeListResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IAccessCode[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
}

export interface ICreateAccessCode {
    code: string;
    expiresAt: string;
    maxUses?: number;
}

export interface IUpdateAccessCode {
    maxUses?: number;
    isActive?: boolean;
}

// Create access code
export const createAccessCode = async (
    data: ICreateAccessCode
): Promise<IAccessCodeResponse | { error: string }> => {
    try {
        const res = await fetchWithAuth(`/access-code`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.message || "Failed to create access code" };
        }

        return json;
    } catch (error: any) {
        return { error: error.message };
    }
};

// Get all access codes
export const getAccessCodes = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
): Promise<IAccessCodeListResponse | { error: string }> => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            queryParams.append("search", search);
        }

        const res = await fetchWithAuth(`/access-code?${queryParams.toString()}`);
        const json = await res.json();

        if (!res.ok) {
            return { error: json.message || "Failed to fetch access codes" };
        }

        return json;
    } catch (error: any) {
        return { error: error.message };
    }
};

// Get single access code by id
export const getAccessCodeById = async (
    id: string
): Promise<IAccessCode | { error: string }> => {
    try {
        const res = await fetchWithAuth(`/access-code/${id}`);
        const json = await res.json();

        if (!res.ok) {
            return { error: json.message || "Failed to fetch access code" };
        }

        return json.data;
    } catch (error: any) {
        return { error: error.message };
    }
};

// Update access code by id
export const updateAccessCode = async (
    id: string,
    data: IUpdateAccessCode
): Promise<IAccessCodeResponse | { error: string }> => {
    try {
        const res = await fetchWithAuth(`/access-code/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.message || "Failed to update access code" };
        }

        return json;
    } catch (error: any) {
        return { error: error.message };
    }
};

// Delete access code by id
export const deleteAccessCode = async (
    id: string
): Promise<{ success: boolean; message: string } | { error: string }> => {
    try {
        const res = await fetchWithAuth(`/access-code/${id}`, {
            method: "DELETE",
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json?.message || "Failed to delete access code" };
        }

        return {
            success: true,
            message: json?.message || "Access code deleted successfully",
        };
    } catch (error: any) {
        return { error: error.message };
    }
};
