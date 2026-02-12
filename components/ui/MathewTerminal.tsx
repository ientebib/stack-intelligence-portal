"use client";

import { useEffect, useRef, useState } from "react";

/* ── Animation Script ─────────────────────────────────────── */

type AnimStep =
  | { action: "think"; text: string; speed?: number }
  | { action: "print"; text: string; delay?: number; cls?: string }
  | { action: "wait"; ms: number };

const ANIMATION: AnimStep[] = [
  // ── Workspace Loading ──
  { action: "print", text: "Loading workspace\u2026", cls: "dim" },
  { action: "wait", ms: 900 },
  { action: "print", text: "> cat .mathew/thesis_policy.md", cls: "cmd" },
  { action: "wait", ms: 600 },
  { action: "print", text: "Thesis v2.1 \u2014 Structural AI infrastructure buildout cycle", delay: 200 },
  { action: "print", text: "Invalidation triggers: 0 of 6 active \u00b7 Last updated: Jan 15, 2026", delay: 200, cls: "dim" },
  { action: "wait", ms: 700 },
  { action: "print", text: "> cat .mathew/portfolio_state.toon", cls: "cmd" },
  { action: "wait", ms: 600 },
  { action: "print", text: "Stack Fund I \u2014 $20.0M NAV", cls: "header", delay: 200 },
  { action: "print", text: "Equities             $14.2M    71%    NVDA AMD TSM AVGO VRT MRVL", delay: 180 },
  { action: "print", text: "Commodities          $3.8M     19%    Copper, Uranium", delay: 180 },
  { action: "print", text: "Treasury+Reserve     $2.0M     10%", delay: 180 },
  { action: "wait", ms: 500 },
  { action: "print", text: "\u2713 Portfolio loaded", cls: "success", delay: 250 },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },
  { action: "print", text: "Checking data freshness\u2026", cls: "dim" },
  { action: "wait", ms: 900 },
  { action: "print", text: "financials/NVDA/    last sync: 14d ago  \u26a0 Q3 FY2026 not ingested", cls: "warn", delay: 280 },
  { action: "print", text: "supply/cowos.toon   last sync: 21d ago  \u26a0 new TrendForce data available", cls: "warn", delay: 280 },
  { action: "wait", ms: 500 },
  { action: "print", text: "\u26a0 2 items stale", cls: "warn", delay: 250 },
  { action: "wait", ms: 650 },
  { action: "print", text: "" },
  { action: "print", text: "Ready.", cls: "header" },
  { action: "wait", ms: 1000 },
  { action: "print", text: "" },
  { action: "print", text: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", cls: "dim" },
  { action: "print", text: "" },

  // ── Query ──
  { action: "print", text: "isaac: @mathew NVDA reports Q4 on Feb 25. Full research update \u2014 does the thesis hold and is it priced for it?", cls: "user" },
  { action: "wait", ms: 1100 },
  { action: "print", text: "" },
  { action: "print", text: "mathew is thinking\u2026", cls: "pulse" },
  { action: "wait", ms: 2500 },
  { action: "print", text: "" },

  // ── Reasoning ──
  { action: "think", text: "NVDA financials are 14 days stale \u2014 need to sync before anything else. The real question Isaac is asking isn\u2019t business quality, it\u2019s whether the current market cap already prices in the beat cadence. Let me load the equity research skill and run this properly.", speed: 28 },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },
  { action: "print", text: "> cat skills/equity-research/SKILL.md", cls: "cmd" },
  { action: "wait", ms: 600 },
  { action: "print", text: "Workflow: data_refresh \u2192 assumptions \u2192 valuation \u2192 synthesis", delay: 200 },
  { action: "print", text: "Output: runs/research/nvda/brief.md", delay: 200, cls: "dim" },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 1: Data Refresh ──
  { action: "print", text: "Step 1 \u00b7 Data Refresh", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "> python tools/fmp_sync.py --ticker NVDA --quarters Q1-Q3-FY2026", cls: "cmd" },
  { action: "wait", ms: 1000 },
  { action: "print", text: "\u2713 5 .toon files synced", cls: "success", delay: 250 },
  { action: "wait", ms: 500 },
  { action: "print", text: "" },
  { action: "print", text: "> grep revenue financials/NVDA/income_Q*_FY2026.toon", cls: "cmd" },
  { action: "wait", ms: 800 },
  { action: "print", text: "Q1 $44.1B +69% \u00b7 Q2 $46.7B +56% \u00b7 Q3 $57.0B +62% (beat $55.2B est by 3.3%)", delay: 240 },
  { action: "print", text: "Q4 guidance: $65.0B \u00b12%", delay: 240 },
  { action: "print", text: "FY26 YTD: $147.8B \u2014 already exceeds FY2025 full year ($130.5B)", delay: 240, cls: "header" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "> grep segments financials/NVDA/segments_Q3_FY2026.toon", cls: "cmd" },
  { action: "wait", ms: 700 },
  { action: "print", text: "Data center $51.2B 89.8% +66% YoY \u00b7 Gaming $4.3B \u00b7 Auto $592M", delay: 240 },
  { action: "wait", ms: 500 },
  { action: "print", text: "" },
  { action: "print", text: "> grep gross_margin financials/NVDA/income_Q*_FY2026.toon", cls: "cmd" },
  { action: "wait", ms: 700 },
  { action: "print", text: "Q1 60.5% (H20 charge) \u2192 Q2 72.7% \u2192 Q3 73.6% \u2192 Q4 guided 75.0%", delay: 240 },
  { action: "print", text: "Mgmt targeting mid-70s into FY2027", delay: 240, cls: "dim" },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 2: Market Pricing ──
  { action: "print", text: "Step 2 \u00b7 What Is the Market Pricing In?", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "> python tools/implied_growth.py --ticker NVDA --ev 4720", cls: "cmd" },
  { action: "wait", ms: 1100 },
  { action: "print", text: "Implied 5Y revenue CAGR: 22.4%", delay: 240 },
  { action: "print", text: "Consensus 5Y revenue CAGR: 17.8%", delay: 240 },
  { action: "print", text: "Gap: +4.6pp \u2014 market prices ABOVE consensus. Sustained beats are already embedded.", delay: 240, cls: "warn" },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },
  { action: "think", text: "At $4.58T, there\u2019s no margin of safety. A single miss at this multiple gets punished. The real question is whether the beat cadence is sustainable \u2014 and that depends on supply chain capacity.", speed: 28 },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 3: Bear Case ──
  { action: "print", text: "Step 3 \u00b7 Bear Case", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "Three vectors identified:", cls: "dim", delay: 200 },
  { action: "print", text: "" },
  { action: "print", text: "Margin compression \u2014 HBM repricing +high-teens % (SK Hynix, Samsung). Every 1pp margin = ~$2B operating income.", delay: 280, cls: "bear" },
  { action: "print", text: "ASIC diversification \u2014 Broadcom custom ASIC SAM $60-90B by 2027. Google TPU, Amazon Trainium, MSFT Maia all scaling.", delay: 280, cls: "bear" },
  { action: "print", text: "Capex fatigue \u2014 Oracle funding constraints in Dec 2025 took NVDA down 3.8% in a day. Market is sensitive to any spending pause signal.", delay: 280, cls: "bear" },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 4: Supply Chain ──
  { action: "print", text: "Step 4 \u00b7 Supply Chain (Thesis Check)", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "> python tools/api_pull.py --source semi_analysis --fields cowos,hbm", cls: "cmd" },
  { action: "wait", ms: 1000 },
  { action: "print", text: "CoWoS capacity: 75-80K wafers/month \u2192 targeting 120-130K by end 2026", delay: 240 },
  { action: "print", text: "CoWoS fully booked. NVDA holds ~60% of 2026 allocation. AMD ~11%. <15% left for everyone else.", delay: 240 },
  { action: "print", text: "HBM3e: sold out through 2026 (SK Hynix CFO, Micron CEO \u2014 both confirmed on earnings calls)", delay: 240 },
  { action: "print", text: "Global CoWoS demand: 370K wafers (2024) \u2192 670K (2025) \u2192 1M (2026E)", delay: 240 },
  { action: "wait", ms: 700 },
  { action: "print", text: "" },
  { action: "think", text: "Supply constraint supports pricing power (good for margins) but also limits upside (can\u2019t sell what TSMC can\u2019t package). These two effects partially offset.", speed: 28 },
  { action: "wait", ms: 700 },
  { action: "print", text: "" },
  { action: "print", text: "Cross-referencing copper position\u2026", cls: "dim" },
  { action: "wait", ms: 800 },
  { action: "print", text: "> python tools/api_pull.py --source trading_economics --fields copper", cls: "cmd" },
  { action: "wait", ms: 900 },
  { action: "print", text: "COMEX copper: $5.90/lb \u00b7 LME: $12,980/tonne (record $13,000 hit Jan 2026)", delay: 240 },
  { action: "print", text: "2025 return: +43% \u2014 best year since 2009", delay: 240 },
  { action: "print", text: "Split consensus: China Securities sees 100K tonne deficit. Goldman sees 600K surplus. Flagging.", delay: 240, cls: "warn" },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 5: DCF Valuation ──
  { action: "print", text: "Step 5 \u00b7 DCF Valuation", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "> python tools/dcf_model.py --config runs/research/nvda/dcf_inputs.json", cls: "cmd" },
  { action: "wait", ms: 1200 },
  { action: "print", text: "" },
  { action: "print", text: "                    Bull      Base      Bear", cls: "tbl-head", delay: 160 },
  { action: "print", text: "  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", cls: "dim", delay: 100 },
  { action: "print", text: "  5Y CAGR           24%       18%       12%", delay: 200 },
  { action: "print", text: "  Terminal margin   36%       33%       28%", delay: 200 },
  { action: "print", text: "  Fair value/sh     ~$280     ~$181     ~$107", delay: 200 },
  { action: "print", text: "  vs current        +49%      \u22124%       \u221243%", delay: 200 },
  { action: "print", text: "" },
  { action: "print", text: "Current ~$188. Base case says roughly fair. Upside requires sustained beats. Bear case is \u221243%.", delay: 260 },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },

  // ── Step 6: Synthesis ──
  { action: "print", text: "Step 6 \u00b7 Synthesis", cls: "step" },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "\u2713 Brief saved \u2192 runs/research/nvda/brief.md", cls: "success", delay: 300 },
  { action: "wait", ms: 600 },
  { action: "print", text: "" },
  { action: "print", text: "THESIS ALIGNMENT: Strong \u2014 every supply chain data point confirms structural buildout", cls: "synth", delay: 260 },
  { action: "print", text: "VALUATION: Fairly valued at $4.58T \u2014 limited margin of safety", cls: "synth", delay: 260 },
  { action: "print", text: "RECOMMENDATION: HOLD current allocation. Do not add. Revisit on pullback to $155-165.", cls: "synth-hold", delay: 260 },
  { action: "wait", ms: 800 },
  { action: "print", text: "" },
  { action: "print", text: "Flags for IC:", cls: "header" },
  { action: "print", text: "  \u26a0 No margin of safety for new capital at current levels", cls: "warn", delay: 260 },
  { action: "print", text: "  \u26a0 HBM cost repricing pressures FY2027 margins", cls: "warn", delay: 260 },
  { action: "print", text: "  \u26a0 NVDA + TSM = ~45% of equity sleeve \u2014 concentration risk", cls: "warn", delay: 260 },
  { action: "print", text: "  \u26a0 Goldman vs China Securities disagree on copper balance", cls: "warn", delay: 260 },
  { action: "wait", ms: 500 },
  { action: "print", text: "  \u2713 Thesis invalidation triggers: 0 of 6 active", cls: "success", delay: 260 },
  { action: "print", text: "  \u2713 Next catalyst: Feb 25 \u2014 Q4 FY2026 earnings", cls: "success", delay: 260 },

  // ── Save to memory ──
  { action: "wait", ms: 900 },
  { action: "print", text: "" },
  { action: "print", text: "Saving to memory\u2026", cls: "dim" },
  { action: "wait", ms: 650 },
  { action: "print", text: "\u2713 Research brief saved \u00b7 8 trackers updated \u00b7 Next scan: 18h", cls: "success", delay: 350 },
];

