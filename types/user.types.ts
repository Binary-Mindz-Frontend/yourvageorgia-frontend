export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  phone: string | null;
  username: string;
  name: string;
  avatarUrl: string;
  role: 'USER' | 'ADMIN';
  signUpMethod: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'FACEBOOK';
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
}

// export enum AuthProvider {
//   GOOGLE = 'GOOGLE',
//   FACEBOOK = 'FACEBOOK',
//   TWITTER = 'TWITTER',
//   INSTAGRAM = 'INSTAGRAM',
//   LINKEDIN = 'LINKEDIN',
//   GITHUB = 'GITHUB',
//   APPLE = 'APPLE',
//   TIKTOK = 'TIKTOK',
// }
