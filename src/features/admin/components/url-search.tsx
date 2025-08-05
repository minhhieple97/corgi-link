"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUrlSearch } from "../hooks";

type UrlSearchProps = {
  initialSearch: string;
};

export const UrlSearch = ({ initialSearch }: UrlSearchProps) => {
  const { search, setSearch, handleSearch } = useUrlSearch(initialSearch);

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search URLs"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};
