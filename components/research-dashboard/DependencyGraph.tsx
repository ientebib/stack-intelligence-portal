"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./DependencyGraph.module.css";
import type {
  DependencyEdge,
  LiveHypothesis,
  SignalBand,
  TrendSummary,
} from "@/lib/research-dashboard/types";

const EDGE_COLORS: Record<string, string> = {
  requires: "#0B5EA8",
  amplifies: "#B08415",
  conditional_on: "#C43030",
};

const TREND_COLORS: Record<string, string> = {
  "T-001": "#0D7A3E",
  "T-002": "#0B5EA8",
  "T-003": "#8B7355",
};

function bandStroke(band: SignalBand): string {
  if (band === "support") return "#0D7A3E";
  if (band === "weaken") return "#C43030";
  if (band === "neutral") return "#B08415";
  return "#8A8A8A";
}

type Rect = { x: number; y: number; w: number; h: number };
type RenderedEdge = { edge: DependencyEdge; d: string; color: string; dashed: boolean };

/* Smooth bezier edge routing — arcs through gaps, never cuts through cards */
function bezierEdge(from: Rect, to: Rect): string {
  const fromCx = from.x + from.w / 2;
  const fromCy = from.y + from.h / 2;
  const toCx = to.x + to.w / 2;
  const toCy = to.y + to.h / 2;

  const sameCol = !(from.x + from.w + 12 < to.x || to.x + to.w + 12 < from.x);

  if (sameCol) {
    const sx = from.x + from.w;
    const sy = fromCy;
    const ex = to.x + to.w;
    const ey = toCy;
    const bulge = Math.max(36, Math.abs(ey - sy) * 0.35);
    return `M${sx},${sy} C${sx + bulge},${sy} ${ex + bulge},${ey} ${ex},${ey}`;
  } else {
    const goRight = toCx > fromCx;
    const sx = goRight ? from.x + from.w : from.x;
    const sy = fromCy;
    const ex = goRight ? to.x : to.x + to.w;
    const ey = toCy;
    const dx = ex - sx;
    return `M${sx},${sy} C${sx + dx * 0.4},${sy} ${sx + dx * 0.6},${ey} ${ex},${ey}`;
  }
}

/* ── Memoized card — only re-renders when its own visual state changes ── */
type CardProps = {
  h: LiveHypothesis;
  selected: boolean;
  dimmed: boolean;
  connRelColor: string | null;
  onClick: () => void;
};

const CardNode = memo(function CardNode({ h, selected, dimmed, connRelColor, onClick }: CardProps) {
  const sc = bandStroke(h.signal);
  const cls = [styles.card, selected && styles.cardSel, dimmed && styles.cardDim]
    .filter(Boolean)
    .join(" ");

  // Use individual border properties only — no shorthand conflicts
  const style: React.CSSProperties = {};
  if (selected) {
    style.borderTopColor = sc;
    style.borderRightColor = sc;
    style.borderBottomColor = sc;
    style.borderLeftColor = sc;
  }
  if (connRelColor) {
    style.borderLeftColor = connRelColor;
    style.borderLeftWidth = 4;
  }

  return (
    <div data-hid={h.hypothesisId} className={cls} style={style} onClick={onClick}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <span className={styles.cardId}>{h.hypothesisId}</span>
          <span className={styles.cardDot} style={{ background: sc }} />
          <span className={styles.cardBand}>{h.signal}</span>
        </div>
        <p className={styles.cardClaim}>{h.claimSummary}</p>
        <div className={styles.cardFoot}>
          <span>Tier {h.tier ?? "—"}</span>
          <span>{h.kpis.length} KPIs</span>
          {h.status && <span>{h.status}</span>}
        </div>
      </div>
    </div>
  );
});

type Props = {
  hypotheses: LiveHypothesis[];
  dependencies: DependencyEdge[];
  trends: TrendSummary[];
  selectedHypothesis: string | null;
  onSelectHypothesis: (id: string | null) => void;
};

