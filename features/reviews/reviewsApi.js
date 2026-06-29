import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ productId } = {}) =>
        productId ? `/reviews?productId=${productId}` : "/reviews",
      providesTags: (result, error, arg) => [
        { type: "Reviews", id: arg?.productId || "GLOBAL" },
      ],
    }),

    addReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      }),
      invalidatesTags: ["Reviews"],
    }),

    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: `/reviews?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

    updateReview: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/reviews",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updateData }),
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} = reviewsApi;
