import type { ExpenseRecord } from "../api/sheet2ApiClient";
import { parseDateInputValue, parseFlexibleDate } from "./dateFormatter";

export type MonthlyExpense = {
  monthLabel: string;
  total: number;
};

export type ExpenseSummary = {
  budget: number;
  totalSpent: number;
  remainingBalance: number;
  averageTicketValue: number;
  shoppingNumber: number;
  topCategory: string;
  percentageSpent: number;
};

export type ExpenseFilter =
  | "all"
  | "last30Days"
  | "lastMonth"
  | "last7Days"
  | "thisMonth"
  | "today"
  | "custom";

export type ExpenseDateRange = {
  startDate: string;
  endDate: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function parseExpenseValue(value: string): number {
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

export function parseExpenseDate(value: string): Date | null {
  return parseFlexibleDate(value);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function filterExpenseByDate(
  expense: ExpenseRecord,
  filter: ExpenseFilter,
  customRange?: ExpenseDateRange,
): boolean {
  const expenseDate = parseExpenseDate(expense.date);

  if (!expenseDate) {
    return false;
  }

  const normalizedExpenseDate = startOfDay(expenseDate).getTime();
  const today = new Date();
  const todayStart = startOfDay(today).getTime();

  switch (filter) {
    case "all":
      return true;
    case "today":
      return normalizedExpenseDate === todayStart;
    case "last7Days": {
      const start = startOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
      ).getTime();
      return (
        normalizedExpenseDate >= start &&
        normalizedExpenseDate <= endOfDay(today).getTime()
      );
    }
    case "last30Days": {
      const start = startOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
      ).getTime();
      return (
        normalizedExpenseDate >= start &&
        normalizedExpenseDate <= endOfDay(today).getTime()
      );
    }
    case "thisMonth": {
      const start = startOfMonth(today).getTime();
      const end = startOfNextMonth(today).getTime() - 1;
      return normalizedExpenseDate >= start && normalizedExpenseDate <= end;
    }
    case "lastMonth": {
      const start = startOfMonth(
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
      ).getTime();
      const end = startOfMonth(today).getTime() - 1;
      return normalizedExpenseDate >= start && normalizedExpenseDate <= end;
    }
    case "custom": {
      const start = parseDateInputValue(customRange?.startDate ?? "");
      const end = parseDateInputValue(customRange?.endDate ?? "");

      if (!start || !end) {
        return false;
      }

      return (
        normalizedExpenseDate >= startOfDay(start).getTime() &&
        normalizedExpenseDate <= endOfDay(end).getTime()
      );
    }
    default:
      return true;
  }
}

export function formatCurrencyValue(value: number): string {
  return currencyFormatter.format(value);
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

export function buildMonthlyExpenseSeries(
  expenses: ExpenseRecord[],
  totalMonths = 6,
  baseDate = new Date(),
): MonthlyExpense[] {
  const lastMonths = getLastMonths(baseDate, totalMonths);

  const totalsByMonth = new Map<string, number>(
    lastMonths.map((monthDate) => [monthKey(monthDate), 0]),
  );

  for (const expense of expenses) {
    const date = parseExpenseDate(expense.date);

    if (!date) {
      continue;
    }

    const key = monthKey(new Date(date.getFullYear(), date.getMonth(), 1));

    if (!totalsByMonth.has(key)) {
      continue;
    }

    const value = parseExpenseValue(expense.expense);
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
}

export function summarizeExpenses(expenses: ExpenseRecord[]): ExpenseSummary {
  return summarizeExpensesWithBudget(expenses, 0);
}

export function summarizeExpensesWithBudget(
  expenses: ExpenseRecord[],
  budget: number,
): ExpenseSummary {
  let totalSpent = 0;
  const categoryTotals = new Map<string, number>();

  for (const expense of expenses) {
    const value = parseExpenseValue(expense.expense);
    totalSpent += value;

    const currentCategoryTotal = categoryTotals.get(expense.category) ?? 0;
    categoryTotals.set(expense.category, currentCategoryTotal + value);
  }

  const shoppingNumber = expenses.length;
  const averageTicketValue =
    shoppingNumber > 0 ? totalSpent / shoppingNumber : 0;

  const sortedCategories = Array.from(categoryTotals.entries()).sort(
    (left, right) => right[1] - left[1],
  );
  const topCategory = sortedCategories[0]?.[0] ?? "N/A";

  const remainingBalance = budget - totalSpent;
  const percentageSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;

  return {
    budget,
    totalSpent,
    remainingBalance,
    averageTicketValue,
    shoppingNumber,
    topCategory,
    percentageSpent,
  };
}
