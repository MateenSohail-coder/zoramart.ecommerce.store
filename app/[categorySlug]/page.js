"use client";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function categoriesslug() {
  const params = useParams();
  const searchParams = useSearchParams();
  const Slug = params.categorySlug;
  const id = searchParams.get("id");

  const { data: categories, isLoading } = useGetCategoriesQuery(id);
  const { data: products, isLoading: productloader } = useGetProductsQuery(
    "6a1463d2b16f53bdefe0383f",
  );
  useEffect(() => {
    if (Slug) {
      console.log(Slug);
    }
    if (id) {
      console.log(id);
    }
  }, [Slug]);

  return (
    <div>
      {isLoading ? (
        <div className="">loading....</div>
      ) : (
        categories.map((item, index) => (
          <div key={index} className="">
            {item.name}
          </div>
        ))
      )}
      {productloader ? (
        <div className="">loading2..</div>
      ) : (
        products.map((item, index) => (
          <div key={index} className=" ">
            {item.name}
            {item.category.level}
          </div>
        ))
      )}
      <div onClick={() => console.log(products)} className="">
        pro
      </div>
    </div>
  );
}
