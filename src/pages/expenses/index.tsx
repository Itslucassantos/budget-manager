import { BudgetTable } from "../../components/budgetTable";
import { AppShell } from "../../components/appShell";

export function Expenses() {
  return (
    <AppShell>
      <div>
        <h1 className="text-lg md:text-2xl text-slate-100 font-medium">
          Expenses
        </h1>
        <p className="text-sm md:text-base text-slate-400">
          Manage all your transactions
        </p>
      </div>

      <div className="mt-4">
        <BudgetTable />
      </div>
    </AppShell>
  );
}
