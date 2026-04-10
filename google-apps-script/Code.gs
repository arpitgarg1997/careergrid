/**
 * CareerGrid — Auto Email Quiz Results
 *
 * HOW TO SET UP:
 * 1. Open your CareerGrid Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Save
 * 5. Run > setupTrigger (this creates the auto-trigger)
 * 6. Authorize the script when prompted
 *
 * The script will automatically email results whenever a new row is added
 * to the Scoring sheet.
 */

// ── Configuration ──
const CONFIG = {
  scoringSheet: "Scoring",
  responsesSheet: "Responses",
  fromName: "CareerGrid",
  subject: "Your CareerGrid Career Direction Report",
  whatsappNumber: "919876543210", // UPDATE with your WhatsApp number
};

const CLUSTERS = {
  "Analytical": { icon: "💻", fullName: "Analytical & Technology", color: "#3B82F6", streams: "Science (PCM) | BCA | B.Tech CS/IT", description: "You thrive on logic, systems, and building solutions. Careers in software engineering, data science, AI, and product development await." },
  "Healthcare": { icon: "🏥", fullName: "Healthcare & Medical", color: "#EF4444", streams: "Science (PCB) | MBBS | BDS | Nursing", description: "You care deeply about health and healing. Medicine, surgery, pharmacy, physiotherapy, and biomedical research are your path." },
  "Business":   { icon: "📊", fullName: "Business & Finance", color: "#F59E0B", streams: "Commerce | BBA | B.Com | CA", description: "You think in terms of growth, opportunity, and value creation. Finance, entrepreneurship, consulting, and management are natural fits." },
  "Creative":   { icon: "🎨", fullName: "Creative & Design", color: "#8B5CF6", streams: "Arts / Humanities | B.Des | BFA | Film Studies", description: "You see the world through a creative lens. Design, filmmaking, animation, branding, and creative direction fuel your passion." },
  "Law":        { icon: "⚖️", fullName: "Law & Civil Services", color: "#6366F1", streams: "Arts / Humanities | BA LLB | UPSC Preparation", description: "You value justice, governance, and structured authority. Law, civil services, policy-making, and public administration suit you." },
  "Media":      { icon: "🎙️", fullName: "Communication & Media", color: "#EC4899", streams: "Arts / Humanities | BJMC | Mass Communication", description: "You love being heard and shaping narratives. Journalism, content creation, PR, advertising, and broadcasting match your energy." },
  "Psychology": { icon: "🧠", fullName: "Psychology & Human Behavior", color: "#14B8A6", streams: "Arts / Science | BA/BSc Psychology | Counselling", description: "You read people well and care about emotional wellbeing. Clinical psychology, counselling, HR, and behavioral research are ideal." },
  "Science":    { icon: "🔬", fullName: "Core Sciences & Research", color: "#0EA5E9", streams: "Science (PCM/PCB) | BSc | Research Programs", description: "You question how the world works at a fundamental level. Research science, academia, space science, and advanced R&D call you." },
  "Sports":     { icon: "🏆", fullName: "Sports & Performance", color: "#F97316", streams: "Physical Education | Sports Science | BPEd", description: "You push physical limits and thrive on competition. Professional sports, coaching, sports management, and fitness training are your arena." },
};

/**
 * One-time setup: creates an onEdit trigger to watch for new rows.
 * Run this manually once from the Apps Script editor.
 */
function setupTrigger() {
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));

  // Create onChange trigger (fires on new rows from API)
  ScriptApp.newTrigger("onSheetChange")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onChange()
    .create();

  Logger.log("Trigger created successfully!");
}

/**
 * Triggered on sheet change. Checks for new rows in Scoring sheet
 * that haven't been emailed yet.
 */
function onSheetChange(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const scoring = ss.getSheetByName(CONFIG.scoringSheet);
    const responses = ss.getSheetByName(CONFIG.responsesSheet);

    if (!scoring || !responses) return;

    const lastRow = scoring.getLastRow();
    if (lastRow < 2) return;

    // Check column O (15th column) for "EMAILED" flag
    // We use column O in Scoring sheet as the email-sent flag
    const flagCol = 15; // Column O

    for (let row = 2; row <= lastRow; row++) {
      const flag = scoring.getRange(row, flagCol).getValue();
      if (flag === "EMAILED") continue;

      // Get data from Scoring sheet
      const scoringData = scoring.getRange(row, 1, 1, 14).getValues()[0];
      const name = scoringData[0];
      const top1 = scoringData[10]; // Column K
      const top2 = scoringData[11]; // Column L
      const top3 = scoringData[12]; // Column M
      const summary = scoringData[13]; // Column N

      if (!name || !top1) continue;

      // Get email from Responses sheet (Column C)
      const email = responses.getRange(row, 3).getValue();
      if (!email || !email.toString().includes("@")) continue;

      // Send the email
      const html = buildEmailHTML(name, top1, top2, top3, summary);

      MailApp.sendEmail({
        to: email,
        subject: `${CONFIG.subject} — ${name}`,
        htmlBody: html,
        name: CONFIG.fromName,
      });

      // Mark as emailed
      scoring.getRange(row, flagCol).setValue("EMAILED");

      Logger.log(`Email sent to ${email} for ${name}`);
    }
  } catch (err) {
    Logger.log("Error: " + err.toString());
  }
}

/**
 * Manual function to send emails for all un-emailed rows.
 * Useful for backfilling or testing.
 */
function sendPendingEmails() {
  onSheetChange(null);
}

/**
 * Test function: sends a sample email to yourself.
 */
