import { FaWallet } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { RiDeleteBinLine } from "react-icons/ri";
import ModalDeleteAccount from "../modalDeleteAccount";
import { NavigationLinks } from "../navigationLinks";
import toast from "react-hot-toast";

export function SidebarDesktop() {
  const { handleLogout, user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);

  const handleDeleteAccount = () => {
    setOpenModalDeleteAccount(true);
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="hidden md:flex flex-col w-64 self-stretch bg-zinc-900 border-r border-slate-700">
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

      <NavigationLinks />

      <div className="flex flex-col gap-2 mt-auto px-4 border-t border-slate-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all p-2 rounded-md w-full mt-auto"
        >
          <IoIosLogOut width={13} height={13} />
          <span className="font-medium text-sm">Logout</span>
        </button>

        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all p-2 rounded-md w-full mt-auto"
        >
          <RiDeleteBinLine width={13} height={13} />
          <span className="font-medium text-sm">Delete Account</span>
        </button>

        <ModalDeleteAccount
          open={openModalDeleteAccount}
          onClose={() => setOpenModalDeleteAccount(false)}
          setErrorMessage={setErrorMessage}
        />

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
            <p className="text-base font-medium text-slate-100">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
