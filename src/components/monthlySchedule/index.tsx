import { useMemo } from "react";
import type { ExpenseRecord } from "../../api/sheet2ApiClient";
import {
  buildMonthlyExpenseSeries,
  formatCurrencyValue,
  type MonthlyExpense,
} from "../../utils/expenseAnalytics";

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

type MonthlyScheduleProps = {
  expenses: ExpenseRecord[];
  isLoading?: boolean;
  hasError?: boolean;
};

export function MonthlySchedule({
  expenses,
  isLoading = false,
  hasError = false,
}: MonthlyScheduleProps) {
  const monthlyData = useMemo<MonthlyExpense[]>(() => {
    return buildMonthlyExpenseSeries(expenses, 6);
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
                        title={`${item.monthLabel} - ${formatCurrencyValue(item.total)}`}
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
