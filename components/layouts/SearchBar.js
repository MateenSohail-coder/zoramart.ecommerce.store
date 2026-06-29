"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = React.useState(
    searchParams.get("search") ? String(searchParams.get("search")) : "",
  );

  React.useEffect(() => {
    const next = searchParams.get("search")
      ? String(searchParams.get("search"))
      : "";
    setValue(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function commitSearch(nextValue) {
    const q = String(nextValue || "").trim();

    // Your home/product listing uses query param `search`.
    // Keep it simple: route to home and let RTK query filter by `search`.
    if (!q) {
      router.push("/");
      return;
    }

    router.push(`/?search=${encodeURIComponent(q)}`);
  }

  return (
    <div className="relative w-full max-w-xl">
      <Input
        placeholder="Search products, brands, categories..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitSearch(value);
        }}
        className="h-10 w-full m-0 font-dmsans rounded-lg border border-black/10 bg-[#f8f8f8] pl-14 pr-10 text-sm shadow-sm outline-none transition-all placeholder:text-black/40 focus:border-[#ff6f00] focus:ring-2 focus:ring-[#ff6f00] dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/35"
      />

      <div className="pointer-events-none absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-l-lg bg-[#ff6f00]">
        <Search className="h-5 w-5 text-white" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => commitSearch(value)}
        className="absolute right-1 top-1 h-8 w-8 rounded-full text-[#ff6f00] hover:bg-[#ff6f00]/10"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
