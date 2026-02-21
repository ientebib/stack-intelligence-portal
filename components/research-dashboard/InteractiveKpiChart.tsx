"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

type InteractiveKpiChartProps = {
  history: Array<{ period: string; value: number }>;
  strokeColor: string;
  height?: number;
};

export function InteractiveKpiChart({ history, strokeColor, height = 160 }: InteractiveKpiChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: history.map((h) => h.period),
      datasets: [
        {
          label: "Value",
          data: history.map((h) => h.value),
          borderColor: strokeColor,
          backgroundColor: strokeColor.length === 7 ? strokeColor + "15" : strokeColor,
          fill: true,
          tension: 0.2, // smoother curve
          pointRadius: history.length > 30 ? 0 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: strokeColor,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [history, strokeColor]);

  const options = useMemo(() => {
    const values = history.map((h) => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(17, 17, 17, 0.95)",
          titleFont: { family: "Inter", size: 11 },
          bodyFont: { family: "JetBrains Mono", size: 12 },
          padding: 10,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            label: (context: any) => {
              const val = context.parsed.y;
              return `${Number.isInteger(val) ? val : val.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: "JetBrains Mono", size: 9 },
            color: "#8A8A8A",
            maxTicksLimit: 6,
            maxRotation: 0,
          },
        },
        y: {
          grid: {
            color: "#E6E8EB",
            drawBorder: false,
            tickLength: 0,
          },
          border: { display: false },
          min: min - range * 0.1,
          max: max + range * 0.1,
          ticks: {
            font: { family: "JetBrains Mono", size: 9 },
            color: "#8A8A8A",
            padding: 6,
            maxTicksLimit: 5,
          },
        },
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
    };
  }, [history]);

  return (
    <div style={{ width: "100%", height: `${height}px`, position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
