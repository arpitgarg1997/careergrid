import { google } from "googleapis";

/**
 * Robustly parse the private key from env — handles all edge cases:
 * quotes, literal \n, Windows \r\n, extra whitespace, corrupted formatting.
 * Reconstructs a clean PEM key from the base64 content.
 */
function parsePrivateKey(raw) {
  if (!raw) return "";

  let key = raw;

  // Strip any wrapping quotes
  while (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
  while (key.startsWith("'") && key.endsWith("'")) key = key.slice(1, -1);

  // Replace literal \n with real newlines
  key = key.replace(/\\n/g, "\n");

  // Remove carriage returns
  key = key.replace(/\r/g, "");

  // Extract just the base64 content (strip headers, footers, whitespace)
  const base64 = key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  // Reconstruct clean PEM: header + base64 in 64-char lines + footer
  const lines = base64.match(/.{1,64}/g) || [];
  return (
    "-----BEGIN PRIVATE KEY-----\n" +
    lines.join("\n") +
    "\n-----END PRIVATE KEY-----\n"
  );
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error(
      `Missing Google credentials: client_email=${!!clientEmail}, private_key=${!!privateKey}`
    );
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendQuizResponse(data) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set");
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const row = [
    timestamp,
    data.name,
    data.email,
    data.whatsapp,
    data.class,
    ...Array.from({ length: 15 }, (_, i) => data.answers[`q${i + 1}`] || ""),
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Responses!A:T",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (err) {
    if (err.message?.includes("Unable to parse range") || err.code === 400) {
      console.error("'Responses' tab not found, trying 'Sheet1'...");
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A:T",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });
    } else {
      throw err;
    }
  }
}
