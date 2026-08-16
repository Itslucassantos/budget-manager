import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/sheet2ApiClient";

export const expensesQueryKey = ["expenses"] as const;

export function useExpensesQuery(limit = 400) {
  return useQuery({
    queryKey: [...expensesQueryKey, limit],
    queryFn: ({ signal }) => getExpenses({ limit, signal }),
  });
}
