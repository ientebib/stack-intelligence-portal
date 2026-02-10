import { slide08MacroShiftDividerData } from "@/lib/data/slides";

const slideData = slide08MacroShiftDividerData;

export function Slide08MacroShiftDivider() {
  return (
    <>
      <div className="section-divider-wrap">
        <div className="section-divider-block">
          <div className="section-divider-kicker">{slideData.title}</div>
          <div className="section-divider-headline">{slideData.subtitle}</div>
        </div>
      </div>
    </>
  );
}
