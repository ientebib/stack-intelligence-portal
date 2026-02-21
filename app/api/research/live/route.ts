import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type {
  LiveHypothesis,
  LiveKpi,
  ResearchLivePayload,
  SignalBand,
} from "@/lib/research-dashboard/types";

export const runtime = "nodejs";

const DEFAULT_FRAMEWORK_PATH = "/Users/isaacentebi/stack-research-framework/stack-research-framework";
const SNAPSHOT_ID_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type ManifestKpi = {
  kpi_id?: string;
  band?: Exclude<SignalBand, "missing">;
  value?: number;
  observation_period?: string;
};

type RegistryTrend = {
  trend_id?: string;
  name?: string;
  hypotheses?: Array<{
    hypothesis_id?: string;
    claim_summary?: string;
    tier?: number;
    status?: string;
  }>;
};

type KpiDefinition = {
  kpi_id?: string;
  hypothesis_id?: string;
  name?: string;
  definition?: { units?: string };
  data_source?: { primary?: string };
  frequency?: string;
  latency?: string;
  quality_grade?: { grade?: string };
  missing_data_policy?: string;
};

type KpiSnapshotDetail = {
  delta?: number;
  history?: Array<{ period?: string; value?: number }>;
};

function frameworkRoot(): string {
  return process.env.STACK_RESEARCH_FRAMEWORK_PATH ?? DEFAULT_FRAMEWORK_PATH;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function listSnapshotIds(snapshotsDir: string): Promise<string[]> {
  const entries = await fs.readdir(snapshotsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && SNAPSHOT_ID_REGEX.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function normalizeHistory(history: KpiSnapshotDetail["history"]): Array<{ period: string; value: number }> {
  return (history ?? [])
    .map((point) => ({
      period: point.period ?? "",
      value: typeof point.value === "number" ? point.value : Number.NaN,
    }))
    .filter((point) => point.period && Number.isFinite(point.value));
}

function bandPriority(band: Exclude<SignalBand, "missing">): number {
  if (band === "weaken") return 3;
  if (band === "neutral") return 2;
  return 1;
}

function inferHypothesisSignal(kpis: LiveKpi[]): Exclude<SignalBand, "missing"> {
  const bands = kpis
    .map((kpi) => kpi.band)
    .filter((band): band is Exclude<SignalBand, "missing"> => band !== "missing");
  if (bands.length === 0) return "neutral";

  let current: Exclude<SignalBand, "missing"> = "support";
  for (const band of bands) {
    if (bandPriority(band) > bandPriority(current)) current = band;
  }
  return current;
}

export async function GET() {
  try {
    const root = frameworkRoot();
    const snapshotsDir = path.join(root, "data", "snapshots");
    const snapshotIds = await listSnapshotIds(snapshotsDir);
    if (snapshotIds.length === 0) {
      return NextResponse.json({ error: "No snapshots found", snapshotsDir }, { status: 500 });
    }

    const snapshot = snapshotIds[snapshotIds.length - 1];
    const snapshotDir = path.join(snapshotsDir, snapshot);

    const manifest = await readJson<{
      computed_at?: string;
      kpis_computed?: ManifestKpi[];
    }>(path.join(snapshotDir, "manifest.json"));
    const registry = await readJson<{
      trends?: RegistryTrend[];
      dependency_graph?: Array<{ from?: string; to?: string; relationship?: string }>;
    }>(path.join(root, "ledgers", "ledger0_registry.json"));

    const manifestByKpi = new Map<string, ManifestKpi>();
    for (const row of manifest.kpis_computed ?? []) {
      if (!row.kpi_id) continue;
      manifestByKpi.set(row.kpi_id, row);
    }

    const trendSummaries: ResearchLivePayload["trends"] = [];
    const hypotheses = new Map<string, LiveHypothesis>();

    for (const trend of registry.trends ?? []) {
      const trendId = trend.trend_id ?? "UNKNOWN";
      const trendName = trend.name ?? "Unknown Trend";
      const hypothesisIds: string[] = [];

      for (const hypothesis of trend.hypotheses ?? []) {
        const hypothesisId = hypothesis.hypothesis_id;
        if (!hypothesisId) continue;
        hypothesisIds.push(hypothesisId);
        hypotheses.set(hypothesisId, {
          hypothesisId,
          trendId,
          trendName,
          claimSummary: hypothesis.claim_summary ?? "",
          tier: hypothesis.tier,
          status: hypothesis.status,
          signal: "neutral",
          kpis: [],
        });
      }

      trendSummaries.push({ trendId, trendName, hypotheses: hypothesisIds });
    }

    const kpiDir = path.join(root, "objects", "kpis");
    const kpiFiles = (await fs.readdir(kpiDir)).filter((file) => file.endsWith(".json")).sort();

    let support = 0;
    let neutral = 0;
    let weaken = 0;
    let kpisComputed = 0;

    for (const file of kpiFiles) {
      const def = await readJson<KpiDefinition>(path.join(kpiDir, file));
      const kpiId = def.kpi_id ?? path.basename(file, ".json");
      const hypothesisId = def.hypothesis_id;
      if (!hypothesisId) continue;
      const hypothesis = hypotheses.get(hypothesisId);
      if (!hypothesis) continue;

      const liveRow = manifestByKpi.get(kpiId);
      const band: SignalBand = liveRow?.band ?? "missing";

      if (liveRow) {
        kpisComputed += 1;
        if (liveRow.band === "support") support += 1;
        if (liveRow.band === "neutral") neutral += 1;
        if (liveRow.band === "weaken") weaken += 1;
      }

      let detail: KpiSnapshotDetail | null = null;
      try {
        detail = await readJson<KpiSnapshotDetail>(path.join(snapshotDir, `${kpiId}.json`));
      } catch {
        detail = null;
      }

      hypothesis.kpis.push({
        kpiId,
        hypothesisId,
        name: def.name ?? kpiId,
        value: typeof liveRow?.value === "number" ? liveRow.value : null,
        units: def.definition?.units,
        band,
        observationPeriod: liveRow?.observation_period,
        delta: detail?.delta ?? null,
        history: normalizeHistory(detail?.history),
        sourcePrimary: def.data_source?.primary,
        frequency: def.frequency,
        latency: def.latency,
        qualityGrade: def.quality_grade?.grade,
        missingDataPolicy: def.missing_data_policy,
      });
    }

    const hypothesisList = Array.from(hypotheses.values())
      .map((hypothesis) => ({
        ...hypothesis,
        signal: inferHypothesisSignal(hypothesis.kpis),
        kpis: [...hypothesis.kpis].sort((a, b) => a.kpiId.localeCompare(b.kpiId)),
      }))
      .sort((a, b) => a.hypothesisId.localeCompare(b.hypothesisId));

    const dependencies = (registry.dependency_graph ?? [])
      .filter((edge) => edge.from && edge.to)
      .map((edge) => ({
        from: edge.from as string,
        to: edge.to as string,
        relationship: edge.relationship ?? "requires",
      }));

    const payload: ResearchLivePayload = {
      snapshot,
      computedAt: manifest.computed_at,
      totals: {
        kpisDefined: kpiFiles.length,
        kpisComputed,
        support,
        neutral,
        weaken,
        hypotheses: hypothesisList.length,
        hypothesesWithData: hypothesisList.filter((h) => h.kpis.some((k) => k.band !== "missing"))
          .length,
      },
      trends: trendSummaries,
      hypotheses: hypothesisList,
      dependencies,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to build research dashboard payload",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
