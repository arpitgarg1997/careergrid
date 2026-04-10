import { NextResponse } from "next/server";
import { google } from "googleapis";

function parsePrivateKey(raw) {
  if (!raw) return "";

  let key = raw;

  // Strip wrapping quotes
  while (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
  while (key.startsWith("'") && key.endsWith("'")) key = key.slice(1, -1);

  // Replace literal \n with real newlines
  key = key.replace(/\\n/g, "\n");

  // Remove carriage returns
  key = key.replace(/\r/g, "");

  // Extract just the base64 content
  const base64 = key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  // Reconstruct clean PEM
  const lines = base64.match(/.{1,64}/g) || [];
  return (
    "-----BEGIN PRIVATE KEY-----\n" +
    lines.join("\n") +
    "\n-----END PRIVATE KEY-----\n"
  );
}

export async function GET() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const parsedKey = parsePrivateKey(rawKey);

  const checks = {
    env: {
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
    },
    keyDebug: {
      RAW_LENGTH: rawKey.length,
      PARSED_LENGTH: parsedKey.length,
      PARSED_FIRST_50: parsedKey.substring(0, 50),
      PARSED_KEY_VALID: parsedKey.startsWith("-----BEGIN PRIVATE KEY-----"),
      BASE64_LENGTH: parsedKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, "")
        .replace(/-----END PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "").length,
    },
    sheetsConnection: null,
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: parsedKey,
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
