"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Boxes } from "lucide-react";
import toast from "react-hot-toast";

import {
  registerUser,
  RegisterData,
} from "@/lib/registerApi";

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

function fieldProps() {
  return {
    className:
      "w-full rounded-md border py-2.5 px-3 text-sm outline-none transition-colors placeholder:text-slate-400",
    style: { borderColor: "#DBD9D2" },
    onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
      (e.currentTarget.style.borderColor = "#1D2320"),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
      (e.currentTarget.style.borderColor = "#DBD9D2"),
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirm
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.password_confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      toast.success("Account created successfully!");

      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);

      const responseData = error?.response?.data;

      if (responseData?.username) {
        toast.error(responseData.username[0]);
      } else if (responseData?.email) {
        toast.error(responseData.email[0]);
      } else if (responseData?.password_confirm) {
        toast.error(responseData.password_confirm[0]);
      } else if (responseData?.detail) {
        toast.error(responseData.detail);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const field = fieldProps();

  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-screen items-center justify-center px-6 py-12`}
      style={{
        backgroundColor: "#F0F1EC",
        fontFamily: "var(--font-body)",
        color: "#1D2320",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Register Card */}
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
                Create your account
              </h1>
              <p className="text-[13px]" style={{ color: "#4B5D64" }}>
                Start tracking inventory today
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
                {...field}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                autoComplete="email"
                {...field}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                {...field}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirm"
                className="mb-1.5 block text-[13px] font-medium"
              >
                Confirm password
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                {...field}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#1D2320" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <div
            className="mt-6 border-t pt-5 text-center"
            style={{ borderColor: "#EEEDE7" }}
          >
            <p className="text-[13px]" style={{ color: "#4B5D64" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium underline decoration-1 underline-offset-4"
                style={{ color: "#1D2320", textDecorationColor: "#DBD9D2" }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: "#4B5D64" }}
          >
            Back to home
          </Link>
        </div>

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