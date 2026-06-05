import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/core" }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (id) => (id ? `/categories?id=${id}` : "/categories"),
      providesTags: (result, error, id) => [
        { type: "Categories", id: id || "LIST" },
      ],
    }),

    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/categories",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }),
      async onQueryStarted(productData, { dispatch, queryFulfilled }) {
        const currentTempId = `temp_${Date.now()}`;
        const patchResult = dispatch(
          categoryApi.util.updateQueryData(
            "getCategories",
            productData.parentCategory || undefined,
            (draft) => {
              draft.push({ _id: currentTempId, ...productData });
            },
          ),
        );
        try {
          const { data: newProduct } = await queryFulfilled;
          dispatch(
            categoryApi.util.updateQueryData(
              "getCategories",
              productData.parentCategory || undefined,
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

    deleteCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/categories?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategories: builder.mutation({
      query: ({ id, name, parentCategory }) => ({
        url: "/categories",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, parentCategory }),
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddProductMutation,
  useDeleteCategoriesMutation,
  useUpdateCategoriesMutation,
} = categoryApi;
