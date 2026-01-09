"use client";

import { use } from "react";
import { type ChartData } from "../lib/getChartData";

export function PackageChart({
  data: dataPromise,
}: {
  data: Promise<ChartData>;
}) {
  const data = use(dataPromise);

  if (!data.length) return null;

  return <></>;
}
