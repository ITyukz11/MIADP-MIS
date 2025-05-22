"use client";

import { useC3IPOValidationData } from "@/lib/c3/ipo-validation/useC3IPOValidation";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import AccompanyingPersons from "../(components)/AccompanyingPersons";
import BasicInformationIPOValidation from "../(components)/BasicInformationIPOValidation";

function Page() {
  const { C3IPOValidationData, C3IPOValidationError, C3IPOValidationLoading } =
    useC3IPOValidationData();

  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const record = C3IPOValidationData?.find(
    (item: any) => String(item._id) === id
  );

  if (C3IPOValidationLoading) return <div className="p-4">Loading...</div>;
  if (C3IPOValidationError)
    return <div className="p-4 text-red-500">Failed to load data.</div>;
  if (!record)
    return (
      <div className="p-4 text-muted-foreground">
        No record found with ID: {id}
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">IPO Validation Details</h1>
      <BasicInformationIPOValidation
        validationData={[
          {
            name: "Name IPO",
            value: record["validation_process_001/name_ipo"],
          },
          { name: "Name AD", value: record["validation_process_001/name_ad"] },
          { name: "CADT No.", value: record["validation_process_001/cadt_no"] },
          {
            name: "Office Address",
            value: record["validation_process_001/office_address"],
          },
          {
            name: "Location",
            value: record["validation_process_001/location"],
          },
          {
            name: "Potential Enterprise Projects",
            value:
              record["validation_process_001/potential_enterprise_projects"],
          },
          {
            name: "Priority Commodity",
            value: record["validation_process_001/priority_commodity"],
          },
          {
            name: "Prioritized Enterprise",
            value: record["validation_process_001/prioritized_enterprise"],
          },
          {
            name: "Validation Conducted By",
            value: record["validation_process_001/validation_conducted_by"],
          },
          {
            name: "Date Conducted",
            value: record["validation_process_001/date_conducted"],
          },
        ]}
      />

      <Separator />

      <AccompanyingPersons
        pso={record[
          "validation_process_001/accompanying_persons/pso_miadp_staff_repeat"
        ]?.map((p: any) => ({
          name: p[
            "validation_process_001/accompanying_persons/pso_miadp_staff_repeat/pso_miadp_staff_name"
          ],
          position:
            p[
              "validation_process_001/accompanying_persons/pso_miadp_staff_repeat/pso_miadp_staff_position"
            ],
        }))}
        rpco={record[
          "validation_process_001/accompanying_persons/rpco_miadp_staff_repeat"
        ]?.map((r: any) => ({
          name: r[
            "validation_process_001/accompanying_persons/rpco_miadp_staff_repeat/rpco_miadp_staff_name"
          ],
          position:
            r[
              "validation_process_001/accompanying_persons/rpco_miadp_staff_repeat/rpco_miadp_staff_position"
            ],
        }))}
        lpmiu={record[
          "validation_process_001/accompanying_persons/lpmiu_staff_repeat"
        ]?.map((l: any) => ({
          name: l[
            "validation_process_001/accompanying_persons/lpmiu_staff_repeat/lpmiu_staff_name"
          ],
          position:
            l[
              "validation_process_001/accompanying_persons/lpmiu_staff_repeat/lpmiu_staff_position"
            ],
        }))}
        plgu={record[
          "validation_process_001/accompanying_persons/plgu_staff_repeat"
        ]?.map((p: any) => ({
          name: p[
            "validation_process_001/accompanying_persons/plgu_staff_repeat/plgu_staff_name"
          ],
          position:
            p[
              "validation_process_001/accompanying_persons/plgu_staff_repeat/plgu_staff_position"
            ],
        }))}
        other={record[
          "validation_process_001/accompanying_persons/other_staff_repeat"
        ]?.map((o: any) => ({
          name: o[
            "validation_process_001/accompanying_persons/other_staff_repeat/other_staff_name"
          ],
          position:
            o[
              "validation_process_001/accompanying_persons/other_staff_repeat/other_staff_position"
            ],
        }))}
      />

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <p>
              <span className="font-medium">Approval:</span>{" "}
              {record["recommendation_group/approval"]}
            </p>
            <p>
              <span className="font-medium">Approval Choice 1:</span>{" "}
              {record["recommendation_group/approval_choice_1"]}
            </p>
            <p>
              <span className="font-medium">Approval Choice 2:</span>{" "}
              {record["recommendation_group/approval_choice_2"]}
            </p>
            <p>
              <span className="font-medium">Conditions:</span>{" "}
              {record["recommendation_group/conditions_input"]}
            </p>
            <p>
              <span className="font-medium">Recommendations:</span>{" "}
              {record["recommendation_group/recommendations"]}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {["part_I_quali_selected_ipo", "part_II_quali_selected_ipo"].map(
        (part) => (
          <div key={part}>
            <h2 className="text-xl font-semibold mb-4">
              {part.includes("I") ? "Part I" : "Part II"} Responses
            </h2>
            <Card>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
                {Object.entries(record)
                  .filter(([key]) => key.startsWith(part))
                  .map(([key, value], i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-muted-foreground">
                        {key.split("/").pop()}
                      </p>
                      <p>{value as string}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )
      )}

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Part III Scoring Sheet</h2>
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            {Object.entries(record)
              .filter(([key]) => key.startsWith("part_III_ipo_scoring_sheet"))
              .map(([key, value], i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-muted-foreground">
                    {key.split("/").pop()}
                  </p>
                  <p>{value as string}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;
