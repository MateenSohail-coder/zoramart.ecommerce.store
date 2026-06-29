// store/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        categoryId,
        sellerId,
        page = 1,
        limit = 10,
        sort,
        order,
        minPrice,
        maxPrice,
        inStock,
        search,
      }) => {
        const params = new URLSearchParams();
        if (categoryId) params.set("categoryid", categoryId);
        if (sellerId) params.set("sellerId", sellerId);
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (sort) params.set("sort", sort);
        if (order) params.set("order", order);
        if (minPrice !== undefined) params.set("minPrice", String(minPrice));
        if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
        if (inStock !== undefined) params.set("inStock", String(inStock));
        if (search) params.set("search", search);
        return `/products?${params.toString()}`;
      },

      // ✅ Tag includes page so each page has its own cache entry.
      // When you invalidate "Products" by categoryId (or GLOBAL), ALL pages are
      // cleared together — which is what you want on a product create/update/delete.
      providesTags: (result, error, arg) => [
        {
          type: "Products",
          id: `${arg?.categoryId || "GLOBAL"}-page-${arg?.page || 1}-sort-${arg?.sort || "createdAt"}-order-${arg?.order || "desc"}-min-${arg?.minPrice ?? ""}-max-${arg?.maxPrice ?? ""}-stock-${arg?.inStock ?? ""}-q-${arg?.search || ""}`,
        },
        {
          type: "Products",
          id: arg?.categoryId || "GLOBAL",
        },
      ],

      // ✅ Keep previous page data in the cache while next page fetches.
      // This is what enables smooth "append" UX without blanking the grid.
      keepUnusedDataFor: 300,
    }),

    getProduct: builder.query({
      query: ({ id, slug } = {}) => {
        const params = new URLSearchParams();
        if (id) params.set("id", id);
        if (slug) params.set("slug", slug);
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result?._id ? [{ type: "Products", id: result._id }] : [],
    }),

    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }),
      async onQueryStarted(productData, { dispatch, queryFulfilled }) {
        const currentTempId = `temp_${Date.now()}`;
        const patchResult = dispatch(
          productApi.util.updateQueryData(
            "getProducts",
            productData.category || undefined,
            (draft) => {
              draft.push({ _id: currentTempId, ...productData });
            },
          ),
        );
        try {
          const { data: newProduct } = await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData(
              "getProducts",
              productData.category || undefined,
              (draft) => {
                const index = draft.findIndex((t) => t._id === currentTempId);
                if (index !== -1) draft[index] = newProduct;
              },
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteProducts: builder.mutation({
      query: (id) => ({
        url: `/products?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    updateProducts: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/products",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updateData }),
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
} = productApi;
