"use client";

import { useId } from "react";

type KpiSparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
};

type Point = { x: number; y: number };

function buildPoints(
  values: number[],
  width: number,
  height: number,
  padTop: number,
  padBottom: number,
): { pts: Point[]; min: number; max: number; range: number } {
  if (values.length === 0) return { pts: [], min: 0, max: 0, range: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / Math.max(values.length - 1, 1);
  const usableH = height - padTop - padBottom;

  const pts = values.map((v, i) => ({
    x: i * stepX,
    y: height - padBottom - ((v - min) / range) * usableH,
  }));
  return { pts, min, max, range };
}

function toLinePath(pts: Point[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function toAreaPath(pts: Point[], h: number): string {
  if (pts.length === 0) return "";
  const line = toLinePath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L${last.x.toFixed(1)},${h} L${first.x.toFixed(1)},${h} Z`;
}

export function KpiSparkline({
  values,
  width = 460,
  height = 160,
  stroke = "#0D7A3E",
}: KpiSparklineProps) {
  const rawId = useId();
  const gradId = `grd${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const safe = values.filter((v) => Number.isFinite(v));

  // Layout params for a proper "chart" look
  const labelWidth = 40;
  const graphWidth = width - labelWidth;
  const padTop = 15;
  const padBottom = 15;

  const { pts, min, max, range } = buildPoints(safe, graphWidth, height, padTop, padBottom);
  const lp = toLinePath(pts);
  const ap = toAreaPath(pts, height);
  const last = pts.length > 0 ? pts[pts.length - 1] : null;

  // 5 axis lines (y-axis)
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  // Threshold / median line
  const avg = safe.length ? safe.reduce((a, b) => a + b, 0) / safe.length : 0;
  const avgY =
    range === 0
      ? height / 2
      : height - padBottom - ((avg - min) / range) * (height - padTop - padBottom);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Trend sparkline"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.15} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0.0} />
        </linearGradient>
      </defs>

      {/* Axis Lines & Labels */}
      {ticks.map((frac, idx) => {
        const y = height - padBottom - frac * (height - padTop - padBottom);
        const val = min + frac * range;
        return (
          <g key={idx}>
            <line
              x1={0}
              y1={y}
              x2={graphWidth}
              y2={y}
              stroke="#DDE0E4"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <text
              x={graphWidth + 8}
              y={y + 3}
              fill="#8A8A8A"
              fontSize="10"
              fontFamily="var(--font-data)"
              letterSpacing="0.5"
            >
              {val.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Threshold (Average) */}
      {safe.length > 0 && (
        <line
          x1={0}
          y1={avgY}
          x2={graphWidth}
          y2={avgY}
          stroke="#111111"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.2}
        />
      )}

      {/* Area fill */}
      {ap && <path d={ap} fill={`url(#${gradId})`} />}

      {/* Line */}
      {lp && (
        <path
          d={lp}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Terminal dot with halo */}
      {last && (
        <g>
          <circle cx={last.x} cy={last.y} r={6} fill={stroke} opacity={0.2} />
          <circle cx={last.x} cy={last.y} r={3} fill={stroke} stroke="#fff" strokeWidth={1} />
        </g>
      )}
    </svg>
  );
}
