import { SectionHeader, SourceLine } from "@/components/ui";
import { slide48LeadingIndicatorsData } from "@/lib/data/slides";

const slideData = slide48LeadingIndicatorsData;

function toneClass(tone: "primary" | "secondary" | "negative") {
  if (tone === "primary") {
    return "accent-primary";
  }
  if (tone === "secondary") {
    return "accent-secondary";
  }
  return "semantic-negative";
}

export function Slide48LeadingIndicators() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />

      <div className="ai-portfolio-layout">
        <div className="nnn-grid">
          {slideData.towers.map((tower) => (
            <article key={tower.title} className={`card card--${tower.tone}`}>
              <h3 className={`card-label ${toneClass(tower.tone)}`}>{tower.title}</h3>
              {tower.points.map((point) => (
                <p key={point} className="card-text">
                  {point}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className="chart-area ai-portfolio-chart-area">
          <h3 className="adoption-row-label">{slideData.coverageTitle}</h3>
          <table className="thesis-table">
            <thead>
              <tr>
                <th>Cadence</th>
                <th>AI Buildout</th>
                <th>Macro</th>
                <th>Market</th>
                <th>Portfolio Action</th>
              </tr>
            </thead>
            <tbody>
              {slideData.coverageRows.map((row) => (
                <tr key={row.cadence}>
                  <td>{row.cadence}</td>
                  <td>{row.aiBuildout}</td>
                  <td>{row.macro}</td>
                  <td>{row.market}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SourceLine text={slideData.sourceLine} tight />
    </>
  );
}
