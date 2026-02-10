import { SectionHeader, SourceLine } from "@/components/ui";
import { slide07ExecutiveSummaryData } from "@/lib/data/slides";

const slideData = slide07ExecutiveSummaryData;

export function Slide07ExecutiveSummary() {
  return (
    <>
      <SectionHeader
        sectionLabel={slideData.sectionLabel}
        title={slideData.title}
        subtitle={slideData.subtitle || " "}
      />

      <div className="exec-summary-layout">
        <div className="exec-summary-thesis-stack">
          <section className="exec-summary-thesis-block">
            <h3 className="exec-summary-thesis-title exec-summary-primary-tone">
              THESIS A — MACRO CONSTRAINT
            </h3>
            <p className="exec-summary-thesis-body">
              The post-1950s monetary and political order is entering a <strong>regime of tightening constraint</strong>. Public debt is high, interest burdens are rising, geopolitics are fragmenting, and institutional credibility is weakening. <strong>Policy flexibility narrows</strong>: sustaining restrictive real financial conditions becomes progressively more costly. The adjustment path is a <strong>structural repricing toward assets with direct claims on real resources</strong> and productive capacity, and away from purely nominal financial claims.
            </p>
          </section>

          <section className="exec-summary-thesis-block">
            <h3 className="exec-summary-thesis-title exec-summary-secondary-tone">
              THESIS B — AI INFRASTRUCTURE
            </h3>
            <p className="exec-summary-thesis-body">
              Frontier AI is shifting from incremental software gains to a <strong>general-purpose production technology</strong> that substitutes for economically productive cognitive labor. Productivity gains can be real while the buildout becomes <strong>capital- and energy-intensive</strong>, constrained by physical bottlenecks: power, chips, cooling, grid capacity, minerals, and land. The result is a mixed macro impulse: <strong>deflationary in cognition, inflationary in the physical layer</strong> that enables it.
            </p>
          </section>

          <section className="exec-summary-thesis-block">
            <h3 className="exec-summary-thesis-title exec-summary-intersection-tone">
              THE INTERSECTION
            </h3>
            <p className="exec-summary-thesis-body">
              These forces are not offsetting — <strong>they compound</strong>. AI raises potential output, but it also increases capital intensity and <strong>strains scarce inputs</strong> (power, grid hardware, chips, and minerals) inside a macro regime with less policy room to absorb shocks. As AI displaces labor, the political response skews toward <strong>redistribution and industrial policy</strong> — further widening structural deficits and reinforcing the drift toward real-asset repricing.
            </p>
          </section>
        </div>
      </div>

      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
