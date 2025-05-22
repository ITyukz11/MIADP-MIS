"use client";
export const countConceptNoteTrue = (data: any[]) => {
  if (!Array.isArray(data)) return 0; // Prevent error if data is undefined or not an array
  return data.filter((item) => item?.conceptNote === true).length;
};
