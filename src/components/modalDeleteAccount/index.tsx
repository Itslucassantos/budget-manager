import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ModalDeleteAccount({
  open,
  onClose,
  setErrorMessage,
}: DeleteModalProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      const getUser = localStorage.getItem("user");

      if (!getUser) {
        setErrorMessage("User not found");
        return;
      }

      localStorage.removeItem("user");

      onClose();
      navigate("/");
    } catch {
      setErrorMessage("Unable to delete account");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-zinc-900 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-zinc-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-700">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-slate-100"
                    >
                      Delete Account
                    </DialogTitle>
                    <div className="mt-1">
                      <p className="text-sm text-slate-400">
                        Are you sure you want to delete your account?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="inline-flex w-full justify-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-zinc-700 sm:ml-3 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    disabled={isDeleting}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-red-600 sm:mt-0 sm:w-auto *:disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
