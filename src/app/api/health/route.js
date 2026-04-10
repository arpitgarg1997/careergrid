import { NextResponse } from "next/server";
import { google } from "googleapis";

function parsePrivateKey(raw) {
  if (!raw) return "";
  let key = raw;
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n");
  return key;
}

export async function GET() {
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  const checks = {
    env: {
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
      RAW_KEY_LENGTH: (process.env.GOOGLE_PRIVATE_KEY || "").length,
      PARSED_KEY_LENGTH: privateKey.length,
      PARSED_KEY_VALID: privateKey.startsWith("-----BEGIN PRIVATE KEY-----"),
    },
    sheetsConnection: null,
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      fields: "sheets.properties.title",
    });

    const tabNames = res.data.sheets.map((s) => s.properties.title);
    checks.sheetsConnection = { success: true, tabs: tabNames };
  } catch (err) {
    checks.sheetsConnection = {
      success: false,
      error: err.message,
      code: err.code,
    };
  }

  return NextResponse.json(checks);
}
