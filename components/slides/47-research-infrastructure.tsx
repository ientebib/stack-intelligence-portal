import Image from "next/image";
import { SectionHeader, SourceLine } from "@/components/ui";
import { slide47ResearchInfrastructureData } from "@/lib/data/slides";

const slideData = slide47ResearchInfrastructureData;

export function Slide47ResearchInfrastructure() {
  return (
    <>
      <SectionHeader sectionLabel={slideData.sectionLabel} title={slideData.title} subtitle={slideData.subtitle} />
      <div className="chart-area">
        <Image className="nnn-image" src={slideData.imagePath} alt={slideData.imageAlt} width={1600} height={900} />
      </div>
      <SourceLine text={slideData.sourceLine} />
    </>
  );
}
