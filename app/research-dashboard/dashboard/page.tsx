import { InvestorAuthGate } from "@/components/ui/InvestorAuthGate";
import { ResearchDashboardApp } from "@/components/research-dashboard/ResearchDashboardApp";

export default function ResearchDashboardAppPage() {
  return (
    <InvestorAuthGate>
      <ResearchDashboardApp />
    </InvestorAuthGate>
  );
}
