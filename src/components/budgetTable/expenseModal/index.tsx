import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BudgetTableProps } from "../index";
import { Input } from "../../Input";
import { useEffect } from "react";
import { toDateInputValue, toDisplayDate } from "../../../utils/dateFormatter";
import { createExpense, updateExpense } from "../../../api/sheet2ApiClient";

type ExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  editingExpense: BudgetTableProps | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const schema = z.object({
  buy: z.string().min(1, { message: "Buy is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  expense: z.string().min(1, { message: "Expense is required" }),
});

type FormData = z.infer<typeof schema>;

export default function ExpenseModal({
  open,
  onClose,
  onSaved,
  setSuccessMessage,
  setErrorMessage,
  editingExpense,
  isLoading,
  setIsLoading,
}: ExpenseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      buy: "",
      category: "Select a category",
      date: "",
      expense: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingExpense) {
      reset({
        buy: editingExpense.buy,
        category: editingExpense.category,
        date: toDateInputValue(editingExpense.date),
        expense: editingExpense.expense,
      });
    } else {
      reset({
        buy: "",
        category: "Select a category",
        date: "",
        expense: "",
      });
    }
  }, [editingExpense, reset, open]);

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Education",
    "Shopping",
    "Bills",
    "Other",
  ];

  async function onSubmit(data: FormData) {
    if (data.category === "Select a category") {
      setErrorMessage("Please select a category");
      return;
    }

    if (!data.buy || !data.date || !data.expense) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const payload = {
      buy: data.buy,
      category: data.category,
      date: toDisplayDate(data.date),
      expense: data.expense,
    };

    try {
      if (editingExpense) {
        setIsLoading(true);
        await updateExpense(editingExpense, payload);
        setSuccessMessage("Expense updated successfully");
      } else {
        setIsLoading(true);
        await createExpense(payload);
        setSuccessMessage("Expense added successfully");
      }

      await onSaved();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "No rows matched for update"
      ) {
        setErrorMessage("Update not applied: original row was not found");
      } else {
        setErrorMessage("Unable to save expense");
      }
      setIsLoading(false);
      return;
    }

    setErrorMessage(null);
    setIsLoading(false);
    reset();
    onClose();
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
                      {editingExpense ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                    <div className="mt-1">
                      <p className="text-sm text-slate-400">
                        Enter the transaction details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form
                className="flex flex-col gap-2 px-4 pb-4 sm:px-6 mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label htmlFor="buy" className="text-sm text-slate-100">
                    Buy
                  </label>

                  <Input
                    type="text"
                    placeholder="Ex: Buy groceries"
                    name="buy"
                    register={register}
                    rules={{ required: "Buy is required" }}
                    error={errors.buy?.message}
                  />
                </div>

                <div>
                  <label htmlFor="category" className="text-sm text-slate-100">
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className="w-full min-w-0 bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="my-1 text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="date" className="text-sm text-slate-100">
                      Date
                    </label>
                    <Input
                      type="date"
                      placeholder="Select a date"
                      name="date"
                      register={register}
                      rules={{ required: "Date is required" }}
                      error={errors.date?.message}
                    />
                  </div>

                  <div>
                    <label htmlFor="expense" className="text-sm text-slate-100">
                      Expense
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 100.00"
                      name="expense"
                      register={register}
                      rules={{ required: "Expense is required" }}
                      error={errors.expense?.message}
                    />
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
                    type="submit"
                    data-autofocus
                    disabled={isLoading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-blue-600 sm:mt-0 sm:w-auto *:disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Loading..."
                      : editingExpense
                        ? "Update"
                        : "Save"}
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
