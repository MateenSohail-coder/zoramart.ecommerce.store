import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: [{ type: "Cart", id: "CURRENT" }],
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart?productId=${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart?clear=true",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} = cartApi;

export const useGetCartsQuery = useGetCartQuery;
export const useAddCartMutation = useAddToCartMutation;
export const useDeleteCartMutation = useRemoveFromCartMutation;
export const useUpdateCartMutation = useUpdateCartItemMutation;
