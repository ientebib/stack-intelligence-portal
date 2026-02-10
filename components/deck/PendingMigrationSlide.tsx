type PendingMigrationSlideProps = {
  chartCount: number;
  hasSourceLine: boolean;
  inlineStyleAttrCount: number;
  lineStart: number;
  lineEnd: number;
  title: string;
};

export function PendingMigrationSlide({
  chartCount,
  hasSourceLine,
  inlineStyleAttrCount,
  lineStart,
  lineEnd,
  title
}: PendingMigrationSlideProps) {
  return (
    <div className="migration-pending-wrap">
      <div className="migration-pending-card">
        <div className="migration-pill">Migration Pending</div>
        <h3>{title || "Untitled slide"}</h3>
        <p>
          This slide still renders from the legacy deck. Keep using <code>/deck</code> for full-fidelity playback while
          this slide is ported to React.
        </p>

        <div className="migration-metadata-grid">
          <div>
            <span>Charts</span>
            <strong>{chartCount}</strong>
          </div>
          <div>
            <span>Source Line</span>
            <strong>{hasSourceLine ? "Yes" : "No"}</strong>
          </div>
          <div>
            <span>Inline Styles</span>
            <strong>{inlineStyleAttrCount}</strong>
          </div>
          <div>
            <span>Legacy Range</span>
            <strong>
              {lineStart}-{lineEnd}
            </strong>
          </div>
        </div>

        <a className="migration-link" href="/InvestmentThesis.html">
          Open Legacy Deck
        </a>
      </div>
    </div>
  );
}
