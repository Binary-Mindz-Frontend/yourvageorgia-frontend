import icon1 from "@/public/assets/dashboard/categories/icon1.png";
import icon2 from "@/public/assets/dashboard/categories/icon2.png";
import icon4 from "@/public/assets/dashboard/categories/icon4.png";

export type TCategory = {
    _id: string;
    title: string;
    image: string;
    description: string;
};

export const categoryData: TCategory[] = [
    {
        _id: "1",
        title: "Landscaping",
        image: icon1.src,
        description: "All landscaping services including garden design and maintenance.",
    },
    {
        _id: "2",
        title: "Lawn Care",
        image: icon2.src,
        description: "Professional lawn mowing, trimming, and fertilization services.",
    },
    {
        _id: "3",
        title: "Tree Services",
        image: icon4.src,
        description: "Tree trimming, pruning, and removal services for residential and commercial properties.",
    },
    {
        _id: "4",
        title: "Cleaning",
        image: icon4.src,
        description: "House and office cleaning services to keep your spaces spotless.",
    },
    {
        _id: "5",
        title: "House Cleaning",
        image: icon1.src,
        description: "Comprehensive cleaning solutions for homes of all sizes.",
    },
    {
        _id: "6",
        title: "Commercial Cleaning",
        image: icon2.src,
        description: "Reliable cleaning services for offices and commercial spaces.",
    },
];
