"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Product } from "@/types/product";

interface DeleteModalProps {
  product: Product | null;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({
  product,
  isOpen,
  loading,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Delete Product"
      onClose={onClose}
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900">
            {product.name}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}