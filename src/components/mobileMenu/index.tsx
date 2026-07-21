import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { IoMenu } from "react-icons/io5";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const currentPath = window.location.pathname;

  return (
    <div className="md:hidden border-b-2 border-gray-200">
      <button onClick={() => setOpen(true)} className="ml-4 mr-6 mt-4">
        <IoMenu height={44} width={44} color="black" />
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
                <div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                  <div className="flex border-b border-gray-200 p-4">
                    <div className="flex items-center justify-center w-9 h-9 bg-blue-400 rounded-md mr-4">
                      <FaWallet width={13} height={13} color="white" />
                    </div>

                    <div className="flex flex-col">
                      <h1 className="text-base text-gray-700 font-medium">
                        Budget manager
                      </h1>
                      <p className="text-sm text-gray-500">
                        Financial management
                      </p>
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
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
