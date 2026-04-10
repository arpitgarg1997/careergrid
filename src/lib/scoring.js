import { DOUBLE_WEIGHT_QUESTIONS } from "./questions";

/**
 * Compute cluster scores from quiz answers.
 * answers: { q1: "A", q2: "C", ... q15: "B" }
 * Returns: { scores: { A: 3, B: 5, ... }, top3: ["B", "A", "D"], summary: "..." }
 */
export function computeScores(answers) {
  const scores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };

  for (let i = 0; i < 15; i++) {
    const key = `q${i + 1}`;
    const answer = answers[key];
    if (!answer || !scores.hasOwnProperty(answer)) continue;

    // Base score
    scores[answer] += 1;

    // Double-weight bonus for Q1 (i=0), Q6 (i=5), Q12 (i=11)
    if (DOUBLE_WEIGHT_QUESTIONS.includes(i)) {
      scores[answer] += 1;
    }
  }

  // Extract top 3
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);

  return {
    scores,
    top3: sorted,
  };
}
