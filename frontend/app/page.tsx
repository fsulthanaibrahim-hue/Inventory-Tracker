import Link from "next/link";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

import {
  ArrowRight,
  Boxes,
  ClipboardList,
  RadioTower,
} from "lucide-react";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

type StockRow = {
  sku: string;
  item: string;
  qty: string;
  status: "In stock" | "Low" | "Out";
};

const rows: StockRow[] = [
  { sku: "INV-0231", item: "Steel bolts, M8", qty: "482", status: "In stock" },
  { sku: "INV-0198", item: "Packing tape, 2\"", qty: "12", status: "Low" },
  { sku: "INV-0347", item: "Pallet wrap, roll", qty: "0", status: "Out" },
  { sku: "INV-0412", item: "Zip ties, 200mm", qty: "1,204", status: "In stock" },
];

const statusColor: Record<StockRow["status"], string> = {
  "In stock": "#4F7A5B",
  Low: "#E3A73D",
  Out: "#B4483B",
};

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen`}
      style={{
        backgroundColor: "#F0F1EC",
        fontFamily: "var(--font-body)",
        color: "#1D2320",
      }}
    >
      {/* Navbar */}
      <nav className="border-b" style={{ borderColor: "#DBD9D2" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ backgroundColor: "#1D2320" }}
            >
              <Boxes size={16} color="#F0F1EC" />
            </div>
            <span
              className="text-[15px] font-medium tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              InventoryPro
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm transition-colors"
              style={{ color: "#4B5D64" }}
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1D2320" }}
            >
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <div>
            <h1
              className="text-[2.75rem] leading-[1.08] font-medium tracking-tight md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Know what&rsquo;s on
              <br />
              the shelf, always.
            </h1>

            <p
              className="mt-6 max-w-md text-[15px] leading-7"
              style={{ color: "#4B5D64" }}
            >
              InventoryPro keeps a live count of every product you stock, so
              nobody finds out you&rsquo;re out of something by accident.
              Add items, watch levels change, and act before a shelf goes
              empty.
            </p>

            <div className="mt-9 flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1D2320" }}
              >
                Get started
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium underline decoration-1 underline-offset-4"
                style={{ color: "#1D2320", textDecorationColor: "#DBD9D2" }}
              >
                See a live manifest
              </Link>
            </div>
          </div>

          {/* Manifest panel — the hero visual */}
          <div
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: "#DBD9D2", backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-3"
              style={{ borderColor: "#DBD9D2" }}
            >
              <span className="text-[13px] font-medium">Warehouse 4 — manifest</span>
              <span
                className="text-[11px]"
                style={{ color: "#4B5D64", fontFamily: "var(--font-mono)" }}
              >
                synced 2s ago
              </span>
            </div>

            <div
              className="grid grid-cols-[1fr_2fr_0.7fr_1fr] gap-2 px-5 py-2 text-[11px]"
              style={{ color: "#4B5D64", fontFamily: "var(--font-mono)" }}
            >
              <span>sku</span>
              <span>item</span>
              <span className="text-right">qty</span>
              <span>status</span>
            </div>

            <div>
              {rows.map((row, i) => (
                <div
                  key={row.sku}
                  className="grid grid-cols-[1fr_2fr_0.7fr_1fr] items-center gap-2 px-5 py-3 text-[13px]"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #EEEDE7",
                  }}
                >
                  <span
                    style={{ fontFamily: "var(--font-mono)", color: "#4B5D64" }}
                  >
                    {row.sku}
                  </span>
                  <span>{row.item}</span>
                  <span
                    className="text-right"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {row.qty}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: statusColor[row.status] }}
                    />
                    <span style={{ color: "#4B5D64" }}>{row.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section
        className="border-y"
        style={{ borderColor: "#DBD9D2", backgroundColor: "#E9EAE4" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          style={{ borderColor: "#DBD9D2" } as React.CSSProperties}
        >
          <Stat number="2,400+" label="SKUs tracked per warehouse" />
          <Stat number="< 1s" label="stock level sync time" />
          <Stat number="98%" label="pick accuracy after rollout" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3 md:divide-x" style={{ borderColor: "#DBD9D2" } as React.CSSProperties}>
          <Feature
            icon={<Boxes size={20} />}
            title="Product management"
            description="Add, edit, and search every product you carry, with details that stay consistent across your team."
          />
          <Feature
            icon={<RadioTower size={20} />}
            title="Stock monitoring"
            description="See in stock, low, and out at a glance, and get to the ones that need attention first."
            padded
          />
          <Feature
            icon={<ClipboardList size={20} />}
            title="Secure access"
            description="Sign in with JWT authentication, so only your team can see or change what's on the shelf."
            padded
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: "#DBD9D2" }}>
        <p className="text-center text-[13px]" style={{ color: "#4B5D64" }}>
          InventoryPro — inventory tracking that stays out of your way
        </p>
      </footer>
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="px-6 py-8 text-center sm:text-left">
      <p
        className="text-2xl font-medium"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {number}
      </p>
      <p className="mt-1 text-[13px]" style={{ color: "#4B5D64" }}>
        {label}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
  padded,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  padded?: boolean;
}) {
  return (
    <div className={padded ? "md:pl-12" : ""}>
      <div style={{ color: "#E3A73D" }}>{icon}</div>
      <h2
        className="mt-4 text-[15px] font-medium"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-6" style={{ color: "#4B5D64" }}>
        {description}
      </p>
    </div>
  );
}