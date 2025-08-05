import { useQueryState, parseAsString } from "nuqs";

export const useUrlFilter = (initialFilter: string) => {
  const [filter, setFilter] = useQueryState(
    "filter",
    parseAsString.withDefault(initialFilter)
  );

  return {
    currentFilter: filter,
    handleFilterChange: setFilter,
  };
};
