import { ProcessDocReportFilterProvider } from "@/components/context/ad-plan/MultiFilterProcDocRepContext";
import { ADPlanTable8MultiFilterProvider } from "@/components/context/ad-plan/MultiFilterTable8Context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function ADPlanTable8Layout({ children }: AppLayoutProps) {
  const initialProcDocReportMultiFilter = {
    region: ["All"],
    province: ["All"],
    city: ["All"],
    municipality: ["All"],
    baranggay: ["All"],
    WFPActivity: ["All"],
    month: ["All"],
    year: ["All"],
    preActivity: ["All"],
    during: ["All"],
    postActivity: ["All"],
    noOfParticipants:["All"]
  };


  const initialTable8MultiFilter = {
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
    <ProcessDocReportFilterProvider initialMultiFilter={initialProcDocReportMultiFilter}>
      <ADPlanTable8MultiFilterProvider initialMultiFilter={initialTable8MultiFilter}>
        <div>{children}</div>
      </ADPlanTable8MultiFilterProvider>
    </ProcessDocReportFilterProvider>
  );
}
