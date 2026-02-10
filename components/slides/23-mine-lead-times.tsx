import type { ChartData, ChartOptions } from "chart.js";
import { BarChart } from "@/components/charts/BarChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide23MineLeadTimesData } from "@/lib/data/slides";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";
import { hexToRgba } from "@/lib/chartUtils";

const slideData = slide23MineLeadTimesData;

const barColors = slideData.periods.map((period) => {
  if (period === slideData.projectedPeriod) {
    return theme.caution;
  }
  return chartSeriesColor(theme, 1);
});

const chartData: ChartData<"bar"> = {
  labels: slideData.periods,
  datasets: [
    {
      label: "Avg. years from discovery to production",
      data: slideData.yearsToProduction,
      backgroundColor: barColors.map((color, index) => hexToRgba(color, index < 3 ? 0.78 : 0.9)),
      borderColor: barColors,
      borderWidth: 1.5,
      borderRadius: 5,
      barPercentage: 0.65
    }
  ]
};

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 16, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 400 },
        callback: (value, index) => {
          const label = slideData.periods[index];
          if (!label) {
            return "";
          }
          if (label === slideData.projectedPeriod) {
            return ["Non-Operating", "(Projected)"];
          }
          return label;
        }
      }
    },
    y: {
      beginAtZero: true,
      suggestedMax: 30,
      ticks: {
        stepSize: 5,
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `${value} yrs`
      },
      grid: { color: theme.border },
      title: {
        display: true,
        text: "Years from discovery to production",
        color: theme.textMuted,
        font: { family: fonts.data, size: 9, weight: 400 }
      }
    }
  },
  plugins: {
    annotation: {
      annotations: {
        trendLine: {
          type: "line",
          xMin: 0,
          xMax: 2,
          yMin: 7.5,
          yMax: 19.4,
          borderColor: hexToRgba(theme.caution, 0.45),
          borderWidth: 1.5,
          borderDash: [4, 3]
        },
        tripledLabel: {
          type: "label",
          xValue: 1,
          yValue: 20.5,
          content: ["3x increase"],
          color: theme.caution,
          backgroundColor: "transparent",
          font: { family: fonts.data, size: 9, weight: 400 },
          padding: 0
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
        label: (item) => `${Number(item.raw).toFixed(1)} years`
      }
    }
  }
};

export function Slide23MineLeadTimes() {
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
