import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: null,
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "desc",
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined, // true/false
  search: "",
};

const productSlice = createSlice({
  name: "productUI",
  initialState,
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
      state.page = 1;
    },

    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setOrder(state, action) {
      state.order = action.payload;
      state.page = 1;
    },

    setMinPrice(state, action) {
      state.minPrice = action.payload;
      state.page = 1;
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload;
      state.page = 1;
    },
    setInStock(state, action) {
      state.inStock = action.payload;
      state.page = 1;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },

    setFilters(state, action) {
      const {
        categoryId,
        page,
        limit,
        sort,
        order,
        minPrice,
        maxPrice,
        inStock,
        search,
      } = action.payload || {};

      if (categoryId !== undefined) state.categoryId = categoryId;
      if (page !== undefined) state.page = page;
      if (limit !== undefined) state.limit = limit;
      if (sort !== undefined) state.sort = sort;
      if (order !== undefined) state.order = order;
      if (minPrice !== undefined) state.minPrice = minPrice;
      if (maxPrice !== undefined) state.maxPrice = maxPrice;
      if (inStock !== undefined) state.inStock = inStock;
      if (search !== undefined) state.search = search;
    },

    resetProductUI(state) {
      state.categoryId = null;
      state.page = 1;
      state.limit = 10;
      state.sort = "createdAt";
      state.order = "desc";
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.inStock = undefined;
      state.search = "";
    },
  },
});

export const {
  setCategoryId,
  setPage,
  setLimit,
  setSort,
  setOrder,
  setMinPrice,
  setMaxPrice,
  setInStock,
  setSearch,
  setFilters,
  resetProductUI,
} = productSlice.actions;

export const productUIActions = productSlice.actions;

export default productSlice.reducer;
