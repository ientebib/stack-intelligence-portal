import type { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "@/components/charts/LineChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide36HardwareData } from "@/lib/data/slides";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";

const slideData = slide36HardwareData;

const chartData: ChartData<"line"> = {
  labels: slideData.years,
  datasets: [
    {
      label: "Shipments (M units, H100-eq)",
      data: slideData.shipmentsMillionUnits,
      borderColor: chartSeriesColor(theme, 0),
      backgroundColor: "transparent",
      yAxisID: "y",
      borderWidth: 2.2,
      pointRadius: 3.5,
      pointHoverRadius: 5,
      tension: 0.28
    },
    {
      label: "Associated cost ($B)",
      data: slideData.costUsdBillions,
      borderColor: chartSeriesColor(theme, 1),
      backgroundColor: "transparent",
      yAxisID: "y1",
      borderWidth: 2.2,
      pointRadius: 3.5,
      pointHoverRadius: 5,
      borderDash: [5, 4],
      tension: 0.28
    }
  ]
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 8, right: 16, bottom: 4, left: 8 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 }
      }
    },
    y: {
      position: "left",
      min: 0,
      max: 40,
      ticks: {
        color: chartSeriesColor(theme, 0),
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `${value}M`
      },
      grid: { color: theme.border }
    },
    y1: {
      position: "right",
      min: 0,
      max: 400,
      ticks: {
        color: chartSeriesColor(theme, 1),
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `$${value}B`
      },
      grid: { display: false }
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
        padding: 12
      }
    },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        label: (item) => {
          const value = Number(item.raw);
          if (item.datasetIndex === 0) {
            return `${item.dataset.label}: ${value.toFixed(2)}M`;
          }
          return `${item.dataset.label}: $${value.toFixed(0)}B`;
        }
      }
    }
  }
};

export function Slide36HardwareShipments() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />

      <div className="adoption-layout">
        <h3 className="adoption-row-label">AI accelerators shipped (H100 equivalent)</h3>
        <div className="adoption-card-grid">
          {slideData.shipmentsStats.map((stat) => (
            <article key={`shipments-${stat.label}`} className="adoption-card">
              <div className="adoption-card-metric">{stat.value}</div>
              <div className="adoption-card-label">{stat.label}</div>
            </article>
          ))}
        </div>

        <div>
          <h3 className="adoption-row-label">Associated chip cost</h3>
          <div className="adoption-card-grid">
            {slideData.costStats.map((stat) => (
              <article key={`cost-${stat.label}`} className="adoption-card">
                <div className="adoption-card-metric">{stat.value}</div>
                <div className="adoption-card-label">{stat.label}</div>
              </article>
            ))}
          </div>
          <p className="adoption-card-detail">{slideData.note}</p>
        </div>

        <div className="chart-area adoption-chart-area">
          <LineChart data={chartData} options={chartOptions} />
        </div>
      </div>

      <SourceLine text={slideData.sourceLine} tight />
    </>
  );
}
