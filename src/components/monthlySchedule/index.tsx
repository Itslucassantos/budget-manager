import { useEffect, useMemo, useState } from "react";
import { getExpenses, type ExpenseRecord } from "../../api/sheet2ApiClient";

type MonthlyExpense = {
  monthLabel: string;
  total: number;
};

function parseExpense(value: string): number {
  const raw = value.replace(/\s+/g, "").replace("R$", "");

  if (!raw) {
    return 0;
  }

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  let normalized = raw;

  if (hasComma && hasDot) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = raw.replace(",", ".");
  }

  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  if (value.includes("/")) {
    const [day, month, year] = value.split("/");

    if (!day || !month || !year) {
      return null;
    }

    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (value.includes("-")) {
    const [year, month, day] = value.split("-");

    if (!day || !month || !year) {
      return null;
    }

    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getLastMonths(baseDate: Date, totalMonths: number): Date[] {
  return Array.from({ length: totalMonths }, (_, index) => {
    const offset = totalMonths - index - 1;
    return new Date(baseDate.getFullYear(), baseDate.getMonth() - offset, 1);
  });
}

function roundAxisCeil(value: number): number {
  if (value <= 0) {
    return 0;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function formatAxisValue(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `R$${thousands.toFixed(thousands >= 10 ? 0 : 1)}k`;
  }

  return `R$${Math.round(value)}`;
}

export function MonthlySchedule() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const rows = await getExpenses({
          limit: 400,
          signal: controller.signal,
        });
        setExpenses(rows);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadExpenses();

    return () => controller.abort();
  }, []);

  const monthlyData = useMemo<MonthlyExpense[]>(() => {
    const now = new Date();
    const lastMonths = getLastMonths(now, 6);

    const totalsByMonth = new Map<string, number>(
      lastMonths.map((monthDate) => [monthKey(monthDate), 0]),
    );

    for (const expense of expenses) {
      const date = parseDate(expense.date);

      if (!date) {
        continue;
      }

      const key = monthKey(new Date(date.getFullYear(), date.getMonth(), 1));

      if (!totalsByMonth.has(key)) {
        continue;
      }

      const value = parseExpense(expense.expense);
      const current = totalsByMonth.get(key) ?? 0;
      totalsByMonth.set(key, current + value);
    }

    return lastMonths.map((monthDate) => {
      const label = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
        monthDate,
      );

      return {
        monthLabel: label,
        total: totalsByMonth.get(monthKey(monthDate)) ?? 0,
      };
    });
  }, [expenses]);

  const maxValue = useMemo(() => {
    const highest = Math.max(...monthlyData.map((item) => item.total), 0);
    return roundAxisCeil(highest);
  }, [monthlyData]);

  const axisTicks = useMemo(() => {
    if (maxValue === 0) {
      return [0, 0, 0, 0, 0];
    }

    return Array.from({ length: 5 }, (_, index) => {
      const ratio = 1 - index / 4;
      return Math.round(maxValue * ratio);
    });
  }, [maxValue]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

  return (
    <div className="flex flex-col bg-zinc-900 rounded-lg p-4 border border-slate-700">
      <div>
        <h3 className="text-base text-slate-100 font-medium">
          Monthly expenses
        </h3>
        <p className="text-sm text-slate-400">
          Progress over the last 6 months
        </p>
      </div>

      {hasError ? (
        <p className="text-sm text-red-400 mt-4">
          Error loading spreadsheet data.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-[3rem_1fr] gap-2 h-56">
          <div className="flex flex-col justify-between text-xs text-slate-400">
            {axisTicks.map((tick, index) => (
              <span key={`${tick}-${index}`}>{formatAxisValue(tick)}</span>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex flex-col justify-between pb-6">
              {axisTicks.map((_, index) => (
                <div
                  key={index}
                  className="border-t border-dashed border-slate-700"
                />
              ))}
            </div>

            {isLoading ? (
              <div className="absolute inset-0 pb-6 flex items-end gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full rounded-t bg-slate-700/60 animate-pulse"
                    style={{ height: `${22 + index * 4}%` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="absolute inset-0 pb-6 flex items-end justify-between gap-3">
                  {monthlyData.map((item) => {
                    const height =
                      maxValue > 0
                        ? Math.max((item.total / maxValue) * 100, 2)
                        : 2;

                    return (
                      <div
                        key={item.monthLabel}
                        className="w-full rounded-t bg-blue-500/80 hover:bg-blue-400 transition-colors"
                        style={{ height: `${height}%` }}
                        title={`${item.monthLabel} - ${currencyFormatter.format(item.total)}`}
                      />
                    );
                  })}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between text-slate-400 text-sm">
                  {monthlyData.map((item) => (
                    <span key={`label-${item.monthLabel}`}>
                      {item.monthLabel}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
