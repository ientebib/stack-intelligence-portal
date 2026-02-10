import { redirect } from "next/navigation";

export default function DeckPage() {
  const mode = process.env.NEXT_PUBLIC_DECK_MODE ?? "react";
  redirect(mode === "legacy" ? "/InvestmentThesis.html" : "/deck-react");
}
