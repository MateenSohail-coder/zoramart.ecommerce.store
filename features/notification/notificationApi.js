import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core", credentials: "include" }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ userId, role, read } = {}) => {
        const params = new URLSearchParams();
        if (userId) params.set("userId", userId);
        if (role) params.set("role", role);
        if (typeof read === "boolean") params.set("read", String(read));
        const qs = params.toString();
        return qs ? `/notification?${qs}` : "/notification";
      },
      providesTags: (result, error, arg) => [
        {
          type: "Notifications",
          id: arg?.role || arg?.userId ? "FILTERED" : "LIST",
        },
      ],
    }),

    addNotification: builder.mutation({
      query: (notificationData) => ({
        url: "/notification",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notification?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    updateNotification: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: "/notification",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updateData }),
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} = notificationApi;
