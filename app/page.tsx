import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  type SearchParams,
} from "nuqs/server";
import { Suspense } from "react";
import z from "zod";
import { PackageChart } from "./PackageChart";
import { PackageInput } from "./PackageInput";

const loadSearchParams = createLoader({
  p: parseAsArrayOf(parseAsString),
});

const APIDataSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      downloads: z.int(),
    }),
  ),
});

async function getChartData(packageNames: string[]) {
  const series = new Map<string, Record<string, number>>();
  await Promise.all(
    packageNames.map(async (packageName) => {
      try {
        const response = await fetch(
          `https://pypistats.org/api/packages/${packageName}/overall?mirrors=false`,
        );
        if (!response.ok) {
          throw new Error();
        }

        const json = await response.json();
        const data = APIDataSchema.parse(json).data;

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
    .map(([date, packageData]) => ({
      _date: date,
      ...packageData,
    }))
    .sort((a, b) => (a._date > b._date ? 1 : -1));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { p } = await loadSearchParams(searchParams);
  const packageNames = p ?? [];

  const chartData = getChartData(packageNames);

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
      <PackageInput />
      <Suspense>
        <PackageChart data={chartData} />
      </Suspense>
    </div>
  );
}
