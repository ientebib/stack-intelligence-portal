type SectionHeaderProps = {
  sectionLabel: string;
  title: string;
  subtitle: string;
};

export function SectionHeader({ sectionLabel, title, subtitle }: SectionHeaderProps) {
  return (
    <>
      <div className="section-label">{sectionLabel}</div>
      <div className="slide-title">{title}</div>
      <div className="slide-subtitle">{subtitle}</div>
    </>
  );
}
