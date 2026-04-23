import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  GraduationCap,
  ShoppingBag,
  Users,
  MessageCircle,
  Map,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Marketplace",
      desc: "Buy & sell textbooks, gadgets, and essentials with students you trust."
    },
    {
      icon: Users,
      title: "Study Groups",
      desc: "Find classmates, plan sessions, and study smarter together.",
    },
    {
      icon: MessageCircle,
      title: "Instant Chat",
      desc: "Message classmates and sellers in real time.",
    },
    {
      icon: Map,
      title: "Campus Maps",
      desc: "Navigate buildings, food spots, and facilities effortlessly.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Study Groups" },
    { number: "2K+", label: "Items Sold" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-black flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Campus Hub</span>
        </div>
        <Link to="/auth" className="text-sm font-medium hover:underline">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section className="relative px-6 py-28 text-center max-w-6xl mx-auto">
        {/* Ambient blobs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-black/10 blur-3xl rounded-full" />
        <div className="absolute top-32 right-0 w-72 h-72 bg-black/5 blur-2xl rounded-full" />

        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm mb-10 shadow">
            <Star className="w-4 h-4" />
            <span>Trusted by students across campus</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Campus life,
            <br />
            <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
              actually organized.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-14 max-w-2xl mx-auto">
            Buy, sell, study, chat, and navigate — all your campus needs,
            finally in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-black text-white px-9 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-[12px_12px_0_0_#000]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button className="px-9 py-4 border-2 border-black rounded-xl font-semibold text-lg hover:bg-black hover:text-white transition">
              Watch Demo
            </button>
          </div>
        </Motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20 bg-black text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {stats.map((stat, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">
              Built for real student life
            </h2>
            <p className="text-xl text-gray-600">
              Not another portal. A campus companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <Motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`rounded-3xl p-8 border bg-white`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      feature.highlight
                        ? "bg-white text-black"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      feature.highlight
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {feature.desc}
                  </p>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 bg-gradient-to-r from-black to-gray-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Join your campus ecosystem
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Free forever. No spam. No clutter.
          </p>

          <div className="flex items-center justify-center gap-8 mb-10">
            {["Free to use", "No credit card", "Instant signup"].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-white text-black px-9 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Start Using Campus Hub
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t text-center text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-6 w-6 rounded bg-black flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Campus Hub</span>
        </div>
        <p className="text-sm">
          © 2026 Campus Hub — built by students, for students.
        </p>
      </footer>
    </div>
  );
}
