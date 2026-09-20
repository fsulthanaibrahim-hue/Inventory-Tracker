"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Package
} from "lucide-react";

import { Product } from "@/types/product";
import ProductStatus from "./ProductStatus";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Product
              </th>

              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Category
              </th>

              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Quantity
              </th>

              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Price
              </th>

              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product._id}
                className="group transition hover:bg-slate-50/70"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                      {product.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        #{product._id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                    {product.category}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                  {product.quantity}
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                  ₹{product.price.toLocaleString("en-IN")}
                </td>

                <td className="px-6 py-4">
                  <ProductStatus quantity={product.quantity} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(product)}
                      title="Edit product"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      title="Delete product"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      title="More options"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Package
                      size={20}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    No products found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add your first product to get started.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}