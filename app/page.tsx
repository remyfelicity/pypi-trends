import PackageInput from "./PackageInput";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="flex h-16 items-center text-xl">PyPI Trends</h1>
      <PackageInput />
    </div>
  );
}
