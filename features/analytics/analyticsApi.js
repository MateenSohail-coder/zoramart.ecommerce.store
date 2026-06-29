import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({
      query: ({ days = 30 } = {}) => `/analytics/admin?days=${days}`,
      providesTags: [{ type: "Analytics", id: "ADMIN" }],
    }),

    getSellerAnalytics: builder.query({
      query: ({ days = 30, sellerId } = {}) => {
        const params = new URLSearchParams();
        params.set("days", String(days));
        if (sellerId) params.set("sellerId", sellerId);
        return `/analytics/seller?${params.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "SELLER" }],
    }),
  }),
});

export const { useGetAdminAnalyticsQuery, useGetSellerAnalyticsQuery } =
  analyticsApi;
