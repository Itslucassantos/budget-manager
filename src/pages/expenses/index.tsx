import { BudgetTable } from "../../components/budgetTable";
import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";

export function Expenses() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 min-w-0 p-4">
        <div>
          <h1 className="text-lg md:text-2xl text-gray-700 font-medium">
            Expenses
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Manage all your transactions
          </p>
        </div>

        <div className="mt-4">
          <BudgetTable />
        </div>
      </div>
    </div>
  );
}
