import type { ChartData, ChartOptions, Plugin } from "chart.js";
import { BarChart } from "@/components/charts/BarChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide04CapitalWaterfallData } from "@/lib/data/slides";
import type { WaterfallDatasetName } from "@/lib/data/types";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide04CapitalWaterfallData;
const labels = slideData.points.map((point) => point.label);
const tickLabels = slideData.points.map((point) => point.tickLabel);
const annotationItems = slideData.points
  .map((point, index) =>
    point.annotationText && point.annotationDataset
      ? { index, text: point.annotationText, dataset: point.annotationDataset }
      : null
  )
  .filter((item): item is { index: number; text: string; dataset: Exclude<WaterfallDatasetName, "base"> } => Boolean(item));
const datasetIndexByName: Record<WaterfallDatasetName, number> = {
  base: 0,
  increase: 1,
  decrease: 2,
  total: 3
};

const waterfallData: ChartData<"bar"> = {
  labels,
  datasets: [
    {
      label: "base",
      data: slideData.points.map((point) => point.base),
      backgroundColor: "transparent",
      borderWidth: 0,
      barPercentage: 0.55
    },
    {
      label: "increase",
      data: slideData.points.map((point) => point.increase),
      backgroundColor: chartSeriesColor(theme, 0),
      borderColor: chartSeriesColor(theme, 0),
      borderWidth: 0,
      barPercentage: 0.55,
      borderRadius: 3
    },
    {
      label: "decrease",
      data: slideData.points.map((point) => point.decrease),
      backgroundColor: theme.negative,
      borderColor: theme.negative,
      borderWidth: 0,
      barPercentage: 0.55,
      borderRadius: 3
    },
    {
      label: "total",
      data: slideData.points.map((point) => point.total),
      backgroundColor: chartSeriesColor(theme, 1),
      borderColor: chartSeriesColor(theme, 1),
      borderWidth: 0,
      barPercentage: 0.55,
      borderRadius: 3
    }
  ]
};

const waterfallOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 30, right: 20, bottom: 4, left: 10 } },
  scales: {
    x: {
      stacked: true,
      ticks: {
        font: { family: fonts.data, size: 9, weight: 400 },
        color: theme.textTertiary,
        maxRotation: 0,
        callback: (_, index) => tickLabels[index]
      },
      grid: { display: false }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: slideData.yAxisMax,
      ticks: {
        callback: (v) => `$${v}M`,
        stepSize: slideData.yAxisStep,
        font: { family: fonts.data, size: 9, weight: 300 },
        color: theme.textTertiary
      },
      grid: { color: theme.border },
      title: {
        display: true,
        text: slideData.yAxisTitle,
        font: { family: fonts.data, size: 9, weight: 400 },
        color: theme.textTertiary
      }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: theme.textPrimary,
      titleColor: theme.bg,
      bodyColor: theme.bg,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      filter: (item) => item.dataset.label !== "base",
      callbacks: {
        label: (ctx) => {
          if (ctx.dataset.label === "base") {
            return "";
          }
          const value = ctx.parsed.y ?? 0;
          const label =
            ctx.dataset.label === "decrease" ? "Outflow" : ctx.dataset.label === "increase" ? "Inflow" : "Net";
          return `${label}: $${value.toFixed(2)}M`;
        }
      }
    }
  }
};

const waterfallLabelsPlugin: Plugin<"bar"> = {
  id: "waterfallLabels",
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = `400 9px ${fonts.data}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    annotationItems.forEach((item) => {
      const meta = chart.getDatasetMeta(datasetIndexByName[item.dataset]);
      const bar = meta.data[item.index];
      if (!bar) {
        return;
      }
      ctx.fillStyle =
        item.dataset === "decrease"
          ? theme.negative
          : item.dataset === "total"
            ? chartSeriesColor(theme, 1)
            : chartSeriesColor(theme, 0);
      ctx.fillText(item.text, bar.x, bar.y - 6);
    });

    ctx.restore();
  }
};

export function Slide04CapitalWaterfall() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />
      <div className="chart-area">
        <BarChart data={waterfallData} options={waterfallOptions} plugins={[waterfallLabelsPlugin]} />
      </div>
      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
