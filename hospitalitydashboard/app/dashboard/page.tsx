"use client";
import { useState, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import AskAIPage from "./_components/AskAIPage";
import SOPsPage from "./_components/SOPs";
import ManualsPage from "./_components/Manuals";
import TroubleshootingPage from "./_components/Troubleshooting";
import FaultLibraryPage from "./_components/FaultLibrary";
import LicensesPage from "./_components/Licenses";
import InspectionsPage from "./_components/Inspections";
import EmployeesPage from "./_components/Employees";
import PayrollPage from "./_components/Payroll";
import VendorsPage from "./_components/Vendors";
import AnalyticsPage from "./_components/Analytics";
import AddKnowledgePage from "./_components/AddKnowledge";
import SettingsPage from "./_components/Settings";

const PAGES: Record<string, React.ComponentType<any>> = {
  ask:             AskAIPage,
  sops:            SOPsPage,
  manuals:         ManualsPage,
  troubleshooting: TroubleshootingPage,
  faultlibrary:    FaultLibraryPage,
  licenses:        LicensesPage,
  inspections:     InspectionsPage,
  employees:       EmployeesPage,
  payroll:         PayrollPage,
  vendors:         VendorsPage,
  analytics:       AnalyticsPage,
  knowledge:       AddKnowledgePage,
  configurations:  SettingsPage,
  settings:        SettingsPage,
};

export default function DashboardPage() {
  const [active, setActive]       = useState("ask");
  const [sidebarOpen, setSidebar] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar when navigating on mobile
  const handleNav = (id: string) => {
    setActive(id);
    if (isMobile) setSidebar(false);
  };

  const Page = PAGES[active] || AskAIPage;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebar(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }}
        />
      )}

      {/* ── Sidebar ── */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? 0 : -240) : 0,
        top: 0, bottom: 0, zIndex: 50,
        transition: "left 0.25s ease",
        flexShrink: 0,
      }}>
        <Sidebar active={active} setActive={handleNav} />
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#0c1526", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
            <button
              onClick={() => setSidebar(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#f1f5f9", fontSize: 22, lineHeight: 1 }}
            >
              ☰
            </button>
            <div style={{ color: "#7c6af7", fontWeight: 800, fontSize: 16 }}>🏨 HospitalityOS</div>
          </div>
        )}

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 16 : 28 }}>
          <Page />
        </div>
      </div>
    </div>
  );
}