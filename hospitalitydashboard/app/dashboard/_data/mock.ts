 // ─────────────────────────────────────────────────────────────────────────────
// mock.ts — Replace these with real Supabase queries when ready
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK = {
  sops: [
    { id: 1, title: "Guest Check-In Procedure",  category: "Front Desk",   updated: "Apr 10, 2026", driveId: "1abc", status: "Active" },
    { id: 2, title: "Food Safety & Handling",     category: "Kitchen",      updated: "Mar 28, 2026", driveId: "2abc", status: "Active" },
    { id: 3, title: "Emergency Evacuation",       category: "Safety",       updated: "Feb 14, 2026", driveId: "3abc", status: "Review Needed" },
    { id: 4, title: "Housekeeping Standards",     category: "Housekeeping", updated: "Apr 1, 2026",  driveId: "4abc", status: "Active" },
  ],

  manuals: [
    { id: 1, title: "POS System Manual",      category: "Technology", updated: "Jan 20, 2026", driveId: "m1" },
    { id: 2, title: "HVAC Operations Guide",  category: "Facilities", updated: "Nov 5, 2025",  driveId: "m2" },
    { id: 3, title: "Brand Standards Guide",  category: "Brand",      updated: "Mar 1, 2026",  driveId: "m3" },
  ],

  troubleshooting: [
    { id: 1, title: "POS Won't Start",       symptom: "Black screen on startup",      solution: "Power cycle, check cable P7",           driveId: "t1" },
    { id: 2, title: "HVAC E-47 Fault Code",  symptom: "Grinding noise on startup",    solution: "Pressure sensor calibration needed",    driveId: "t2" },
    { id: 3, title: "Key Card Not Working",  symptom: "Card reader flashes red",      solution: "Re-encode at front desk terminal",      driveId: "t3" },
  ],

  inspections: [
    { id: 1, name: "Fire Suppression System",    vendor: "ABC Fire Protection", due: "May 1, 2026",  daysLeft: 7,  status: "urgent" },
    { id: 2, name: "HVAC Annual Inspection",      vendor: "CoolTech Services",   due: "Jun 15, 2026", daysLeft: 52, status: "upcoming" },
    { id: 3, name: "Health Dept. Inspection",     vendor: "City Health Dept.",   due: "Apr 28, 2026", daysLeft: 4,  status: "urgent" },
    { id: 4, name: "Electrical Safety Cert",      vendor: "Sparks Electrical",   due: "Jul 20, 2026", daysLeft: 87, status: "ok" },
  ],

  licenses: [
    { id: 1, name: "Business Operating License", issuer: "City of Miami",     expiry: "Dec 31, 2026", daysLeft: 251, status: "ok" },
    { id: 2, name: "Food Service Permit",         issuer: "Health Department", expiry: "May 30, 2026", daysLeft: 36,  status: "upcoming" },
    { id: 3, name: "Liquor License",              issuer: "State ABC Board",   expiry: "Apr 30, 2026", daysLeft: 6,   status: "urgent" },
    { id: 4, name: "Music Performance License",   issuer: "ASCAP",             expiry: "Jan 1, 2027",  daysLeft: 252, status: "ok" },
  ],

  employees: [
    { id: 1, name: "Maria Garcia", role: "Front Desk",  payType: "hourly",    rate: 18,   hours: 40 },
    { id: 2, name: "James Lee",    role: "Chef",         payType: "biweekly",  rate: 2800, hours: null },
    { id: 3, name: "Sarah Kim",    role: "Housekeeping", payType: "hourly",    rate: 16,   hours: 32 },
    { id: 4, name: "David Brown",  role: "Maintenance",  payType: "hourly",    rate: 22,   hours: 45 },
    { id: 5, name: "Emily Chen",   role: "Manager",      payType: "biweekly",  rate: 3500, hours: null },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript types — mirrors your future Supabase table columns
// ─────────────────────────────────────────────────────────────────────────────

export type SOP            = typeof MOCK.sops[0];
export type Manual         = typeof MOCK.manuals[0];
export type Troubleshoot   = typeof MOCK.troubleshooting[0];
export type Inspection     = typeof MOCK.inspections[0];
export type License        = typeof MOCK.licenses[0];
export type Employee       = typeof MOCK.employees[0];