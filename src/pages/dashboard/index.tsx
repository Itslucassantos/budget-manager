import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";

export function Dashboard() {
  return (
    <div className="flex">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 p-4">
        <div className="flex">
          <div>
            <h1 className="text-lg md:text-2xl text-gray-700 font-medium">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Overview of your finances
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
