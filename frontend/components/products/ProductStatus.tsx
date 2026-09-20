import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ProductStatusProps {
  quantity: number;
}

export default function ProductStatus({
  quantity,
}: ProductStatusProps) {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600">
        <XCircle size={13} />
        Out of Stock
      </span>
    );
  }

  if (quantity <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-600">
        <AlertTriangle size={13} />
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600">
      <CheckCircle2 size={13} />
      In Stock
    </span>
  );
}