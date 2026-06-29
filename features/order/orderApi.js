import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ buyerId, status, page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams();
        if (buyerId) params.set("buyerId", buyerId);
        if (status) params.set("status", status);
        params.set("page", String(page));
        params.set("limit", String(limit));
        const qs = params.toString();
        return `/order?${qs}`;
      },
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),

    addOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    checkout: builder.mutation({
      query: (checkoutData) => ({
        url: "/order",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkout: true, ...checkoutData }),
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    deleteOrder: builder.mutation({
      query: (arg) => {
        const id = typeof arg === "string" ? arg : arg?.id;
        return {
          url: `/order?id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/order",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updateData }),
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useCheckoutMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = orderApi;
