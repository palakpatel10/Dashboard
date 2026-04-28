import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// ── Auth helper ────────────────────────────────────────────────────────────
async function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key:  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
  return google.drive({ version: "v3", auth });
}

// ── GET /api/drive/files?folder=FOLDER_ID ─────────────────────────────────
// Lists all files inside a given Drive folder
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folder") ?? process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return NextResponse.json({ error: "No folder ID provided" }, { status: 400 });
    }

    const drive = await getDriveClient();

    const res = await drive.files.list({
      q:      `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, modifiedTime, webViewLink, size)",
      orderBy: "modifiedTime desc",
    });

    return NextResponse.json({ files: res.data.files ?? [] });

  } catch (err) {
    console.error("Drive list error:", err);
    return NextResponse.json({ error: "Failed to list Drive files" }, { status: 500 });
  }
}