import { Card } from "../../components/card";
import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";
import { FaWallet } from "react-icons/fa6";

export function Dashboard() {
  const budget = `R$ 1000,00`;

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
        </div>
      </div>
    </div>
  );
}