/* ── Terminal Component ───────────────────────────────────── */

type DisplayLine = { text: string; cls?: string };

export function MathewTerminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [typingLine, setTypingLine] = useState("");
  const [typingCls, setTypingCls] = useState<string | undefined>();
  const [cursorOn, setCursorOn] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    function sleep(ms: number) {
      return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }

    async function thinkText(text: string, speed = 26) {
      setTypingCls("think");
      const words = text.split(" ");
      let built = "";
      for (let i = 0; i < words.length; i += 1) {
        if (cancelled) return;
        built += (i === 0 ? "" : " ") + words[i];
        setTypingLine(built);
        await sleep(speed + Math.random() * 35);
      }
      if (cancelled) return;
      setLines((prev) => [...prev, { text, cls: "think" }]);
      setTypingLine("");
      setTypingCls(undefined);
    }

    async function printLine(text: string, delay = 60, cls?: string) {
      if (cancelled) return;
      await sleep(delay);
      setLines((prev) => [...prev, { text, cls }]);
    }

    async function run() {
      await sleep(500);
      for (const step of ANIMATION) {
        if (cancelled) return;
        if (step.action === "think") {
          await thinkText(step.text, step.speed);
        } else if (step.action === "print") {
          await printLine(step.text, step.delay, step.cls);
        } else {
          await sleep(step.ms);
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((prev) => !prev), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, typingLine]);

  function lineClass(cls?: string) {
    if (!cls) return "mathew-ln";
    return `mathew-ln mathew-ln--${cls}`;
  }

  return (
    <div className="mathew-overlay" onClick={onClose}>
      <div className="mathew-terminal" onClick={(e) => e.stopPropagation()}>
        <div className="mathew-bar">
          <div className="mathew-dots">
            <span className="mathew-dot mathew-dot--red" />
            <span className="mathew-dot mathew-dot--yellow" />
            <span className="mathew-dot mathew-dot--green" />
          </div>
          <span className="mathew-bar-title">mathew &mdash; Stack Capital AI Research</span>
          <button className="mathew-bar-close" onClick={onClose}>&times;</button>
        </div>
        <div className="mathew-body" ref={bodyRef}>
          {lines.map((line, i) => (
            <div key={i} className={lineClass(line.cls)}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {typingLine ? (
            <div className={lineClass(typingCls)}>
              {typingLine}
              <span className={`mathew-cursor${cursorOn ? "" : " mathew-cursor--off"}`}>{"\u2588"}</span>
            </div>
          ) : (
            <div className="mathew-ln">
              <span className={`mathew-cursor${cursorOn ? "" : " mathew-cursor--off"}`}>{"\u2588"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
