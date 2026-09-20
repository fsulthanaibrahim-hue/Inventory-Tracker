"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowDown, ArrowUp, Boxes, Package, Plus, RefreshCw, Search, ShoppingBag, TrendingDown } from "lucide-react";
import { getProducts, deleteProduct, updateStock } from "@/lib/api";


type Product = {
  id: string;
  name: string;
  description?: string;
  category: "Sunglasses" | "Accessories" | "Other";
  price: number | string;
  quantity: number | string;
  minimum_stock: number | string;
  created_at?: string;
  updated_at?: string;
};

type DashboardProps = {
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
};

export default function Dashboard({
  onAddProduct,
  onEditProduct,
}: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ================================
  // LOAD PRODUCTS
  // ================================
  const loadProducts = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getProducts({
        search: search.trim() || undefined,
        category:
          category !== "All" ? category : undefined,
      });

      /*
       * API response can be:
       *
       * 1. [products]
       * 2. { results: [products] }
       * 3. { products: [products] }
       * 4. { data: [products] }
       */

      const data = response?.data ?? response;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.results)) {
        setProducts(data.results);
      } else if (Array.isArray(data?.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        "Unable to load products. Please check your connection and try again."
      );

      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ================================
  // LOAD WHEN SEARCH/CATEGORY CHANGES
  // ================================
  useEffect(() => {
    loadProducts();
  }, [search, category]);

  // ================================
  // CALCULATE DASHBOARD STATS
  // ================================
  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) =>
        total + Number(product.quantity || 0),
      0
    );

    const lowStock = products.filter((product) => {
      const quantity = Number(product.quantity || 0);
      const minimumStock = Number(
        product.minimum_stock || 0
      );

      return (
        quantity > 0 &&
        quantity <= minimumStock
      );
    }).length;

    const outOfStock = products.filter(
      (product) =>
        Number(product.quantity || 0) === 0
    ).length;

    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // ================================
  // DELETE PRODUCT
  // ================================
  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );
    } catch (err) {
      console.error("Delete failed:", err);

      setError("Failed to delete the product.");
    }
  };

  // ================================
  // UPDATE STOCK
  // ================================
  const handleStockUpdate = async (
    productId: string,
    action: "add" | "remove",
  ) => {
    const value = window.prompt(
      action === "add"
        ? "How many items do you want to add?"
        : "How many items do you want to remove?"
    );

    if (value === null || value.trim() === "") {
      return;
    }

    const quantity = Number(value);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      window.alert(
        "Please enter a valid positive whole number."
      );

      return;
    }

    try {
      setError("");

      const response = await updateStock(
        productId, 
        {
          action,
          quantity,
        }
    );

      const responseData =
        response?.data ?? response;

      const updatedProduct =
        responseData?.product ??
        responseData?.data ??
        responseData;

      if (
        updatedProduct &&
        typeof updatedProduct === "object" &&
        updatedProduct.id
      ) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  ...updatedProduct,
                }
              : product
          )
        );
      } else {
        await loadProducts(true);
      }
    } catch (err) {
      console.error(
        "Stock update failed:",
        err
      );

      setError("Failed to update stock.");
    }
  };

  // ================================
  // STOCK STATUS
  // ================================
  const getStockStatus = (product: Product) => {
    const quantity = Number(
      product.quantity || 0
    );

    const minimumStock = Number(
      product.minimum_stock || 0
    );

    if (quantity === 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-700 border-red-200",
      };
    }

    if (quantity <= minimumStock) {
      return {
        label: "Low stock",
        className:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    }

    return {
      label: "In stock",
      className:
        "bg-green-50 text-green-700 border-green-200",
    };
  };

  // ================================
  // FORMAT PRICE
  // ================================
  const formatPrice = (
    price: number | string
  ) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "₹0.00";
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* ================================
                PAGE HEADING
            ================================= */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Monitor your inventory and manage
                  your products.
                </p>
              </div>

              <div className="flex gap-3">
                {/* Refresh */}
                <button
                  type="button"
                  onClick={() =>
                    loadProducts(true)
                  }
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                {/* Add Product */}
                <button
                  type="button"
                  onClick={onAddProduct}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={18} />

                  Add Product
                </button>
              </div>
            </div>

            {/* ================================
                ERROR MESSAGE
            ================================= */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-medium">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* ================================
                STAT CARDS
            ================================= */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={
                  <Package size={22} />
                }
                description="Products in inventory"
              />

              <StatCard
                title="Total Stock"
                value={stats.totalStock}
                icon={
                  <Boxes size={22} />
                }
                description="Total available units"
              />

              <StatCard
                title="Low Stock"
                value={stats.lowStock}
                icon={
                  <TrendingDown size={22} />
                }
                description="Products need attention"
              />

              <StatCard
                title="Out of Stock"
                value={stats.outOfStock}
                icon={
                  <ShoppingBag size={22} />
                }
                description="Products unavailable"
              />
            </div>

            {/* ================================
                INVENTORY SECTION
            ================================= */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Section Header */}
              <div className="border-b border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Inventory
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage your products and stock
                      levels.
                    </p>
                  </div>

                  {/* ================================
                      FILTERS
                  ================================= */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Search */}
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target.value
                          )
                        }
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-64"
                      />
                    </div>

                    {/* Category */}
                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="All">
                        All Categories
                      </option>

                      <option value="Sunglasses">
                        Sunglasses
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ================================
                  LOADING
              ================================= */}
              {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <RefreshCw
                      size={28}
                      className="mx-auto animate-spin text-gray-400"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      Loading products...
                    </p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                /* ================================
                   EMPTY STATE
                ================================= */
                <div className="flex min-h-[300px] items-center justify-center p-6">
                  <div className="text-center">
                    <Package
                      size={40}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="mt-4 font-semibold text-gray-900">
                      No products found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or
                      add a new product.
                    </p>

                    <button
                      type="button"
                      onClick={onAddProduct}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      <Plus size={16} />

                      Add Product
                    </button>
                  </div>
                </div>
              ) : (
                /* ================================
                   PRODUCT TABLE
                ================================= */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-6 py-4">
                          Product
                        </th>

                        <th className="px-6 py-4">
                          Category
                        </th>

                        <th className="px-6 py-4">
                          Price
                        </th>

                        <th className="px-6 py-4">
                          Stock
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => {
                        const stockStatus =
                          getStockStatus(product);

                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-gray-50"
                          >
                            {/* Product */}
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>

                                {product.description && (
                                  <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                                    {
                                      product.description
                                    }
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                {product.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatPrice(
                                product.price
                              )}
                            </td>

                            {/* Stock */}
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {Number(
                                    product.quantity ||
                                      0
                                  )}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Min:{" "}
                                  {Number(
                                    product.minimum_stock ||
                                      0
                                  )}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${stockStatus.className}`}
                              >
                                {
                                  stockStatus.label
                                }
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {/* Add Stock */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStockUpdate(
                                      product.id,
                                      "add"
                                    )
                                  }
                                  title="Add stock"
                                  className="rounded-lg border border-gray-200 p-2 text-green-600 transition hover:bg-green-50"
                                >
                                  <ArrowUp
                                    size={16}
                                  />
                                </button>

                                {/* Remove Stock */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStockUpdate(
                                      product.id,
                                      "remove"
                                    )
                                  }
                                  title="Remove stock"
                                  disabled={
                                    Number(
                                      product.quantity
                                    ) === 0
                                  }
                                  className="rounded-lg border border-gray-200 p-2 text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <ArrowDown
                                    size={16}
                                  />
                                </button>

                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onEditProduct?.(
                                      product
                                    )
                                  }
                                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                  Edit
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      product.id
                                    )
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ================================
                  FOOTER
              ================================= */}
              {!loading &&
                products.length > 0 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-medium text-gray-900">
                        {products.length}
                      </span>{" "}
                      product
                      {products.length !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

