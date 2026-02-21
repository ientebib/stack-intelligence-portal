"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NeuralStackLogo } from "@/components/ui/NeuralStackLogo";
import { InteractiveKpiChart } from "@/components/research-dashboard/InteractiveKpiChart";
import { DependencyGraph } from "@/components/research-dashboard/DependencyGraph";
import styles from "@/components/research-dashboard/ResearchDashboardApp.module.css";
import type {
  LiveHypothesis,
  LiveKpi,
  ResearchLivePayload,
  SignalBand,
} from "@/lib/research-dashboard/types";
import {
  Activity,
  LayoutGrid,
  Map as MapIcon,
  Database,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

type TabKey = "live" | "framework" | "map" | "sources";

const TREND_COLORS: Record<string, string> = {
  "T-001": "#0D7A3E", // Green
  "T-002": "#0B5EA8", // Blue
  "T-003": "#8B7355", // Warm/Brown
};

function bandClass(band: SignalBand): string {
  if (band === "support") return styles.bandSupport;
  if (band === "weaken") return styles.bandWeaken;
  if (band === "neutral") return styles.bandNeutral;
  return styles.bandMissing;
}

function bandStroke(band: SignalBand): string {
  if (band === "support") return "#0D7A3E";
  if (band === "weaken") return "#C43030";
  if (band === "neutral") return "#B08415";
  return "#8A8A8A";
}

function formatValue(value: number | null): string {
  if (value === null) return "n/a";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function gradeClass(grade: string | undefined): string {
  if (grade === "A") return styles.gradeA;
  if (grade === "B") return styles.gradeB;
  if (grade === "C") return styles.gradeC;
  return "";
}

function averageSignalScore(hypothesis: LiveHypothesis): number {
  const scored = hypothesis.kpis.map((kpi): number => {
    if (kpi.band === "support") return 1;
    if (kpi.band === "neutral") return 0;
    if (kpi.band === "weaken") return -1;
    return 0;
  });
  if (scored.length === 0) return 0;
  return scored.reduce((sum, v) => sum + v, 0) / scored.length;
}


export function ResearchDashboardApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("live");
  const [data, setData] = useState<ResearchLivePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [expandedHyps, setExpandedHyps] = useState<Set<string>>(new Set());

  function toggleHyp(id: string) {
    setExpandedHyps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/research/live", { cache: "no-store" });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const payload = (await response.json()) as ResearchLivePayload;
        if (!cancelled) {
          setData(payload);
          setSelectedHypothesis((prev) =>
            !prev && payload.hypotheses.length > 0 ? payload.hypotheses[0].hypothesisId : prev,
          );
          setExpandedHyps(new Set(payload.hypotheses.map(h => h.hypothesisId)));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hypothesisById = useMemo(() => {
    const map = new Map<string, LiveHypothesis>();
    data?.hypotheses.forEach((h) => map.set(h.hypothesisId, h));
    return map;
  }, [data]);

  const liveHypotheses = useMemo(
    () =>
      (data?.hypotheses ?? []).filter((h) => h.kpis.some((kpi) => kpi.band !== "missing")),
    [data],
  );


  const renderLive = () => {
    if (!data) return null;
    return (
      <div className={styles.tabContent}>
        {/* Combined Stats & Signal Row */}
        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={styles.statLabel}>Snapshot</div>
            <div className={styles.statValueEbg}>{data.snapshot}</div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statLabel}>KPIs Computed</div>
            <div className={styles.statValueMono}>
              {data.totals.kpisComputed}
              <span className={styles.statMuted}>/{data.totals.kpisDefined}</span>
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statLabel}>Support</div>
            <div className={`${styles.statValueEbg} ${styles.valSupport}`}>
              {data.totals.support}
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statLabel}>Neutral</div>
            <div className={`${styles.statValueEbg} ${styles.valNeutral}`}>
              {data.totals.neutral}
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statLabel}>Weaken</div>
            <div className={`${styles.statValueEbg} ${styles.valWeaken}`}>{data.totals.weaken}</div>
          </article>
        </section>

        <div className={styles.liveControlsRow}>
          <div className={styles.liveControls}>
            <button 
              className={styles.liveControlButton}
              onClick={() => setExpandedHyps(new Set(liveHypotheses.map(h => h.hypothesisId)))}
            >
              Expand All
            </button>
            <button 
              className={styles.liveControlButton}
              onClick={() => setExpandedHyps(new Set())}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Hypothesis KPI cards */}
        {liveHypotheses.map((hypothesis, idx) => {
          const isOpen = expandedHyps.has(hypothesis.hypothesisId);
          return (
            <article
              key={hypothesis.hypothesisId}
              className={styles.hypothesisCard}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <header
                className={`${styles.hypothesisHead} ${!isOpen ? styles.hypothesisHeadClosed : ""}`}
                style={{ borderLeftColor: TREND_COLORS[hypothesis.trendId] ?? "#0D7A3E" }}
                onClick={() => toggleHyp(hypothesis.hypothesisId)}
              >
                <div className={styles.hypothesisMetaRow}>
                  <span className={styles.hypothesisId}>{hypothesis.hypothesisId}</span>
                  <span className={styles.hypothesisTrend}>{hypothesis.trendId}</span>
                  <span className={`${styles.bandPill} ${bandClass(hypothesis.signal)}`}>
                    {hypothesis.signal}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`${styles.frameworkChevron}${isOpen ? ` ${styles.frameworkChevronOpen}` : ""}`}
                    style={{ marginLeft: "auto" }}
                  />
                </div>
                <div className={styles.hypothesisClaim}>{hypothesis.claimSummary}</div>
              </header>

              {isOpen && (
                <div className={styles.kpiGrid}>
                  {hypothesis.kpis
                    .filter((kpi) => kpi.band !== "missing")
                    .map((kpi) => {
                      return (
                        <section className={styles.kpiCard} key={kpi.kpiId}>
                          <div className={styles.kpiTopRow}>
                            <span className={styles.kpiId}>{kpi.kpiId}</span>
                            <span className={styles.kpiName}>{kpi.name}</span>
                            <span className={`${styles.bandPill} ${bandClass(kpi.band)}`}>
                              {kpi.band}
                            </span>
                          </div>

                          {/* Value Hierarchy */}
                          <div className={styles.kpiMetricRow}>
                            <div className={styles.kpiValueGroup}>
                              <span className={styles.kpiValue}>{formatValue(kpi.value)}</span>
                              {kpi.units && <span className={styles.kpiUnits}>{kpi.units}</span>}
                            </div>
                            {kpi.delta !== undefined && kpi.delta !== null && (
                              <div className={kpi.delta < 0 ? styles.deltaDown : styles.deltaUp}>
                                {kpi.delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(kpi.delta).toFixed(2)}
                              </div>
                            )}
                          </div>

                          <div className={styles.chartWrap}>
                            <InteractiveKpiChart
                              history={kpi.history}
                              strokeColor={bandStroke(kpi.band)}
                              height={160}
                            />
                          </div>

                          <div className={styles.kpiMetaRow}>
                            <div className={styles.kpiMetaItem}>
                              <Clock size={12} /> {kpi.frequency ?? "n/a"}
                            </div>
                            <div className={styles.kpiMetaItem}>
                              <Database size={12} /> {kpi.sourcePrimary ?? "n/a"}
                            </div>
                            {kpi.qualityGrade && (
                              <div className={styles.kpiMetaGrade}>Grade {kpi.qualityGrade}</div>
                            )}
                          </div>
                        </section>
                      );
                    })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  };

  const renderFramework = () => {
    if (!data) return null;
    return (
      <section className={`${styles.frameworkGrid} ${styles.tabContent}`}>
        {data.trends.map((trend) => (
          <article key={trend.trendId} className={styles.trendColumn}>
            <header
              className={styles.trendHead}
              style={{ borderLeftColor: TREND_COLORS[trend.trendId] ?? "#0D7A3E" }}
            >
              <div
                className={styles.trendId}
                style={{ color: TREND_COLORS[trend.trendId] ?? "#0D7A3E" }}
              >
                {trend.trendId}
              </div>
              <h3 className={styles.trendName}>{trend.trendName}</h3>
            </header>
            <div className={styles.trendBody}>
              {trend.hypotheses.map((hypothesisId) => {
                const hypothesis = hypothesisById.get(hypothesisId);
                if (!hypothesis) return null;
                const score = averageSignalScore(hypothesis);
                const isOpen = expandedHyps.has(hypothesis.hypothesisId);
                return (
                  <section key={hypothesis.hypothesisId} className={styles.frameworkHypothesis}>
                    {/* Clickable header row */}
                    <div
                      className={styles.frameworkHypHead}
                      onClick={() => toggleHyp(hypothesis.hypothesisId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleHyp(hypothesis.hypothesisId);
                      }}
                    >
                      <span
                        className={styles.frameworkSignalDot}
                        style={{ backgroundColor: bandStroke(hypothesis.signal) }}
                      />
                      <div className={styles.frameworkTop}>
                        <span className={styles.frameworkHypId}>{hypothesis.hypothesisId}</span>
                        <span className={`${styles.bandPill} ${bandClass(hypothesis.signal)}`}>
                          {hypothesis.signal}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`${styles.frameworkChevron}${isOpen ? ` ${styles.frameworkChevronOpen}` : ""}`}
                      />
                    </div>

                    <p className={styles.frameworkClaim}>{hypothesis.claimSummary}</p>
                    <div className={styles.frameworkMeta}>
                      <span>Tier {hypothesis.tier ?? "n/a"}</span>
                      <span>{hypothesis.status ?? "n/a"}</span>
                      <span>{hypothesis.kpis.length} KPIs</span>
                      <span>Score {score.toFixed(2)}</span>
                    </div>

                    {/* Expandable KPI list */}
                    {isOpen && (
                      <div className={styles.frameworkKpiList}>
                        {hypothesis.kpis.map((kpi: LiveKpi) => (
                          <div key={kpi.kpiId} className={styles.frameworkKpiRow}>
                            <span
                              className={styles.miniBandDot}
                              style={{ backgroundColor: bandStroke(kpi.band) }}
                            />
                            <span className={styles.frameworkKpiId}>{kpi.kpiId}</span>
                            <span className={styles.frameworkKpiName}>{kpi.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    );
  };

  const renderMap = () => {
    if (!data) return null;
    return (
      <DependencyGraph
        hypotheses={data.hypotheses}
        dependencies={data.dependencies}
        trends={data.trends}
        selectedHypothesis={selectedHypothesis}
        onSelectHypothesis={setSelectedHypothesis}
      />
    );
  };

  const renderSources = () => {
    if (!data) return null;
    return (
      <section className={`${styles.sourcesList} ${styles.tabContent}`}>
        {data.hypotheses.map((hypothesis) => (
          <article className={styles.sourceGroup} key={hypothesis.hypothesisId}>
            <header className={styles.sourceHead}>
              <div
                className={styles.sourceHypothesis}
                style={{ color: TREND_COLORS[hypothesis.trendId] ?? "#0D7A3E" }}
              >
                {hypothesis.hypothesisId}
              </div>
              <div className={styles.sourceClaim}>{hypothesis.claimSummary}</div>
            </header>
            <div className={styles.sourceTableWrap}>
              <table className={styles.sourceTable}>
                <thead>
                  <tr>
                    <th>KPI</th>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Freq</th>
                    <th>Latency</th>
                    <th>Grade</th>
                    <th>Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {hypothesis.kpis.map((kpi) => (
                    <tr key={kpi.kpiId}>
                      <td className={styles.sourceKpiIdCol}>
                        <span className={styles.sourceKpiId}>{kpi.kpiId}</span>
                      </td>
                      <td className={styles.sourceKpiNameCol}>{kpi.name}</td>
                      <td title={kpi.sourcePrimary}>{kpi.sourcePrimary ?? "n/a"}</td>
                      <td>{kpi.frequency ?? "n/a"}</td>
                      <td title={kpi.latency}>{kpi.latency ?? "n/a"}</td>
                      <td>
                        <span className={gradeClass(kpi.qualityGrade)}>
                          {kpi.qualityGrade ?? "n/a"}
                        </span>
                      </td>
                      <td className={styles.policyCell} title={kpi.missingDataPolicy}>
                        {kpi.missingDataPolicy ?? "n/a"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandLeft}>
          <NeuralStackLogo size={36} interactive={false} animate={false} density="low" />
          <div className={styles.headerTitles}>
            <div className={styles.wordmark}>THE STACK</div>
            <h1 className={styles.headerTitle}>Research Dashboard</h1>
          </div>
        </div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === "live" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("live")}
            type="button"
          >
            <Activity size={15} /> Live
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "framework" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("framework")}
            type="button"
          >
            <LayoutGrid size={15} /> Framework
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "map" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("map")}
            type="button"
          >
            <MapIcon size={15} /> Map
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "sources" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("sources")}
            type="button"
          >
            <Database size={15} /> Sources
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <Activity size={24} className={styles.pulseIcon} /> Loading Live Data...
          </div>
        ) : null}

        {error ? <div className={styles.error}>Failed to load data: {error}</div> : null}

        {!loading && !error && activeTab === "live" ? renderLive() : null}
        {!loading && !error && activeTab === "framework" ? renderFramework() : null}
        {!loading && !error && activeTab === "map" ? renderMap() : null}
        {!loading && !error && activeTab === "sources" ? renderSources() : null}

        <p className={styles.backRow}>
          <Link className={styles.backLink} href="/">
            ← Back to Portal
          </Link>
        </p>
      </main>
    </div>
  );
}
