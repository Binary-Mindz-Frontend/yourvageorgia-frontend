/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    console.error(err);
    return true;
  }
};

export const getValidToken = async (): Promise<string> => {
  const cookieStore = await cookies();

  const token = cookieStore.get('accessToken')!.value;

  return token;
};
