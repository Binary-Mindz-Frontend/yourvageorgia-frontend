"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategoryById } from "@/services/category/category";
import { ICategory } from "@/types/category.types";
import { toast } from "sonner";

interface CategoryViewProps {
  categoryId: string;
}

const CategoryView: React.FC<CategoryViewProps> = ({ categoryId }) => {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      const res = await getCategoryById(categoryId);
      if ("error" in res) {
        toast.error(res.error, { style: { background: "#000", color: "#fff" } });
      } else {
        setCategory(res);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!category) return <p className="text-white">No category found.</p>;

  return (
    <div className="p-4 bg-gray-900 text-white rounded flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold">{category.title}</h2>
      <p>{category.description || "-"}</p>
      {category.image && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover bg-gray-900 rounded"
            unoptimized
          />
        </div>
      )}
     <div className="text-sm text-gray-400">
  Created At: {category.createdAt
    ? new Date(category.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : "-"}
</div>

    </div>
  );
};

export default CategoryView;
