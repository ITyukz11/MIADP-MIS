"use client";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { FaPlus } from "react-icons/fa";


import { useADPlanProcessDocReportData } from "@/lib/ad-plan/process-doc-report/useProcessDocReportHook";
import ProcessDocumentReportFormDialog from "../components/dialog/ProcessDocumentReportFormDialog";
import { useProcessDocReportMultiFilter } from "@/components/context/ad-plan/MultiFilterProcDocRepContext";
import { MultiSelectFilter, Option } from "../components/MultiSelectComponent";
import { mindanaoCities, mindanaoProvinces, monthOptions, PSAMindanaoRegions, wfpYearOptions } from "@/lib/data/filter";
import { FilterSheet } from "@/components/dialog/filter-modal";
import { duringData, postActivityData, preActivityData, WFPActivities2025RPCO09 } from "@/lib/ad-plan/data/data";

interface ActivitiesLayoutProps {
    children: React.ReactNode;
}



export default function AdPl({ children }: ActivitiesLayoutProps) {
    const [open, setOpen] = useState<boolean>(false)
    const { adPlanProcDocReportLoading, refetchAdPlanProcDocReport } = useADPlanProcessDocReportData();
    const { currentMultiFilter, setCurrentMultiFilter, resetFilters } = useProcessDocReportMultiFilter()

    // Count how many filters are applied
    const appliedFiltersCount = useMemo(() => {
        return Object.values(currentMultiFilter).reduce((count, value) => {
            if (Array.isArray(value)) {
                const filteredValues = value.filter((v) => v !== "All"); // Exclude "All"
                return count + filteredValues.length;
            }
            return count;
        }, 0);
    }, [currentMultiFilter]);

    const WFPActivityOptions: Option[] = WFPActivities2025RPCO09.map((activity)=>({
        value: activity.title,
        label:activity.title
    }))

    const regionOptions: Option[] = PSAMindanaoRegions.map((region) => ({
        value: region.value,
        label: region.label,
    }));

    const provinceOptions: Option[] = mindanaoProvinces.map((province) => ({
        value: province.value,
        label: province.label,
    }));
    const cityOptions: Option[] = mindanaoCities.map((city) => ({
        value: city.value,
        label: city.label,
    }));
    const monthlyOptions: Option[] = monthOptions.map((month) => ({
        value: month,
        label: month,
    }))
    const yearlyOptions: Option[] = wfpYearOptions.map((year) => ({
        value: year,
        label: year,
    }))
    const noOfParticipantOptions: Option[] = [
        { value: "10-19", label: "10-19" },
        { value: "20-29", label: "20-29" },
        { value: "30-39", label: "30-39" },
        { value: "40-49", label: "40-49" },
        { value: "50-59", label: "50-59" },
        { value: "60-69", label: "60-69" },
        { value: "70-79", label: "70-79" },
        { value: "80-89", label: "80-89" },
        { value: "90-99", label: "90-99" },
        { value: "100", label: "100+" },
    ].map((participants) => ({
        value: participants.value,
        label: participants.label,
    }))

    const preActivityOptions: Option[] = preActivityData.map((data) => ({
        label: data,
        value: data
    }))
    const duringOptions: Option[] = duringData.map((data) => ({
        label: data,
        value: data
    }))
    const postActivityOptions: Option[] = postActivityData.map((data) => ({
        label: data,
        value: data
    }))
    const handleFilterChange = (filterKey: string, selected: string[]) => {
        setCurrentMultiFilter({
            ...currentMultiFilter,
            [filterKey]: selected,
        });
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-row flex-wrap gap-2 justify-between">
                <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <div className="flex flex-row gap-2 flex-wrap items-center">
                        <Label className="text-xl md:text-3xl font-bold tracking-tight">
                            Process Documentation Report Tracker{" "}
                        </Label>
                        <Label className="text-xs sm:text-sm text-muted-foreground">
                            BETA VERSION
                        </Label>
                    </div>

                    <div className="flex flex-row flex-wrap gap-2">
                        <Button onClick={() => setOpen(true)} variant={'outline'} className="flex flex-row gap-2"><FaPlus className="shrink-0" /> Add Report</Button>
                        <ProcessDocumentReportFormDialog open={open} setClose={() => setOpen(!open)} />
                        <FilterSheet
                            title="Filter Activity Reports"
                            filterCount={appliedFiltersCount}
                            onReset={() => resetFilters()}
                        >
                            <MultiSelectFilter
                                label="WFP Activity"
                                options={WFPActivityOptions}
                                selectedValues={currentMultiFilter?.WFPActivity || []}
                                onChange={(selected) => handleFilterChange("WFPActivity", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Month"
                                options={monthlyOptions}
                                selectedValues={currentMultiFilter?.month || []}
                                onChange={(selected) => handleFilterChange("month", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Year"
                                options={yearlyOptions}
                                selectedValues={currentMultiFilter?.year || []}
                                onChange={(selected) => handleFilterChange("year", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Region"
                                options={regionOptions}
                                selectedValues={currentMultiFilter?.region || []}
                                onChange={(selected) => handleFilterChange("region", selected)}
                                onCloseSheet={() => setOpen(false)}
                                loading={adPlanProcDocReportLoading} // or your loading state
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Province"
                                options={provinceOptions}
                                selectedValues={currentMultiFilter?.province || []}
                                onChange={(selected) => handleFilterChange("province", selected)}
                                onCloseSheet={() => setOpen(false)}
                                loading={adPlanProcDocReportLoading} // or your loading state
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="City"
                                options={cityOptions}
                                selectedValues={currentMultiFilter?.city || []}
                                onChange={(selected) => handleFilterChange("city", selected)}
                                onCloseSheet={() => setOpen(false)}
                                loading={adPlanProcDocReportLoading} // or your loading state
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="No. of Participants"
                                options={noOfParticipantOptions}
                                selectedValues={currentMultiFilter?.noOfParticipants || []}
                                onChange={(selected) => handleFilterChange("noOfParticipants", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Pre-Activity"
                                options={preActivityOptions}
                                selectedValues={currentMultiFilter?.preActivity || []}
                                onChange={(selected) => handleFilterChange("preActivity", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="During Activity"
                                options={duringOptions}
                                selectedValues={currentMultiFilter?.during || []}
                                onChange={(selected) => handleFilterChange("during", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                            <MultiSelectFilter
                                label="Post-Activity"
                                options={postActivityOptions}
                                selectedValues={currentMultiFilter?.postActivity || []}
                                onChange={(selected) => handleFilterChange("postActivity", selected)}
                                onCloseSheet={() => setOpen(false)}
                                allValue="All"
                            />
                        </FilterSheet>
                    </div>
                </div>
            </div>

            <div className="h-full flex-1 flex-col space-y-8 flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}
