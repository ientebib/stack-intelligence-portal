import Link from "next/link";

type GatewayHealth = {
  status: string;
  framework_root: string;
  framework_exists: boolean;
  snapshot_count: number;
  latest_snapshot: string | null;
};

type KpiListResponse = {
  snapshot: string;
  count: number;
};

async function fetchGatewayData<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gateway request failed (${response.status})`);
  }
  return response.json();
}

export default async function ResearchGatewayStatusPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

  let health: GatewayHealth | null = null;
  let kpis: KpiListResponse | null = null;
  let error: string | null = null;

  try {
    health = await fetchGatewayData<GatewayHealth>(`${apiBaseUrl}/health`);
    kpis = await fetchGatewayData<KpiListResponse>(
      `${apiBaseUrl}/api/research/kpis?snapshot=latest`,
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown gateway error";
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
      <h1>Research Gateway Status</h1>
      <p>
        API base URL: <code>{apiBaseUrl}</code>
      </p>

      {error ? (
        <section>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <p>
            Make sure backend gateway is running:
            <br />
            <code>
              python3 -m uvicorn gateway.research_gateway:app --host 127.0.0.1 --port 8000
            </code>
          </p>
        </section>
      ) : (
        <section>
          <h2>Connected</h2>
          <p>Status: {health?.status}</p>
          <p>Framework path: {health?.framework_root}</p>
          <p>Latest snapshot: {health?.latest_snapshot}</p>
          <p>Total snapshots: {health?.snapshot_count}</p>
          <p>KPIs in latest snapshot: {kpis?.count}</p>
          <p>Snapshot used for KPIs: {kpis?.snapshot}</p>
          <p>
            Try API directly:{" "}
            <a href={`${apiBaseUrl}/api/research/kpis?snapshot=latest`} target="_blank">
              /api/research/kpis?snapshot=latest
            </a>
          </p>
        </section>
      )}

      <p style={{ marginTop: 24 }}>
        <Link href="/research-dashboard">Back to Research Dashboard</Link>
      </p>
    </main>
  );
}
