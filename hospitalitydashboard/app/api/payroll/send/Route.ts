import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

// Server-side Supabase client (uses service role key — never expose this to browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountant, period, emailBody, total, clientId, periodStart, periodEnd } = body;

    // ── Validate ────────────────────────────────────────────────────────────
    if (!accountant || !period || !emailBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Send email via Resend ───────────────────────────────────────────────
    const { data: emailData, error: emailError } = await resend.emails.send({
      from:    process.env.EMAIL_FROM ?? "noreply@yourdomain.com",
      to:      accountant,
      subject: `Payroll Request — ${period}`,
      text:    emailBody,
      // html: you can add a styled HTML version here later
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // ── Save payroll run to Supabase ────────────────────────────────────────
    const { error: dbError } = await supabase
      .from("payroll_runs")
      .insert({
        client_id:    clientId,
        period_label: period,
        period_start: periodStart ?? null,
        period_end:   periodEnd ?? null,
        total_amount: total,
        sent_to:      accountant,
        email_body:   emailBody,
        sent_at:      new Date().toISOString(),
      });

    if (dbError) {
      console.error("DB error:", dbError);
      // Email sent but DB save failed — still return success but log it
    }

    return NextResponse.json({ success: true, emailId: emailData?.id });

  } catch (err) {
    console.error("Payroll send error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}