import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (args) => {
        if (!args) return "/categories";
        if (typeof args === "string") return `/categories?id=${args}`;
        const params = new URLSearchParams();
        Object.entries(args).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") params.set(k, v);
        });
        const qs = params.toString();
        return `/categories${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    getCategoryBySlug: builder.query({
      query: (slug) => `/categories?slug=${encodeURIComponent(slug)}`,
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/categories",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),

    deleteCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/categories?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),

    updateCategories: builder.mutation({
      query: ({ id, name, parentCategory }) => ({
        url: "/categories",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, parentCategory }),
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useAddProductMutation,
  useDeleteCategoriesMutation,
  useUpdateCategoriesMutation,
} = categoryApi;
