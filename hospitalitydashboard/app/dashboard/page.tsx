"use client";
import { useState } from "react";
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
  const [active, setActive] = useState("ask");

  const Page = PAGES[active] || AskAIPage;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <Page />
      </div>
    </div>
  );
}