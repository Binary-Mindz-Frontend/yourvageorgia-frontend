/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ICategory } from "@/types/category.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;


export interface ICategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory & { _id: string; createdAt: string; updatedAt: string; __v: number };
}

export const createCategory = async (data: ICategory): Promise<ICategoryResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to create category" };
    }

    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};

// get all categories
export const getCategories = async (): Promise<{ data: ICategoryResponse["data"][] } | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/category`);
    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to fetch categories" };
    return { data: json.data };
  } catch (error: any) {
    return { error: error.message };
  }
};

// delete category by id
export const deleteCategory = async (
  categoryId: string
): Promise<{ success: boolean; message: string } | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/category/${categoryId}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json?.message || "Failed to delete category" };
    }

    return {
      success: true,
      message: json?.message || "Category deleted successfully",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

// get single category by id
export const getCategoryById = async (
  categoryId: string
): Promise<ICategoryResponse["data"] | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/category/${categoryId}`);
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch category" };
    }

    return json.data; 
  } catch (error: any) {
    return { error: error.message };
  }
};

