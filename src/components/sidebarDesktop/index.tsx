import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";

export function SidebarDesktop() {
  const currentPath = window.location.pathname;

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      <div className="flex border-b border-gray-200 p-4">
        <div className="flex items-center justify-center w-9 h-9 bg-blue-400 rounded-md mr-4">
          <FaWallet width={13} height={13} color="white" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-base text-gray-700 font-medium">
            Budget manager
          </h1>
          <p className="text-sm text-gray-500">Financial management</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 px-4">
        <div
          className={`${currentPath === "/dashboard" ? "bg-gray-200 text-blue-400" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"} p-2 rounded-md flex gap-2 items-center justify-around`}
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
          className={`${currentPath === "/expenses" ? "bg-gray-200 text-blue-400" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"} p-2 rounded-md flex gap-2 items-center justify-around`}
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
