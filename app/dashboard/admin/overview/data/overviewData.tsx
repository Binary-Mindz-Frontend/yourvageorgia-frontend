import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { JSX } from "react";

export type TopCard = {
  id: number;
  title: string;
  value: string;
  icon: JSX.Element;
};
export type PerformanceItem = { label: string; value: number };
export type StatusItem = { label: string; value: string };
export type ActivityItem = {
  id: number;
  text: string;
  time: string;
  icon: JSX.Element;
};
export type ServiceItem = { label: string; value: number };

// ---------- Static Data ----------
export const topCards: TopCard[] = [
  {
    id: 1,
    title: "Today's Revenue",
    value: "$10,000.00",
    icon: <DollarSign size={20} className="text-[#5E257A]" />,
  },
  {
    id: 2,
    title: "Verified Providers",
    value: "20",
    icon: <Users size={20} className="text-blue-500" />,
  },
  {
    id: 3,
    title: "Customer Rating",
    value: "4.5/5",
    icon: <Star size={20} className="text-orange-500" />,
  },
  {
    id: 4,
    title: "Job Completion",
    value: "97.2%",
    icon: <CheckCircle2 size={20} className="text-green-500" />,
  },
];

export const platformPerformance: PerformanceItem[] = [
  { label: "Job Completion Rate", value: 42.3 },
  { label: "Customer Satisfaction", value: 30.8 },
  { label: "Repeat Customers", value: 20.2 },
];

export const systemStatus: StatusItem[] = [
  { label: "Server Uptime", value: "99.98%" },
  { label: "Active Users", value: "11847" },
  { label: "API Response", value: "120ms" },
  { label: "Cache Hit Rate", value: "96.05%" },
];

export const recentActivity: ActivityItem[] = [
  {
    id: 1,
    text: "Mike Chen completed kitchen renovation job",
    time: "2 hours ago",
    icon: <Wrench size={18} className="text-primary" />,
  },
  {
    id: 2,
    text: "23 new user registrations today",
    time: "1 hour ago",
    icon: <Users size={18} className="text-blue-600" />,
  },
  {
    id: 3,
    text: "New high priority dispute opened",
    time: "1 day ago",
    icon: <AlertTriangle size={18} className="text-red-500" />,
  },
];

export const topServices: ServiceItem[] = [
  { label: "Plumbing & Heating", value: 42.3 },
  { label: "Electrical Work", value: 30.8 },
  { label: "Kitchen & Bathroom", value: 20.2 },
  { label: "Roofing & Renovation", value: 15.5 },
];
