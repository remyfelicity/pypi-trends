"use client";

import { use } from "react";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";

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

  return (
    <div className="mt-4">
      <VictoryChart
        padding={{
          top: 0,
          left: 50,
          bottom: 50,
          right: 0,
        }}
        theme={VictoryTheme.clean}
      >
        <VictoryAxis
          crossAxis
          style={{
            grid: { stroke: "oklch(87.2% 0.01 258.338)" },
            tickLabels: { fontSize: 20 },
          }}
          tickCount={3}
          tickFormat={(timestamp: number) =>
            new Date(timestamp).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
            })
          }
        />
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "oklch(87.2% 0.01 258.338)" },
            tickLabels: { fontSize: 20 },
          }}
          tickFormat={(downloadCount: number) =>
            downloadCount.toLocaleString("en-US", { notation: "compact" })
          }
        />
        {data
          .entries()
          .toArray()
          .map(([packageName, packageData], i) => (
            <VictoryLine
              data={packageData.map((packageDatum) => ({
                x: packageDatum.date,
                y: packageDatum.downloads,
              }))}
              key={packageName}
              style={{
                data: {
                  stroke: VictoryTheme.clean.palette?.qualitative?.at(i),
                  strokeWidth: 2,
                },
              }}
            />
          ))}
      </VictoryChart>
    </div>
  );
}
