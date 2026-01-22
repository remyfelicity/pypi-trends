"use client";

import { use } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartData } from "../lib/getChartData";

export function PackageChart({
  data: dataPromise,
  packageNames,
}: {
  data: Promise<ChartData>;
  packageNames: string[];
}) {
  const data = use(dataPromise);

  if (!data.packageData.length) return null;

  return (
    <LineChart
      data={data.packageData}
      responsive
      style={{
        aspectRatio: 1.5,
        marginInline: "auto",
        maxHeight: "60dvh",
        paddingInline: 16,
        width: "100%",
      }}
    >
      <CartesianGrid stroke="oklch(87.2% 0.01 258.338)" />
      <XAxis dataKey="_date" stroke="oklch(37.3% 0.034 259.733)" />
      <YAxis stroke="oklch(37.3% 0.034 259.733)" />
      {packageNames.map((packageName) => (
        <Line
          dataKey={packageName}
          dot={false}
          key={packageName}
          stroke="oklch(50% 0.134 242.749)"
          strokeWidth={2}
        />
      ))}
    </LineChart>
  );
}
