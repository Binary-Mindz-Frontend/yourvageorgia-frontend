/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Partner } from "@/types/partner.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

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
  params: IGetPartnersParams = {}
): Promise<
  { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
> => {
  try {
    const queryParams = new URLSearchParams();

    // Force sorting by position ASC
    queryParams.set("sortBy", "position");
    queryParams.set("sortOrder", "asc");

    (Object.keys(params) as Array<keyof IGetPartnersParams>).forEach((key) => {
      // Prevent override
      if (key === "sortBy" || key === "sortOrder") return;

      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}/partner?${queryParams.toString()}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch partners" };
    }

    return {
      data: json.data,
      meta: json.meta,
    };
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