"use server";

import { cookies } from "next/headers";

const getAccessTokenFromCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};


export const addFavourite = async (program: string) => {
  const token = await getAccessTokenFromCookies();

  // console.log('accessToken',token.access);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/favourite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ program }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to add favourite");
  }

  return data;
};


export const getFavourites = async () => {
  const token = await getAccessTokenFromCookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/favourite`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // important
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch favourites");
  }

  return data;
};



export const deleteFavourite = async (partner: string) => {
  const token = await getAccessTokenFromCookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/favourite/${partner}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete favourite");
  }

  return data;
};


