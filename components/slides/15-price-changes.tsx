import type { ChartData, ChartOptions } from "chart.js";
import { BarChart } from "@/components/charts/BarChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide15PriceChangesData } from "@/lib/data/slides";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide15PriceChangesData;

const barColors = slideData.values.map((value, index) => {
  const category = slideData.categories[index];
  if (category === "Overall CPI") {
    return chartSeriesColor(theme, 1);
  }
  if (value < 0) {
    return theme.negative;
  }
  if (value > slideData.overallCpiValue) {
    return chartSeriesColor(theme, 0);
  }
  return theme.textTertiary;
});

const chartData: ChartData<"bar"> = {
  labels: slideData.categories,
  datasets: [
    {
      data: slideData.values,
      backgroundColor: barColors,
      borderColor: barColors,
      borderWidth: 0,
      barThickness: 14
    }
  ]
};

const chartOptions: ChartOptions<"bar"> = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 10, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      min: -120,
      max: 300,
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `${value}%`
      },
      grid: { color: theme.border }
    },
    y: {
      grid: { display: false },
      ticks: {
        color: theme.textSecondary,
        font: { family: fonts.body, size: 11, weight: 400 }
      }
    }
  },
  plugins: {
    annotation: {
      annotations: {
        cpiLine: {
          type: "line",
          xMin: slideData.overallCpiValue,
          xMax: slideData.overallCpiValue,
          borderColor: chartSeriesColor(theme, 1),
          borderWidth: 1.5,
          borderDash: [5, 4],
          label: {
            display: true,
            content: "Overall CPI",
            position: "start",
            color: chartSeriesColor(theme, 1),
            backgroundColor: "transparent",
            font: { family: fonts.data, size: 8, weight: 400 },
            padding: 0
          }
        }
      }
    },
    legend: { display: false },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        label: (item) => `${Number(item.raw).toFixed(1)}%`
      }
    }
  }
};

export function Slide15PriceChanges() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />
      <div className="chart-area">
        <BarChart data={chartData} options={chartOptions} />
      </div>
      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
