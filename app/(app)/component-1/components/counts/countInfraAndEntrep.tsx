"use client";
import { useMemo } from "react";

export const useAdPlanTable8Counts = (data: any[]) => {
  const { infraCount, entrepCount } = useMemo(() => {
    if (!Array.isArray(data)) return { infraCount: 0, entrepCount: 0 };

    let infraCount = 0;
    let entrepCount = 0;

    data.forEach((item) => {
      if (item?.infraEntrep?.toLowerCase().includes("infra")) {
        infraCount++;
      }
      if (item?.infraEntrep?.toLowerCase().includes("entrep")) {
        entrepCount++;
      }
    });

    return { infraCount, entrepCount };
  }, [data]);

  const conceptNoteTrueCount = useMemo(
    () =>
      Array.isArray(data)
        ? data.filter((item) => item.conceptNote === true).length
        : 0,
    [data]
  );

  const validatedTrueCount = useMemo(
    () =>
      Array.isArray(data)
        ? data.filter((item) => item.validated === true).length
        : 0,
    [data]
  );

  return { infraCount, entrepCount, conceptNoteTrueCount, validatedTrueCount };
};
