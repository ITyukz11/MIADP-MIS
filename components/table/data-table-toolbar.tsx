import React, { useEffect, useState, useTransition } from "react";
import { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DialogApprovePendingUsers } from "../admin/dialog-accounts";
import { AiOutlineExport, AiOutlinePrinter } from "react-icons/ai";
import { SearchIcon } from "lucide-react";
import * as ExcelJS from "exceljs";
import { useCalendarOfActivityFilter } from "../context/FilterRegionContext";
import { useSelector } from "@/app/store/store";
import { Label } from "../ui/label";

interface DataTableToolbarProps<TData> {
  data: TData[];
  table: TanstackTable<TData>;
  selectedRows: Record<string, boolean>;
  allowDateRange: boolean;
  allowExportToExcel?: boolean;
  tableType?: string;
}

type CSVRow = Record<string, any>;

export function DataTableToolbar<TData>({
  data,
  table,
  selectedRows,
  allowDateRange,
  allowExportToExcel,
  tableType,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [filterInput, setFilterInput] = useState<string>("");

  const { currentFilter } = useCalendarOfActivityFilter();
  const { usersData, loadingUser, errorUser } = useSelector(
    (state) => state.users
  );
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: new Date(2024, 0, 1), // January 1, 2024
  //   to: new Date(2024, 11, 31), // December 31, 2024
  // });

  // const isDateRangeDifferent = dateRange &&
  //   (dateRange.from?.getTime() !== new Date(2024, 0, 1).getTime() ||
  //     dateRange.to?.getTime() !== new Date(2024, 11, 31).getTime());

  const filteredData = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  // const ExportToCSVDatas = table.getAllColumns().filter(column => column.getIsVisible())

  const visibleColumns = table
    .getAllColumns()
    .filter((column) => column.getIsVisible());

  // Extract data from visible columns
  const csvData: CSVRow[] = table.getFilteredRowModel().rows.map((row) => {
    const rowData: CSVRow = {};
    visibleColumns.forEach((column) => {
      // Ensure type safety by asserting the type of row.original
      if (typeof row.original === "object" && row.original !== null) {
        rowData[column.id] = (row.original as Record<string, any>)[column.id];
      }
    });
    return rowData;
  });

  // Prepare headers
  const headers = visibleColumns.map((column) => ({
    label: column.id,
    key: column.id,
  }));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.setGlobalFilter(filterInput || undefined);
    }, 300); // Debounce filter input to avoid rapid API calls or rendering

    return () => clearTimeout(timeoutId);
  }, [filterInput, table]);

  // useEffect(() => {
  //   if (dateRange?.from && dateRange?.to) {
  //     table.setColumnFilters((old) => [
  //       ...old.filter(
  //         (filter) => filter.id !== 'dateFrom' && filter.id !== 'dateTo'
  //       ),
  //       {
  //         id: 'dateFrom',
  //         value: dateRange,
  //       },
  //       {
  //         id: 'dateTo',
  //         value: dateRange,
  //       },
  //     ]);
  //   } else {
  //     table.resetColumnFilters();
  //   }
  // }, [dateRange, table]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Function to get date ranges for the past 12 months including the current month
  const getDateRangeOptions = () => {
    const today = new Date();
    const options = [];

    // Loop to create options for the current month and the previous 12 months
    for (let i = 0; i < 13; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      options.push({
        value: `${year}-${date.getMonth() + 1}`, // Format: YYYY-M
        label: i === 0 ? "This month" : `${month} ${year}`, // Label for the current month
      });
    }

    return options;
  };

  // useEffect(() => {
  //   if (selectedMonth) {
  //     const [year, month] = selectedMonth.split('-').map(Number);
  //     const from = new Date(year, month - 1, 1);
  //     const to = new Date(year, month, 0);
  //     setDateRange({ from, to });
  //   }
  // }, [selectedMonth]);

  // Call getDateRangeOptions to get the month options
  const monthOptions = getDateRangeOptions();
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long", // Full month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
    });

    return formatter.format(date);
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Calendar of Activity");

    try {
      // Get visible columns and data
      const visibleColumns = table.getAllColumns().filter((column) => {
        if (column.id != "#") {
          return column.getIsVisible();
        }
      });

      const headers = [
        "#",
        "Region",
        "Unit/Component",
        ...visibleColumns.map((column) => column.id),
        "Participants",
      ];

      // Define title, date, and filter data
      const title = "CALENDAR OF ACTIVITIES";
      const date = `Date: ${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
      const filterData = `Type: ${currentFilter?.typeOfActivity} | Filtered by: ${currentFilter?.region}`;
      // const filteredDate = `${formatDate(dateRange?.from)} - ${formatDate(dateRange?.to)}`

      // Add title
      worksheet.mergeCells(
        "A1:" + String.fromCharCode(65 + headers.length - 1) + "1"
      );
      const titleCell = worksheet.getCell("A1");
      titleCell.value = title;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };

      // Add date
      worksheet.mergeCells(
        "A2:" + String.fromCharCode(65 + headers.length - 1) + "2"
      );
      const dateCell = worksheet.getCell("A2");
      dateCell.value = date;
      dateCell.font = { size: 12 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };

      // Add filter data
      worksheet.mergeCells(
        "A3:" + String.fromCharCode(65 + headers.length - 1) + "3"
      );
      const filterCell = worksheet.getCell("A3");
      filterCell.value = filterData;
      filterCell.font = { size: 12 };
      filterCell.alignment = { horizontal: "center", vertical: "middle" };

      // Add date
      worksheet.mergeCells(
        "A4:" + String.fromCharCode(65 + headers.length - 1) + "4"
      );
      const dateRangeCell = worksheet.getCell("A4");
      dateRangeCell.value = currentFilter?.month + "," + currentFilter?.wfpYear;
      dateRangeCell.font = {
        size: 12,
        bold: true, // Bold text
        underline: "single", // Underline text
      };
      dateRangeCell.alignment = { horizontal: "center", vertical: "middle" };

      // Add a blank row for spacing
      worksheet.addRow([]);

      // Add headers to the worksheet
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true }; // Bold text
        cell.alignment = { horizontal: "center" }; // Center align
        cell.value = cell.value?.toString().toUpperCase(); // Capitalize text
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "8DB4E2" }, // Blue color
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });

      // Add rows using key-value pairs
      let rows = table.getFilteredRowModel().rows.map((row) => {
        const rowData = visibleColumns.reduce((acc, column) => {
          acc[column.id] = (row.original as any)[column.id] || "";
          return acc;
        }, {} as Record<string, any>);

        // Access 'unit' or 'component' from the 'user' object
        const user = (row.original as any).user || {};
        rowData["Region"] = user.region;
        rowData["Unit/Component"] = user.unit || user.component || "";

        const participantsData = (row.original as any).participants || {};
        console.log("data: ", participantsData);

        //const participants: (string | undefined)[] = []
        const participantsSet: Set<string> = new Set();

        participantsData.forEach((participant: any) => {
          const user = usersData.find((user) => user.id === participant.userId);

          // Ensure the component exists before accessing its characters
          const componentCode = user?.component
            ? user.component[0] + user.component[user.component.length - 1]
            : "";

          const participantString = `${user?.region}-${componentCode}${
            user?.unit ? "-" + user?.unit : ""
          }`;

          if (participantString) {
            participantsSet.add(participantString);
          }
        });

        const participants: string[] = Array.from(participantsSet);

        console.log("participants: ", participants);

        console.log("participants: ", participants);
        // console.log(participants.toLocaleString())
        rowData["Participants"] = participants.toLocaleString();

        return rowData;
      });

      // Sort rows by DATEFROM column in ascending alphabetical order
      rows.sort((a: any, b: any) => {
        const dateA: any = new Date(a.dateFrom);
        const dateB: any = new Date(b.dateFrom);
        return dateA - dateB;
      });

      // Add an incremental number in the first column
      rows.forEach((data: any, index: number) => {
        const rowValues = [
          index + 1,
          data["Region"],
          data["Unit/Component"],
          ...headers.slice(3).map((header) => data[header]),
        ]; // Ensure correct order
        const row = worksheet.addRow(rowValues);

        // Add alternate row colors and styles
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.alignment = { wrapText: true, vertical: "middle" }; // Wrap text and center vertically

          // Check if the cell is in the 'Status' column
          if (headers[colNumber - 1] === "status") {
            switch (cell.value) {
              case "Ongoing":
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "00a354" }, // Green
                };
                break;
              case "Upcoming":
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "f2c018" }, // Yellow
                };
                break;
              case "Completed":
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "4682B4" }, // Blue
                };
                break;
              case "Cancelled":
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "b03620" }, // Red
                };
                break;
              case "Postponed":
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "e38812" }, // Orange
                };
                break;
              default:
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFF" }, // Default white color
                };
                break;
            }
          } else {
            // Apply alternate row coloring for non-status cells
            if (index % 2 === 0) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F2F2F2" }, // Light gray for even rows
              };
            } else {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "DCE6F1" }, // Light blue for odd rows
              };
            }
          }
          cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
        });
      });

      // Set column widths based on header names
      headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1);
        switch (header.toUpperCase()) {
          case "#":
            column.width = 3;
            break;
          case "ACTIVITYTITLE":
            column.width = 40;
            break;
          case "LOCATION":
            column.width = 15;
            break;
          case "ACTIVITYDESCRIPTION":
            column.width = 35;
            break;
          case "UNIT/COMPONENT":
            column.width = 17;
            break;
          case "PARTICIPANTS":
            column.width = 30;
            break;
          default:
            column.width = 12;
            break;
        }
      });

      worksheet.pageSetup = {
        paperSize: 9, // A4 paper size
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      };

      // Write file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Calendar of Activities.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  // console.log("Filtered rows:", table.getFilteredRowModel().rows);

  const handleExportToExcelSubproject = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("MIADP Subproject");

    try {
      // Get visible columns and remove "action" column
      const visibleColumns = table
        .getAllColumns()
        .filter(
          (column) =>
            column.getIsVisible() && column.id !== "action" && column.id !== "#"
        );

      // Define headers
      const headers = ["#", ...visibleColumns.map((column) => column.id)];
      console.log("Headers:", headers);

      // Define title and date
      const title = "MIADP Subproject";
      const date = `Date: ${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;

      // Merge and style title
      worksheet.mergeCells(
        `A1:${String.fromCharCode(65 + headers.length - 1)}1`
      );
      const titleCell = worksheet.getCell("A1");
      titleCell.value = title;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };

      // Merge and style date
      worksheet.mergeCells(
        `A2:${String.fromCharCode(65 + headers.length - 1)}2`
      );
      const dateCell = worksheet.getCell("A2");
      dateCell.value = date;
      dateCell.font = { size: 12 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };

      // Add blank row for spacing
      worksheet.addRow([]);

      // Add headers to the worksheet
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        cell.value = cell.value?.toString().toUpperCase();
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "8DB4E2" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });

      // Get rows and exclude "action" column
      let rows = table.getFilteredRowModel().rows.map((row) => {
        return visibleColumns.reduce((acc, column) => {
          acc[column.id] = (row.original as any)[column.id] || "";
          return acc;
        }, {} as Record<string, any>);
      });

      // Sort rows alphabetically by "code" column (if it exists)
      rows.sort((a: any, b: any) => {
        const codeA: any = a.code ? new Date(a.code) : 0;
        const codeB: any = b.code ? new Date(b.code) : 0;
        return codeA - codeB;
      });

      // Add rows and auto-increment the first column
      rows.forEach((data: any, index: number) => {
        const rowValues = [
          index + 1,
          ...headers.slice(1).map((header) => data[header]),
        ];
        const row = worksheet.addRow(rowValues);

        // Apply row styling without wrapping text
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" }; // No wrap text
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "DCE6F1" },
          };
          cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
        });
      });

      // Adjust column width dynamically based on content
      worksheet.columns.forEach((column, index) => {
        let maxLength = headers[index]?.length || 10; // Start with header length
        rows.forEach((row) => {
          const cellValue = row[headers[index]]
            ? row[headers[index]].toString()
            : "";
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2; // Adjust width
      });

      // Set page setup for printing
      worksheet.pageSetup = {
        paperSize: 9, // A4
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      };

      // Generate Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "MIADP Subproject.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };
  console.log("tableType: ", tableType);
  return (
    <div className="flex items-center justify-between flex-wrap overflow-x-auto px-1">
      <div className="flex flex-1 items-center gap-2 py-1 flex-wrap justify-start">
        <div className="relative">
          <Input
            placeholder="Filter..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px] pr-6 z-50 text-xs md:text-sm"
          />
          <SearchIcon className="absolute right-2 top-2 h-4 w-4" />
        </div>
        {allowExportToExcel && (
          <Button
            variant="outline"
            className="flex flex-row items-center justify-center text-xs md:text-sm"
            onClick={
              tableType === "subproject"
                ? handleExportToExcelSubproject
                : tableType === "activities"
                ? handleExportToExcel
                : undefined // Instead of null
            }
          >
            <AiOutlineExport className="w-4 h-4 shrink-0" />
            <span className="md:block hidden md:text-xs lg:text-sm">
              Export to Excel
            </span>
          </Button>
        )}

        <Button variant="outline" disabled className="cursor-not-allowed">
          <AiOutlinePrinter className="w-5 h-5 shrink-0" />
          <Label className="md:block hidden md:text-xs lg:text-sm">Print</Label>
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        {/* {allowDateRange && (
          <>
            {isFiltered && isDateRangeDifferent && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  setDateRange({ from: new Date(2024, 0, 1), to: new Date(2024, 11, 31) })
                }}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
            <CalendarDateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
            <Select onValueChange={setSelectedMonth} value={selectedMonth} disabled={false}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Month</SelectLabel>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )} */}

        {/* <Button
              variant="outline"
              className="flex flex-row gap-1 items-center justify-center"
              onClick={() => setDateRange(getCurrentMonthRange())} // Set date range to current month
            >
              <CalendarCheck size={15} />
              This month
            </Button> */}

        <DataTableViewOptions table={table} />
        <DialogApprovePendingUsers
          approvedPendingUsersData={
            filteredData as Array<
              TData & {
                id?: number;
                name?: string;
                email?: string;
                region?: string;
                color?: string;
                password?: string;
              }
            >
          }
          disable={Object.keys(selectedRows).length > 0 ? false : true}
        />
      </div>
    </div>
  );
}
