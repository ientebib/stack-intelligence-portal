import type { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "@/components/charts/LineChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide30CapabilityBenchmarksData } from "@/lib/data/slides";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide30CapabilityBenchmarksData;

const chartData: ChartData<"line"> = {
  labels: slideData.dates,
  datasets: [
    {
      label: "WeirdML",
      data: slideData.weirdMl,
      borderColor: chartSeriesColor(theme, 0),
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 3,
      tension: 0.25
    },
    {
      label: "SimpleBench",
      data: slideData.simpleBench,
      borderColor: chartSeriesColor(theme, 1),
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 3,
      tension: 0.25
    },
    {
      label: "FrontierMath",
      data: slideData.frontierMath,
      borderColor: theme.caution,
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 3,
      tension: 0.25
    },
    {
      label: "SWE-Bench Verified",
      data: slideData.sweBenchVerified,
      borderColor: theme.negative,
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 3,
      tension: 0.25
    }
  ]
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 10, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        maxRotation: 40,
        autoSkip: true,
        maxTicksLimit: 12
      }
    },
    y: {
      min: 0,
      max: 0.9,
      ticks: {
        stepSize: 0.1,
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `${Math.round(Number(value) * 100)}%`
      },
      grid: { color: theme.border }
    }
  },
  plugins: {
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
        boxWidth: 18
      }
    },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        label: (item) => `${item.dataset.label}: ${(Number(item.raw) * 100).toFixed(1)}%`
      }
    }
  }
};

export function Slide30CapabilityBenchmarks() {
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
