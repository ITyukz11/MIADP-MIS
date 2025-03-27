export const countCommodities = (data: any[]) => {
  if (!Array.isArray(data)) return [];

  const commodityCount = data.reduce((acc, entry) => {
    const commodities = entry.commodities
      .split(",")
      .map((c: string) => c.trim()) // Trim spaces
      .filter((c: string) => c && c !== "ALL COMMODITIES"); // Remove empty and "ALL COMMODITIES"

    commodities.forEach((commodity: string) => {
      acc[commodity] = (acc[commodity] || 0) + 1;
    });

    return acc;
  }, {} as Record<string, number>);

  // Convert the object into an array of { name, count } objects
  return Object.entries(commodityCount).map(([name, count]) => ({
    name,
    count,
  }));
};
