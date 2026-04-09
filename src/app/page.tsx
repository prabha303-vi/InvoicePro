"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./login/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authToken = document.cookie.includes("auth-token=demo-token");
    if (authToken) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Show login screen by default
  const authToken = typeof document !== "undefined" && document.cookie.includes("auth-token=demo-token");
  if (authToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <LoginPage />;
}