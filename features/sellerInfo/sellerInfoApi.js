import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerInfoApi = createApi({
  reducerPath: "sellerInfoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["SellerInfo"],
  endpoints: (builder) => ({
    getSellerInfos: builder.query({
      query: () => "/sellerInfo",
      providesTags: [{ type: "SellerInfo", id: "LIST" }],
    }),

    addSellerInfo: builder.mutation({
      query: (sellerData) => ({
        url: "/sellerInfo",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerData),
      }),
      invalidatesTags: ["SellerInfo"],
    }),

    deleteSellerInfo: builder.mutation({
      query: ({ id }) => ({
        url: `/sellerInfo?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SellerInfo"],
    }),

    updateSellerInfo: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/sellerInfo",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updateData }),
      }),
      invalidatesTags: ["SellerInfo"],
    }),
  }),
});

export const {
  useGetSellerInfosQuery,
  useAddSellerInfoMutation,
  useDeleteSellerInfoMutation,
  useUpdateSellerInfoMutation,
} = sellerInfoApi;
