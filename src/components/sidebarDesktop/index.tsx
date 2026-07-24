import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";

export function SidebarDesktop() {
  const currentPath = window.location.pathname;

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-zinc-900 border-r border-slate-700">
      <div className="flex border-b border-slate-700 p-4">
        <div className="flex items-center justify-center w-9 h-9 bg-blue-400 rounded-md mr-4">
          <FaWallet width={13} height={13} color="white" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-base text-slate-100 font-medium">
            Budget manager
          </h1>
          <p className="text-sm text-slate-700">Financial management</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 px-4">
        <div
          className={`${currentPath === "/dashboard" ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`}
        >
          <div className="flex gap-2 items-center">
            <MdOutlineDashboardCustomize width={13} height={13} />
            <Link to="/dashboard" className="font-medium text-sm">
              Dashboard
            </Link>
          </div>

          <div
            className={`${currentPath === "/dashboard" ? "rounded-full bg-blue-400 w-2 h-2" : ""}`}
          ></div>
        </div>

        <div
          className={`${currentPath === "/expenses" ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`}
        >
          <div className="flex gap-2 items-center">
            <IoWalletOutline width={13} height={13} />
            <Link to="/expenses" className="font-medium text-sm">
              Expenses
            </Link>
          </div>

          <div
            className={`${currentPath === "/expenses" ? "rounded-full bg-blue-400 w-2 h-2" : ""}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
