"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFileText, FiPlus, FiLogOut, FiUser, FiClock, FiArrowRight, FiZap, FiShield, FiDownload } from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const authToken = document.cookie.includes("auth-token=demo-token");
    if (!authToken) {
      router.push("/login");
      return;
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) +
        " • " +
        now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ─── HEADER ─── */}
      <header style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        padding: "0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            }}>
              <FiFileText style={{ color: "#fff", fontSize: 22 }} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.3 }}>InvoicePro</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, letterSpacing: 0.5 }}>INVOICE MANAGEMENT</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", background: "rgba(255,255,255,0.08)",
              borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiUser style={{ color: "#fff", fontSize: 14 }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>Admin</span>
            </div>
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10, background: "rgba(255,255,255,0.06)",
              cursor: "pointer", fontSize: 13, color: "#e2e8f0", fontWeight: 500,
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#fca5a5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#e2e8f0"; }}
            >
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
        padding: "40px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(59,130,246,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.06)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <FiClock style={{ color: "#94a3b8", fontSize: 14 }} />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{currentTime}</span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: -0.5 }}>
            {greeting}, Admin! 👋
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", margin: 0 }}>
            Ready to create and manage your professional invoices.
          </p>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: 1200, margin: "-36px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

        {/* ── Create Invoice CTA Card ── */}
        <Link href="/invoice/create" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            borderRadius: 20, padding: "36px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 8px 30px rgba(59,130,246,0.25)",
            marginBottom: 32,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.25)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiPlus style={{ color: "#fff", fontSize: 28 }} />
              </div>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Create New Invoice</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: 0 }}>Generate a professional GST tax invoice in seconds</p>
              </div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FiArrowRight style={{ color: "#fff", fontSize: 22 }} />
            </div>
          </div>
        </Link>

        {/* ── Feature Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

          {/* Card 1 */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              <FiZap style={{ color: "#2563eb", fontSize: 22 }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Fast & Easy</h4>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              Create professional tax invoices with pre-filled company details in just a few clicks.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              <FiDownload style={{ color: "#7c3aed", fontSize: 22 }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>PDF Download</h4>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              Download high-quality A4 PDF invoices. Print-ready with perfect formatting every time.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              <FiShield style={{ color: "#059669", fontSize: 22 }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>GST Compliant</h4>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              Automatic CGST & SGST calculation with editable tax rates. Fully GST compliant invoices.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