function testEmail() {
  const html = buildEmailHTML("Test Student", "Analytical", "Business", "Creative", "Your strongest alignment is Analytical & Technology, followed by Business & Finance and Creative & Design.");
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: "CareerGrid Test Email",
    htmlBody: html,
    name: CONFIG.fromName,
  });
  Logger.log("Test email sent to " + Session.getActiveUser().getEmail());
}

/**
 * Builds the beautiful HTML email.
 */
function buildEmailHTML(name, top1Key, top2Key, top3Key, summary) {
  const c1 = CLUSTERS[top1Key] || { icon: "🎯", fullName: top1Key, color: "#10B981", streams: "", description: "" };
  const c2 = CLUSTERS[top2Key] || { icon: "🎯", fullName: top2Key, color: "#3B82F6", streams: "", description: "" };
  const c3 = CLUSTERS[top3Key] || { icon: "🎯", fullName: top3Key, color: "#6B7280", streams: "", description: "" };

  const firstName = name.split(" ")[0];
  const waMsg = encodeURIComponent(`Hi, I completed the CareerGrid quiz. My top career cluster is ${c1.fullName}. I'd like personalised guidance.`);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header with Logo -->
        <tr>
          <td style="background:linear-gradient(135deg,#1E3A5F 0%,#2563EB 100%);padding:28px 40px;text-align:center;">
            <img src="https://careergrid-five.vercel.app/logo-dark.svg" alt="CareerGrid" width="180" height="45" style="display:block;margin:0 auto 8px auto;" />
            <p style="color:#93C5FD;font-size:12px;margin:0;letter-spacing:2px;text-transform:uppercase;">Your Future, Mapped</p>
          </td>
        </tr>

        <!-- Green summary banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#10B981 0%,#059669 100%);padding:28px 40px;">
            <p style="color:#D1FAE5;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">Your Career Direction Report</p>
            <h2 style="color:#ffffff;font-size:24px;margin:0 0 12px 0;font-weight:700;">Great news, ${firstName}!</h2>
            <p style="color:#ECFDF5;font-size:15px;margin:0;line-height:1.6;">
              Your strongest alignment is <strong>${c1.fullName}</strong>, followed by <strong>${c2.fullName}</strong> and <strong>${c3.fullName}</strong>.
            </p>
          </td>
        </tr>

        <!-- Cluster 1 -->
        <tr>
          <td style="padding:28px 40px 0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #D1FAE5;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:24px;background-color:#F0FDF4;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:28px;width:40px;vertical-align:top;">${c1.icon}</td>
                      <td style="padding-left:12px;">
                        <h3 style="margin:0 0 4px 0;font-size:18px;color:#1F2937;">${c1.fullName}</h3>
                        <span style="display:inline-block;background-color:#10B981;color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;">#1 — Your Strongest Match</span>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:16px 0 12px 0;">${c1.description}</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;padding:12px;">
                    <tr><td style="padding:12px;">
                      <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#374151;">Recommended Streams & Paths:</p>
                      <p style="margin:0;font-size:13px;color:#6B7280;">${c1.streams}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cluster 2 -->
        <tr>
          <td style="padding:16px 40px 0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:28px;width:40px;vertical-align:top;">${c2.icon}</td>
                      <td style="padding-left:12px;">
                        <h3 style="margin:0 0 4px 0;font-size:18px;color:#1F2937;">${c2.fullName}</h3>
                        <span style="display:inline-block;background-color:#1E3A5F;color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;">#2 — Strong Alignment</span>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:16px 0 12px 0;">${c2.description}</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border-radius:8px;">
                    <tr><td style="padding:12px;">
                      <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#374151;">Recommended Streams & Paths:</p>
                      <p style="margin:0;font-size:13px;color:#6B7280;">${c2.streams}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cluster 3 -->
        <tr>
          <td style="padding:16px 40px 0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:28px;width:40px;vertical-align:top;">${c3.icon}</td>
                      <td style="padding-left:12px;">
                        <h3 style="margin:0 0 4px 0;font-size:18px;color:#1F2937;">${c3.fullName}</h3>
                        <span style="display:inline-block;background-color:#374151;color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;">#3 — Notable Fit</span>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:16px 0 12px 0;">${c3.description}</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border-radius:8px;">
                    <tr><td style="padding:12px;">
                      <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#374151;">Recommended Streams & Paths:</p>
                      <p style="margin:0;font-size:13px;color:#6B7280;">${c3.streams}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- WhatsApp CTA -->
        <tr>
          <td style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EBF4FF;border-radius:12px;border:1px solid #DBEAFE;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <h3 style="margin:0 0 8px 0;font-size:16px;color:#1E3A5F;">Want Personalised Guidance?</h3>
                  <p style="margin:0 0 16px 0;font-size:14px;color:#6B7280;line-height:1.5;">Connect with us on WhatsApp for detailed career roadmaps and stream selection advice.</p>
                  <a href="https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}" style="display:inline-block;background-color:#25D366;color:#ffffff;font-size:15px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
                    Get Guidance on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer with Logo -->
        <tr>
          <td style="background-color:#1E3A5F;padding:24px 40px;text-align:center;">
            <img src="https://careergrid-five.vercel.app/logo-dark.svg" alt="CareerGrid" width="120" height="30" style="display:block;margin:0 auto 10px auto;" />
            <p style="color:#64748B;font-size:11px;margin:0;">India's structured career guidance platform for Class 9–12 students.</p>
            <p style="color:#475569;font-size:10px;margin:8px 0 0 0;">This email was sent because you completed the CareerGrid career quiz.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}
