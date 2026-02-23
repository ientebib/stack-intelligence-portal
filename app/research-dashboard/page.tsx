import { InvestorAuthGate } from "@/components/ui/InvestorAuthGate";
import { ResearchDashboardApp } from "@/components/research-dashboard/ResearchDashboardApp";

export default function ResearchDashboardPage() {
  return (
    <InvestorAuthGate>
      <ResearchDashboardApp />
    </InvestorAuthGate>
  );
}
