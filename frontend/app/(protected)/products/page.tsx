"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";


import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";

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

type ProductForm = {
  name: string;
  description: string;
  category: "Sunglasses" | "Accessories" | "Other";
  price: string;
  quantity: string;
  minimum_stock: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "Other",
  price: "",
  quantity: "",
  minimum_stock: "5",
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<ProductForm>({ ...emptyForm });

  // ============================================
  // LOAD PRODUCTS
  // ============================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      const data = response?.data ?? response;

      /*
       * Supported API responses:
       *
       * 1. [products]
       * 2. { results: [...] }
       * 3. { products: [...] }
       * 4. { data: [...] }
       */

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
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        "Unable to load products. Please try again."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ============================================
  // OPEN CREATE MODAL
  // ============================================

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setError("");
    setIsModalOpen(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      category: product.category ?? "Other",
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? ""),
      minimum_stock: String(
        product.minimum_stock ?? "5"
      ),
    });

    setError("");
    setIsModalOpen(true);
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setError("");
  };

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const minimumStock = Number(
      form.minimum_stock
    );

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError("Price must be greater than 0.");
      return;
    }

    if (
      form.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError(
        "Quantity must be a valid whole number."
      );
      return;
    }

    if (
      form.minimum_stock === "" ||
      !Number.isInteger(minimumStock) ||
      minimumStock < 0
    ) {
      setError(
        "Minimum stock must be a valid whole number."
      );
      return;
    }

    // -----------------------------
    // PAYLOAD
    // -----------------------------

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      quantity,
      minimum_stock: minimumStock,
    };

    try {
      setSaving(true);

      // ========================================
      // UPDATE PRODUCT
      // ========================================

      if (editingProduct) {
        const response = await updateProduct(
          editingProduct.id,
          payload
        );

        const responseData =
          response?.data ?? response;

        const updatedProduct =
          responseData?.product ??
          responseData?.data ??
          responseData;

        /*
         * Update product locally if API returned
         * the updated product.
         */

        if (
          updatedProduct &&
          typeof updatedProduct === "object"
        ) {
          const normalizedProduct: Product = {
            ...editingProduct,
            ...updatedProduct,
            id:
              updatedProduct.id ??
              editingProduct.id,
          };

          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product.id === editingProduct.id
                ? normalizedProduct
                : product
            )
          );
        } else {
          // If API didn't return the product,
          // reload everything.
          await loadProducts();
        }
      }

      // ========================================
      // CREATE PRODUCT
      // ========================================

      else {
        const response =
          await createProduct(payload);

        const responseData =
          response?.data ?? response;

        const newProduct =
          responseData?.product ??
          responseData?.data ??
          responseData;

        /*
         * Only add to state if the response
         * actually looks like a product.
         */

        if (
          newProduct &&
          typeof newProduct === "object" &&
          newProduct.id
        ) {
          setProducts((currentProducts) => [
            newProduct,
            ...currentProducts,
          ]);
        } else {
          await loadProducts();
        }
      }

      // Close modal after successful save
      setIsModalOpen(false);
      setEditingProduct(null);
      setForm({ ...emptyForm });
      setError("");
    } catch (err) {
      console.error(
        "Product save failed:",
        err
      );

      setError(
        "Failed to save the product. Please check the entered values."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE PRODUCT
  // ============================================

  const handleDelete = async (
    product: Product
  ) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
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
  // SEARCH
  // ============================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return (
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue) ||
        product.description
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ============================================
  // FORMAT PRICE
  // ============================================

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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard")
                  }
                  className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
                >
                  <ArrowLeft size={16} />

                  Back to Dashboard
                </button>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Products
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Create, update and manage your
                  inventory products.
                </p>
              </div>

              {/* Add Product */}
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Plus size={18} />

                Add Product
              </button>
            </div>

            {/* =====================================
                ERROR MESSAGE
            ====================================== */}

            {error && !isModalOpen && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* =====================================
                MAIN CARD
            ====================================== */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* ===================================
                  SEARCH
              ==================================== */}

              <div className="border-b border-gray-200 p-4 sm:p-6">
                <div className="relative max-w-md">
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
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* ===================================
                  LOADING
              ==================================== */}

              {loading ? (
                <div className="flex min-h-[350px] items-center justify-center">
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
              ) : filteredProducts.length ===
                0 ? (
                /* =================================
                   EMPTY STATE
                ================================== */

                <div className="flex min-h-[350px] items-center justify-center p-6">
                  <div className="text-center">
                    <Package
                      size={42}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      No products found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {search
                        ? "Try a different search term."
                        : "Add your first product to start tracking inventory."}
                    </p>

                    {!search && (
                      <button
                        type="button"
                        onClick={
                          openCreateModal
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        <Plus size={17} />

                        Add Product
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* =================================
                   PRODUCT TABLE
                ================================== */

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
                          Quantity
                        </th>

                        <th className="px-6 py-4">
                          Minimum
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(
                        (product) => {
                          const quantity = Number(
                            product.quantity || 0
                          );

                          const minimumStock =
                            Number(
                              product.minimum_stock ||
                                0
                            );

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
                                  {
                                    product.category
                                  }
                                </span>
                              </td>

                              {/* Price */}

                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {formatPrice(
                                  product.price
                                )}
                              </td>

                              {/* Quantity */}

                              <td className="px-6 py-4">
                                <span
                                  className={
                                    quantity ===
                                    0
                                      ? "font-semibold text-red-600"
                                      : quantity <=
                                        minimumStock
                                      ? "font-semibold text-yellow-600"
                                      : "font-medium text-green-600"
                                  }
                                >
                                  {quantity}
                                </span>
                              </td>

                              {/* Minimum */}

                              <td className="px-6 py-4 text-sm text-gray-600">
                                {minimumStock}
                              </td>

                              {/* Actions */}

                              <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                  {/* Edit */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditModal(
                                        product
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                                  >
                                    <Edit3
                                      size={14}
                                    />

                                    Edit
                                  </button>

                                  {/* Delete */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        product
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                  >
                                    <Trash2
                                      size={14}
                                    />

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

              {/* ===================================
                  FOOTER
              ==================================== */}

              {!loading &&
                filteredProducts.length >
                  0 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-medium text-gray-900">
                        {
                          filteredProducts.length
                        }
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-gray-900">
                        {products.length}
                      </span>{" "}
                      products
                    </p>
                  </div>
                )}
            </section>
          </div>
        </main>
      </div>

      {/* ==========================================
          PRODUCT MODAL
      =========================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* ====================================
                MODAL HEADER
            ===================================== */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProduct
                    ? "Update the product information."
                    : "Enter the details for your new product."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* ====================================
                FORM
            ===================================== */}

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] overflow-y-auto p-6">
                {/* Modal Error */}

                {error && isModalOpen && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* =================================
                      PRODUCT NAME
                  ================================== */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="product-name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Product Name
                    </label>

                    <input
                      id="product-name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target
                            .value,
                        }))
                      }
                      placeholder="Enter product name"
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>

                  {/* =================================
                      DESCRIPTION
                  ================================== */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="product-description"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>

                    <textarea
                      id="product-description"
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description:
                            event.target
                              .value,
                        }))
                      }
                      rows={3}
                      placeholder="Enter product description"
                      disabled={saving}
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>

                  {/* =================================
                      CATEGORY
                  ================================== */}

                  <div>
                    <label
                      htmlFor="product-category"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>

                    <select
                      id="product-category"
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          category:
                            event.target
                              .value as ProductForm["category"],
                        }))
                      }
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    >
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

                  {/* =================================
                      PRICE
                  ================================== */}

                  <div>
                    <label
                      htmlFor="product-price"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>

                    <input
                      id="product-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          price:
                            event.target.value,
                        }))
                      }
                      placeholder="0.00"
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>

                  {/* =================================
                      QUANTITY
                  ================================== */}

                  <div>
                    <label
                      htmlFor="product-quantity"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>

                    <input
                      id="product-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={form.quantity}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          quantity:
                            event.target.value,
                        }))
                      }
                      placeholder="0"
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>

                  {/* =================================
                      MINIMUM STOCK
                  ================================== */}

                  <div>
                    <label
                      htmlFor="minimum-stock"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Minimum Stock
                    </label>

                    <input
                      id="minimum-stock"
                      type="number"
                      min="0"
                      step="1"
                      value={
                        form.minimum_stock
                      }
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          minimum_stock:
                            event.target
                              .value,
                        }))
                      }
                      placeholder="5"
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* ====================================
                  MODAL FOOTER
              ===================================== */}

              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
