"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

import {
  ArrowLeft,
  LockKeyhole,
  Boxes,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { loginUser } from "@/lib/authApi";
import { saveTokens } from "@/lib/auth";

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

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      saveTokens(data.access, data.refresh);

      toast.success("Login successful!");

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-screen items-center justify-center px-6`}
      style={{
        backgroundColor: "#F0F1EC",
        fontFamily: "var(--font-body)",
        color: "#1D2320",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Back to Home */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm transition-colors hover:opacity-70"
          style={{ color: "#4B5D64" }}
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        {/* Login Card */}
        <div
          className="rounded-lg border bg-white p-8"
          style={{ borderColor: "#DBD9D2" }}
        >
          {/* Header */}
          <div className="mb-7 flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-md"
              style={{ backgroundColor: "#1D2320" }}
            >
              <Boxes size={17} color="#F0F1EC" />
            </div>
            <div>
              <h1
                className="text-lg font-medium leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sign in
              </h1>
              <p className="text-[13px]" style={{ color: "#4B5D64" }}>
                Access your inventory dashboard
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3A6" }}
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-md border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400"
                  style={{ borderColor: "#DBD9D2" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1D2320")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#DBD9D2")}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3A6" }}
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400"
                  style={{ borderColor: "#DBD9D2" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1D2320")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#DBD9D2")}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#1D2320" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register Option */}
          <div
            className="mt-6 border-t pt-5 text-center"
            style={{ borderColor: "#EEEDE7" }}
          >
            <p className="text-[13px]" style={{ color: "#4B5D64" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium underline decoration-1 underline-offset-4"
                style={{ color: "#1D2320", textDecorationColor: "#DBD9D2" }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-[12px]"
          style={{ color: "#4B5D64", fontFamily: "var(--font-mono)" }}
        >
          InventoryPro — secure access
        </p>
      </div>
    </main>
  );
}