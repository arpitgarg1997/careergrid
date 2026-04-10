import { google } from "googleapis";

function getAuth() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendQuizResponse(data) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const row = [
    timestamp,
    data.name,
    data.email,
    data.whatsapp,
    data.class,
    ...Array.from({ length: 15 }, (_, i) => data.answers[`q${i + 1}`] || ""),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Responses!A:T",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
