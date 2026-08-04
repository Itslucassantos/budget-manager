import { Card } from "../../components/card";
import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";
import { FaWallet } from "react-icons/fa6";
import { HiMiniArrowTrendingDown } from "react-icons/hi2";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { RiBarChartFill } from "react-icons/ri";
import { RiShoppingCartFill } from "react-icons/ri";
import { FaTag } from "react-icons/fa6";
import { MonthlySchedule } from "../../components/monthlySchedule";

export function Dashboard() {
  const budget = `R$ 5000,00`;
  const remainingBalance = `R$ 500,00`;
  const averageTicketValue = `R$ 50,00`;
  const totalSpent = `R$ 500,00`;
  const porcentageSpent =
    budget && totalSpent
      ? `${((parseFloat(totalSpent.replace("R$ ", "").replace(",", ".")) / parseFloat(budget.replace("R$ ", "").replace(",", "."))) * 100).toFixed(2)}%`
      : "0%";
  const shoppingNumber = 10;
  const topCategory = "Electronics";

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 min-w-0 p-4">
        <div className="flex">
          <div>
            <h1 className="text-lg md:text-2xl text-slate-100 font-medium">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              Overview of your finances
            </p>
          </div>
        </div>

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
            description={`${porcentageSpent} of the budget`}
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
                style={{ width: porcentageSpent }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{porcentageSpent} used</p>

            <div className="text-sm text-slate-400">
              {remainingBalance} remaining
            </div>
          </div>
        </div>

        <div className="mt-4">
          <MonthlySchedule />
        </div>
      </div>
    </div>
  );
}
