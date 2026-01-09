"use client";

import { use } from "react";

export function PackageChart({
  data: dataPromise,
}: {
  data: Promise<
    Map<
      string,
      {
        date: Date;
        downloads: number;
      }[]
    >
  >;
}) {
  const data = use(dataPromise);

  if (!data.size) return null;

  return <></>;
}
