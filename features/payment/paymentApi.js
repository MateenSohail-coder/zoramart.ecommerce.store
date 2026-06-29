import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "/payment",
      providesTags: [{ type: "Payments", id: "LIST" }],
    }),

    addPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      }),
      invalidatesTags: ["Payments"],
    }),

    deletePayment: builder.mutation({
      query: ({ id }) => ({
        url: `/payment?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),

    updatePayment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/payment",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updateData }),
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useAddPaymentMutation,
  useDeletePaymentMutation,
  useUpdatePaymentMutation,
} = paymentApi;
