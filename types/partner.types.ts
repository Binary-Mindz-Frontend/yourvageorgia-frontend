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
export interface PartnerCategory {
  _id: string;
  title: string;
}

export interface Partner {
  _id?: string;
  category: string | PartnerCategory; 
  title?: string;
  name: string;
  thumbnail?: string;
  address?: string;
  position?: number;
  gallery?: string[];
  logo?: string;
  isFeatured?: boolean;
  offer?: PartnerOffer[];  
  about?: PartnerAbout;
  terms?: string[];
  contacts?: PartnerContact[];
  socials?: PartnerSocials;
}


