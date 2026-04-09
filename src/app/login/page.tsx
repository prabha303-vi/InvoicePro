"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiFileText } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      document.cookie = "auth-token=demo-token; path=/; max-age=86400";
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCredentials = () => {
    setFormData({
      email: "demo@example.com",
      password: "password123",
      name: "Demo User",
      phone: "+1234567890",
    });
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    height: 48,
    padding: "0 16px 0 46px",
    border: focusedField === field ? "2px solid #3b82f6" : "2px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 15,
    color: "#111827",
    background: focusedField === field ? "#fff" : "#f9fafb",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
    boxShadow: focusedField === field ? "0 0 0 4px rgba(59,130,246,0.1)" : "none",
  });

  const iconStyle = (field: string): React.CSSProperties => ({
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: focusedField === field ? "#3b82f6" : "#9ca3af",
    transition: "color 0.2s ease",
    fontSize: 18,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 20,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "36px 36px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
              }}
            >
              <FiFileText size={26} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 6px",
                letterSpacing: -0.5,
              }}
            >
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
                margin: 0,
              }}
            >
              {mode === "login"
                ? "Sign in to manage your invoices"
                : "Join us and start creating invoices"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "28px 36px 32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {mode === "register" && (
                <>
                  {/* Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Full Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <FiUser style={iconStyle("name")} />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        style={inputStyle("name")}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Phone Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <FiPhone style={iconStyle("phone")} />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField("")}
                        style={inputStyle("phone")}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <FiMail style={iconStyle("email")} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    style={inputStyle("email")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <FiLock style={iconStyle("password")} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    style={inputStyle("password")}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: 50,
                marginTop: 26,
                border: "none",
                borderRadius: 12,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
                letterSpacing: 0.3,
              }}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <FiArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "22px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            {/* Demo */}
            <button
              type="button"
              onClick={loadDemoCredentials}
              style={{
                width: "100%",
                height: 46,
                border: "2px solid #e5e7eb",
                borderRadius: 12,
                background: "#fff",
                color: "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: 0.2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.color = "#3b82f6";
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
                e.currentTarget.style.background = "#fff";
              }}
            >
              Load Demo Credentials
            </button>

            {/* Switch Mode */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  fontSize: 14,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>Sign up</span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>Sign in</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Demo: demo@example.com / password123
        </p>
      </div>
    </div>
  );
}
