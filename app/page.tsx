"use client";

import { Button, Input } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { createParser, useQueryState } from "nuqs";
import { useState, type FormEvent } from "react";

const parseAsPackageNames = createParser({
  parse: (query) => (query.length === 0 ? null : query.split(",")),
  serialize: (value) => value.join(","),
});

export default function Home() {
  const [input, setInput] = useState("");
  const [packageNames, setPackageNames] = useQueryState(
    "p",
    parseAsPackageNames,
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
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
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
        {packageNames?.map((packageName) => (
          <li
            className="flex h-12 items-center rounded-full border border-gray-300 pl-4"
            key={packageName}
          >
            {packageName}
            <Button
              className="grid size-12 cursor-pointer place-items-center rounded-full"
              onClick={() => handleRemovePackage(packageName)}
            >
              <XMarkIcon className="size-5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
