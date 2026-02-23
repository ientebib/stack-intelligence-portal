import type { DeckSection, DeckSlide } from "@/components/deck/types";
import { Slide01Title } from "@/components/slides/01-title";
import { PitchSlide02Leadership } from "@/components/slides/pitch-02-leadership";
import { PitchSlide03IntelArch } from "@/components/slides/pitch-03-intelligence-arch";
import { Slide29AiValueChain } from "@/components/slides/29-ai-value-chain";
import { Slide47ResearchInfrastructure } from "@/components/slides/47-research-infrastructure";
import { Slide48LeadingIndicators } from "@/components/slides/48-leading-indicators";
import { PitchSlide03Thesis } from "@/components/slides/pitch-03-thesis";
import { PitchSlide04Fiscal } from "@/components/slides/pitch-04-fiscal";
import { PitchSlide09Reserves } from "@/components/slides/pitch-09-reserves";
import { PitchSlide05Scaling } from "@/components/slides/pitch-05-scaling";
import { PitchSlide07Adoption } from "@/components/slides/pitch-07-adoption";
import { PitchSlide06AiDemand } from "@/components/slides/pitch-06-ai-demand";
import { PitchSlide08Supply } from "@/components/slides/pitch-08-supply";
import { Slide26BeyondGold } from "@/components/slides/26-beyond-gold";
import { PitchSlide11Cape } from "@/components/slides/pitch-11-cape";
import { Slide08ScenarioMatrix } from "@/components/slides/08-scenario-matrix";
import { Slide50ScenarioAnalysis } from "@/components/slides/50-scenario-analysis";
import { Slide51TermsAtAGlance } from "@/components/slides/51-terms-at-a-glance";
import { Slide54ClosingQuestion } from "@/components/slides/54-closing-question";

export const shortDeckSections: DeckSection[] = [
  { from: 1, to: 2, label: "Overview" },
  { from: 3, to: 6, label: "How We Invest" },
  { from: 7, to: 15, label: "Thesis" },
  { from: 16, to: 16, label: "Scenarios" },
  { from: 17, to: 18, label: "Fund & Terms" },
  { from: 19, to: 19, label: "Closing" }
];

export const shortDeckSlides: DeckSlide[] = [
  {
    number: 1,
    title: "Cover",
    sectionLabel: "OVERVIEW",
    migrationStatus: "migrated",
    content: <Slide01Title />
  },
  {
    number: 2,
    title: "Leadership & Fund",
    sectionLabel: "OVERVIEW",
    migrationStatus: "migrated",
    content: <PitchSlide02Leadership />
  },
  {
    number: 3,
    title: "Intelligence Architecture",
    sectionLabel: "HOW WE INVEST",
    migrationStatus: "migrated",
    content: <PitchSlide03IntelArch />
  },
  {
    number: 4,
    title: "The 12 Layers of the Stack",
    sectionLabel: "HOW WE INVEST",
    migrationStatus: "migrated",
    content: <Slide29AiValueChain />
  },
  {
    number: 5,
    title: "Research Process",
    sectionLabel: "HOW WE INVEST",
    migrationStatus: "migrated",
    content: <Slide47ResearchInfrastructure />
  },
  {
    number: 6,
    title: "Research Monitoring Framework",
    sectionLabel: "HOW WE INVEST",
    migrationStatus: "migrated",
    content: <Slide48LeadingIndicators />
  },
  {
    number: 7,
    title: "Thesis Visual",
    sectionLabel: "THESIS",
    migrationStatus: "migrated",
    content: <PitchSlide03Thesis />
  },
  {
    number: 8,
    title: "Adoption & Revenue",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide07Adoption />
  },
  {
    number: 9,
    title: "AI Physical Demand",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide06AiDemand />
  },
  {
    number: 10,
    title: "Scaling Laws",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide05Scaling />
  },
  {
    number: 11,
    title: "Supply Constraints",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide08Supply />
  },
  {
    number: 12,
    title: "Beyond Gold",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <Slide26BeyondGold />
  },
  {
    number: 13,
    title: "Fiscal Dominance",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide04Fiscal />
  },
  {
    number: 14,
    title: "Reserve Rotation",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide09Reserves />
  },
  {
    number: 15,
    title: "Valuation Risk",
    sectionLabel: "EVIDENCE",
    migrationStatus: "migrated",
    content: <PitchSlide11Cape />
  },
  {
    number: 16,
    title: "Portfolio wins in any scenario",
    sectionLabel: "SCENARIOS",
    migrationStatus: "migrated",
    content: <Slide08ScenarioMatrix />
  },
  {
    number: 17,
    title: "Return Modeling",
    sectionLabel: "FUND",
    migrationStatus: "migrated",
    content: <Slide50ScenarioAnalysis />
  },
  {
    number: 18,
    title: "Fund Terms",
    sectionLabel: "TERMS",
    migrationStatus: "migrated",
    content: <Slide51TermsAtAGlance />
  },
  {
    number: 19,
    title: "Thank you",
    sectionLabel: "CLOSING",
    migrationStatus: "migrated",
    content: <Slide54ClosingQuestion />
  }
];
