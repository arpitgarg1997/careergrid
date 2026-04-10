import { google } from "googleapis";

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

  // Handle multiple ways the private key might be stored in Vercel:
  // 1. Escaped newlines: \\n → \n
  // 2. JSON-encoded with extra quotes: "\"-----BEGIN..."
  // 3. Raw with literal \n strings
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    // Strip wrapping quotes (Vercel sometimes adds these)
    privateKey = JSON.parse(privateKey);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

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
    // If the "Responses" tab doesn't exist, try the default Sheet1
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
