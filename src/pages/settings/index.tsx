import { MobileMenu } from "../../components/mobileMenu";
import { SidebarDesktop } from "../../components/sidebarDesktop";

export function Settings() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 min-w-0 p-4">
        <div className="flex">
          <div>
            <h1 className="text-lg md:text-2xl text-slate-100 font-medium">
              Settings
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              Manage your account and integrations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
