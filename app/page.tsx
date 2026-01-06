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

const PackageDownloadStatsSchema = z.object({
  data: z.array(
    z.object({
      date: z.string().transform((date) => new Date(date)),
      downloads: z.int(),
    }),
  ),
});

type PackageDownloadStats = z.infer<typeof PackageDownloadStatsSchema>;

async function fetchPackageDownloadStats(packageNames: string[]) {
  const packageDownloadStats = new Map<string, PackageDownloadStats["data"]>();
  await Promise.all(
    packageNames.map(async (packageName) => {
      fetch(
        `https://pypistats.org/api/packages/${packageName}/overall?mirrors=false`,
      )
        .then((response) => response.json())
        .then((json) => PackageDownloadStatsSchema.parse(json))
        .then((json) => packageDownloadStats.set(packageName, json.data))
        .catch();
    }),
  );
  return packageDownloadStats;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { p } = await loadSearchParams(searchParams);
  const packageNames = p ?? [];

  const packageDownloadStats = fetchPackageDownloadStats(packageNames);

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
      <PackageInput />
    </div>
  );
}
