import { NavLink } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";

type NavigationLinksProps = {
  onNavigate?: () => void;
};

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    Icon: MdOutlineDashboardCustomize,
  },
  {
    to: "/expenses",
    label: "Expenses",
    Icon: IoWalletOutline,
  },
  {
    to: "/settings",
    label: "Settings",
    Icon: IoSettingsOutline,
  },
] as const;

export function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <div className="flex flex-col gap-2 mt-4 px-4">
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `${isActive ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex gap-2 items-center">
                <Icon width={13} height={13} />
                <span className="font-medium text-sm">{label}</span>
              </div>

              <div
                className={isActive ? "rounded-full bg-blue-400 w-2 h-2" : ""}
              ></div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
