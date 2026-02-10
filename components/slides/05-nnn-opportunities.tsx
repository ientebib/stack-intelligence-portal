import { NnnPropertyCard, SectionHeader, SourceLine } from "@/components/ui";
import { slide05NnnOpportunitiesData } from "@/lib/data/slides";

const slideData = slide05NnnOpportunitiesData;

export function Slide05NnnOpportunities() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />

      <div className="nnn-grid">
        {slideData.cards.map((card) => (
          <NnnPropertyCard key={card.title} {...card} />
        ))}
      </div>

      <div className="nnn-process-row">
        {slideData.processSteps.map((step, index) => (
          <div
            key={step.title}
            className={`nnn-step ${index < slideData.processSteps.length - 1 ? "with-divider" : ""}`}
          >
            <div className="nnn-step-title">{step.title}</div>
            <div className="nnn-step-text">{step.description}</div>
          </div>
        ))}
      </div>

      <SourceLine text={slideData.sourceLine} tight />
    </>
  );
}
