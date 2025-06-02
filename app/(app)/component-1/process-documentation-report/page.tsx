'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConstructionIcon } from 'lucide-react';
import { FaBackspace, FaFemale, FaMale, FaStore } from 'react-icons/fa';
import { GrValidate } from 'react-icons/gr';
import { GiFemale, GiMale, GiNotebook } from 'react-icons/gi';
import { useADPlanProcessDocReportData } from '@/lib/ad-plan/process-doc-report/useProcessDocReportHook';
import { DataTable } from '@/components/table/data-table';
import { ProcessDocReportColumns } from '@/components/table/data/ad-plan/ProcessDocReportColumns';
import { useProcessDocReportMultiFilter } from '@/components/context/ad-plan/MultiFilterProcDocRepContext';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaUsers } from 'react-icons/fa6';
import ViewProcessDocumentationReport from './ViewProcessDocReport';
import { AnimatePresence, motion } from 'framer-motion';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { ProcessDocDashboard } from './(analytics)/Analytics';

export default function Page() {
  const { adPlanProcDocReportData, adPlanProcDocReportError, adPlanProcDocReportLoading, refetchAdPlanProcDocReport } = useADPlanProcessDocReportData();
  const { currentMultiFilter } = useProcessDocReportMultiFilter()
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [viewReport, setViewReport] = useState<any>(null)


  const filterProcessDocReport = useMemo(() => {
    return (data: any[]) => {
      return data.filter((report) => {
        const matchesRegion =
          currentMultiFilter?.region?.includes("All") ||
          currentMultiFilter?.region?.includes(report.region);

        const matchesProvince =
          currentMultiFilter?.province?.includes("All") ||
          currentMultiFilter?.province?.includes(report.province);

        const matchesCity =
          currentMultiFilter?.city?.includes("All") ||
          currentMultiFilter?.city?.includes(report.city);

        const matchesMunicipality =
          currentMultiFilter?.municipality?.includes("All") ||
          currentMultiFilter?.municipality?.includes(report.municipality);

        const matchesBaranggay =
          currentMultiFilter?.baranggay?.includes("All") ||
          currentMultiFilter?.baranggay?.includes(report.baranggay);

        const matchesWFPActivity =
          currentMultiFilter?.WFPActivity?.includes("All") ||
          currentMultiFilter?.WFPActivity?.includes(report.WFPActivity);

        const dateConducted = new Date(report.dateConducted);
        const monthName = dateConducted.toLocaleString("default", { month: "long" });
        const yearConducted = dateConducted.getFullYear();

        const matchesMonthConducted =
          currentMultiFilter?.month?.includes("All") ||
          currentMultiFilter?.month?.includes(monthName);

        const matchesYearConducted =
          currentMultiFilter?.year?.includes("All") ||
          currentMultiFilter?.year?.includes(yearConducted.toString());

        const totalParticipants = report.totalMaleIP + report.totalFemaleIP + report.totalMaleNonIP + report.totalFemaleNonIP
        const matchesNoParticipants =
          currentMultiFilter?.noOfParticipants?.includes("All") ||
          currentMultiFilter?.noOfParticipants?.some((range: string) => {
            const participantCount = Number(totalParticipants);

            if (range === "100") {
              return participantCount >= 100;
            }

            const [min, max] = range.split("-").map(Number);
            return participantCount >= min && participantCount <= max;
          });

        const matchesPreActivity =
          currentMultiFilter?.preActivity?.includes("All") ||
          currentMultiFilter?.preActivity?.includes(report.preActivity);
        const matchesDuring =
          currentMultiFilter?.during?.includes("All") ||
          currentMultiFilter?.during?.includes(report.during);

        const matchesPostActivity =
          currentMultiFilter?.postActivity?.includes("All") ||
          currentMultiFilter?.postActivity?.includes(report.postActivity);

        return (
          matchesRegion &&
          matchesProvince &&
          matchesCity &&
          matchesMunicipality &&
          matchesBaranggay &&
          matchesWFPActivity &&
          matchesMonthConducted &&
          matchesYearConducted &&
          matchesNoParticipants &&
          matchesPreActivity &&
          matchesDuring &&
          matchesPostActivity
        );
      });
    };
  }, [currentMultiFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Filtering... ad plan process documentation report data")
        setFilteredData(filterProcessDocReport(adPlanProcDocReportData || []));
      } catch (error) {
        console.error("Error fetching process document report:", error);
      }
    };

    fetchData();
  }, [adPlanProcDocReportData, filterProcessDocReport, adPlanProcDocReportLoading]);

  console.log("Filter ad plan data: ", adPlanProcDocReportData)
  console.log("Filter: " , filteredData)

  const totalMaleParticipants = useMemo(() => {
    if (!filteredData) return null;

    return filteredData.reduce(
      (total, data) => {
        return total + Number(data.totalMaleIP) + Number(data.totalMaleNonIP);
      },
      0
    );
  }, [filteredData]);

  const totalFemaleParticipants = useMemo(() => {
    if (!filteredData) return null;

    return filteredData.reduce(
      (total, data) => {
        return total + Number(data.totalFemaleIP) + Number(data.totalFemaleNonIP);
      },
      0
    );
  }, [filteredData]);

  const grandTotal = useMemo(() => {
    if (!totalMaleParticipants || !totalFemaleParticipants) return 0;
    return totalMaleParticipants + totalFemaleParticipants;
  }, [totalMaleParticipants, totalFemaleParticipants]);

  const handleViewRow = (id: string) => {
    console.log("id", id)
    const report = adPlanProcDocReportData?.find((report: any) => report.id === id)
    setViewReport(report)
  }
  console.log("grandTotal: ", grandTotal)
  console.log("adPlanProcDocReportData: ", adPlanProcDocReportData)
  return (
    <div className="w-full flex flex-col">
      <div className="relative">
        <Tabs defaultValue="overview">
          <TabsList className="flex w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" >Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Announcements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Report Submitted
                  </CardTitle>
                  <TbReportAnalytics className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  {adPlanProcDocReportLoading ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-5" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{(filteredData?.length)}</div>
                      <p className="text-xs text-muted-foreground">
                        + data still not accurate ok?
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of Participants
                  </CardTitle>
                  <FaUsers className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  {adPlanProcDocReportLoading ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-5" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{grandTotal}</div>
                      <p className="text-xs text-muted-foreground">
                        + data still not accurate ok?
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of Male Participants
                  </CardTitle>
                  <GiMale className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  {adPlanProcDocReportLoading ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-5" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalFemaleParticipants}</div>
                      <p className="text-xs text-muted-foreground">
                        + data still not accurate ok?
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of Female Participants
                  </CardTitle>
                  <GiFemale className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  {adPlanProcDocReportLoading ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-5" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalMaleParticipants}</div>
                      <p className="text-xs text-muted-foreground">
                        + data still not accurate ok?
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <AnimatePresence>
              {viewReport ?
                <motion.div
                  key="report"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-4 flex flex-col">
                      <Button variant="link" className='flex flex-row gap-2 items-center w-fit h-8' onClick={() => setViewReport(null)}><IoArrowBackCircle className="w-8 h-8 shrink-0" />
                        Back</Button>
                      <ViewProcessDocumentationReport report={viewReport} />
                    </CardContent>
                  </Card>
                </motion.div> :
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      {adPlanProcDocReportLoading ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-10" />
                          <Skeleton className="h-[250px] w-full rounded-xl" />
                        </div>
                      ) : (
                        <DataTable
                          data={filteredData}
                          columns={ProcessDocReportColumns}
                          hiddenColumns={[
                            // "activityTitle",
                            // "dateConducted",
                            // "region",
                            "province",
                            // "WFPActivity",
                            // "preparedByName",
                            // "totalParticipants"
                          ]
                          }
                          onViewRowId={handleViewRow}
                          allowSelectRow={false}
                          allowDateRange={false}
                          tableType="activities"
                          allowExportToExcel={false}
                          cursorRowSelect
                        />
                      )}
                      {adPlanProcDocReportError && (
                        <Label className="text-destructive">
                          {adPlanProcDocReportError}
                        </Label>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              }
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
              <ProcessDocDashboard data={filteredData}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

