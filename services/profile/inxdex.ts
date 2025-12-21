/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isMembership: boolean;
  isPartner: boolean;
  startDate: number;
  endDate: number;
  memberShipId: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface IProfileResponse {
  success: boolean;
  data: IUserProfile;
  message?: string;
}
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
export const getMyProfile = async (): Promise<IProfileResponse | { error: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/user/my-profile`); // your server API route
    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Failed to fetch profile" };
    }

    return json;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const downloadWallet = async (token: string) => {
  return await fetch(`${BASE_URL}/wallet/membership`, {
      headers: {
          "Authorization": token
      },
  });
}
