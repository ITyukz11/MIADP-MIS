import { ADPlanTable8MultiFilterProvider } from "@/components/context/ad-plan/MultiFilterTable8Context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function ADPlanTable8Layout({ children }: AppLayoutProps) {
  const initialMultiFilter = {
    region: ["All"],
    // lgu: ["All"],
    commodities: ["All"],
    infraEntrep: ["All"],
    typeOfSP: ["All"],
    // location: ["All"],
    validated: ["All"],
    conceptNote: ["All"],
  };
  return (
    <ADPlanTable8MultiFilterProvider initialMultiFilter={initialMultiFilter}>
      <div>{children}</div>
    </ADPlanTable8MultiFilterProvider>
  );
}
