"use client";

import { Button, Input } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { use, useState, type FormEvent } from "react";
import { type ChartData } from "../lib/getChartData";

export function PackageInput({ data }: { data: Promise<ChartData> }) {
  const { errorPackageNames } = use(data);
  const [input, setInput] = useState("");
  const [packageNames, setPackageNames] = useQueryState(
    "p",
    parseAsArrayOf(parseAsString).withOptions({
      history: "push",
      shallow: false,
    }),
  );

  function handleAddPackage(event: FormEvent) {
    event.preventDefault();

    const normalizedPackageName = input.toLowerCase().trim();
    setInput("");

    if (
      !normalizedPackageName ||
      packageNames?.includes(normalizedPackageName)
    ) {
      return;
    }
    setPackageNames(
      [...(packageNames ?? []), normalizedPackageName].toSorted(),
    );
  }

  function handleRemovePackage(packageNameToRemove: string) {
    const newPackageNames = packageNames?.filter(
      (packageName) => packageName !== packageNameToRemove,
    );

    if (!newPackageNames) return;
    if (newPackageNames.length === 0) {
      setPackageNames(null);
      return;
    }
    setPackageNames(newPackageNames);
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-4">
        <form className="relative w-full max-w-lg" onSubmit={handleAddPackage}>
          <Input
            className="h-16 w-full rounded-lg border border-gray-300 pr-12 pl-6 text-xl shadow placeholder:text-gray-400"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search for packages"
            type="text"
            value={input}
          />
          <MagnifyingGlassIcon className="absolute top-5 right-5 size-6 text-gray-400" />
        </form>
        <ul className="flex max-w-5xl flex-wrap justify-center gap-2">
          {packageNames?.map((packageName) => {
            const isError = errorPackageNames.has(packageName);
            return (
              <li
                className={`flex h-12 items-center rounded-lg border pl-4 shadow ${isError ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                key={packageName}
              >
                {isError ? (
                  <ExclamationCircleIcon className="mr-2 size-5 text-red-600" />
                ) : null}
                {packageName}
                <Button
                  className="group grid size-12 cursor-pointer place-items-center rounded-full"
                  onClick={() => handleRemovePackage(packageName)}
                >
                  <div
                    className={`grid size-8 place-items-center rounded-lg transition-colors duration-200 ${isError ? "group-hover:bg-red-100" : "group-hover:bg-gray-100"}`}
                  >
                    <XMarkIcon className="size-5" />
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
