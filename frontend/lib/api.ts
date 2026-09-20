import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

import {
  Product,
  ProductFormData,
  StockUpdateData,
} from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REFRESH ACCESS TOKEN
========================= */

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error(
      "Refresh token is missing."
    );
  }

  const response = await axios.post(
    `${API_URL}/auth/token/refresh/`,
    {
      refresh: refreshToken,
    }
  );

  const newAccessToken =
    response.data.access;

  const newRefreshToken =
    response.data.refresh;

  setTokens(
    newAccessToken,
    newRefreshToken
  );

  return newAccessToken;
}

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearTokens();

      if (typeof window !== "undefined") {
        window.location.href =
          "/login";
      }

      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes(
        "/auth/token/refresh/"
      )
    ) {
      clearTokens();

      if (typeof window !== "undefined") {
        window.location.href =
          "/login";
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();

      if (typeof window !== "undefined") {
        window.location.href =
          "/login";
      }

      return Promise.reject(
        refreshError
      );
    }
  }
);

/* =========================
   GET PRODUCTS
========================= */

export async function getProducts(
  params?: {
    search?: string;
    category?: string;
  }
): Promise<Product[]> {
  const response = await api.get(
    "/products/",
    {
      params,
    }
  );

  return response.data.products;
}

/* =========================
   GET SINGLE PRODUCT
========================= */

export async function getProduct(
  id: string
): Promise<Product> {
  const response = await api.get(
    `/products/${id}/`
  );

  return response.data.product;
}

/* =========================
   CREATE PRODUCT
========================= */

export async function createProduct(
  data: ProductFormData
) {
  const response = await api.post(
    "/products/",
    data
  );

  return response.data;
}

/* =========================
   UPDATE PRODUCT
========================= */

export async function updateProduct(
  id: string,
  data: ProductFormData
) {
  const response = await api.put(
    `/products/${id}/`,
    data
  );

  return response.data;
}

/* =========================
   DELETE PRODUCT
========================= */

export async function deleteProduct(
  id: string
) {
  const response = await api.delete(
    `/products/${id}/`
  );

  return response.data;
}

/* =========================
   UPDATE STOCK
========================= */

export async function updateStock(
  id: string,
  data: StockUpdateData
) {
  const response = await api.patch(
    `/products/${id}/stock/`,
    data
  );

  return response.data;
}

/* =========================
   INVENTORY STATS
========================= */

export async function getInventoryStats() {
  const response = await api.get(
    "/products/stats/"
  );

  return response.data.stats;
}

export default api;