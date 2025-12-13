/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Partner } from "@/types/partner.types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- New Interface for Query Parameters ---
export interface IGetPartnersParams {
  limit?: number;
  page?: number;
  search?: string;
  address?: string;
  category?: string; // Should be category ID
  activity?: string; // Should be activity name or ID
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPartnerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Partner & { 
    _id: string; 
    createdAt: string; 
    updatedAt: string; 
    __v: number;
  };
}

export interface IPositionUpdateData {
    position: number; // Assuming 'position' is a number
}

export interface IGetAllPartnersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPartnerResponse["data"][];
  meta: {
    total: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

// CREATE PARTNER (No change)
export const createPartner = async (
  data: Partner
): Promise<IPartnerResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/partner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to create partner" };
    }

    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};

// GET ALL PARTNERS (Updated to include query parameters)
export const getPartners = async (
  params: IGetPartnersParams = {} // Use an optional parameter object with a default empty value
): Promise<
  { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
> => {
  try {
    // 1. Construct URLSearchParams from the parameters object
    const queryParams = new URLSearchParams();
    
    // Iterate over keys in params and append non-null/non-undefined values
    (Object.keys(params) as Array<keyof IGetPartnersParams>).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
            // Ensure numbers are converted to string for URLSearchParams
            queryParams.append(key, String(value));
        }
    });

    // 2. Construct the full URL with query parameters
    const queryString = queryParams.toString();
    const url = `${BASE_URL}/partner${queryString ? '?' + queryString : ''}`;

    // 3. Fetch data
    const res = await fetch(url);
    const json: IGetAllPartnersResponse | { message: string } = await res.json();

    if (!res.ok) {
      // Type assertion for error handling based on API response structure
      const errorJson = json as { message: string }; 
      return { error: errorJson.message || "Failed to fetch partners" };
    }
    
    // Type assertion for success response
    const successJson = json as IGetAllPartnersResponse;

    // The API response for 'get all' often includes 'meta' data for pagination.
    return { data: successJson.data, meta: successJson.meta };
  } catch (error: any) {
    return { error: error.message };
  }
};


// GET SINGLE PARTNER BY ID  
export const getPartnerById = async (
  partnerId: string
): Promise<IPartnerResponse["data"] | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/partner/${partnerId}`);
    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to fetch partner" };
    
    // Convert isFeatured from string to boolean
    const data = {
      ...json.data,
      isFeatured: json.data.isFeatured === "true" || json.data.isFeatured === true
    };
    
    return data;
  } catch (error: any) {
    return { error: error.message };
  }
};

// UPDATE PARTNER 
export const updatePartner = async (
  partnerId: string,
  data: Partial<Partner>
): Promise<IPartnerResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/partner/${partnerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to update partner" };
    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};

// DELETE PARTNER (No change)
export const deletePartner = async (
  partnerId: string
): Promise<{ success: boolean; message: string } | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/partner/${partnerId}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok) return { error: json?.message || "Failed to delete partner" };

    return {
      success: true,
      message: json?.message || "Partner deleted successfully",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updatePartnerPosition = async (
    partnerId: string,
    data: IPositionUpdateData
): Promise<IPartnerResponse | { error: string }> => {
    try {
        const res = await fetch(`${BASE_URL}/partner/change-position/${partnerId}`, {
            method: "PATCH", // Use PATCH method
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();
        
        // Handle non-2xx response
        if (!res.ok) {
            return { error: json.message || "Failed to update partner position" };
        }

        // Return success response
        return json;
    } catch (error: any) {
        // Handle network or other unexpected errors
        return { error: error.message || "An unexpected error occurred during position update" };
    }
};