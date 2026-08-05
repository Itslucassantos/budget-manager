import { useEffect, useMemo, useState } from "react";
import { FaTag, FaWallet } from "react-icons/fa6";
import {
  HiMiniArrowTrendingDown,
  HiMiniArrowTrendingUp,
} from "react-icons/hi2";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { RiBarChartFill, RiShoppingCartFill } from "react-icons/ri";
import { getExpenses, type ExpenseRecord } from "../../api/sheet2ApiClient";
import { Card } from "../../components/card";
import { MonthlySchedule } from "../../components/monthlySchedule";
import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";
import toast from "react-hot-toast";
import {
  filterExpenseByDate,
  formatCurrencyValue,
  type ExpenseDateRange,
  type ExpenseFilter,
  summarizeExpensesWithBudget,
} from "../../utils/expenseAnalytics";

export function Dashboard() {
  const budgetValue = 5000;
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ExpenseFilter>("all");
  const [customRange, setCustomRange] = useState<ExpenseDateRange>({
    startDate: "",
    endDate: "",
  });

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

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((expense) =>
        filterExpenseByDate(expense, selectedFilter, customRange),
      ),
    [expenses, selectedFilter, customRange],
  );

  const summary = useMemo(
    () => summarizeExpensesWithBudget(filteredExpenses, budgetValue),
    [filteredExpenses],
  );

  const budget = formatCurrencyValue(budgetValue);
  const remainingBalance = formatCurrencyValue(summary.remainingBalance);
  const averageTicketValue = formatCurrencyValue(summary.averageTicketValue);
  const totalSpent = formatCurrencyValue(summary.totalSpent);
  const percentageSpent = `${summary.percentageSpent.toFixed(2)}%`;
  const shoppingNumber = summary.shoppingNumber;
  const topCategory = summary.topCategory;
  const hasNoFilteredExpenses =
    !isLoading && expenses.length > 0 && filteredExpenses.length === 0;

  useEffect(() => {
    if (hasNoFilteredExpenses) {
      toast.error("No expenses match the selected filter.", {
        duration: 5000,
      });
    }
  }, [hasNoFilteredExpenses]);

  const filterOptions: Array<{ value: ExpenseFilter; label: string }> = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "last7Days", label: "Last 7 days" },
    { value: "last30Days", label: "Last 30 days" },
    { value: "thisMonth", label: "This month" },
    { value: "lastMonth", label: "Last month" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 min-w-0 p-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-lg md:text-2xl text-slate-100 font-medium">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              Overview of your finances
            </p>
          </div>

          <div>
            <div className="relative inline-flex min-w-56 items-center rounded-2xl border border-slate-700 bg-zinc-900 px-4 py-2 shadow-sm transition hover:border-slate-700 hover:bg-zinc-900 focus-within:border-blue-500">
              <FiCalendar className="mr-2 shrink-0 text-slate-400" />

              <select
                value={selectedFilter}
                onChange={(event) =>
                  setSelectedFilter(event.target.value as ExpenseFilter)
                }
                className="w-full appearance-none bg-zinc-900 pr-8 text-slate-100 border-none focus:outline-none focus:ring-0 focus:border-blue-500"
              >
                {filterOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="mt-1 text-slate-100 bg-zinc-900"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className="pointer-events-none absolute right-4 text-slate-400" />
            </div>

            {selectedFilter === "custom" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-slate-300">
                  Start date
                  <input
                    type="date"
                    value={customRange.startDate}
                    onChange={(event) =>
                      setCustomRange((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-700 bg-zinc-800 px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm text-slate-300">
                  End date
                  <input
                    type="date"
                    value={customRange.endDate}
                    onChange={(event) =>
                      setCustomRange((current) => ({
                        ...current,
                        endDate: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-700 bg-zinc-800 px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </div>

        {hasError && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            Error loading spreadsheet data.
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            title="BUDGET"
            price={budget}
            description="Monthly limit"
            icon={<FaWallet height={13} width={13} className="text-blue-500" />}
          />

          <Card
            title="REMAINING BALANCE"
            price={remainingBalance}
            description="Available"
            icon={
              <HiMiniArrowTrendingDown
                height={13}
                width={13}
                className="text-green-500"
              />
            }
          />

          <Card
            title="AVERAGE TICKET VALUE"
            price={averageTicketValue}
            description="Average per purchase"
            icon={
              <RiBarChartFill
                height={13}
                width={13}
                className="text-yellow-500"
              />
            }
          />

          <Card
            title="TOTAL SPENT"
            price={totalSpent}
            description={`${percentageSpent} of the budget`}
            icon={
              <HiMiniArrowTrendingUp
                height={13}
                width={13}
                className="text-red-500"
              />
            }
          />

          <Card
            title="SHOPPING"
            shoppingNumber={shoppingNumber}
            description="Transactions during the period"
            icon={
              <RiShoppingCartFill
                height={13}
                width={13}
                className="text-purple-500"
              />
            }
          />

          <Card
            title="TOP CATEGORY"
            price={topCategory}
            description="Most purchased category"
            icon={<FaTag height={13} width={13} className="text-green-300" />}
          />
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 border border-slate-700 mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-base text-slate-100 font-medium">
              Use of the budget
            </p>
            <div className="text-base text-slate-400">
              {totalSpent} of {budget}
            </div>
          </div>

          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: percentageSpent }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{percentageSpent} used</p>

            <div className="text-sm text-slate-400">
              {remainingBalance} remaining
            </div>
          </div>
        </div>

        <div className="mt-4">
          <MonthlySchedule
            expenses={filteredExpenses}
            isLoading={isLoading}
            hasError={hasError}
          />
        </div>
      </div>
    </div>
  );
}
