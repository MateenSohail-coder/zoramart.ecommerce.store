import { categoryApi } from "@/features/categories/categoryApi";
import { productApi } from "@/features/product/productApi";
import { configureStore } from "@reduxjs/toolkit";

import { reviewsApi } from "@/features/reviews/reviewsApi";
import { cartApi } from "@/features/cart/cartApi";
import { orderApi } from "@/features/order/orderApi";
import { paymentApi } from "@/features/payment/paymentApi";
import { sellerInfoApi } from "@/features/sellerInfo/sellerInfoApi";
import { notificationApi } from "@/features/notification/notificationApi";
import { analyticsApi } from "@/features/analytics/analyticsApi";
import { userApi } from "@/features/users/userApi";

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,

    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [sellerInfoApi.reducerPath]: sellerInfoApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      productApi.middleware,
      categoryApi.middleware,
      reviewsApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      paymentApi.middleware,
      sellerInfoApi.middleware,
      notificationApi.middleware,
      analyticsApi.middleware,
      userApi.middleware,
    );
  },
});

