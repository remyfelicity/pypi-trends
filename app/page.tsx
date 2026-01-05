import { createLoader, createParser, type SearchParams } from "nuqs/server";
import z from "zod";
import { PackageInput } from "./PackageInput";

const parseAsPackageNames = createParser({
  parse: (query) => (query.length === 0 ? null : query.split(",")),
  serialize: (value) => value.join(","),
});

const loadSearchParams = createLoader({
  p: parseAsPackageNames,
});

const DownloadStatsSchema = z.object({
  data: z.array(
    z.object({
      category: z.string(),
      date: z.string().transform((date) => new Date(date)),
      downloads: z.int(),
    }),
  ),
  package: z.string(),
  type: z.string(),
});

async function fetchDownloadStats(packageName: string) {
  const response = await fetch(
    `https://pypistats.org/api/packages/${packageName}/overall?mirrors=false`,
  );
  const json = await response.json();
  return DownloadStatsSchema.parse(json);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { p } = await loadSearchParams(searchParams);
  const packageNames = p ?? [];

  const downloadStats = Promise.all(packageNames.map(fetchDownloadStats));

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
      <PackageInput />
    </div>
  );
}
