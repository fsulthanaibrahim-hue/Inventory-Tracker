"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { ArrowLeft, Package, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { getProduct, updateProduct } from "@/lib/api";

import { Product, ProductCategory, ProductFormData } from "@/types/product";

const categories: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Food",
  "Other",
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [formData, setFormData] =
    useState<ProductFormData>({
      name: "",
      description: "",
      category: "Electronics",
      price: 0,
      quantity: 0,
      minimum_stock: 0,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProduct() {
    try {
      setLoading(true);

      const data = await getProduct(id);

      setProduct(data);

      setFormData({
        name: data.name,
        description: data.description || "",
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.quantity),
        minimum_stock: Number(data.minimum_stock),
      });
    } catch (error: any) {
      console.error(
        "Failed to load product:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Product not found.";

      toast.error(message);

      router.replace("/products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" ||
        name === "quantity" ||
        name === "minimum_stock"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (formData.quantity < 0) {
      toast.error("Quantity cannot be negative.");
      return;
    }

    if (formData.minimum_stock < 0) {
      toast.error(
        "Minimum stock cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      await updateProduct(id, {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      toast.success("Product updated successfully.");

      router.push("/products");
    } catch (error: any) {
      console.error(
        "Update product error:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to update product.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
            <div className="text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-indigo-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading product...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Package size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Edit Product
                </h1>

                <p className="text-sm text-slate-500">
                  Update product information and stock.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ₹
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Quantity
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Minimum Stock */}
                <div>
                  <label
                    htmlFor="minimum_stock"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Minimum Stock
                  </label>

                  <input
                    id="minimum_stock"
                    name="minimum_stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.minimum_stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Low Stock when quantity is less than
                    or equal to this value.
                  </p>
                </div>
              </div>

              {/* Product information */}
              <div className="mt-8 rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-slate-400">
                      Product ID
                    </span>

                    <p className="mt-1 break-all font-medium text-slate-700">
                      {product._id}
                    </p>
                  </div>

                  {product.created_at && (
                    <div>
                      <span className="text-slate-400">
                        Created
                      </span>

                      <p className="mt-1 font-medium text-slate-700">
                        {new Date(
                          product.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}