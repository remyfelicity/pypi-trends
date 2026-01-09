"use client";

import { use } from "react";

export function PackageChart({
  data: dataPromise,
}: {
  data: Promise<Record<string, number | string>[]>;
}) {
  const data = use(dataPromise);

  if (!data.length) return null;

  return <></>;
}
