export type SignalBand = "support" | "neutral" | "weaken" | "missing";

export type DependencyRelationship = "requires" | "amplifies" | "conditional_on" | string;

export type LiveKpi = {
  kpiId: string;
  hypothesisId: string;
  name: string;
  value: number | null;
  units?: string;
  band: SignalBand;
  observationPeriod?: string;
  delta?: number | null;
  history: Array<{ period: string; value: number }>;
  sourcePrimary?: string;
  frequency?: string;
  latency?: string;
  qualityGrade?: string;
  missingDataPolicy?: string;
};

export type LiveHypothesis = {
  hypothesisId: string;
  claimSummary: string;
  trendId: string;
  trendName: string;
  tier?: number;
  status?: string;
  signal: Exclude<SignalBand, "missing">;
  kpis: LiveKpi[];
};

export type TrendSummary = {
  trendId: string;
  trendName: string;
  hypotheses: string[];
};

export type DependencyEdge = {
  from: string;
  to: string;
  relationship: DependencyRelationship;
};

export type ResearchLivePayload = {
  snapshot: string;
  computedAt?: string;
  totals: {
    kpisDefined: number;
    kpisComputed: number;
    support: number;
    neutral: number;
    weaken: number;
    hypotheses: number;
    hypothesesWithData: number;
  };
  trends: TrendSummary[];
  hypotheses: LiveHypothesis[];
  dependencies: DependencyEdge[];
};
