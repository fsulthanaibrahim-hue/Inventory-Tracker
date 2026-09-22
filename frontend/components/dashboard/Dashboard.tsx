"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  Boxes,
  Package,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";

import type { ProductFormData } from "@/types/product";

// ============================================
// PRODUCT TYPE
// ============================================

type Product = {
  id: string;
  name: string;
  description?: string;
  category:
    | "Sunglasses"
    | "Accessories"
    | "Other";
  price: number | string;
  quantity: number | string;
  minimum_stock: number | string;
  created_at?: string;
  updated_at?: string;
};

// ============================================
// FORM TYPE
// ============================================

type FormData = {
  name: string;
  description: string;
  category:
    | ""
    | "Sunglasses"
    | "Accessories"
    | "Other";
  price: string;
  quantity: string;
  minimum_stock: string;
};

// ============================================
// EMPTY FORM
// ============================================

const emptyForm: FormData = {
  name: "",
  description: "",
  category: "",
  price: "",
  quantity: "",
  minimum_stock: "",
};

// ============================================
// DASHBOARD
// ============================================

export default function Dashboard() {
  // ============================================
  // PRODUCTS
  // ============================================

  const [products, setProducts] =
    useState<Product[]>([]);

  // ============================================
  // LOADING
  // ============================================

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // ============================================
  // ERROR
  // ============================================

  const [error, setError] =
    useState("");

  // ============================================
  // SEARCH / CATEGORY
  // ============================================

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  // ============================================
  // ADD / EDIT FORM
  // ============================================

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<FormData>(emptyForm);

  const [savingProduct, setSavingProduct] =
    useState(false);

  // ============================================
  // LOAD PRODUCTS
  // ============================================

  const loadProducts = async (
    showRefresh = false
  ) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getProducts({
        search:
          search.trim() || undefined,

        category:
          category !== "All"
            ? category
            : undefined,
      });

      /*
       * getProducts() from api.ts returns:
       *
       * response.data.products
       *
       * So normally `response` is already
       * the products array.
       */

      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        "Unable to load products. Please check your connection and try again."
      );

      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================
  // LOAD WHEN SEARCH / CATEGORY CHANGES
  // ============================================

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  // ============================================
  // DASHBOARD STATS
  // ONLY 2 CARDS
  // ============================================

  const stats = useMemo(() => {
    const totalProducts =
      products.length;

    const totalStock =
      products.reduce(
        (total, product) =>
          total +
          Number(
            product.quantity || 0
          ),
        0
      );

    return {
      totalProducts,
      totalStock,
    };
  }, [products]);

  // ============================================
  // RESET FORM
  // ============================================

  const resetForm = () => {
    setFormData(emptyForm);

    setEditingProductId(null);

    setShowProductForm(false);
  };

  // ============================================
  // OPEN ADD PRODUCT FORM
  // ============================================

  const handleOpenAddForm = () => {
    setError("");

    setFormData(emptyForm);

    setEditingProductId(null);

    setShowProductForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================
  // OPEN EDIT PRODUCT FORM
  // ============================================

  const handleEdit = (
    product: Product
  ) => {
    setError("");

    setEditingProductId(
      product.id
    );

    setFormData({
      name: product.name || "",

      description:
        product.description || "",

      category:
        product.category || "",

      price: String(
        product.price ?? ""
      ),

      quantity: String(
        product.quantity ?? ""
      ),

      minimum_stock: String(
        product.minimum_stock ?? ""
      ),
    });

    setShowProductForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================
  // SAVE PRODUCT
  // ADD OR UPDATE
  // ============================================

  const handleSubmitProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSavingProduct(true);

      setError("");

      // ========================================
      // VALIDATE CATEGORY
      // ========================================

      if (
        formData.category !==
          "Sunglasses" &&
        formData.category !==
          "Accessories" &&
        formData.category !==
          "Other"
      ) {
        setError(
          "Please select a valid category."
        );

        return;
      }

      // ========================================
      // CREATE PRODUCT DATA
      // ========================================

      const productData: ProductFormData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        category:
          formData.category,

        price: Number(
          formData.price
        ),

        quantity: Number(
          formData.quantity
        ),

        minimum_stock: Number(
          formData.minimum_stock
        ),
      };

      // ========================================
      // VALIDATE PRODUCT NAME
      // ========================================

      if (!productData.name) {
        setError(
          "Product name is required."
        );

        return;
      }

      // ========================================
      // VALIDATE PRICE
      // ========================================

      if (
        Number.isNaN(
          productData.price
        ) ||
        productData.price <= 0
      ) {
        setError(
          "Please enter a valid price."
        );

        return;
      }

      // ========================================
      // VALIDATE QUANTITY
      // ========================================

      if (
        Number.isNaN(
          productData.quantity
        ) ||
        productData.quantity < 0
      ) {
        setError(
          "Please enter a valid quantity."
        );

        return;
      }

      // ========================================
      // VALIDATE MINIMUM STOCK
      // ========================================

      if (
        Number.isNaN(
          productData.minimum_stock
        ) ||
        productData.minimum_stock < 0
      ) {
        setError(
          "Please enter a valid minimum stock."
        );

        return;
      }

      // ========================================
      // UPDATE EXISTING PRODUCT
      // ========================================

      if (editingProductId) {
        await updateProduct(
          editingProductId,
          productData
        );

        resetForm();

        await loadProducts(true);

        return;
      }

      // ========================================
      // CREATE NEW PRODUCT
      // ========================================

      await createProduct(
        productData
      );

      resetForm();

      await loadProducts(true);
    } catch (err) {
      console.error(
        "Save product failed:",
        err
      );

      if (editingProductId) {
        setError(
          "Failed to update the product."
        );
      } else {
        setError(
          "Failed to add the product."
        );
      }
    } finally {
      setSavingProduct(false);
    }
  };

  // ============================================
  // DELETE PRODUCT
  // ============================================

  const handleDelete = async (
    productId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(
        productId
      );

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== productId
          )
      );

      // Close edit form if the
      // currently edited product
      // was deleted.

      if (
        editingProductId ===
        productId
      ) {
        resetForm();
      }
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

      setError(
        "Failed to delete the product."
      );
    }
  };

  // ============================================
  // STOCK STATUS
  // ============================================

  const getStockStatus = (
    product: Product
  ) => {
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

    if (
      quantity <= minimumStock
    ) {
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

  // ============================================
  // FORMAT PRICE
  // ============================================

  const formatPrice = (
    price: number | string
  ) => {
    const numericPrice =
      Number(price);

    if (
      Number.isNaN(numericPrice)
    ) {
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

  // ============================================
  // RETURN
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">

        <main className="min-w-0 flex-1">

          <div className="p-4 sm:p-6 lg:p-8">

            {/* ========================================
                PAGE HEADING
            ======================================== */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Monitor your inventory and
                  manage your products.
                </p>
              </div>

              <div className="flex gap-3">

                {/* REFRESH */}

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

                {/* ADD PRODUCT */}

                <button
                  type="button"
                  onClick={
                    handleOpenAddForm
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={18} />

                  Add Product
                </button>

              </div>
            </div>

            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

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

            {/* ========================================
                ADD / EDIT PRODUCT FORM
            ======================================== */}

            {showProductForm && (
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                {/* FORM HEADER */}

                <div className="mb-6 flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingProductId
                        ? "Edit Product"
                        : "Add New Product"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {editingProductId
                        ? "Update the product details below."
                        : "Add a new product to your inventory."}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                </div>

                {/* FORM */}

                <form
                  onSubmit={
                    handleSubmitProduct
                  }
                >

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* PRODUCT NAME */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Product Name
                      </label>

                      <input
                        type="text"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                        }
                        placeholder="e.g. Ray-Ban Aviator"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />

                    </div>

                    {/* CATEGORY */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                      </label>

                      <select
                        value={
                          formData.category
                        }
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            category:
                              event.target.value as FormData["category"],
                          })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      >

                        <option value="">
                          Select category
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

                    {/* DESCRIPTION */}

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                      </label>

                      <textarea
                        value={
                          formData.description
                        }
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            description:
                              event.target.value,
                          })
                        }
                        placeholder="Enter product description"
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />

                    </div>

                    {/* PRICE */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Price
                      </label>

                      <input
                        type="number"
                        value={
                          formData.price
                        }
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            price:
                              event.target.value,
                          })
                        }
                        placeholder="e.g. 2500"
                        min="0.01"
                        step="0.01"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />

                    </div>

                    {/* QUANTITY */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Quantity
                      </label>

                      <input
                        type="number"
                        value={
                          formData.quantity
                        }
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            quantity:
                              event.target.value,
                          })
                        }
                        placeholder="e.g. 10"
                        min="0"
                        step="1"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />

                    </div>

                    {/* MINIMUM STOCK */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Minimum Stock
                      </label>

                      <input
                        type="number"
                        value={
                          formData.minimum_stock
                        }
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            minimum_stock:
                              event.target.value,
                          })
                        }
                        placeholder="e.g. 5"
                        min="0"
                        step="1"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />

                    </div>

                  </div>

                  {/* FORM BUTTONS */}

                  <div className="mt-6 flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        savingProduct
                      }
                      className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingProduct
                        ? editingProductId
                          ? "Updating..."
                          : "Adding..."
                        : editingProductId
                        ? "Update Product"
                        : "Add Product"}
                    </button>

                  </div>

                </form>
              </div>
            )}

            {/* ========================================
                STAT CARDS
                ONLY 2
            ======================================== */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* TOTAL PRODUCTS */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Products
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stats.totalProducts.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      Products in inventory
                    </p>

                  </div>

                  <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
                    <Package size={22} />
                  </div>

                </div>

              </div>

              {/* TOTAL STOCK */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Stock
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stats.totalStock.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      Total available units
                    </p>

                  </div>

                  <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
                    <Boxes size={22} />
                  </div>

                </div>

              </div>

            </div>

            {/* ========================================
                INVENTORY
            ======================================== */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

              {/* SECTION HEADER */}

              <div className="border-b border-gray-200 p-4 sm:p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Inventory
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage your products and
                      stock levels.
                    </p>

                  </div>

                  {/* FILTERS */}

                  <div className="flex flex-col gap-3 sm:flex-row">

                    {/* SEARCH */}

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

                    {/* CATEGORY */}

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

              {/* LOADING */}

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

                /* EMPTY STATE */

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
                      Try changing your search
                      or add a new product.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleOpenAddForm
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      <Plus size={16} />

                      Add Product
                    </button>

                  </div>

                </div>

              ) : (

                /* PRODUCT TABLE */

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[850px]">

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

                      {products.map(
                        (product) => {

                          const stockStatus =
                            getStockStatus(
                              product
                            );

                          return (
                            <tr
                              key={
                                product.id
                              }
                              className="hover:bg-gray-50"
                            >

                              {/* PRODUCT */}

                              <td className="px-6 py-4">

                                <div>

                                  <p className="font-medium text-gray-900">
                                    {
                                      product.name
                                    }
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

                              {/* CATEGORY */}

                              <td className="px-6 py-4">

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                  {
                                    product.category
                                  }
                                </span>

                              </td>

                              {/* PRICE */}

                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {formatPrice(
                                  product.price
                                )}
                              </td>

                              {/* STOCK */}

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

                              {/* STATUS */}

                              <td className="px-6 py-4">

                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${stockStatus.className}`}
                                >
                                  {
                                    stockStatus.label
                                  }
                                </span>

                              </td>

                              {/* ACTIONS */}

                              <td className="px-6 py-4">

                                <div className="flex items-center justify-end gap-2">

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        product
                                      )
                                    }
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>

                                  {/* DELETE */}

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
                        }
                      )}

                    </tbody>

                  </table>

                </div>
              )}

              {/* FOOTER */}

              {!loading &&
                products.length > 0 && (

                  <div className="border-t border-gray-200 px-6 py-4">

                    <p className="text-sm text-gray-500">

                      Showing{" "}

                      <span className="font-medium text-gray-900">
                        {
                          products.length
                        }
                      </span>{" "}

                      product
                      {products.length !==
                      1
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