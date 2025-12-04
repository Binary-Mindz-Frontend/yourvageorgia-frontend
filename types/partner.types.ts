// src/types/partner.types.ts

export interface PartnerOffer {
  title: string;
  description: string;
  validUntil: string; // YYYY-MM-DD
  offerPercentage?: number;
}

export interface PartnerAbout {
  title: string;
  description: string;
}

export interface PartnerContact {
  officeName?: string;
  phone?: string;
  addressUrl?: string;
  address?: string;
  email?: string;
  mobile?: string;
}

export interface PartnerSocials {
  website?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface Partner {
  category: string; // category ID
  name: string;
  thumbnail?: string;
  address?: string;
  gallery?: string[];
  logo?: string;
  isFeatured?: boolean;
  offer?: PartnerOffer;
  about?: PartnerAbout;
  terms?: string[];
  contacts?: PartnerContact[];
  socials?: PartnerSocials;
}
