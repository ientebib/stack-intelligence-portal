import type { ChartData, ChartOptions, Plugin } from "chart.js";
import { BarChart } from "@/components/charts/BarChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide06NnnStructureData } from "@/lib/data/slides";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";
import { hexToRgba } from "@/lib/chartUtils";

const slideData = slide06NnnStructureData;

const migrationData: ChartData<"bar"> = {
  labels: slideData.migrationYears,
  datasets: [
    {
      label: "Net domestic migration (thousands)",
      data: slideData.migrationValues,
      backgroundColor: slideData.migrationValues.map((_, index, values) => {
        const minOpacity = 0.5;
        const maxOpacity = 1;
        const ratio = values.length <= 1 ? 1 : index / (values.length - 1);
        const opacity = minOpacity + (maxOpacity - minOpacity) * ratio;
        return hexToRgba(chartSeriesColor(theme, 0), opacity);
      }),
      borderColor: chartSeriesColor(theme, 0),
      borderWidth: 1,
      borderRadius: 3,
      barPercentage: 0.7
    }
  ]
};

const migrationOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 8, right: 4, bottom: 0, left: 4 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        label: (ctx) => `+${ctx.parsed.y}K net migrants`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: fonts.data, size: 9, weight: 400 },
        color: theme.textTertiary
      }
    },
    y: {
      grid: { color: theme.border },
      ticks: {
        font: { family: fonts.data, size: 9, weight: 300 },
        color: theme.textTertiary,
        callback: (value) => `${value}K`
      },
      beginAtZero: true
    }
  }
};

const assumptions = slideData.noiDebtAssumptions;
const loanAmount = assumptions.propertyValue * assumptions.ltv;
const monthlyRate = assumptions.rate / 12;
const amortizationMonths = assumptions.amortizationYears * 12;
const annualPayment =
  (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths))) /
  (Math.pow(1 + monthlyRate, amortizationMonths) - 1) *
  12;

const noiDebtLabels: string[] = [];
const noiData: number[] = [];
const debtServiceData: number[] = [];
const cumulativeSurplusData: number[] = [];
let cumulativeSurplus = 0;

for (let year = 1; year <= assumptions.years; year += 1) {
  noiDebtLabels.push(`Yr ${year}`);
  const noi = assumptions.propertyValue * assumptions.capRate * Math.pow(1 + assumptions.noiEscalation, year - 1);
  const yearlySurplus = noi - annualPayment;
  cumulativeSurplus = cumulativeSurplus * (1 + assumptions.treasuryYield) + yearlySurplus;
  noiData.push(Math.round(noi / 1000));
  debtServiceData.push(Math.round(annualPayment / 1000));
  cumulativeSurplusData.push(Math.round(cumulativeSurplus / 1000));
}

const balloonBalance =
  (loanAmount * (Math.pow(1 + monthlyRate, amortizationMonths) - Math.pow(1 + monthlyRate, 120))) /
  (Math.pow(1 + monthlyRate, amortizationMonths) - 1);
const balloonBalanceK = Math.round(balloonBalance / 1000);

const noiDebtData = {
  labels: noiDebtLabels,
  datasets: [
    {
      type: "bar",
      label: "NOI",
      data: noiData,
      backgroundColor: hexToRgba(chartSeriesColor(theme, 0), 0.72),
      borderColor: chartSeriesColor(theme, 0),
      borderWidth: 1,
      borderRadius: 3,
      barPercentage: 0.4,
      categoryPercentage: 0.8,
      order: 2
    },
    {
      type: "bar",
      label: "Debt Service",
      data: debtServiceData,
      backgroundColor: hexToRgba(theme.negative, 0.5),
      borderColor: theme.negative,
      borderWidth: 1,
      borderRadius: 3,
      barPercentage: 0.4,
      categoryPercentage: 0.8,
      order: 3
    },
    {
      type: "line",
      label: "Cumulative Surplus (at 3.5%)",
      data: cumulativeSurplusData,
      borderColor: chartSeriesColor(theme, 1),
      backgroundColor: "transparent",
      borderWidth: 2.2,
      pointRadius: 3,
      pointBackgroundColor: chartSeriesColor(theme, 1),
      pointBorderColor: theme.bg,
      pointBorderWidth: 1.2,
      tension: 0.3,
      yAxisID: "y1",
      order: 1
    }
  ]
} as unknown as ChartData<"bar">;

const noiDebtOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 8, right: 8, bottom: 0, left: 4 } },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        font: { family: fonts.data, size: 8, weight: 400 },
        color: theme.textTertiary,
        padding: 8,
        boxWidth: 8
      }
    },
    tooltip: {
      backgroundColor: theme.surface3,
      titleColor: theme.textPrimary,
      bodyColor: theme.textSecondary,
      titleFont: { family: fonts.data, size: 10, weight: 400 },
      bodyFont: { family: fonts.data, size: 10, weight: 400 },
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}K`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: fonts.data, size: 9, weight: 400 },
        color: theme.textTertiary
      }
    },
    y: {
      position: "left",
      grid: { color: theme.border },
      ticks: {
        font: { family: fonts.data, size: 9, weight: 300 },
        color: theme.textTertiary,
        callback: (value) => `$${value}K`
      }
    },
    y1: {
      position: "right",
      grid: { display: false },
      ticks: {
        font: { family: fonts.data, size: 9, weight: 300 },
        color: hexToRgba(theme.textPrimary, 0.6),
        callback: (value) => `$${value}K`
      },
      min: 0
    }
  }
};

const balloonLinePlugin: Plugin<"bar"> = {
  id: "balloonLine",
  afterDraw: (chart) => {
    const yScale = chart.scales.y1;
    if (!yScale) {
      return;
    }

    const yPixel = yScale.getPixelForValue(balloonBalanceK);
    const left = chart.chartArea.left;
    const right = chart.chartArea.right;
    const label = `Balloon: $${(balloonBalance / 1000000).toFixed(1)}M`;
    const ctx = chart.ctx;

    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.negative, 0.55);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(left, yPixel);
    ctx.lineTo(right, yPixel);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = hexToRgba(theme.negative, 0.16);
    ctx.fillRect(left + 4, yPixel - 16, 122, 14);
    ctx.fillStyle = theme.negative;
    ctx.font = `400 8px ${fonts.data}`;
    ctx.textBaseline = "middle";
    ctx.fillText(label, left + 8, yPixel - 9);
    ctx.restore();
  }
};

export function Slide06NnnStructure() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />

      <div className="nnn-structure-layout">
        <div className="nnn-structure-col">
          <div className="nnn-structure-subhead">{slideData.assetLabel}</div>
          <p className="nnn-structure-description">{slideData.assetDescription}</p>

          <div className="nnn-structure-panel">
            <div className="nnn-structure-panel-label">{slideData.whyFloridaLabel}</div>
            <table className="nnn-structure-table">
              <tbody>
                {slideData.whyFloridaRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nnn-structure-chart-block">
            <div className="nnn-structure-chart-title">{slideData.migrationChartTitle}</div>
            <div className="nnn-structure-chart-wrap">
              <BarChart data={migrationData} options={migrationOptions} />
            </div>
          </div>
        </div>

        <div className="nnn-structure-vrule" />

        <div className="nnn-structure-col">
          <div className="nnn-structure-subhead">{slideData.debtProfileLabel}</div>

          <div className="nnn-structure-panel">
            <table className="nnn-structure-table">
              <tbody>
                {slideData.debtProfileRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nnn-structure-chart-block">
            <div className="nnn-structure-chart-title">{slideData.noiDebtChartTitle}</div>
            <div className="nnn-structure-chart-wrap">
              <BarChart data={noiDebtData} options={noiDebtOptions} plugins={[balloonLinePlugin]} />
            </div>
          </div>
        </div>
      </div>

      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
