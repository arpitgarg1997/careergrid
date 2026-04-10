"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { questions } from "@/lib/questions";

const TOTAL_STEPS = 1 + questions.length; // 1 info step + 15 question steps

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = info, 1-15 = questions
  const [info, setInfo] = useState({ name: "", email: "", whatsapp: "", class: "" });
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const progress = ((step) / TOTAL_STEPS) * 100;

  // ── Validation ──
  function validateInfo() {
    const errs = {};
    if (!info.name.trim()) errs.name = "Please enter your name";
    if (!info.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))
      errs.email = "Please enter a valid email address";
    if (!info.whatsapp.trim() || !/^[6-9]\d{9}$/.test(info.whatsapp))
      errs.whatsapp = "Please enter a valid 10-digit Indian mobile number";
    if (!info.class) errs.class = "Please select your class";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleInfoNext() {
    if (validateInfo()) setStep(1);
  }

  function handleAnswer(questionIndex, key) {
    const qKey = `q${questionIndex + 1}`;
    setAnswers((prev) => ({ ...prev, [qKey]: key }));
    // Auto-advance after a short delay
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setStep(questionIndex + 2); // +2 because step 0 is info
      }
    }, 300);
  }

  async function handleSubmit() {
    // Check all questions answered
    const unanswered = questions.filter((_, i) => !answers[`q${i + 1}`]);
    if (unanswered.length > 0) {
      setSubmitError(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: info.name.trim(),
      email: info.email.trim(),
      whatsapp: info.whatsapp.trim(),
      class: info.class,
      answers,
    };

    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();

      // Store result in sessionStorage for the result page
      if (typeof window !== "undefined") {
        window.__careergrid_result = data;
      }

      // Navigate to result page with data in URL
      const params = new URLSearchParams({
        name: info.name.trim(),
        top1: data.top3[0],
        top2: data.top3[1],
        top3: data.top3[2],
      });
      router.push(`/result?${params.toString()}`);
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ── Info Step ──
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
          <Link href="/" className="inline-block mb-2">
            <Image src="/logo-full.svg" alt="CareerGrid" width={170} height={43} priority />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Career Discovery Quiz</h1>
          <p className="text-gray-500 mb-8">Let&apos;s start with a few details about you.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300"} focus:border-accent-500 focus:ring-2 focus:ring-accent-200 outline-none transition`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300"} focus:border-accent-500 focus:ring-2 focus:ring-accent-200 outline-none transition`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={info.whatsapp}
                  onChange={(e) => setInfo({ ...info, whatsapp: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-r-lg border ${errors.whatsapp ? "border-red-400 bg-red-50" : "border-gray-300"} focus:border-accent-500 focus:ring-2 focus:ring-accent-200 outline-none transition`}
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Class</label>
              <div className="grid grid-cols-4 gap-3">
                {["9", "10", "11", "12"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setInfo({ ...info, class: c })}
                    className={`py-3 rounded-lg border-2 font-semibold transition ${
                      info.class === c
                        ? "border-accent-500 bg-accent-50 text-accent-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Class {c}
                  </button>
                ))}
              </div>
              {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class}</p>}
            </div>
          </div>

          <button
            onClick={handleInfoNext}
            className="w-full mt-8 bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl"
          >
            Start Quiz &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ── Question Steps ──
  const questionIndex = step - 1;
  const currentQuestion = questions[questionIndex];
  const currentAnswer = answers[`q${questionIndex + 1}`];
  const isLastQuestion = questionIndex === questions.length - 1;
  const allAnswered = questions.every((_, i) => answers[`q${i + 1}`]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="h-full bg-accent-500 progress-bar-fill rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Image src="/logo-full.svg" alt="CareerGrid" width={160} height={40} />
            </Link>
            <span className="text-sm font-medium text-gray-500">
              Question {questionIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-snug">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleAnswer(questionIndex, opt.key)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  currentAnswer === opt.key
                    ? "border-accent-500 bg-accent-50 text-accent-800 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 ${
                  currentAnswer === opt.key
                    ? "bg-accent-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {opt.key}
                </span>
                <span className="font-medium">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="text-gray-500 hover:text-gray-700 font-medium transition flex items-center gap-1"
            >
              &larr; Back
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition ${
                  allAnswered && !submitting
                    ? "bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  "See My Results"
                )}
              </button>
            ) : (
              currentAnswer && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Next &rarr;
                </button>
              )
            )}
          </div>

          {submitError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          {/* Question dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i + 1)}
                className={`w-3 h-3 rounded-full transition ${
                  i === questionIndex
                    ? "bg-accent-500 scale-125"
                    : answers[`q${i + 1}`]
                    ? "bg-accent-300"
                    : "bg-gray-200"
                }`}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
