import icon1 from "@/public/assets/dashboard/categories/icon1.png";
import icon2 from "@/public/assets/dashboard/categories/icon2.png";
import icon3 from "@/public/assets/dashboard/categories/icon3.png";
import icon4 from "@/public/assets/dashboard/categories/icon4.png";

export type TCategory = {
    name: string;
    slug: string;
    jobs: string;
    featured: boolean;
    type: "Parent" | "Sub";
    status: "Active" | "Inactive";
    image: string;
};

export const categoryData: TCategory[] = [
    {
        name: "Landscaping",
        slug: "landscaping",
        jobs: "350 Jobs",
        featured: true,
        type: "Parent",
        status: "Active",
        image: icon1.src,
    },
    {
        name: "Lawn Care",
        slug: "lawn-care",
        jobs: "180 Jobs",
        featured: false,
        type: "Sub",
        status: "Active",
        image: icon2.src,
    },
    {
        name: "Tree Services",
        slug: "tree-services",
        jobs: "170 Jobs",
        featured: false,
        type: "Parent",
        status: "Active",
        image: icon3.src,
    },
    {
        name: "Cleaning",
        slug: "cleaning",
        jobs: "290 Jobs",
        featured: true,
        type: "Sub",
        status: "Active",
        image: icon4.src,
    },
    {
        name: "House Cleaning",
        slug: "house-cleaning",
        jobs: "150 Jobs",
        featured: false,
        type: "Parent",
        status: "Active",
        image: icon1.src,
    },
    {
        name: "Commercial Cleaning",
        slug: "commercial-cleaning",
        jobs: "140 Jobs",
        featured: false,
        type: "Sub",
        status: "Active",
        image: icon2.src,
    },
];
