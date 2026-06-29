"use client";

import * as React from "react";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import SimpleTable from "../../_components/SimpleTable";

export default function AdminCategoriesPage() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const categories = data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Categories</h2>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load categories.</div>
      ) : (
        <SimpleTable
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
          ]}
          rows={categories.map((c) => ({
            name: c.name,
            slug: c.slug,
          }))}
          emptyText="No categories found."
        />
      )}
    </div>
  );
}
