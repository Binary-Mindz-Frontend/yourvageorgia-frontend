// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { Partner } from "@/types/partner.types";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

// // --- New Interface for Query Parameters ---
// export interface IGetPartnersParams {
//   limit?: number;
//   page?: number;
//   search?: string;
//   address?: string;
//   category?: string; // Should be category ID
//   activity?: string; // Should be activity name or ID
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
// }

// export interface IPartnerResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: Partner & {
//     _id: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//   };
// }

// export interface IGetPartnerFilters {
//   page?: number;
//   limit?: number;
//   search?: string;
//   address?: string;
//   category?: string;  
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   activity?: string | string[];
//   area?: string | string[];
// }

// export interface IPositionUpdateData {
//   position: number; // Assuming 'position' is a number
// }

// export interface IGetAllPartnersResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: IPartnerResponse["data"][];
//   meta: {
//     total: number;
//     limit: number;
//     totalPages: number;
//     page: number;
//     pagingCounter: number;
//     hasPrevPage: boolean;
//     hasNextPage: boolean;
//     prevPage: number | null;
//     nextPage: number | null;
//   };
// }

// export interface IAreaResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: string[];
// }

// export const getPartners = async (
//   params: IGetPartnersParams = {}
// ): Promise<
//   { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
// > => {
//   try {
//     const queryParams = new URLSearchParams();

//     // Force sorting by position ASC
//     queryParams.set("sortBy", "position");
//     queryParams.set("sortOrder", "asc");

//     (Object.keys(params) as Array<keyof IGetPartnersParams>).forEach((key) => {
//       // Prevent override
//       if (key === "sortBy" || key === "sortOrder") return;

//       const value = params[key];
//       if (value !== undefined && value !== null && value !== "") {
//         queryParams.append(key, String(value));
//       }
//     });

//     const url = `${BASE_URL}/partner?${queryParams.toString()}`;
//     const res = await fetch(url, {
//       next: { revalidate: 3600 }, // Cache for 1 hour
//     });
//     const json = await res.json();

//     if (!res.ok) {
//       return { error: json.message || "Failed to fetch partners" };
//     }

//     return {
//       data: json.data,
//       meta: json.meta,
//     };
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

// export const getPartnerFiltered = async (
//   filters: IGetPartnerFilters = {}
// ): Promise<
//   { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
// > => {
//   try {
//     const queryParams = new URLSearchParams();
//     queryParams.set("sortBy", "position");
//     queryParams.set("sortOrder", "asc");

//     (Object.keys(filters) as Array<keyof IGetPartnerFilters>).forEach((key) => {

//       if (key === "sortBy" || key === "sortOrder") return;
//       const value = filters[key];

//       if (value === undefined || value === null || value === "") return;

//       // UPDATED: Check for ANY array value, not just activity
//       if (Array.isArray(value)) {
//         value.forEach((val) => queryParams.append(key, val));
//       } else {
//         queryParams.append(key, String(value));
//       }
//     });

//     const url = `${BASE_URL}/partner?${queryParams.toString()}`;

//     const res = await fetch(url, { cache: "no-store" });
//     const json = await res.json();

//     if (!res.ok) return { error: json.message || "Failed to fetch" };

//     return { data: json.data, meta: json.meta };
//   } catch (error: any) {
//     return { error: error.message || "An unexpected error occurred" };
//   }
// };

// export const getAllAreas = async (): Promise<string[] | { error: string }> => {
//   try {
//     const url = `${BASE_URL}/partner/area`;

//     const res = await fetch(url, {
//       next: { revalidate: 3600 }, 
//     });

//     const json: IAreaResponse = await res.json();

//     if (!res.ok) {
//       return { error: json.message || "Failed to fetch areas" };
//     }

//     return json.data;
//   } catch (error: any) {
//     return { error: error.message || "An unexpected error occurred" };
//   }
// };



/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Partner } from "@/types/partner.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface IGetPartnersParams {
  limit?: number;
  page?: number;
  search?: string;
  address?: string;
  category?: string;
  activity?: string;
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

export interface IGetPartnerFilters {
  page?: number;
  limit?: number;
  search?: string;
  address?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  activity?: string | string[];
  area?: string | string[];
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

export interface IAreaResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string[];
}

export const getPartners = async (
  params: IGetPartnersParams = {}
): Promise<
  { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set("sortBy", "position");
    queryParams.set("sortOrder", "asc");

    (Object.keys(params) as Array<keyof IGetPartnersParams>).forEach((key) => {
      if (key === "sortBy" || key === "sortOrder") return;
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}/partner?${queryParams.toString()}`;
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ['partners']
      },
    });
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

export const getPartnerFiltered = async (
  filters: IGetPartnerFilters = {}
): Promise<
  { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set("sortBy", "position");
    queryParams.set("sortOrder", "asc");

    (Object.keys(filters) as Array<keyof IGetPartnerFilters>).forEach((key) => {
      if (key === "sortBy" || key === "sortOrder") return;
      const value = filters[key];

      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        value.forEach((val) => queryParams.append(key, val));
      } else {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}/partner?${queryParams.toString()}`;

    const res = await fetch(url, {
      next: {
        revalidate: 180,
        tags: ['partners-filtered']
      }
    });
    const json = await res.json();

    if (!res.ok) return { error: json.message || "Failed to fetch" };

    return { data: json.data, meta: json.meta };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};

export const getAllAreas = async (): Promise<string[] | { error: string }> => {
  try {
    const url = `${BASE_URL}/partner/area`;

    const res = await fetch(url, {
      next: {
        revalidate: 3600,
        tags: ['areas']
      },
    });

    const json: IAreaResponse = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch areas" };
    }

    return json.data;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};