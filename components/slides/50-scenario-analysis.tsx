"use client";

import { useMemo, useState } from "react";
import type { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "@/components/charts/LineChart";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide50ScenarioAnalysisData } from "@/lib/data/slides";
import type { Slide50ScenarioControlId } from "@/lib/data/types";
import { chartSeriesColor, fonts, theme } from "@/lib/theme";
import { hexToRgba } from "@/lib/chartUtils";

const slideData = slide50ScenarioAnalysisData;

type ScenarioValues = Record<Slide50ScenarioControlId, number>;

type ScenarioResult = {
  navSeries: number[];
  reEquitySeries: number[];
  structuralLongSeries: number[];
  grossIrr: number;
  grossMoic: number;
  lpNetIrr: number;
  lpNetMoic: number;
  lpNetProfit: number;
  gpCarry: number;
};

function defaultControls(): ScenarioValues {
  return slideData.controls.reduce((accumulator, control) => {
    accumulator[control.id] = control.defaultValue;
    return accumulator;
  }, {} as ScenarioValues);
}

function calculateScenario(values: ScenarioValues): ScenarioResult {
  const entryCap = values.entryCapRatePct / 100;
  const exitCap = values.exitCapRatePct / 100;
  const loanRate = values.loanRatePct / 100;
  const structuralLongReturn = values.structuralLongReturnPct / 100;

  const lpCapital = 20;
  const propertyValue = 20;
  const loanPrincipal = propertyValue * 0.55;
  const upfrontCosts = 0.82;
  const structuralLongInitial = loanPrincipal - upfrontCosts;
  const managementFeeRate = 0.02;
  const treasuryRate = 0.04;
  const noiGrowthRate = 0.02;

  const noiYear1 = propertyValue * entryCap;
  const monthlyRate = loanRate / 12;
  const totalPayments = 360;
  const monthlyPayment =
    (loanPrincipal * monthlyRate * (1 + monthlyRate) ** totalPayments) /
    ((1 + monthlyRate) ** totalPayments - 1);
  const annualDebtService = monthlyPayment * 12;

  const navSeries: number[] = [];
  const reEquitySeries: number[] = [];
  const structuralLongSeries: number[] = [];

  let structuralLongValue = structuralLongInitial;
  let treasuryCash = 0;
  let loanBalance = loanPrincipal;

  navSeries.push(propertyValue + structuralLongValue + treasuryCash - loanBalance);
  reEquitySeries.push(propertyValue - loanBalance);
  structuralLongSeries.push(structuralLongValue + treasuryCash);

  for (let year = 1; year <= 10; year += 1) {
    const noi = noiYear1 * (1 + noiGrowthRate) ** year;
    const excessNoi = Math.max(0, noi - annualDebtService);

    treasuryCash = treasuryCash * (1 + treasuryRate) + excessNoi;

    const paymentsMade = year * 12;
    loanBalance =
      (loanPrincipal * ((1 + monthlyRate) ** totalPayments - (1 + monthlyRate) ** paymentsMade)) /
      ((1 + monthlyRate) ** totalPayments - 1);

    const interimReValue = noi / entryCap;
    const beforeFeeNav = interimReValue + structuralLongValue + treasuryCash - loanBalance;
    const managementFee = year <= 5 ? lpCapital * managementFeeRate : Math.max(0, beforeFeeNav) * managementFeeRate;

    structuralLongValue = structuralLongValue * (1 + structuralLongReturn) - managementFee;
    if (structuralLongValue < 0) {
      structuralLongValue = 0;
    }

    const chartReValue = year === 10 ? noi / exitCap : interimReValue;

    navSeries.push(chartReValue + structuralLongValue + treasuryCash - loanBalance);
    reEquitySeries.push(chartReValue - loanBalance);
    structuralLongSeries.push(structuralLongValue + treasuryCash);
  }

  const noiYear10 = noiYear1 * (1 + noiGrowthRate) ** 10;
  const exitReValue = noiYear10 / exitCap;
  const totalValue = exitReValue + structuralLongValue + treasuryCash - loanBalance;
  const grossProfit = totalValue - lpCapital;

  const preferredHurdle = lpCapital * (1.09 ** 10 - 1);
  let gpCarry = 0;
  if (grossProfit > preferredHurdle) {
    const excessProfit = grossProfit - preferredHurdle;
    const catchupBand = Math.min(excessProfit, preferredHurdle * 0.25);
    gpCarry = catchupBand + Math.max(0, excessProfit - catchupBand) * 0.2;
  }

  const grossMoic = totalValue / lpCapital;
  const grossIrr = (Math.max(0.01, totalValue) / lpCapital) ** 0.1 - 1;

  const lpDistribution = totalValue - gpCarry;
  const lpNetProfit = lpDistribution - lpCapital;
  const lpNetMoic = lpDistribution / lpCapital;
  const lpNetIrr = (Math.max(0.01, lpDistribution) / lpCapital) ** 0.1 - 1;

  return {
    navSeries,
    reEquitySeries,
    structuralLongSeries,
    grossIrr,
    grossMoic,
    lpNetIrr,
    lpNetMoic,
    lpNetProfit,
    gpCarry
  };
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatMoic(value: number) {
  return `${value.toFixed(2)}x`;
}

function formatMoneyMillions(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(1)}M`;
}

function metricValue(result: ScenarioResult, key: (typeof slideData.metrics)[number]["key"]) {
  switch (key) {
    case "grossIrr":
      return formatPercent(result.grossIrr);
    case "grossMoic":
      return formatMoic(result.grossMoic);
    case "lpNetIrr":
      return formatPercent(result.lpNetIrr);
    case "lpNetMoic":
      return formatMoic(result.lpNetMoic);
    case "lpNetProfit":
      return formatMoneyMillions(result.lpNetProfit);
    case "gpCarry":
      return formatMoneyMillions(result.gpCarry);
    default:
      return "";
  }
}

const xLabels = ["Yr 0", "Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5", "Yr 6", "Yr 7", "Yr 8", "Yr 9", "Yr 10"];

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
        font: { family: fonts.data, size: 9, weight: 300 }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: theme.textTertiary,
        font: { family: fonts.data, size: 9, weight: 300 },
        callback: (value) => `$${Number(value).toFixed(0)}M`
      },
      title: {
        display: true,
        text: "Value ($M)",
        color: theme.textMuted,
        font: { family: fonts.data, size: 9, weight: 400 }
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
        label: (item) => `${item.dataset.label}: $${Number(item.raw).toFixed(1)}M`
      }
    }
  }
};

export function Slide50ScenarioAnalysis() {
  const [controls, setControls] = useState<ScenarioValues>(() => defaultControls());

  const scenarioResult = useMemo(() => calculateScenario(controls), [controls]);

  const chartData: ChartData<"line"> = {
    labels: xLabels,
    datasets: [
      {
        label: "Total NAV",
        data: scenarioResult.navSeries,
        borderColor: chartSeriesColor(theme, 1),
        backgroundColor: hexToRgba(chartSeriesColor(theme, 1), 0.12),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        tension: 0.28,
        fill: true
      },
      {
        label: "RE Equity",
        data: scenarioResult.reEquitySeries,
        borderColor: chartSeriesColor(theme, 0),
        backgroundColor: hexToRgba(chartSeriesColor(theme, 0), 0.08),
        borderWidth: 2,
        pointRadius: 2.5,
        pointHoverRadius: 4,
        tension: 0.28,
        fill: true
      },
      {
        label: "Structural Long + Cash",
        data: scenarioResult.structuralLongSeries,
        borderColor: theme.caution,
        backgroundColor: hexToRgba(theme.caution, 0.08),
        borderWidth: 2,
        pointRadius: 2.5,
        pointHoverRadius: 4,
        tension: 0.28,
        fill: true
      }
    ]
  };

  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />

      <div className="scenario-layout">
        <div className="scenario-controls-grid">
          {slideData.controls.map((control) => (
            <article key={control.id} className="scenario-control-card">
              <label className="scenario-control-label" htmlFor={`scenario-${control.id}`}>
                {control.label}
              </label>
              <div className="scenario-control-value">{controls[control.id].toFixed(1)}%</div>
              <input
                id={`scenario-${control.id}`}
                className="scenario-control-range"
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={controls[control.id]}
                onChange={(event) => {
                  const nextValue = Number(event.currentTarget.value);
                  setControls((previous) => ({ ...previous, [control.id]: nextValue }));
                }}
              />
            </article>
          ))}
        </div>

        <div className="chart-area scenario-chart-area">
          <LineChart data={chartData} options={chartOptions} />
        </div>

        <div className="scenario-metrics-grid">
          {slideData.metrics.map((metric) => (
            <article key={metric.key} className={`scenario-metric-card scenario-metric-card--${metric.tone}`}>
              <div className="scenario-metric-value">{metricValue(scenarioResult, metric.key)}</div>
              <div className="scenario-metric-label">{metric.label}</div>
            </article>
          ))}
        </div>
      </div>

      <SourceLine text={slideData.sourceLine} tight />
    </>
  );
}
