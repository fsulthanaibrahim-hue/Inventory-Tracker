"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Package,
} from "lucide-react";

import { usePathname } from "next/navigation";


const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
];


export default function Sidebar() {

  const pathname = usePathname();


  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

      <div className="flex h-full flex-col">

        <div className="flex h-20 items-center border-b border-slate-100 px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Package size={19} />
            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                InventoryPro
              </p>

              <p className="text-[10px] text-slate-400">
                Inventory Tracker
              </p>

            </div>

          </Link>

        </div>


        <nav className="flex-1 space-y-1 px-3 py-6">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>


          {navigation.map((item) => {

            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );


            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >

                <Icon size={18} />

                {item.name}

              </Link>
            );

          })}

        </nav>


        <div className="border-t border-slate-100 p-4">

          <p className="text-xs text-slate-400">
            Simple inventory management
          </p>

        </div>

      </div>

    </aside>
  );
}