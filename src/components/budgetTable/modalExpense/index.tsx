import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

type ModalExpenseProps = {
  open: boolean;
  onClose: () => void;
};

export default function ModalExpense({ open, onClose }: ModalExpenseProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Select a category");
  const [buy, setBuy] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [expense, setExpense] = useState<string>("");

  const categories = [
    "Select a category",
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Education",
    "Shopping",
    "Bills",
    "Other",
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log({
      selectedCategory,
      buy,
      date,
      expense,
    });
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-700"
                    >
                      New expense
                    </DialogTitle>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">
                        Enter the transaction details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form
                className="flex flex-col gap-2 px-4 pb-4 sm:px-6 mt-2"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="buy">Buy</label>
                  <div className="flex w-full min-w-0 items-center gap-2 border border-gray-300 bg-gray-200 rounded-lg px-2 py-2 hover:bg-gray-300 duration-200 sm:flex-1">
                    <input
                      type="text"
                      name="buy"
                      value={buy}
                      onChange={(e) => setBuy(e.target.value)}
                      placeholder="Ex: Buy groceries"
                      className="w-full min-w-0 appearance-none bg-transparent focus:outline-none text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full min-w-0 bg-gray-200 border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-300 duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full min-w-0 bg-gray-200 border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-300 duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="expense">Expense</label>
                    <input
                      type="text"
                      name="expense"
                      value={expense}
                      onChange={(e) => setExpense(e.target.value)}
                      placeholder="Ex: 34.90"
                      className="w-full min-w-0 bg-gray-200 border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-300 duration-200"
                    />
                  </div>
                </div>

                <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    onClick={() => onClose()}
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 sm:ml-3 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => onClose()}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-blue-600 sm:mt-0 sm:w-auto"
                  >
                    Save
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
