// store/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ categoryId, page = 1, limit = 10 }) =>
        categoryId
          ? `/products?categoryid=${categoryId}&page=${page}&limit=${limit}`
          : `/products?page=${page}&limit=${limit}`,

      // ✅ Tag includes page so each page has its own cache entry.
      // When you invalidate "Products" by categoryId (or GLOBAL), ALL pages are
      // cleared together — which is what you want on a product create/update/delete.
      providesTags: (result, error, arg) => [
        {
          type: "Products",
          id: `${arg.categoryId || "GLOBAL"}-page-${arg.page}`,
        },
        // Also tag the "list" so you can invalidate all pages at once
        {
          type: "Products",
          id: arg.categoryId || "GLOBAL",
        },
      ],

      // ✅ Keep previous page data in the cache while next page fetches.
      // This is what enables smooth "append" UX without blanking the grid.
      keepUnusedDataFor: 300, // 5 minutes — tune to your needs
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
  useAddProductMutation,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
} = productApi;
