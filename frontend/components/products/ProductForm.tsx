"use client";

import { useEffect, useState } from "react";
import { Product, ProductFormData } from "@/types/product";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setQuantity(String(product.quantity));
      setPrice(String(product.price));
    } else {
      setName("");
      setCategory("");
      setQuantity("");
      setPrice("");
    }
  }, [product]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        name,
        category,
        quantity: Number(quantity),
        price: Number(price),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Product Name"
        placeholder="e.g. Ray-Ban Aviator"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="Category"
        placeholder="e.g. Sunglasses"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <Input
          label="Price"
          type="number"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : product
              ? "Update Product"
              : "Add Product"}
        </Button>
      </div>
    </form>
  );
}