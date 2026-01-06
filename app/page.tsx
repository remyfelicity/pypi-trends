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
      try {
        const response = await fetch(
          `https://pypistats.org/api/packages/${packageName}/overall?mirrors=false`,
        );
        const json = await response.json();
        const parsedJson = PackageDownloadStatsSchema.parse(json);
        packageDownloadStats.set(packageName, parsedJson.data);
      } catch (error) {
        console.error(error);
      }
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
