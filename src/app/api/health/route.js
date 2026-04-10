import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const checks = {
    env: {
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
      PRIVATE_KEY_LENGTH: (process.env.GOOGLE_PRIVATE_KEY || "").length,
      PRIVATE_KEY_STARTS_WITH: (process.env.GOOGLE_PRIVATE_KEY || "").substring(0, 30),
    },
    sheetsConnection: null,
  };

  // Test actual Google Sheets connection
  try {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = JSON.parse(privateKey);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

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
