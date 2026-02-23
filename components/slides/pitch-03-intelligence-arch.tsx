"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui";

/* ── Data ────────────────────────────────────────────────────────────── */

const LAYERS = [
  { name: "Raw Materials", nodes: 15, w: 100 },
  { name: "Semi Equipment", nodes: 9, w: 96 },
  { name: "Chip Design", nodes: 8, w: 90 },
  { name: "Passives & PCBs", nodes: 4, w: 62 },
  { name: "Systems & Storage", nodes: 3, w: 56 },
  { name: "DC Infrastructure", nodes: 13, w: 98 },
  { name: "Power & Grid", nodes: 9, w: 92 },
  { name: "Fiber & Networking", nodes: 8, w: 84 },
  { name: "Software & Compute", nodes: 5, w: 70 },
  { name: "Model Development", nodes: 3, w: 50 },
  { name: "AI Applications", nodes: 4, w: 64 },
  { name: "Edge & End-User", nodes: 2, w: 38 },
];

const SKILLS = [
  "DCF Models", "Stock Screener", "Risk Analysis", "Moat Analysis",
  "Value-Chain Map", "Quant Factors", "Equity Research", "Trend Analysis",
];

/* ── Particle stream connector ───────────────────────────────────────── */

function ParticleStream({ delay = 0, direction = "up" }: { delay?: number; direction?: "up" | "down" }) {
  const [yFrom, yTo] = direction === "down" ? [-24, 24] : [24, -24];
  return (
    <div className="ia-stream">
      <div className="ia-stream-lane">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="ia-dot"
            animate={{
              y: [yFrom, yTo],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: delay + i * 0.36,
              ease: "linear",
            }}
          />
        ))}
      </div>
      <div className="ia-stream-lane ia-stream-lane--offset">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="ia-dot ia-dot--dim"
            animate={{
              y: [yFrom, yTo],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: delay + 0.2 + i * 0.45,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Canvas: scrolling node grid behind Agent ─────────────────────────── */

function NodeGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = (ts: number) => {
      setOffset((ts / 60) % 200);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="ia-node-grid" ref={ref} aria-hidden>
      <div
        className="ia-node-grid-inner"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className={`ia-node-cell ${i % 7 === 0 ? "ia-node-cell--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main slide ──────────────────────────────────────────────────────── */

export function PitchSlide03IntelArch() {
  useEffect(() => {
    console.log("🎯 Slide 3 (Intelligence Architecture) mounted");
    return () => console.log("🎯 Slide 3 unmounted");
  }, []);

  return (
    <>
      <SectionHeader
        sectionLabel="HOW WE INVEST"
        title="Purpose-built AI architecture for systematic investment research and value investing"
        subtitle="Systematic coverage, per-company analysis, and continuous thesis validation"
      />

      <div className="ia-arch">
        {/* ═══ MAP (top, foundation) ═══ */}
        <motion.div
          className="ia-map"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0 }}
        >
          <div className="ia-map-head">
            <div className="ia-map-title-row">
              <span className="ia-map-title">The Map</span>
              <span className="ia-map-counts">
                12 Layers &middot; 85 Nodes &middot; 990 Companies
              </span>
            </div>
            <p className="ia-map-definition">
              990 companies tracked across 12 layers. An always-on agent surfaces material shifts, new entrants, and consolidation as the AI supply chain evolves.
            </p>
          </div>
          <div className="ia-rack">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.name}
                className="ia-rack-row"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.15 + i * 0.04,
                }}
                style={{ transformOrigin: "left" }}
              >
                <span className="ia-rack-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="ia-rack-name">{layer.name}</span>
                <div className="ia-rack-bar-wrap">
                  <motion.div
                    className={`ia-rack-bar ${i % 2 === 0 ? "ia-rack-bar--g" : "ia-rack-bar--b"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${layer.w}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                      damping: 16,
                      delay: 0.25 + i * 0.04,
                    }}
                  />
                </div>
                <span className="ia-rack-nodes">{layer.nodes}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ParticleStream delay={0.1} direction="down" />

        {/* ═══ AGENT (middle, the core) ═══ */}
        <motion.div
          className="ia-agent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.18 }}
        >
          <NodeGrid />
          <div className="ia-agent-content">
            <div className="ia-agent-head">
              <div className="ia-agent-name-row">
                <span className="ia-pulse-ring" />
                <span className="ia-agent-name">The Agent</span>
                <span className="ia-agent-badge">ALWAYS ON</span>
              </div>
              <p className="ia-agent-sub">
                Per-company and aggregate analysis engine. Maintains living DCF models, updates on earnings and material events, and stores persistent research memory.
              </p>
            </div>
            <div className="ia-agent-grid">
              <div className="ia-agent-col">
                <span className="ia-agent-col-label">Research Skills</span>
                <div className="ia-skill-tags">
                  {SKILLS.map((s, i) => (
                    <motion.span
                      key={s}
                      className="ia-skill-tag"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.04, duration: 0.25 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="ia-agent-col ia-agent-col--stats">
                <div className="ia-agent-metric">
                  <span className="ia-agent-metric-num">50+</span>
                  <span className="ia-agent-metric-label">MCP Tools</span>
                </div>
                <div className="ia-agent-metric">
                  <span className="ia-agent-metric-num">990</span>
                  <span className="ia-agent-metric-label">Tickers Analyzed</span>
                </div>
                <div className="ia-agent-metric">
                  <span className="ia-agent-metric-num">.md</span>
                  <span className="ia-agent-metric-label">Memory Per Company</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <ParticleStream delay={0.4} direction="down" />

        {/* ═══ FRAMEWORK (bottom, output) ═══ */}
        <motion.div
          className="ia-frame"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.35 }}
        >
          <div className="ia-frame-label">
            <span className="ia-frame-icon">◇</span>
            The Framework
          </div>
          <div className="ia-frame-labels">
            <span className="ia-frame-label-item">Macro Trends</span>
            <span className="ia-frame-label-item">Hypotheses</span>
            <span className="ia-frame-label-item">KPIs Tracked</span>
            <span className="ia-frame-label-item">Validation Checks</span>
          </div>
          <p className="ia-frame-detail">
            Curated macro hypotheses validated against aggregate KPIs and live feeds. A dedicated agent monitors broad trends and flags when conditions shift.
          </p>
        </motion.div>
      </div>
    </>
  );
}
