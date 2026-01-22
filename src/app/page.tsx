import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  type SearchParams,
} from "nuqs/server";
import { Suspense } from "react";
import { getChartData } from "../lib/getChartData";
import { PackageChart } from "./PackageChart";
import { PackageInput } from "./PackageInput";

const loadSearchParams = createLoader({
  p: parseAsArrayOf(parseAsString),
});

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { p } = await loadSearchParams(searchParams);
  const packageNames = p ?? [];

  const chartData = getChartData(packageNames);

  return (
    <>
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl">PyPI Trends</h1>
      </div>
      <PackageInput data={chartData} />
      <Suspense>
        <PackageChart data={chartData} packageNames={packageNames} />
      </Suspense>
    </>
  );
}
