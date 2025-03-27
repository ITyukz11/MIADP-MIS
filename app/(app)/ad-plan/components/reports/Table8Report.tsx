import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConstructionIcon } from "lucide-react";
import { Skeleton } from "antd";
import { FaProjectDiagram, FaStore } from "react-icons/fa";
import { GrValidate } from "react-icons/gr";
import { GiNotebook } from "react-icons/gi";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartSwitcher, {
  ChartType,
} from "@/app/(app)/activities/report/components/ChartSwitcher";
import {
  CommodityRankingChart,
  SubProjectAreaChart,
  SubProjectBarChart,
  SubProjectLineChart,
  SubProjectPieChart,
  SubProjectRadarChart,
  SubProjectScatterChart,
  SubProjectTreemap,
} from "@/app/(app)/activities/report/components/AnalyticsCharts";
import { countCommodities } from "../counts/countCommodities";
import { useADPlanTable8MultiFilter } from "@/components/context/ad-plan/MultiFilterTable8Context";

type Props = {};

const Table8Report = (props: Props) => {
  const { adPlanTable8Data, adPlanTable8Error, adPlanTable8Loading } =
    useADPlanTable8Data();
  const { currentMultiFilter } = useADPlanTable8MultiFilter();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Consolidated Filtering Logic
  const filterTable8 = useMemo(() => {
    return (data: any[]) => {
      return data.filter((table8) => {
        const matchesRegion =
          currentMultiFilter?.region?.includes("All") ||
          currentMultiFilter?.region?.includes(table8.region);

        const matchesCommodities =
          currentMultiFilter?.commodities?.includes("All") ||
          currentMultiFilter?.commodities?.some((commodity) =>
            table8.commodities.toLowerCase().includes(commodity.toLowerCase())
          );

        const matchesInfraEntrep =
          currentMultiFilter?.infraEntrep?.includes("All") ||
          currentMultiFilter?.infraEntrep?.includes(table8.infraEntrep);

        const matchesValidated =
          currentMultiFilter?.validated?.includes("All") || // Show all if "All" is selected
          currentMultiFilter?.validated?.some(
            (val: any) => val === table8.validated.toString() // Convert boolean to string for comparison
          );

        const matchesConcepNote =
          currentMultiFilter?.conceptNote?.includes("All") || // Show all if "All" is selected
          currentMultiFilter?.conceptNote?.some(
            (val: any) => val === table8.conceptNote.toString() // Convert boolean to string for comparison
          );

        return (
          // matchesType &&
          // matchesActivityType &&
          matchesRegion &&
          matchesCommodities &&
          matchesInfraEntrep &&
          matchesValidated &&
          matchesConcepNote
          // matchesUnit &&
          // matchesStatus &&
          // matchesWFPYear &&
          // matchesMonth
        );
      });
    };
  }, [currentMultiFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFilteredData(filterTable8(adPlanTable8Data));
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };

    fetchData();
  }, [adPlanTable8Data, filterTable8]);
  // Sample Data
  const sampleData = [
    {
      region: "IX",
      lgu: "ZAMBOANGA DEL SUR",
      commodities: "CORN",
      infraEntrep: "ENTREP",
      subproject:
        "Integrated Corn Production Enhancement, Consolidation, Processing and Marketing (Rank 1) Cluster - production enhancement and consolidation Bag-ong Valencia processing and marketing",
      validated: true,
      conceptNote: true,
    },
    {
      region: "X",
      lgu: "BUKIDNON",
      commodities: "COFFEE",
      infraEntrep: "INFRA",
      subproject:
        "Sustainable Coffee Farming and Processing Project - Improving post-harvest processing and market access",
      validated: false,
      conceptNote: true,
    },
    {
      region: "XI",
      lgu: "DAVAO DEL NORTE",
      commodities: "BANANA",
      infraEntrep: "ENTREP",
      subproject:
        "Banana Industry Development Program - Expansion of high-quality banana production and export",
      validated: true,
      conceptNote: false,
    },
    {
      region: "XII",
      lgu: "COTABATO",
      commodities: "RICE",
      infraEntrep: "INFRA",
      subproject:
        "Rice Productivity Enhancement Program - Construction of irrigation systems and seed distribution",
      validated: true,
      conceptNote: true,
    },
    {
      region: "XIII",
      lgu: "AGUSAN DEL SUR",
      commodities: "COCOA",
      infraEntrep: "ENTREP",
      subproject:
        "Agusan Cocoa Industry Revitalization - Training farmers and improving cocoa bean fermentation",
      validated: false,
      conceptNote: false,
    },
    {
      region: "BARMM",
      lgu: "MAGUINDANAO",
      commodities: "FISHERIES",
      infraEntrep: "INFRA",
      subproject:
        "Sustainable Fisheries Program - Establishment of cold storage facilities and fish hatcheries",
      validated: true,
      conceptNote: true,
    },
  ];

  const commoditiesData = countCommodities(filteredData);

  console.log("commoditiesData:", commoditiesData);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* TOTAL SUBPROJECT CARD */}
        <Card className="2xl:col-span-3 lg:col-span-4 col-span-12">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">
              TOTAL SUBPROJECT
            </CardTitle>
            <FaProjectDiagram className="text-muted-foreground w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adPlanTable8Data.length}</div>
            <p className="text-xs text-muted-foreground">
              + data still not accurate ok?
            </p>
          </CardContent>
        </Card>

        {/* OTHER STATS CARDS */}
        <div className="2xl:col-span-9 lg:col-span-8 col-span-12 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap justify-between items-center gap-4">
            {/* LGU Covered */}
            <Card className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  # of LGU Covered
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row justify-between items-center">
                <div>
                  <div className="text-xl font-bold">22</div>
                  <p className="text-xs text-muted-foreground">
                    + data still not accurate ok?
                  </p>
                </div>
                <FaStore className="text-muted-foreground w-12 h-12 flex-shrink-0" />
              </CardContent>
            </Card>

            {/* SP Validated */}
            <Card className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  # of SP Validated
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row justify-between items-center">
                <div>
                  <div className="text-xl font-bold">33</div>
                  <p className="text-xs text-muted-foreground">
                    + data still not accurate ok?z
                  </p>
                </div>
                <GrValidate className="text-muted-foreground w-12 h-12 flex-shrink-0" />
              </CardContent>
            </Card>

            {/* SP with Concept Note */}
            <Card className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  # of SP with CN
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row justify-between items-center">
                <div>
                  <div className="text-xl font-bold">44</div>
                  <p className="text-xs text-muted-foreground">
                    + data still not accurate ok?
                  </p>
                </div>
                <GiNotebook className="text-muted-foreground w-12 h-12 flex-shrink-0" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        {/* BAR Chart Card */}
        <Card className="lg:col-span-8 col-span-12">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                Subproject per Region
                <Label className="ml-2 text-xs text-gray-500">
                  ** All data presented here are not yet final**
                </Label>
              </CardTitle>
              {adPlanTable8Loading && <LoadingSpinner />}
            </div>
          </CardHeader>
          <CardContent>
            <SubProjectBarChart data={sampleData} />

            {/* <h2>Subprojects by Region (Pie Chart)</h2>
              <SubProjectPieChart data={sampleData} />

              <h2>Subprojects Over Time (Line Chart)</h2>
              <SubProjectLineChart data={sampleData} />

              <h2>Subprojects per LGU (Area Chart)</h2>
              <SubProjectAreaChart data={sampleData} />

              <h2>Subprojects by Infra/Entrep (Radar Chart)</h2>
              <SubProjectRadarChart data={sampleData} />

              <h2>Commodities vs Subprojects (Scatter Chart)</h2>
              <SubProjectScatterChart data={sampleData} />

              <h2>Subprojects by Type (Treemap Chart)</h2>
              <SubProjectTreemap data={sampleData} /> */}
          </CardContent>
        </Card>

        {/* PIE Chart Card */}
        <Card className="lg:col-span-4 col-span-12">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                Subproject per Region
                <Label className="ml-2 text-xs text-gray-500">
                  ** All data presented here are not yet final**
                </Label>
              </CardTitle>
              {adPlanTable8Loading && <LoadingSpinner />}
            </div>
          </CardHeader>
          <CardContent>
            <SubProjectPieChart data={sampleData} />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>Commodities</CardHeader>
          <CardContent>
            <CommodityRankingChart data={commoditiesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Table8Report;
