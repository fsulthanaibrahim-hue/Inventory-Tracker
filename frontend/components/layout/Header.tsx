"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { logout } from "@/lib/auth";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    logout();

    toast.success("Logged out successfully.");

    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            InventoryPro
          </h1>

          <p className="text-xs text-slate-400">
            Inventory Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <UserCircle
              size={20}
              className="text-slate-400"
            />

            <span className="text-sm font-medium text-slate-600">
              Inventory User
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}