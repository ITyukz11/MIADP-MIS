// app/kobotoolbox/page.tsx or any client component
"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/table/data-table";
import { KoboIpoValidationColumns } from "@/components/table/data/c3/ipo-validation/ipo-validation-column";
import { useC3IPOValidationData } from "@/lib/c3/ipo-validation/useC3IPOValidation";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConstructionIcon } from "lucide-react";
import { FaStore } from "react-icons/fa";
import { GrValidate } from "react-icons/gr";
import { GiNotebook } from "react-icons/gi";

const Page = () => {
  const { C3IPOValidationData, C3IPOValidationError, C3IPOValidationLoading } =
    useC3IPOValidationData();

  const hiddenColumn = [
    "validation_process_001/office_address",
    "validation_process_001/potential_enterprise_projects",
    "validation_process_001/priority_commodity",
    "validation_process_001/prioritized_enterprise",
    "validation_process_001/validation_conducted_by",
  ];

  console.log("C3IPOValidationData: ", C3IPOValidationData);

  return (
    <div className="w-full flex flex-col">
      <div className="relative">
        <Tabs defaultValue="overview">
          <TabsList className="flex w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    # of CADT
                  </CardTitle>
                  <ConstructionIcon className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  0
                  {/* {infraCount == 0 ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-5" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{infraCount}</div>
                    <p className="text-xs text-muted-foreground">
                      + data still not accurate ok?
                    </p>
                  </>
                )} */}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of Enterprise
                  </CardTitle>
                  <FaStore className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  0
                  {/* {filteredData.length == 0 && adPlanTable8Loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-5" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{entrepCount}</div>
                    <p className="text-xs text-muted-foreground">
                      + data still not accurate ok?
                    </p>
                  </>
                )} */}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of SP Validated
                  </CardTitle>
                  <GrValidate className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  0
                  {/* {filteredData.length == 0 && adPlanTable8Loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-5" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {validatedTrueCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      + data still not accurate ok?
                    </p>
                  </>
                )} */}
                </CardContent>
              </Card>
              <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    # of SP with CN
                  </CardTitle>
                  <GiNotebook className="text-muted-foreground w-5 h-5" />
                </CardHeader>
                <CardContent>
                  0
                  {/* {filteredData.length == 0 && adPlanTable8Loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-5" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {conceptNoteTrueCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      + data still not accurate ok?
                    </p>
                  </>
                )} */}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="p-4">
                {C3IPOValidationLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                  </div>
                ) : (
                  <DataTable
                    data={C3IPOValidationData}
                    columns={KoboIpoValidationColumns}
                    allowSelectRow={false}
                    hiddenColumns={hiddenColumn}
                    allowExportToExcel
                  />
                )}
                {C3IPOValidationError && (
                  <Label className="text-destructive">
                    {C3IPOValidationError}
                  </Label>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* <Table8Report /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
