import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IoMenu } from "react-icons/io5";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext";

export function MobileMenu() {
  const { handleLogout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="md:hidden border-b border-slate-700">
      <button
        onClick={() => setOpen(true)}
        className="ml-4 mr-6 mt-4"
        aria-label="Open navigation menu"
      >
        <IoMenu height={44} width={44} color="white" />
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-65/100">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:-translate-x-full sm:duration-700"
              >
                <div className="relative flex h-full flex-col overflow-y-auto bg-zinc-900 py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                  <div className="flex border-b border-slate-700 p-4">
                    <div className="flex items-center justify-center w-9 h-9 bg-blue-400 rounded-md mr-4">
                      <FaWallet width={13} height={13} color="white" />
                    </div>

                    <div className="flex flex-col">
                      <h1 className="text-base text-slate-100 font-medium">
                        Budget manager
                      </h1>
                      <p className="text-sm text-slate-700">
                        Financial management
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 px-4">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className={`${pathname === "/dashboard" ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`}
                    >
                      <div className="flex gap-2 items-center">
                        <MdOutlineDashboardCustomize width={13} height={13} />
                        <span className="font-medium text-sm">Dashboard</span>
                      </div>

                      <div
                        className={`${pathname === "/dashboard" ? "rounded-full bg-blue-400 w-2 h-2" : ""}`}
                      ></div>
                    </NavLink>

                    <NavLink
                      to="/expenses"
                      onClick={() => setOpen(false)}
                      className={`${pathname === "/expenses" ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`}
                    >
                      <div className="flex gap-2 items-center">
                        <IoWalletOutline width={13} height={13} />
                        <span className="font-medium text-sm">Expenses</span>
                      </div>

                      <div
                        className={`${pathname === "/expenses" ? "rounded-full bg-blue-400 w-2 h-2" : ""}`}
                      ></div>
                    </NavLink>

                    <NavLink
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className={`${pathname === "/settings" ? "bg-zinc-800 text-blue-400" : "text-slate-700 hover:bg-zinc-800 hover:text-slate-100"} p-2 rounded-md flex gap-2 items-center justify-around`}
                    >
                      <div className="flex gap-2 items-center">
                        <IoSettingsOutline width={13} height={13} />
                        <span className="font-medium text-sm">Settings</span>
                      </div>

                      <div
                        className={`${pathname === "/settings" ? "rounded-full bg-blue-400 w-2 h-2" : ""}`}
                      ></div>
                    </NavLink>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto px-4 border-t border-slate-700 pt-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all p-2 rounded-md w-full mt-auto"
                    >
                      <IoIosLogOut width={13} height={13} />
                      <span className="font-medium text-sm">Logout</span>
                    </button>

                    <button className="flex items-center gap-2 text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all p-2 rounded-md w-full mt-auto">
                      <RiDeleteBinLine width={13} height={13} />
                      <span className="font-medium text-sm">
                        Delete Account
                      </span>
                    </button>

                    <div className="flex gap-4 items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-lg font-medium">
                        <span className="text-xl font-medium text-blue-400">
                          {user?.name
                            ? user.name.charAt(0) +
                              user.name.charAt(user.name.lastIndexOf(" ") + 1)
                            : "AN"}
                        </span>
                      </div>

                      <div>
                        <p className="text-base font-medium text-slate-100">
                          {user?.name}
                        </p>
                        <p className="text-sm text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
