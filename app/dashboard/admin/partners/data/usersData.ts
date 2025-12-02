import user1 from "@/public/assets/dashboard/partners/icon1.png"
import user2 from "@/public/assets/dashboard/partners/icon2.png"
import user3 from "@/public/assets/dashboard/partners/icon3.png"
import user4 from "@/public/assets/dashboard/partners/icon4.png"


export interface IPartnerData {
  id: number;
  userName: string;
  email: string;
  image?:string;
  role: "Client" | "Provider";
  status: "Active" | "Suspended" | "Pending";
  location: string;
  compliance: {
    idVerification: boolean;
    addressVerification: boolean;
    bankVerification: boolean;
    portfolioCheck: boolean;
  };
  performance: {
    earned: string;
    jobsPosted?: number;
    rating?: number;
    pending?: string;
  };
  joined: string;
}


export const PartnerData: IPartnerData[] = [
  {
    id: 1,
    userName: 'Kristin Watson',
    image:user1.src,
    email: 'sara.cruz@example.com',
    role: 'Provider',
    status: 'Active',
    location: 'Bratislava, Slovakia',
    compliance: {
    idVerification: true,
    addressVerification: true,
    bankVerification: false,
    portfolioCheck: true,
  },
    performance: { earned: '$451,680.00', jobsPosted: 12, rating:4.8, pending:'$680.00' },
    joined: '2024-03-15',
  },
  {
    id: 2,
    userName: 'Bessie Cooper',
    image:user2.src,
    email: 'bill.sanders@example.com',
    role: 'Provider',
    status: 'Suspended',
    location: 'Košice, Slovakia',
    compliance: {
    idVerification: true,
    addressVerification: true,
    bankVerification: false,
    portfolioCheck: true,
  },
    performance: { earned: '$451,680.00', jobsPosted: 12, rating:4.8, pending:'$680.00' },
    joined: '2024-03-15',
  },
  {
    id: 3,
    userName: 'Leslie Alexander',
    image:user3.src,
    email: 'alma.lawson@example.com',
    role: 'Provider',
    status: 'Pending',
    location: 'Žilina, Slovakia',
    compliance: {
    idVerification: true,
    addressVerification: true,
    bankVerification: false,
    portfolioCheck: true,
  },
    performance: { earned: '$451,680.00', jobsPosted: 12, rating:4.8, pending:'$680.00' },
    joined: '2024-03-15',
  },
  {
    id: 4,
    userName: 'Annette Black',
    image:user4.src,
    email: 'willie.jennings@example.com',
    role: 'Provider',
    status: 'Active',
    location: 'Trnava, Slovakia',
    compliance: {
    idVerification: true,
    addressVerification: true,
    bankVerification: false,
    portfolioCheck: true,
  },
    performance: { earned: '$451,680.00', jobsPosted: 12, rating:4.8, pending:'$680.00' },
    joined: '2024-03-15',
  },

];