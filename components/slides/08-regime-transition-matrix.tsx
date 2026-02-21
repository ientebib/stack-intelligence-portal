"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "motion/react";
import { SectionHeader, SourceLine } from "@/components/ui";

function AnimatedNumber({ value, format }: { value: number, format: (n: number) => string }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

/* ── "YOU ARE HERE" — Feb 2026 Reality ──────────────────────────────── */
const TODAY_VELOCITY = 32;

/* ── Observed Data Anchors ────────────────────────────────────────────── */
// ACTUAL = reported in filings/surveys. GUIDED = committed in earnings calls.
// The model formulas are calibrated to pass through these exact data points.
// Everything beyond them is MODEL PROJECTION.

const CAPEX_ACTUALS = [
  { year: "FY24", total: 234, tag: "A" as const }, // AMZN+GOOG+META+MSFT+ORCL+CRWV from 10-Ks
  { year: "FY25", total: 394, tag: "A" as const }, // same six, reported/guided
  { year: "FY26", total: 682, tag: "E" as const }, // guidance midpoints + consensus
];

// Individual 2026 guidance (earnings calls, Q4 2025; midpoints where ranges given)
const CAPEX_GUIDANCE = [
  { ticker: "AMZN", amt: 200 },  // analyst consensus (no formal cap)
  { ticker: "GOOG", amt: 180 },  // $175-185B guidance midpoint
  { ticker: "META", amt: 125 },  // $115-135B guidance midpoint
  { ticker: "MSFT", amt: 100 },  // ~$99B consensus (FY2026 ending Jun)
  { ticker: "ORCL", amt: 50 },   // FY2026E (ending May 2026)
  { ticker: "CRWV", amt: 27 },   // "more than 2x 2025" → ~$27B
];

type DataTag = "ACTUAL" | "GUIDED" | "MODEL";

function getDataTag(metric: string, v: number): DataTag {
  if (v <= TODAY_VELOCITY) return "ACTUAL";
  switch (metric) {
    case "capex": return v <= 55 ? "GUIDED" : "MODEL";
    case "power": return v <= 42 ? "GUIDED" : "MODEL";
    default: return v <= TODAY_VELOCITY + 5 ? "GUIDED" : "MODEL";
  }
}

/* ── Full-Stack Data Engine (Convexity & Regime Change) ──────────────── */

function computeMacro(v: number, mp: boolean) {
  // CapEx: calibrated to v=0→$100B, v=32→$394B, v=55→$682B (from JSON totals)
  const baseCapex = 100 + v * 9.19;
  const exponentialCapex = v > 35 ? Math.pow(v - 35, 1.35) * 1.34 : 0;
  const hyperscalerCapex = baseCapex + exponentialCapex;

  // Enterprise adoption: v=32→35.4% (Gartner 2025: 35% deployed at scale)
  const enterpriseAdoption = 12 + v * 0.73;

  // Inference share: calibrated to v=32→52% (SemiAnalysis/Epoch: 50% 2025, 67% 2026)
  const inferenceShare = Math.min(92, 20 + v * 1.0);

  const laborDisplacement =
    v < 40 ? v * 0.05 : 2 + Math.pow(v - 40, 1.35) * 0.15;

  // Copper deficit (kt): calibrated to v=32→1,600 kt (IEA STEPS scenario)
  let copperDeficit = 500 + v * 34.4;
  if (v > 40) copperDeficit += Math.pow(v - 40, 1.8) * 3.5;
  if (mp) copperDeficit *= 1.4;

  const basePower = 25 + v * 1.15;
  const exponentialPower = v > 35 ? Math.pow(v - 35, 1.25) * 0.18 : 0;
  const dcPowerGW = basePower + exponentialPower;

  return {
    hyperscalerCapex,
    enterpriseAdoption,
    inferenceShare,
    laborDisplacement,
    copperDeficit,
    dcPowerGW
  };
}

function computeAllocation(v: number, mp: boolean) {
  let cash = Math.max(3, 12 - v * 0.09);
  let hedges = 16 - v * 0.06;
  let hyperscalers = 24 + v * 0.3;
  let physical = 30 + v * 0.18;
  let shortBook = v < 50 ? 0 : Math.pow(v - 50, 1.25) * 0.45;

  if (mp) {
    hyperscalers *= 0.55;
    physical *= 1.85;
    hedges *= 1.3;
  }

  const total = cash + hyperscalers + physical + shortBook + hedges;
  return {
    cash: (cash / total) * 100,
    hyperscalers: (hyperscalers / total) * 100,
    physical: (physical / total) * 100,
    shortBook: (shortBook / total) * 100,
    hedges: (hedges / total) * 100
  };
}

type Regime = { key: string; title: string; body: string; warning?: string };

function getRegime(v: number, mp: boolean): Regime {
  let body: string;
  let title: string;
  let key: string;

  if (v < 30) {
    key = "r0";
    title = "REGIME I: COGNITIVE CO-PILOT";
    body =
      "Market prices AI as an incremental productivity tool. Capital expenditures remain within historical envelopes. Enterprise penetration is nascent. Conventional valuation frameworks apply. Physical constraints are localized rather than systemic.";
  } else if (v < 60) {
    key = "r1";
    title = "REGIME II: AUTONOMOUS TRANSITION";
    body =
      "Task execution horizons expand exponentially. Workloads shift from discrete queries to sustained autonomous sessions. Infrastructure capex exceeds $600B annualized. Physical layer chokepoints—semiconductors, energy, cooling—reprice violently. Margin compression accelerates for incumbent software.";
  } else {
    key = "r2";
    title = "REGIME III: STRUCTURAL DISPLACEMENT";
    body =
      "Widespread cognitive substitution structurally erodes the labor-linked tax base. Value transfers decisively from labor to physical capital. Inelastic supply constraints—18-year mine development cycles, 7-year grid interconnection queues—force hard capacity rationing across the economy.";
  }

  const warning = mp
    ? "Geopolitical fracture triggered. With non-aligned actors controlling ~70% of critical mineral refining, redundant infrastructure buildouts compound physical demand. Supply deficits in copper and baseload power accelerate sharply."
    : undefined;

  return { key, title, body, warning };
}

/* ── Formatters ──────────────────────────────────────────────────────── */

function getImpliedDate(v: number) {
  // v=32 is Feb 2026 (Q1 2026). Let's say 1 velocity point = 1.5 months for scaling.
  const monthsFromNow = (v - 32) * 1.5;
  const date = new Date(2026, 1); // Feb 2026
  date.setMonth(date.getMonth() + monthsFromNow);
  const q = Math.floor(date.getMonth() / 3) + 1;
  const y = date.getFullYear().toString().slice(-2);
  return `Q${q} '${y}`;
}

const MARKERS = [
  { pct: 20, label: "CONSENSUS" },
  { pct: TODAY_VELOCITY, label: "FEB 2026", isToday: true },
  { pct: 50, label: "DEPLOYMENT THRESHOLD" },
  { pct: 80, label: "STRUCTURAL SQUEEZE" }
];

function fmtB(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${Math.round(n)}B`;
}
function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}
function fmtKt(n: number) {
  return `${Math.round(n)} kt`;
}
function fmtBDelta(n: number) {
  if (Math.abs(n) < 1) return "—";
  const abs = Math.abs(n);
  const sign = n > 0 ? "+" : "-";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}T`;
  return `${sign}$${Math.round(abs)}B`;
}
function fmtPctDelta(n: number) {
  if (Math.abs(n) < 0.1) return "—";
  return n > 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;
}
function fmtGwDelta(n: number) {
  if (Math.abs(n) < 1) return "—";
  return n > 0 ? `+${Math.round(n)} GW` : `${Math.round(n)} GW`;
}
function fmtKtDelta(n: number) {
  if (Math.abs(n) < 1) return "—";
  return n > 0 ? `+${Math.round(n)} kt` : `${Math.round(n)} kt`;
}

/* ── Portfolio segments ──────────────────────────────────────────────── */

const SEGMENTS = [
  {
    key: "cash",
    label: "CASH & EQUIVALENTS",
    assets: "T-BILLS, SHORT UST, USD",
    color: "#64748B"
  },
  {
    key: "hyperscalers",
    label: "COMPUTE CHOKEPOINT",
    assets: "NVDA, TSMC, ASML, MSFT, AMZN, GOOG",
    color: "#0B5EA8"
  },
  {
    key: "physical",
    label: "PHYSICAL LAYER",
    assets: "CU MINERS, U₃O₈, GRID UTILITIES, COOLING",
    color: "#0D7A3E"
  },
  {
    key: "shortBook",
    label: "THE SHORT BOOK",
    assets: "LEGACY SAAS, IT SERVICES, CONSUMER DISCRETIONARY",
    color: "#C43030"
  },
  {
    key: "hedges",
    label: "SOVEREIGN HEDGES",
    assets: "GOLD, BTC, SILVER, TIPS",
    color: "#8B7355"
  }
] as const;

/* ── Component ───────────────────────────────────────────────────────── */

export function Slide08RegimeTransitionMatrix() {
  const [aiVelocity, setAiVelocity] = useState(TODAY_VELOCITY);
  const [isMultipolar, setIsMultipolar] = useState(false);

  const baselineMacro = useMemo(() => computeMacro(TODAY_VELOCITY, false), []);

  const macro = useMemo(
    () => computeMacro(aiVelocity, isMultipolar),
    [aiVelocity, isMultipolar]
  );
  const alloc = useMemo(
    () => computeAllocation(aiVelocity, isMultipolar),
    [aiVelocity, isMultipolar]
  );
  const regime = useMemo(
    () => getRegime(aiVelocity, isMultipolar),
    [aiVelocity, isMultipolar]
  );

  const toggleMultipolar = useCallback(() => setIsMultipolar((p) => !p), []);

  const regimeIndex = aiVelocity < 30 ? 0 : aiVelocity < 60 ? 1 : 2;

  const gauges = [
    {
      label: "HYPERSCALER CAPEX",
      grade: "A",
      raw: macro.hyperscalerCapex,
      format: fmtB,
      deltaVal: macro.hyperscalerCapex - baselineMacro.hyperscalerCapex,
      deltaFormat: fmtBDelta,
      unit: macro.hyperscalerCapex > 690 ? "EXCEEDS FY26 GUIDANCE" : macro.hyperscalerCapex > 500 ? "RAPID ACCELERATION" : "BIG 6 RUN-RATE",
      pct: Math.min(100, Math.max(0, ((macro.hyperscalerCapex - 100) / (1400 - 100)) * 100)),
      status: macro.hyperscalerCapex > 690 ? "alert" : macro.hyperscalerCapex > 500 ? "warning" : "normal",
      tag: getDataTag("capex", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "10-K filings" : aiVelocity <= 55 ? "Earnings guidance" : null
    },
    {
      label: "ENTERPRISE ADOPTION",
      grade: "B",
      raw: macro.enterpriseAdoption,
      format: fmtPct,
      deltaVal: macro.enterpriseAdoption - baselineMacro.enterpriseAdoption,
      deltaFormat: fmtPctDelta,
      unit: macro.enterpriseAdoption > 70 ? "PENETRATION THRESHOLD" : macro.enterpriseAdoption > 35 ? "SCALED DEPLOYMENT" : "EARLY ADOPTERS",
      pct: Math.min(100, Math.max(0, ((macro.enterpriseAdoption - 12) / (85 - 12)) * 100)),
      status: macro.enterpriseAdoption > 70 ? "alert" : macro.enterpriseAdoption > 35 ? "warning" : "normal",
      tag: getDataTag("adoption", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "Gartner 2025" : null
    },
    {
      label: "INFERENCE SHARE",
      grade: "C",
      raw: macro.inferenceShare,
      format: fmtPct,
      deltaVal: macro.inferenceShare - baselineMacro.inferenceShare,
      deltaFormat: fmtPctDelta,
      unit: macro.inferenceShare > 75 ? "INFERENCE DOMINANCE" : macro.inferenceShare > 50 ? "TRAINING PARITY" : "% OF AI COMPUTE",
      pct: Math.min(100, Math.max(0, ((macro.inferenceShare - 20) / (92 - 20)) * 100)),
      status: macro.inferenceShare > 75 ? "alert" : macro.inferenceShare > 50 ? "warning" : "normal",
      tag: getDataTag("inference", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "SemiAnalysis / Epoch AI" : null
    },
    {
      label: "LABOR & TAX BASE EXPOSURE",
      grade: "A",
      raw: macro.laborDisplacement,
      format: fmtPct,
      deltaVal: macro.laborDisplacement - baselineMacro.laborDisplacement,
      deltaFormat: fmtPctDelta,
      unit: macro.laborDisplacement > 10 ? "STRUCTURAL DISPLACEMENT" : macro.laborDisplacement > 3 ? "MEASURABLE IMPACT" : "KNOWLEDGE SECTOR EXPOSURE",
      pct: Math.min(100, Math.max(0, ((macro.laborDisplacement - 0) / (40 - 0)) * 100)),
      status: macro.laborDisplacement > 10 ? "alert" : macro.laborDisplacement > 3 ? "warning" : "normal",
      tag: getDataTag("labor", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "Yale Budget Lab" : null
    },
    {
      label: "COPPER SUPPLY DEFICIT",
      grade: "B",
      raw: macro.copperDeficit,
      format: fmtKt,
      deltaVal: macro.copperDeficit - baselineMacro.copperDeficit,
      deltaFormat: fmtKtDelta,
      unit: macro.copperDeficit > 3000 ? "STRUCTURAL SHORTFALL" : macro.copperDeficit > 1500 ? "SUPPLY CONSTRAINED" : "IMPLIED DEFICIT",
      pct: Math.min(100, Math.max(0, ((macro.copperDeficit - 0) / (7500 - 0)) * 100)),
      status: macro.copperDeficit > 3000 ? "alert" : macro.copperDeficit > 1500 ? "warning" : "normal",
      tag: getDataTag("copper", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "IEA STEPS scenario" : null
    },
    {
      label: "DATACENTER POWER",
      grade: "A",
      raw: macro.dcPowerGW,
      format: (n: number) => `${Math.round(n)} GW`,
      deltaVal: macro.dcPowerGW - baselineMacro.dcPowerGW,
      deltaFormat: fmtGwDelta,
      unit: macro.dcPowerGW > 100 ? "LOAD CONSTRAINED" : macro.dcPowerGW > 65 ? "GRID TENSION" : "US GRID LOAD",
      pct: Math.min(100, Math.max(0, ((macro.dcPowerGW - 25) / (200 - 25)) * 100)),
      status: macro.dcPowerGW > 100 ? "alert" : macro.dcPowerGW > 65 ? "warning" : "normal",
      tag: getDataTag("power", aiVelocity),
      source: aiVelocity <= TODAY_VELOCITY ? "S&P Global / 451" : aiVelocity <= 42 ? "S&P Global proj." : null
    }
  ];

  return (
    <>
      <SectionHeader
        sectionLabel="SCENARIO ANALYSIS"
        title="The Stack Model: Regime Transition Matrix"
        subtitle="HOW COGNITIVE SUBSTITUTION VELOCITY DRIVES CAPITAL ALLOCATION"
      />

      <div
        className={`regime-dashboard ${isMultipolar ? "regime-dashboard--multipolar" : ""}`}
      >
        <div className="regime-dashboard-inner">
          {/* ── ZONE A: Master Controls ── */}
          <div className="regime-controls">
            <div className="regime-slider-section">
              <div className="regime-slider-header">
                <span className="regime-slider-title">
                  Cognitive Substitution Velocity
                </span>
                <div className="regime-velocity-readout">
                  <span
                    className="regime-velocity-value"
                    data-regime={regimeIndex}
                  >
                    <AnimatedNumber value={aiVelocity} format={(n) => Math.round(n).toString()} />
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-muted)" }}>
                    / 100
                  </span>
                </div>
              </div>

              <div className="regime-slider-wrap">
                <div className="regime-slider-track-bg" />

                {/* Slider Tooltip */}
                <div style={{
                  position: "absolute",
                  left: `calc(${aiVelocity}% - 30px)`,
                  top: "-18px",
                  width: "60px",
                  display: "flex",
                  justifyContent: "center",
                  pointerEvents: "none",
                  zIndex: 10
                }}>
                  <div style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "8px",
                    color: "var(--bg)",
                    background: "var(--text-primary)",
                    padding: "2px 4px",
                    borderRadius: "2px",
                    letterSpacing: "0.5px"
                  }}>
                    {getImpliedDate(aiVelocity)}
                  </div>
                </div>

                <input
                  type="range"
                  className="regime-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={aiVelocity}
                  onChange={(e) => setAiVelocity(Number(e.target.value))}
                  style={
                    { "--slider-pct": `${aiVelocity}%` } as React.CSSProperties
                  }
                />
                <div className="regime-slider-markers">
                  {MARKERS.map((m) => (
                    <div
                      key={m.pct}
                      className={`regime-marker ${
                        "isToday" in m && m.isToday
                          ? "regime-marker--today"
                          : aiVelocity >= m.pct
                            ? "regime-marker--passed"
                            : ""
                      }`}
                      style={{ left: `${m.pct}%` }}
                    >
                      <div className="regime-marker-tick" />
                      <span className="regime-marker-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="regime-toggle-section">
              <span className="regime-toggle-label">COMPUTE TOPOGRAPHY</span>
              <button
                className={`regime-toggle-btn ${isMultipolar ? "is-fractured" : ""}`}
                onClick={toggleMultipolar}
                type="button"
              >
                <span className={!isMultipolar ? "active" : ""}>CONSOLIDATED</span>
                <span className={isMultipolar ? "active" : ""}>FRACTURED</span>
              </button>
            </div>
          </div>

          <div className="regime-split">
            {/* ── ZONE B: Gauges ── */}
            <div className="regime-gauges">
              {gauges.map((g) => (
                <div
                  key={g.label}
                  className={`regime-gauge ${g.status !== "normal" ? `regime-gauge--${g.status}` : ""}`}
                >
                  <div className="regime-gauge-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="regime-gauge-title">{g.label}</span>
                      <svg width="24" height="12" viewBox="0 0 24 12" style={{ opacity: 0.6, color: "var(--text-tertiary)" }}>
                        <path d="M0,10 L4,9 L8,6 L12,7 L16,4 L24,2" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1,1" />
                        <circle cx="24" cy="2" r="1.5" fill="var(--primary)" />
                      </svg>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px" }}>[GR: {g.grade}]</span>
                      {g.tag && (
                        <span className={`regime-gauge-tag ${g.tag === "ACTUAL" ? "is-actual" : ""}`}>
                          {g.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="regime-gauge-body">
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span className="regime-gauge-value">
                        <AnimatedNumber value={g.raw} format={g.format} />
                      </span>
                      {Math.abs(g.deltaVal) >= 1 && (
                        <span className={`regime-gauge-delta ${g.deltaVal > 0 ? "is-positive" : "is-negative"}`}>
                          <AnimatedNumber value={g.deltaVal} format={g.deltaFormat} />
                        </span>
                      )}
                    </div>
                    <div className="regime-gauge-bar-bg">
                      <div
                        className="regime-gauge-bar-fill"
                        style={{ width: `${g.pct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span className="regime-gauge-source" style={{ opacity: g.source ? 1 : 0 }}>
                      {g.source || "—"}
                    </span>
                    <span className={`regime-gauge-unit-label ${g.status !== "normal" ? `is-${g.status}` : ""}`}>
                      {g.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── ZONE C: Narrative ── */}
            <div className={`regime-narrative regime-narrative--r${regimeIndex}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={regime.key + (isMultipolar ? "-mp" : "")}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  <span className="regime-narrative-eyebrow">DOMINANT THEME</span>
                  <h3 className="regime-narrative-title">{regime.title}</h3>
                  <div className="regime-narrative-body">{regime.body}</div>
                  
                  {regime.warning && (
                    <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px dashed var(--border)" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--caution)", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                        Macro Overlay
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {regime.warning}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── ZONE D: Portfolio ── */}
          <div className="regime-portfolio">
            <div className="regime-portfolio-header">
              <span className="regime-portfolio-title">CAPITAL ALLOCATION MODEL</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Target: 100% Gross</span>
            </div>

            <table className="regime-alloc-table">
              <tbody>
                {SEGMENTS.map((seg) => {
                  const pct = alloc[seg.key as keyof typeof alloc];
                  return (
                    <tr key={seg.key}>
                      <td style={{ width: "35%" }}>
                        <div className="regime-alloc-asset">
                          <div className="regime-alloc-color" style={{ "--asset-color": seg.color } as React.CSSProperties}></div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontSize: "10px", fontWeight: 500, color: "var(--text-primary)" }}>{seg.label}</span>
                            <span style={{ fontSize: "8px", fontFamily: "var(--font-data)", color: "var(--text-muted)" }}>{seg.assets}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "10%" }}>
                        <div className="regime-alloc-pct">{fmtPct(pct)}</div>
                      </td>
                      <td style={{ width: "55%" }}>
                        <div className="regime-alloc-bar-wrap">
                          <div className="regime-alloc-bar-bg">
                            <motion.div
                              className="regime-alloc-segment"
                              style={{ "--asset-color": seg.color } as React.CSSProperties}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(0, pct)}%` }}
                              transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SourceLine
        text="Source: Company 10-K filings, SemiAnalysis, Epoch AI, IEA, S&P Global · Stack Intelligence regime model (February 2026)"
        tight
      />
    </>
  );
}
