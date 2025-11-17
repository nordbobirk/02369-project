"use client";

import { useState } from "react";
import { login } from "./login";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    setLoading(false);
    if (res) setError(res);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-6">
        {error && (
          <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
        )}
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white flex justify-center font-semibold rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? <Spinner className="my-1" /> : "Log ind"}
          </button>
        </form>
      </div>
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-4 mt-2">
        <p><i>Test credentials: email admin@example.com, pass yatai123!</i></p>
      </div>
    </div>
  );
}
