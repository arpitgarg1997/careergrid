"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useRef } from "react";
import { CLUSTERS, CLUSTER_DESCRIPTIONS } from "@/lib/questions";

// Lightweight confetti burst — no npm dependency needed
function fireConfetti(canvasRef) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];
  const pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 - 100,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      opacity: 1,
    });
  }

  let frame = 0;
  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vx *= 0.99;

      if (frame > 60) p.opacity -= 0.015;
      if (p.opacity <= 0) return;

      alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (alive && frame < 200) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function ResultContent() {
  const params = useSearchParams();
  const canvasRef = useRef(null);
  const name = params.get("name") || "Student";
  const top1 = params.get("top1");
  const top2 = params.get("top2");
  const top3 = params.get("top3");

  useEffect(() => {
    if (top1 && top2 && top3) {
      // Small delay so the page renders first, then confetti pops
      const timer = setTimeout(() => fireConfetti(canvasRef), 400);
      return () => clearTimeout(timer);
    }
  }, [top1, top2, top3]);

  if (!top1 || !top2 || !top3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No results found</h1>
          <p className="text-gray-500 mb-6">Please take the quiz first to see your career direction.</p>
          <Link href="/quiz" className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-bold transition">
            Take the Quiz &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const topClusters = [top1, top2, top3].map((key) => ({
    key,
    ...CLUSTERS[key],
    description: CLUSTER_DESCRIPTIONS[key],
  }));

  const whatsappMsg = encodeURIComponent(
    `Hi, I completed the CareerGrid quiz. My top career cluster is ${CLUSTERS[top1]?.name}. I'd like personalised guidance.`
  );
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  const badges = ["Your Strongest Match", "Strong Alignment", "Notable Fit"];
  const badgeColors = [
    "bg-accent-500 text-white",
    "bg-primary-500 text-white",
    "bg-gray-700 text-white",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative">
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100vw", height: "100vh" }}
      />
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <Link href="/">
          <Image src="/logo-dark.svg" alt="CareerGrid" width={140} height={35} priority />
        </Link>
      </div>

      {/* Result Card */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Summary header */}
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-6 md:px-10 py-8 text-white">
            <p className="text-accent-100 text-sm font-medium mb-2">Your Career Direction Report</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Great news, {name}!
            </h1>
            <p className="text-lg text-accent-50 leading-relaxed">
              Your strongest alignment is <strong>{CLUSTERS[top1]?.name}</strong>, followed
              by <strong>{CLUSTERS[top2]?.name}</strong> and <strong>{CLUSTERS[top3]?.name}</strong>.
            </p>
          </div>

          {/* Cluster cards */}
          <div className="px-6 md:px-10 py-8 space-y-6">
            {topClusters.map((cluster, i) => (
              <div
                key={cluster.key}
                className={`rounded-xl border-2 p-6 transition ${
                  i === 0 ? "border-accent-300 bg-accent-50/50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cluster.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{cluster.name}</h3>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-1 ${badgeColors[i]}`}>
                        #{i + 1} &mdash; {badges[i]}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{cluster.description}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Recommended Streams & Paths:</p>
                  <p className="text-sm text-gray-600">{cluster.streams.join("  |  ")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="px-6 md:px-10 pb-10">
            <div className="bg-primary-50 rounded-xl p-6 md:p-8 text-center border border-primary-100">
              <h3 className="text-xl font-bold text-primary-500 mb-2">Want Personalised Guidance?</h3>
              <p className="text-gray-600 mb-6">
                Connect with us on WhatsApp for detailed career roadmaps, stream selection advice, and next-step planning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${waNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Get Guidance on WhatsApp
                </a>
                <Link
                  href="/quiz"
                  className="w-full sm:w-auto border-2 border-primary-200 text-primary-500 px-8 py-4 rounded-xl font-semibold transition hover:bg-primary-50"
                >
                  Retake Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Share hint */}
        <p className="text-center text-blue-200 text-sm mt-6">
          Share your results with friends and help them discover their career direction too!
        </p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-500 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading your results...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
