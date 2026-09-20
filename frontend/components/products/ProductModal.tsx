"use client";

import Modal from "@/components/ui/Modal";
import ProductForm from "./ProductForm";
import { Product, ProductFormData } from "@/types/product";

interface ProductModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export default function ProductModal({
  isOpen,
  product,
  onClose,
  onSubmit,
}: ProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={product ? "Edit Product" : "Add New Product"}
      onClose={onClose}
    >
      <ProductForm
        product={product}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}