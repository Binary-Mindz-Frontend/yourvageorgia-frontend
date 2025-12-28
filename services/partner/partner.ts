// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { Partner } from "@/types/partner.types";
// // import { CloudCog } from "lucide-react";

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

// export interface IPositionUpdateData {
//     position: number; // Assuming 'position' is a number
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

// // CREATE PARTNER (No change)
// export const createPartner = async (
//   data: Partner
// ): Promise<IPartnerResponse | { error: string }> => {
//   try {
//     const res = await fetch(`${BASE_URL}/partner`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       return { error: json.message || "Failed to create partner" };
//     }

//     return json;
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

// // GET ALL PARTNERS (Updated to include query parameters)
// export const getPartners = async (
//   params: IGetPartnersParams = {}
// ): Promise<
//   { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
// > => {
//   try {
//     const queryParams = new URLSearchParams();

//     // Force sorting by position ASC
//    console.log({params})
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
//     console.log("Fetching partners with URL:", url);
//     const res = await fetch(url);
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



// // GET SINGLE PARTNER BY ID  
// export const getPartnerById = async (
//   partnerId: string
// ): Promise<IPartnerResponse["data"] | { error: string }> => {
//   try {
//     const res = await fetch(`${BASE_URL}/partner/${partnerId}`);
//     const json = await res.json();
//     if (!res.ok) return { error: json.message || "Failed to fetch partner" };

//     // Convert isFeatured from string to boolean
//     const data = {
//       ...json.data,
//       isFeatured: json.data.isFeatured === "true" || json.data.isFeatured === true
//     };

//     return data;
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

// // UPDATE PARTNER 
// export const updatePartner = async (
//   partnerId: string,
//   data: Partial<Partner>
// ): Promise<IPartnerResponse | { error: string }> => {
//   try {
//     const res = await fetch(`${BASE_URL}/partner/${partnerId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const json = await res.json();
//     if (!res.ok) return { error: json.message || "Failed to update partner" };
//     return json;
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

// // DELETE PARTNER (No change)
// export const deletePartner = async (
//   partnerId: string
// ): Promise<{ success: boolean; message: string } | { error: string }> => {
//   try {
//     const res = await fetch(`${BASE_URL}/partner/${partnerId}`, {
//       method: "DELETE",
//     });

//     const json = await res.json();
//     if (!res.ok) return { error: json?.message || "Failed to delete partner" };

//     return {
//       success: true,
//       message: json?.message || "Partner deleted successfully",
//     };
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

// export const updatePartnerPosition = async (
//     partnerId: string,
//     data: IPositionUpdateData
// ): Promise<IPartnerResponse | { error: string }> => {
//     try {
//         const res = await fetch(`${BASE_URL}/partner/change-position/${partnerId}`, {
//             method: "PATCH", // Use PATCH method
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         });

//         const json = await res.json();

//         // Handle non-2xx response
//         if (!res.ok) {
//             return { error: json.message || "Failed to update partner position" };
//         }

//         // Return success response
//         return json;
//     } catch (error: any) {
//         // Handle network or other unexpected errors
//         return { error: error.message || "An unexpected error occurred during position update" };
//     }
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { Partner } from "@/types/partner.types";
import { fetchWithAuth } from "../admin.auth/admin.auth";
// import { CloudCog } from "lucide-react";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;


// --- New Interface for Query Parameters ---
export interface IGetPartnersParams {
  limit?: number;
  page?: number;
  search?: string;
  addressUrl?: string;
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
    // console.log({ params })
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
    // console.log("Fetching partners with URL:", url);
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


export const updatePartner = async (
  partnerId: string,
  data: Partial<Partner>
): Promise<IPartnerResponse | { error: string }> => {
  try {
    const response = await fetchWithAuth(`/partner/${partnerId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });


    const json = await response.json();
    if (!response.ok)
      return {
        error:
          json.message ||
          `Failed to update partner with status: ${response.status}`,
      };
    return json;
  } catch (error: any) {
    // This returns the error message thrown by fetchWithAuth
    return { error: error.message || "An unexpected error occurred." };
  }
};
// DELETE PARTNER (CORRECTED IMPLEMENTATION)
export const deletePartner = async (
  partnerId: string
): Promise<{ success: boolean; message: string } | { error: string }> => {
  try {
    // 💡 Use fetchWithAuth for an authenticated request
    const response = await fetchWithAuth(`/partner/${partnerId}`, {
      method: "DELETE",
      // The Authorization header is automatically added by fetchWithAuth
    });

    const json = await response.json();

    // Check for non-2xx status code
    if (!response.ok) {
      return {
        error:
          json?.message ||
          `Failed to delete partner with status: ${response.status}`,
      };
    }

    return {
      success: true,
      message: json?.message || "Partner deleted successfully",
    };
  } catch (error: any) {
    // Catch errors thrown by fetchWithAuth (e.g., token missing)
    return { error: error.message || "An unexpected error occurred." };
  }
};


// UPDATE PARTNER POSITION
export const updatePartnerPosition = async (
  partnerId: string,
  data: IPositionUpdateData
): Promise<IPartnerResponse | { error: string }> => {
  try {
    // 💡 Use fetchWithAuth for an authenticated request
    const response = await fetchWithAuth(
      `/partner/change-position/${partnerId}`, // The specific endpoint
      {
        method: "PATCH",
        // The Authorization header is automatically added by fetchWithAuth
        body: JSON.stringify(data),
      }
    );


    const json = await response.json();


    // Handle non-2xx response
    if (!response.ok) {
      return {
        error:
          json.message ||
          `Failed to update partner position with status: ${response.status}`,
      };
    }


    // Return success response
    return json;
  } catch (error: any) {
    // Catch errors thrown by fetchWithAuth (e.g., token missing, 401/403)
    return { error: error.message || "An unexpected error occurred during position update" };
  }
};


// GET FILTERED PARTNERS - Separate function for filtering in NetworkFilter
export const getPartnersFilter = async (
  params: IGetPartnersParams = {}
): Promise<
  { data: IGetAllPartnersResponse["data"]; meta: IGetAllPartnersResponse["meta"] } | { error: string }
> => {
  try {
    const queryParams = new URLSearchParams();

    // Force sorting by position ASC
    queryParams.set("sortBy", "position");
    queryParams.set("sortOrder", "asc");

    // Add all filter parameters
    (Object.keys(params) as Array<keyof IGetPartnersParams>).forEach((key) => {
      // Prevent override of sortBy and sortOrder
      if (key === "sortBy" || key === "sortOrder") return;

      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}/partner?${queryParams.toString()}`;
    // console.log("Fetching filtered partners with URL:", url);
    
    const res = await fetch(url, {
      cache: "no-store", // Ensure fresh data for filters
    });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch filtered partners" };
    }

    return {
      data: json.data,
      meta: json.meta,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};