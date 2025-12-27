/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IActivity } from "@/types/activity.types";
import { fetchWithAuth } from "../admin.auth/admin.auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface IActivityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IActivity & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
export interface IActivitiesListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: (IActivity & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  })[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Create new activity (WITH AUTH)
export const createActivity = async (
  data: IActivity
): Promise<IActivityResponse | { error: string }> => {
  try {
    const response = await fetchWithAuth("/activity", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        error:
          json.message ||
          `Failed to create activity with status: ${response.status}`,
      };
    }

    return json;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
};

// Get all activities
export const getActivities = async (
  page: number = 1,
  limit: number = 10
): Promise<IActivitiesListResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/activity?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch activities" };
    }

    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};
// Get all activities 
export const getActivitiesForSelect = async (
  page: number = 1,
  limit: number = 1000
): Promise<IActivitiesListResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/activity?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch activities" };
    }

    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get single activity by id (NO AUTH NEEDED - Public endpoint)
export const getActivityById = async (
  activityId: string
): Promise<IActivityResponse["data"] | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/activity/${activityId}`);
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch activity" };
    }

    return json.data;
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update activity by id (WITH AUTH)
export const updateActivity = async (
  activityId: string,
  data: Partial<IActivity>
): Promise<IActivityResponse | { error: string }> => {
  try {
    const response = await fetchWithAuth(`/activity/${activityId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        error:
          json.message ||
          `Failed to update activity with status: ${response.status}`,
      };
    }

    return json;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
};

// Delete activity by id (WITH AUTH)
export const deleteActivity = async (
  activityId: string
): Promise<{ success: boolean; message: string } | { error: string }> => {
  try {
    const response = await fetchWithAuth(`/activity/${activityId}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        error:
          json?.message ||
          `Failed to delete activity with status: ${response.status}`,
      };
    }

    return {
      success: true,
      message: json?.message || "Activity deleted successfully",
    };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
};