export function DependencyGraph({
  hypotheses,
  dependencies,
  trends,
  selectedHypothesis,
  onSelectHypothesis,
}: Props) {
  const graphRef = useRef<HTMLDivElement>(null);
  const [allEdges, setAllEdges] = useState<RenderedEdge[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const lastSize = useRef({ w: 0, h: 0 });

  const hypothesisById = useMemo(() => {
    const m = new Map<string, LiveHypothesis>();
    hypotheses.forEach((h) => m.set(h.hypothesisId, h));
    return m;
  }, [hypotheses]);

  const trendGroups = useMemo(
    () =>
      trends.map((t) => ({
        ...t,
        items: t.hypotheses
          .map((id) => hypothesisById.get(id))
          .filter(Boolean) as LiveHypothesis[],
      })),
    [trends, hypothesisById],
  );

  const measure = useCallback(() => {
    const el = graphRef.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    setSvgSize({ w: base.width, h: base.height });

    const rects = new Map<string, Rect>();
    el.querySelectorAll<HTMLElement>("[data-hid]").forEach((node) => {
      const id = node.dataset.hid!;
      const r = node.getBoundingClientRect();
      rects.set(id, { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height });
    });

    setAllEdges(
      dependencies
        .filter((d) => rects.has(d.from) && rects.has(d.to))
        .map((d) => ({
          edge: d,
          d: bezierEdge(rects.get(d.from)!, rects.get(d.to)!),
          color: EDGE_COLORS[d.relationship] ?? "#8A8A8A",
          dashed: d.relationship !== "requires",
        })),
    );
  }, [dependencies]);

  useEffect(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure, hypotheses, trends]);

  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      if (Math.abs(r.width - lastSize.current.w) < 2 && Math.abs(r.height - lastSize.current.h) < 2) return;
      lastSize.current = { w: r.width, h: r.height };
      requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // All edges stay in DOM — active ones get opacity 0.8, inactive 0
  const activeEdgeSet = useMemo(() => {
    if (!selectedHypothesis) return new Set<number>();
    const s = new Set<number>();
    allEdges.forEach((e, i) => {
      if (e.edge.from === selectedHypothesis || e.edge.to === selectedHypothesis) s.add(i);
    });
    return s;
  }, [allEdges, selectedHypothesis]);

  const connectedNodes = useMemo(() => {
    if (!selectedHypothesis) return new Set<string>();
    const nodes = new Set([selectedHypothesis]);
    dependencies.forEach((d) => {
      if (d.from === selectedHypothesis || d.to === selectedHypothesis) {
        nodes.add(d.from);
        nodes.add(d.to);
      }
    });
    return nodes;
  }, [selectedHypothesis, dependencies]);

  const connectionMap = useMemo(() => {
    const m = new Map<string, string>();
    if (!selectedHypothesis) return m;
    dependencies.forEach((d) => {
      if (d.from === selectedHypothesis && d.to !== selectedHypothesis)
        m.set(d.to, d.relationship);
      if (d.to === selectedHypothesis && d.from !== selectedHypothesis)
        m.set(d.from, d.relationship);
    });
    return m;
  }, [selectedHypothesis, dependencies]);

  const depDetail = useMemo(() => {
    if (!selectedHypothesis)
      return { inbound: [] as DependencyEdge[], outbound: [] as DependencyEdge[] };
    return {
      inbound: dependencies.filter((d) => d.to === selectedHypothesis),
      outbound: dependencies.filter((d) => d.from === selectedHypothesis),
    };
  }, [selectedHypothesis, dependencies]);

  const has = !!selectedHypothesis;

  // Stable click handlers — one per hypothesis, memoized across renders
  const clickHandlers = useMemo(() => {
    const m = new Map<string, () => void>();
    hypotheses.forEach((h) => {
      m.set(h.hypothesisId, () =>
        onSelectHypothesis(selectedHypothesis === h.hypothesisId ? null : h.hypothesisId),
      );
    });
    return m;
  }, [hypotheses, selectedHypothesis, onSelectHypothesis]);

  return (
    <div className={styles.root}>
      <div
        ref={graphRef}
        className={styles.graph}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-hid]")) return;
          onSelectHypothesis(null);
        }}
      >
        {/* SVG — always mounted, edges fade via CSS opacity transition */}
        <svg
          className={styles.svg}
          width={svgSize.w || "100%"}
          height={svgSize.h || "100%"}
          viewBox={svgSize.w > 0 ? `0 0 ${svgSize.w} ${svgSize.h}` : undefined}
        >
          <defs>
            {Object.entries(EDGE_COLORS).map(([k, c]) => (
              <marker key={k} id={`a-${k}`} markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                <polygon points="0 0.5, 10 4, 0 7.5" fill={c} />
              </marker>
            ))}
          </defs>
          {allEdges.map((e, i) => (
            <path
              key={`${e.edge.from}→${e.edge.to}-${i}`}
              className={styles.edgePath}
              d={e.d}
              fill="none"
              stroke={e.color}
              strokeWidth={2}
              strokeDasharray={e.dashed ? "6 4" : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              markerEnd={`url(#a-${e.edge.relationship})`}
              opacity={activeEdgeSet.has(i) ? 0.8 : 0}
            />
          ))}
        </svg>

        {/* Trend columns */}
        <div className={styles.cols} style={{ gridTemplateColumns: `repeat(${trends.length}, 1fr)` }}>
          {trendGroups.map((t) => {
            const c = TREND_COLORS[t.trendId] ?? "#0D7A3E";
            return (
              <div key={t.trendId} className={styles.col}>
                <div className={styles.colHead} style={{ borderLeftColor: c }}>
                  <span className={styles.colId} style={{ color: c }}>{t.trendId}</span>
                  <span className={styles.colName}>{t.trendName}</span>
                </div>
                <div className={styles.stack}>
                  {t.items.map((h) => (
                    <CardNode
                      key={h.hypothesisId}
                      h={h}
                      selected={selectedHypothesis === h.hypothesisId}
                      dimmed={has && !connectedNodes.has(h.hypothesisId)}
                      connRelColor={connectionMap.has(h.hypothesisId) ? (EDGE_COLORS[connectionMap.get(h.hypothesisId)!] ?? null) : null}
                      onClick={clickHandlers.get(h.hypothesisId)!}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail overlay — positioned inside graph so it never causes layout reflow */}
        {selectedHypothesis && hypothesisById.has(selectedHypothesis) && (() => {
          const h = hypothesisById.get(selectedHypothesis)!;
          return (
            <div className={styles.detailOverlay}>
              <div className={styles.detail}>
                <div className={styles.detailLeft}>
                  <div className={styles.detailIdRow}>
                    <span className={styles.detailId}>{h.hypothesisId}</span>
                    <span className={styles.detailDot} style={{ background: bandStroke(h.signal) }} />
                    <span className={styles.detailBand}>{h.signal}</span>
                  </div>
                  <div className={styles.detailChips}>
                    <span className={styles.metaChip}>{h.trendId}</span>
                    <span className={styles.metaChip}>Tier {h.tier ?? "—"}</span>
                    <span className={styles.metaChip}>{h.kpis.length} KPIs</span>
                  </div>
                </div>

                <p className={styles.detailClaim}>{h.claimSummary}</p>

                <div className={styles.detailDeps}>
                  <div className={styles.depsCol}>
                    <div className={styles.depsLabel}>Depends On</div>
                    {depDetail.inbound.length === 0 ? (
                      <span className={styles.depsNone}>None</span>
                    ) : depDetail.inbound.map((edge, i) => (
                      <div key={i} className={styles.depRow} onClick={() => onSelectHypothesis(edge.from)}>
                        <span className={styles.depDot} style={{ background: EDGE_COLORS[edge.relationship] }} />
                        <span className={styles.depNodeId}>{edge.from}</span>
                        <span className={styles.depType}>{edge.relationship}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.depsCol}>
                    <div className={styles.depsLabel}>Influences</div>
                    {depDetail.outbound.length === 0 ? (
                      <span className={styles.depsNone}>None</span>
                    ) : depDetail.outbound.map((edge, i) => (
                      <div key={i} className={styles.depRow} onClick={() => onSelectHypothesis(edge.to)}>
                        <span className={styles.depDot} style={{ background: EDGE_COLORS[edge.relationship] }} />
                        <span className={styles.depNodeId}>{edge.to}</span>
                        <span className={styles.depType}>{edge.relationship}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className={styles.detailClose} onClick={() => onSelectHypothesis(null)}>×</button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom: legend only — constant height, never triggers layout reflow */}
      <div className={styles.bottom}>
        <div className={styles.legend}>
          {[
            { label: "Requires", color: "#0B5EA8", dash: false },
            { label: "Amplifies", color: "#B08415", dash: true },
            { label: "Conditional", color: "#C43030", dash: true },
          ].map((l) => (
            <div key={l.label} className={styles.legItem}>
              <svg width="24" height="10"><line x1="0" y1="5" x2="17" y2="5" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash ? "4 3" : undefined} /><polygon points="17 2, 23 5, 17 8" fill={l.color} /></svg>
              <span>{l.label}</span>
            </div>
          ))}
          <span className={styles.legSep} />
          {[
            { label: "Support", color: "#0D7A3E" },
            { label: "Neutral", color: "#B08415" },
            { label: "Weaken", color: "#C43030" },
          ].map((s) => (
            <div key={s.label} className={styles.legItem}>
              <span className={styles.legDot} style={{ background: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
