import type { Slide17UsAdvantageData } from "@/lib/data/types";

export const slide17UsAdvantageData: Slide17UsAdvantageData = {
  sectionLabel: "THESIS A - STRUCTURAL ADVANTAGE",
  title: "The US still grows. Most developed economies don't.",
  subtitle:
    "AI and reindustrialization can drive US GDP growth, but growth alone does not protect the dollar or reverse the fiscal trajectory.",
  cards: [
    {
      title: "GDP Growth & Demographics",
      metric: "2.4%",
      description: "IMF 2026 forecast - roughly 2x the Eurozone and 3x Japan.",
      points: [
        "Eurozone 1.2%, Japan 0.7%, UK 1.3%.",
        "US population +0.5%/yr while Japan, Germany, and China decline.",
        "$892B in R&D spending - 3.5% of GDP."
      ],
      tone: "primary"
    },
    {
      title: "Energy & Industrial Reliance",
      metric: "13.5M bbl/d",
      description: "Largest oil producer, net exporter since 2019. But dependency risk remains.",
      points: [
        "90% of advanced chips manufactured in Taiwan.",
        "100% import-reliant for gallium and graphite.",
        "$918B goods-and-services trade deficit in 2024."
      ],
      tone: "negative"
    },
    {
      title: "Innovation Ecosystem",
      metric: "7 of top 10",
      description: "Most valuable companies globally are American.",
      points: [
        "$21T combined market cap of the top 7 US companies.",
        "54% of global unicorns are American (853 companies).",
        "79% of global AI investment."
      ],
      tone: "primary"
    },
    {
      title: "Reserve Currency",
      metric: "58%",
      metricDelta: "from 72%",
      description: "USD share of global reserves has declined over two decades.",
      points: [
        "BRICS+ nations increasing local-currency settlement.",
        "Central-bank gold demand remains elevated.",
        "Fiscal expansion can accelerate reserve diversification."
      ],
      tone: "negative"
    }
  ],
  tensionLabel: "The tension",
  tensionBody:
    "The US can grow its way forward, but the path runs through fiscal expansion, AI-driven labor disruption, and commodity-intensive reindustrialization. GDP rises, while deficits and inflation pressure can rise with it.",
  sourceLine: "Source: IMF WEO Jan 2026; EIA; USGS MCS 2025; Census Bureau; PitchBook; Stanford HAI."
};
