"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type UserSearchProps = {
  initialSearch?: string;
};

export const UserSearch = ({ initialSearch }: UserSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchParams) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`${routes.admin.users}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};
