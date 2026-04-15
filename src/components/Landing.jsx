import React, { useState } from "react";
import { motion } from "framer-motion";
import { ContainerScroll } from "./UI/ContainerScroll";
import LiquidButton from "./UI/LiquidButton";
import Modal from "./UI/Modal";
import Login from "./Auth/Login";
import "../styles/landing.css";

const mockAssignments = [
  {
    id: 1,
    subject: "Marketing",
    title: "Brand Strategy Report",
    deadline: "Tomorrow, 11:59 PM",
    urgency: "critical",
    status: "Pending",
    description: "Comprehensive brand strategy for a D2C startup including GTM plan.",
  },
  {
    id: 2,
    subject: "Finance",
    title: "DCF Valuation Model",
    deadline: "3 days left",
    urgency: "urgent",
    status: "Pending",
    description: "Build a Discounted Cash Flow model for the given company case study.",
  },
  {
    id: 3,
    subject: "Operations",
    title: "Supply Chain Case Study",
    deadline: "Next week",
    urgency: "normal",
    status: "Completed",
    description: "Analyze the supply chain bottlenecks and propose solutions for FMCG sector.",
  },
  {
    id: 4,
    subject: "HRM",
    title: "Performance Appraisal Design",
    deadline: "2 weeks",
    urgency: "normal",
    status: "Pending",
    description: "Design a 360-degree performance appraisal framework for a tech company.",
  },
  {
    id: 5,
    subject: "Strategy",
    title: "Porter's Five Forces",
    deadline: "4 days left",
    urgency: "urgent",
    status: "Pending",
    description: "Strategic analysis using Porter's framework for an e-commerce company.",
  },
  {
    id: 6,
    subject: "Economics",
    title: "Market Equilibrium Analysis",
    deadline: "1 week",
    urgency: "normal",
    status: "Completed",
    description: "Analyze price elasticity and market equilibrium for the healthcare sector.",
  },
];

const subjectColors = {
  Marketing: "#f59e0b",
  Finance: "#10b981",
  Operations: "#3b82f6",
  HRM: "#8b5cf6",
  Strategy: "#ef4444",
  Economics: "#06b6d4",
};

const urgencyColors = {
  critical: "#ef4444",
  urgent: "#f59e0b",
  normal: "#10b981",
};

const features = [
  {
    icon: "📅",
    title: "Track Every Deadline",
    desc: "Color-coded urgency indicators so you always know what's due next.",
  },
  {
    icon: "📄",
    title: "Export to PDF",
    desc: "Download a clean PDF of all assignments to share or print.",
  },
  {
    icon: "🔄",
    title: "Real-time Sync",
    desc: "All updates from your CR appear instantly across every student's screen.",
  },
  {
    icon: "🔐",
    title: "Role-based Access",
    desc: "CRs manage assignments. Students track progress. Each role has its own view.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing">
      {/* Ambient background orbs */}
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />
      <div className="landing-orb landing-orb-3" />

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          
          <span className="landing-nav-name">Assignment Tracker</span>
          <span className="header-subtitle">MBA BA Dashboard</span>
        </div>
        <LiquidButton size="sm" onClick={() => setShowLogin(true)}>
          🔐 Sign In
        </LiquidButton>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <motion.div
          className="landing-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="landing-badge" variants={itemVariants}>
            🎓 Woxsen University · MBA Dashboard
          </motion.div>

          <motion.h1 className="landing-title" variants={itemVariants}>
            Never Miss a<br />
            <span className="landing-title-gradient">Deadline Again</span>
          </motion.h1>

          <motion.p className="landing-subtitle" variants={itemVariants}>
            Your class's complete assignment hub — track due dates, download
            PDFs, and stay ahead of every submission.
          </motion.p>

          <motion.div className="landing-actions" variants={itemVariants}>
            <LiquidButton size="lg" onClick={() => setShowLogin(true)}>
              Get Started →
            </LiquidButton>
          </motion.div>

          <motion.div className="landing-pills" variants={itemVariants}>
            <span className="landing-pill">📅 Deadlines</span>
            <span className="landing-pill">📤 PDF Export</span>
            <span className="landing-pill">🔔 Live updates</span>
            <span className="landing-pill">🛡️ CR managed</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Container Scroll with Mock Dashboard ── */}
      <section className="landing-scroll-section">
        <ContainerScroll
          titleComponent={
            <div className="cscroll-title-content">
              <p className="cscroll-eyebrow">Your assignments, organized</p>
              <h2 className="cscroll-heading">
                Everything in one place,
                <br />
                <span className="cscroll-heading-gradient">beautifully</span>
              </h2>
            </div>
          }
        >
          {/* Mock dashboard preview */}
          <div className="mock-dashboard">
            <div className="mock-topbar">
              <div className="mock-topbar-left">
                <span className="mock-topbar-dot red" />
                <span className="mock-topbar-dot yellow" />
                <span className="mock-topbar-dot green" />
                <span className="mock-topbar-title">👨‍🎓 Student View</span>
              </div>
              <div className="mock-topbar-right">
                <span className="mock-stat-chip">📊 6 Total</span>
              </div>
            </div>
            <div className="mock-grid">
              {mockAssignments.map((a) => (
                <div key={a.id} className={`mock-card mock-card-${a.urgency}`}>
                  <div className="mock-card-top">
                    <span
                      className="mock-subject"
                      style={{ background: `${subjectColors[a.subject]}22`, color: subjectColors[a.subject] }}
                    >
                      {a.subject}
                    </span>
                    <span
                      className="mock-urgency"
                      style={{ color: urgencyColors[a.urgency] }}
                    >
                      {a.urgency === "critical" ? "🔴 Due soon" : a.urgency === "urgent" ? "🟡 Upcoming" : "🟢 On track"}
                    </span>
                  </div>
                  <p className="mock-card-title">{a.title}</p>
                  <p className="mock-card-desc">{a.description}</p>
                  <div className="mock-card-footer">
                    <span className="mock-deadline">📅 {a.deadline}</span>
                    <span className={`mock-status mock-status-${a.status.toLowerCase()}`}>
                      {a.status === "Pending" ? "⏳ Pending" : "✅ Done"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <motion.div
          className="landing-features-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.p className="features-eyebrow" variants={itemVariants}>
            Why students love it
          </motion.p>
          <motion.h2 className="features-heading" variants={itemVariants}>
            Built for your MBA class
          </motion.h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card" variants={itemVariants}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="landing-cta-inner"
        >
          <h2 className="landing-cta-heading">Ready to stay ahead?</h2>
          <p className="landing-cta-sub">
            Sign in with your Woxsen email and get organized today.
          </p>
          <LiquidButton size="lg" onClick={() => setShowLogin(true)}>
            🚀 Get Started
          </LiquidButton>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>Made MBA BA | Batch of 2027 | © {new Date().getFullYear()} Assignment Tracker</p>
      </footer>

      {/* ── Login Modal ── */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title={null}>
        <Login onClose={() => setShowLogin(false)} />
      </Modal>
    </div>
  );
};

export default Landing;
