import { NextResponse } from "next/server";
import { computeScores } from "@/lib/scoring";
import { appendQuizResponse } from "@/lib/sheets";
import { CLUSTERS } from "@/lib/questions";

// Simple in-memory dedup (clears on cold start — acceptable for MVP)
const recentSubmissions = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, answers } = body;
    const studentClass = body.class;

    // ── Validation ──
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!whatsapp || !/^[6-9]\d{9}$/.test(whatsapp)) {
      return NextResponse.json({ error: "Valid 10-digit mobile number required" }, { status: 400 });
    }
    if (!studentClass || !["9", "10", "11", "12"].includes(studentClass)) {
      return NextResponse.json({ error: "Valid class (9-12) required" }, { status: 400 });
    }
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    // Check all 15 questions answered
    for (let i = 1; i <= 15; i++) {
      const a = answers[`q${i}`];
      if (!a || !"ABCDEFGHI".includes(a)) {
        return NextResponse.json({ error: `Invalid answer for question ${i}` }, { status: 400 });
      }
    }

    // ── Dedup check (10 second window) ──
    const dedupKey = `${email}-${Date.now().toString().slice(0, -4)}`; // ~10s window
    if (recentSubmissions.has(dedupKey)) {
      return NextResponse.json(recentSubmissions.get(dedupKey));
    }

    // ── Compute scores ──
    const { scores, top3 } = computeScores(answers);

    const result = {
      success: true,
      top3,
      clusters: top3.map((key) => ({
        key,
        name: CLUSTERS[key].name,
        icon: CLUSTERS[key].icon,
        streams: CLUSTERS[key].streams,
      })),
      summary: `Your strongest alignment is ${CLUSTERS[top3[0]].name}, followed by ${CLUSTERS[top3[1]].name} and ${CLUSTERS[top3[2]].name}.`,
    };

    // ── Save to Google Sheets (non-blocking for the user) ──
    try {
      await appendQuizResponse({
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        class: studentClass,
        answers,
      });
    } catch (sheetError) {
      // Log full error details for debugging in Vercel logs
      console.error("Google Sheets write failed:", {
        message: sheetError.message,
        code: sheetError.code,
        status: sheetError.status,
        errors: sheetError.errors,
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      });
    }

    // Cache for dedup
    recentSubmissions.set(dedupKey, result);
    // Clean old entries (keep map small)
    if (recentSubmissions.size > 100) {
      const firstKey = recentSubmissions.keys().next().value;
      recentSubmissions.delete(firstKey);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Submit quiz error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
