"use client";

import { Button, Input } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
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

    if (packageNames?.includes(normalizedPackageName)) {
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
      <form onSubmit={handleAddPackage}>
        <Input
          className="h-12 w-full rounded-full border border-gray-300 px-4 placeholder:text-gray-500"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a package name"
          type="text"
          value={input}
        />
      </form>
      <ul className="mt-2 flex flex-wrap gap-2">
        {packageNames?.map((packageName) => {
          const isError = errorPackageNames.has(packageName);
          return (
            <li
              className={`flex h-12 items-center rounded-full border border-gray-300 pl-4 ${isError ? "bg-red-50" : ""}`}
              key={packageName}
            >
              {isError ? (
                <ExclamationCircleIcon className="mr-2 size-5 text-red-600" />
              ) : null}
              {packageName}
              <Button
                className="grid size-12 cursor-pointer place-items-center rounded-full"
                onClick={() => handleRemovePackage(packageName)}
              >
                <XMarkIcon className="size-5" />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
