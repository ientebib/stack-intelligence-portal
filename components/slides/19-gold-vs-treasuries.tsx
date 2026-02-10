import type { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "@/components/charts/LineChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide19GoldTreasuriesData } from "@/lib/data/slides";
import { calloutLabel } from "@/lib/annotationStyles";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide19GoldTreasuriesData;

/* Find the first index where gold overtakes treasuries */
const crossoverIndex = slideData.goldHoldingsTrillions.findIndex(
  (gold, i) => gold >= slideData.treasuryHoldingsTrillions[i]
);

const chartData: ChartData<"line"> = {
  labels: slideData.dates,
  datasets: [
    {
      label: "Gold Holdings",
      data: slideData.goldHoldingsTrillions,
      borderColor: chartSeriesColor(theme, 0),
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      fill: false,
      tension: 0.25
    },
    {
      label: "Treasury Holdings",
      data: slideData.treasuryHoldingsTrillions,
      borderColor: chartSeriesColor(theme, 1),
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      fill: false,
      tension: 0.25
    }
  ]
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 12, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        maxRotation: 0,
        autoSkip: false,
        callback: (_, index) => {
          const date = slideData.dates[index];
          return date?.endsWith("-01-01") ? date.slice(0, 4) : "";
        }
      }
    },
    y: {
      min: 1,
      max: 6,
      ticks: {
        stepSize: 0.5,
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `$${value}T`
      },
      grid: { color: theme.border }
    }
  },
  plugins: {
    annotation: {
      annotations: {
        ...(crossoverIndex >= 0
          ? {
              crossoverLine: {
                type: "line" as const,
                xMin: crossoverIndex,
                xMax: crossoverIndex,
                yMin: slideData.goldHoldingsTrillions[crossoverIndex] - 0.4,
                yMax: slideData.goldHoldingsTrillions[crossoverIndex] + 0.4,
                borderColor: theme.textPrimary,
                borderWidth: 1,
                borderDash: [3, 2]
              },
              crossover: {
                ...calloutLabel(theme, {
                  xValue: crossoverIndex,
                  yValue: slideData.goldHoldingsTrillions[crossoverIndex] + 0.6,
                  content: ["Gold overtakes Treasuries"],
                  color: theme.textPrimary,
                  fontSize: 9,
                  fontWeight: 500
                }),
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: 3
              }
            }
          : {})
      }
    },
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        pointStyle: "line",
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 400 },
        padding: 10,
        boxWidth: 20
      }
    },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        title: (items) => items[0]?.label ?? "",
        label: (item) => `${item.dataset.label}: $${Number(item.raw).toFixed(2)}T`
      }
    }
  }
};

export function Slide19GoldVsTreasuries() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />
      <div className="chart-area">
        <LineChart data={chartData} options={chartOptions} />
      </div>
      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
