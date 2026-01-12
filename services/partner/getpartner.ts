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
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch partners" };
    }

    return {
      data: json.data,
      meta: json.meta,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message };
  }
};