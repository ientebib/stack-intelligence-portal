type SlideHeaderBarProps = {
  slideNumber: number;
  totalSlides: number;
};

export function SlideHeaderBar({ slideNumber, totalSlides }: SlideHeaderBarProps) {
  return (
    <div className="slide-header-bar">
      <div className="slide-header-left">
        <div className="slide-header-logo">
          <span>S</span>
        </div>
        <span className="slide-header-wordmark">The Stack</span>
      </div>
      <span className="slide-header-meta">
        Confidential &middot; {slideNumber} / {totalSlides}
      </span>
    </div>
  );
}
