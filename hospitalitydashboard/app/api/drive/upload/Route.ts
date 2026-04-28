import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key:  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return google.drive({ version: "v3", auth });
}

// ── POST /api/drive/upload ────────────────────────────────────────────────
// Uploads a file to Google Drive and saves metadata to Supabase
// Body: FormData with fields: file, folder, table, recordId, clientId
export async function POST(req: NextRequest) {
  try {
    const form     = await req.formData();
    const file     = form.get("file") as File;
    const folder   = form.get("folder") as string ?? process.env.GOOGLE_DRIVE_FOLDER_ID;
    const table    = form.get("table") as string;   // "sops" | "manuals" | "inspections" etc
    const recordId = form.get("recordId") as string;
    const clientId = form.get("clientId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer → Stream for Drive upload
    const buffer   = Buffer.from(await file.arrayBuffer());
    const stream   = Readable.from(buffer);
    const drive    = await getDriveClient();

    // ── Upload to Drive ──────────────────────────────────────────────────
    const driveRes = await drive.files.create({
      requestBody: {
        name:    file.name,
        parents: [folder!],
      },
      media: {
        mimeType: file.type,
        body:     stream,
      },
      fields: "id, name, webViewLink",
    });

    const driveFileId  = driveRes.data.id!;
    const driveUrl     = driveRes.data.webViewLink!;

    // ── Update Supabase record with Drive file info ───────────────────────
    if (table && recordId) {
      await supabase
        .from(table)
        .update({ drive_file_id: driveFileId, drive_url: driveUrl })
        .eq("id", recordId)
        .eq("client_id", clientId);
    }

    return NextResponse.json({
      success:     true,
      driveFileId,
      driveUrl,
      fileName:    file.name,
    });

  } catch (err) {
    console.error("Drive upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}