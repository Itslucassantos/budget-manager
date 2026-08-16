import type { ReactNode } from "react";
import { MobileMenu } from "../mobileMenu";
import { SidebarDesktop } from "../sidebarDesktop";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileMenu />
      <SidebarDesktop />

      <div className="flex-1 min-w-0 p-4">{children}</div>
    </div>
  );
}
