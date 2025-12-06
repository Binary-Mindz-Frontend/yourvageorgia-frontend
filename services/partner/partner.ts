/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Partner } from "@/types/partner.types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

// CREATE PARTNER
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

// GET ALL PARTNERS
export const getPartners = async (): Promise<
  { data: IPartnerResponse["data"][] } | { error: string }
> => {
  try {
    const res = await fetch(`${BASE_URL}/partner`);
    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to fetch partners" };
    return { data: json.data };
  } catch (error: any) {
    return { error: error.message };
  }
};

// GET SINGLE PARTNER BY ID
// export const getPartnerById = async (
//   partnerId: string
// ): Promise<IPartnerResponse["data"] | { error: string }> => {
//   try {
//     const res = await fetch(`${BASE_URL}/partner/${partnerId}`);
//     const json = await res.json();
//     if (!res.ok) return { error: json.message || "Failed to fetch partner" };
//     return json.data;
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

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

// DELETE PARTNER
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
