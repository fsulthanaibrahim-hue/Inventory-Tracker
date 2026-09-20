interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  let symbol = "P";
  let symbolClass = "bg-indigo-50 text-indigo-600";

  if (title === "Total Stock") {
    symbol = "S";
  }

  if (title === "Low Stock") {
    symbol = "!";
    symbolClass = "bg-amber-50 text-amber-600";
  }

  if (title === "Categories") {
    symbol = "C";
  }

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">

      {/* Icon */}

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${symbolClass}`}
      >
        {symbol}
      </div>

      {/* Content */}

      <div className="mt-5">

        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}
