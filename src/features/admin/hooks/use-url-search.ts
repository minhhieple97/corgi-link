import { useQueryState, parseAsString } from "nuqs";

export const useUrlSearch = (initialSearch: string) => {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(initialSearch)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(search);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return {
    search,
    setSearch,
    handleSearch,
    clearSearch,
  };
};
