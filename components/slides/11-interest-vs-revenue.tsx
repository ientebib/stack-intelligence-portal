import type { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "@/components/charts/LineChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide11InterestRevenueData } from "@/lib/data/slides";
import { projectionDivider, recessionBox } from "@/lib/annotationStyles";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide11InterestRevenueData;
const projectionIndex = slideData.years.findIndex((year) => year === slideData.projectionStartYear);
const actualData = slideData.values.map((value, index) => (index <= projectionIndex - 1 ? value : null));
const projectedData = slideData.values.map((value, index) => (index >= projectionIndex - 1 ? value : null));

const chartData: ChartData<"line"> = {
  labels: slideData.years.map(String),
  datasets: [
    {
      label: "Actual",
      data: actualData,
      borderColor: chartSeriesColor(theme, 0),
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      fill: false,
      tension: 0.25,
      spanGaps: false
    },
    {
      label: "Projected",
      data: projectedData,
      borderColor: chartSeriesColor(theme, 0),
      backgroundColor: "transparent",
      borderWidth: 2,
      borderDash: [5, 3],
      pointRadius: 0,
      pointHoverRadius: 3,
      fill: false,
      tension: 0.25,
      spanGaps: false
    }
  ]
};

function buildRecessionAnnotations() {
  const spans: Array<{ start: number; end: number }> = [];
  let start: number | null = null;
  slideData.isRecession.forEach((flag, index) => {
    if (flag === 1 && start === null) start = index;
    if ((flag === 0 || index === slideData.isRecession.length - 1) && start !== null) {
      spans.push({ start, end: flag === 1 ? index : index - 1 });
      start = null;
    }
  });
  const result: Record<string, object> = {};
  spans.forEach((span, i) => {
    result[`recession_${i}`] = recessionBox(theme, { xMin: span.start, xMax: span.end });
  });
  return result;
}

const pd = projectionDivider(theme, { xValue: projectionIndex });

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 18, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxRotation: 0,
        autoSkip: false,
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (_, index) => {
          const year = slideData.years[index];
          return year % 5 === 0 ? String(year) : "";
        }
      }
    },
    y: {
      min: 5,
      max: 24,
      ticks: {
        stepSize: 5,
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `${value}%`
      },
      grid: { color: theme.border }
    }
  },
  plugins: {
    annotation: {
      annotations: {
        ...buildRecessionAnnotations(),
        projectedLine: pd.line,
        actualLabel: pd.actualLabel
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
        padding: 12,
        boxWidth: 24
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
        label: (item) => (item.raw === null ? undefined : `Interest / Revenue: ${Number(item.raw).toFixed(1)}%`)
      }
    }
  }
};

export function Slide11InterestVsRevenue() {
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
