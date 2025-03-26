"use client";
export const countValidatedTrue = (data: any[]) => {
  if (!Array.isArray(data)) return 0;
  return data.filter((item) => item?.validated === true).length;
};
