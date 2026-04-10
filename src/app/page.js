"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CLUSTERS } from "@/lib/questions";

/* ─────────────── Navbar ─────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo-full.svg" alt="CareerGrid" width={140} height={35} priority />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-primary-500 transition">How It Works</a>
          <a href="#clusters" className="hover:text-primary-500 transition">Career Clusters</a>
          <a href="#parents" className="hover:text-primary-500 transition">For Parents</a>
          <a href="#faq" className="hover:text-primary-500 transition">FAQ</a>
          <Link
            href="/quiz"
            className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Start Free Quiz
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-3">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block py-2 text-gray-600">How It Works</a>
          <a href="#clusters" onClick={() => setOpen(false)} className="block py-2 text-gray-600">Career Clusters</a>
          <a href="#parents" onClick={() => setOpen(false)} className="block py-2 text-gray-600">For Parents</a>
          <a href="#faq" onClick={() => setOpen(false)} className="block py-2 text-gray-600">FAQ</a>
          <Link href="/quiz" className="block bg-accent-500 text-white text-center py-3 rounded-lg font-semibold">
            Start Free Quiz
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Hero ─────────────── */
function Hero() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="inline-block bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          Trusted by 1,000+ students across India
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Confused About Which <br className="hidden md:block" />
          <span className="text-accent-300">Stream to Choose</span> After 10th?
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Take India&apos;s most structured career guidance quiz. Discover your top 3 career
          clusters in under 5 minutes &mdash; completely free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quiz"
            className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all animate-pulse-slow"
          >
            Start Free Career Quiz &rarr;
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent("Hi, I want to learn about CareerGrid.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Chat on WhatsApp
          </a>
        </div>
        <p className="mt-6 text-sm text-blue-200">No sign-up required. Takes under 5 minutes.</p>
      </div>
    </section>
  );
}

/* ─────────────── Problem ─────────────── */
function Problem() {
  const problems = [
    {
      icon: "😵",
      title: "Overwhelming Confusion",
      desc: "30+ million students face stream selection every year with little structured guidance. Most rely on what relatives or neighbours suggest.",
    },
    {
      icon: "😰",
      title: "Pressure to Decide Early",
      desc: "Class 10 results come and you have weeks to choose between Science, Commerce, or Arts. One decision that shapes the next 5-7 years.",
    },
    {
      icon: "💸",
      title: "Costly Mistakes",
      desc: "Wrong stream choices lead to course switches, drop years, and lakhs wasted. Fixing a bad decision costs 10x more than preventing it.",
    },
  ];
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-500 mb-4">
            The Stream Selection Problem in India
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Every year, millions of students make a career-defining choice with almost no structured support.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{p.title}</h3>
              <p className="text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */
function HowItWorks() {
  const steps = [
    { num: "1", icon: "📝", title: "Take the Quiz", desc: "Answer 15 carefully designed questions that map your interests, aptitudes, and aspirations to 9 career clusters." },
    { num: "2", icon: "🎯", title: "Discover Your Clusters", desc: "Our weighted scoring engine identifies your top 3 career clusters and shows you where your strengths truly lie." },
    { num: "3", icon: "🚀", title: "Get Direction", desc: "Receive stream recommendations, career paths, and next-step guidance tailored to your unique profile." },
  ];
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-500 mb-4">How CareerGrid Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Three simple steps to career clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                {s.icon}
              </div>
              <div className="inline-block bg-primary-50 text-primary-500 text-sm font-bold px-3 py-1 rounded-full mb-3">
                Step {s.num}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block text-3xl text-gray-300 mt-4">&rarr;</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Career Clusters ─────────────── */
function CareerClusters() {
  const clusterList = Object.entries(CLUSTERS);
  return (
    <section id="clusters" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-500 mb-4">9 Career Clusters</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Every career path in India maps to one of these clusters. The quiz identifies which ones align with you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusterList.map(([key, cluster]) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 hover:border-accent-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{cluster.icon}</span>
                <h3 className="text-lg font-bold text-gray-800">{cluster.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Streams: {cluster.streams.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Parents ─────────────── */
function Parents() {
  const benefits = [
    {
      icon: "🧭",
      title: "Structured Guidance",
      desc: "No more guessing. CareerGrid uses a research-backed 15-question assessment with weighted scoring to identify your child's true career alignment.",
    },
    {
      icon: "🧘",
      title: "Reduced Confusion",
      desc: "Instead of 100 options, your child sees their top 3 clusters with clear stream recommendations. Decision-making becomes focused and confident.",
    },
    {
      icon: "✅",
      title: "Better Decisions, Less Regret",
      desc: "Early, structured direction prevents costly course switches and drop years. Invest 5 minutes now to save years of misdirection later.",
    },
  ];
  return (
    <section id="parents" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-500 mb-4">For Parents</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            You want the best for your child. Here&apos;s how CareerGrid helps you guide them with confidence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-bold text-primary-500 mb-3">{b.title}</h3>
              <p className="text-gray-700 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-800 pr-4">{q}</span>
        <span className={`text-2xl text-gray-400 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{a}</div>
      )}
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is this quiz really free?", a: "Yes, 100% free. No hidden charges, no payment required. We believe every student deserves access to structured career guidance." },
    { q: "How accurate is the career quiz?", a: "The quiz uses a weighted scoring engine across 15 carefully designed questions that map to 9 research-backed career clusters. While no quiz replaces deep counselling, it provides a structured starting point that most students and parents find highly relevant." },
    { q: "What classes is this quiz designed for?", a: "CareerGrid is designed for students in Class 9, 10, 11, and 12. It's especially useful for Class 9-10 students who are about to choose their stream." },
    { q: "What happens after I take the quiz?", a: "You'll immediately see your top 3 career clusters with stream recommendations. You can also connect with us on WhatsApp for personalised follow-up guidance." },
    { q: "Is my data safe?", a: "Absolutely. We collect only your name, email, WhatsApp number, and quiz responses. This data is used solely for providing career guidance and is never shared with third parties." },
    { q: "Can parents take the quiz on behalf of their child?", a: "We recommend the student takes the quiz themselves for the most accurate results, as the questions are about personal preferences and aptitudes. Parents are welcome to sit alongside and discuss the options together." },
    { q: "How is this different from other career tests?", a: "Most career tests give you a personality type and stop there. CareerGrid maps your responses to India-specific career clusters, recommends streams (Science, Commerce, Arts), and provides actionable next steps. Our scoring engine also uses weighted questions for higher accuracy." },
  ];
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-500 mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Bottom CTA ─────────────── */
function BottomCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Find Your Career Direction?</h2>
        <p className="text-lg text-blue-100 mb-8">
          Join thousands of students who discovered their best-fit career clusters with CareerGrid. It takes under 5 minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quiz"
            className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition"
          >
            Start Free Career Quiz &rarr;
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent("Hi, I want to learn about CareerGrid.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */
function Footer() {
  return (
    <footer className="bg-primary-800 text-blue-200 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/logo-dark.svg" alt="CareerGrid" width={130} height={33} />
        <p className="text-sm text-blue-300 text-center">
          India&apos;s structured career guidance platform for Class 9&ndash;12 students.
        </p>
        <p className="text-sm text-blue-400">&copy; {new Date().getFullYear()} CareerGrid. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <CareerClusters />
      <Parents />
      <FAQ />
      <BottomCTA />
      <Footer />
    </main>
  );
}
