import z from "zod";

const APIDataSchema = z.object({
  data: z.array(
    z.object({
      date: z.iso.date(),
      downloads: z.int(),
    }),
  ),
});

export async function getChartData(packageNames: string[]) {
  const series = new Map<string, Record<string, number>>();
  await Promise.all(
    packageNames.map(async (packageName) => {
      try {
        const response = await fetch(
          `https://pypistats.org/api/packages/${packageName}/overall?mirrors=false`,
          { next: { revalidate: 3600 } },
        );
        if (!response.ok) {
          throw new Error();
        }

        const json = await response.json();
        const { data } = APIDataSchema.parse(json);

        for (const { date, downloads } of data) {
          const record = series.get(date) ?? {};
          record[packageName] = downloads;
          series.set(date, record);
        }
      } catch (error) {
        console.error(error);
      }
    }),
  );

  return series
    .entries()
    .toArray()
    .map(([date, data]) => ({ date, data }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

export type ChartData = Awaited<ReturnType<typeof getChartData>>;
