// src/types/partner.types.ts

export interface PartnerOffer {
  title: string;
  description: string;
  validUntil: string; // YYYY-MM-DD
  offerPercentage?: number;
}


export interface PartnerContact {
  officeName?: string;
  phone?: string;
  addressUrl?: string;
  address?: string;
  area?: string;
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
  category?: string | { _id: string; title: string };  // Old single category
  categories?: Array<string | { _id: string; title: string }>; 
  title?: string;
  name: string;
  thumbnail?: string;
  address?: string;
  activity?: string[];
  position?: number;
  gallery?: string[];
  logo?: string;
  isFeatured?: boolean;
  isFeaturedMap?: boolean;
  offer?: PartnerOffer[];  
  about?: string;
  terms?: string[];
  contacts?: PartnerContact[];
  socials?: PartnerSocials;
}


