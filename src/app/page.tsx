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
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
      <PackageInput />
      <Suspense>
        <PackageChart data={chartData} />
      </Suspense>
    </div>
  );
}
