import { ImPencil } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import ExpenseModal from "./expenseModal";
import { LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import type { ExpenseRecord } from "../../api/sheet2ApiClient";
import DeleteModal from "./deleteModal";
import { useExpensesQuery } from "../../hooks/useExpensesQuery";
import { expensesQueryKey } from "../../hooks/useExpensesQuery";
import { useQueryClient } from "@tanstack/react-query";

export type BudgetTableProps = ExpenseRecord;

export function BudgetTable() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expense, setExpense] = useState<BudgetTableProps | null>(null);
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Categories");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);
  const queryClient = useQueryClient();

  const {
    data: data = [],
    isLoading: isListLoading,
    isError: hasLoadError,
  } = useExpensesQuery(400);

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return data.filter((item) => {
      const matchesCategory =
        selectedCategory === "Categories" || item.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        item.buy.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.date.toLowerCase().includes(normalizedSearch) ||
        item.expense.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [data, selectedCategory, deferredSearchTerm]);

  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (effectiveCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, effectiveCurrentPage, itemsPerPage]);

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, Math.min(prev, totalPages) - 1));
  }

  function goToNextPage() {
    setCurrentPage((prev) =>
      Math.min(totalPages, Math.min(prev, totalPages) + 1),
    );
  }

  const columns = [
    { key: "buy", label: "BUY" },
    { key: "category", label: "CATEGORY" },
    { key: "date", label: "DATE" },
    { key: "expense", label: "EXPENSE" },
    { key: "actions", label: "ACTIONS" },
  ];

  const categories = [
    "Categories",
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Education",
    "Shopping",
    "Bills",
    "Other",
  ];

  useEffect(() => {
    if (hasLoadError) {
      setErrorMessage("Error loading expenses");
    }
  }, [hasLoadError]);

  useEffect(() => {
    let successTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let errorTimeoutId: ReturnType<typeof setTimeout> | undefined;

    if (successMessage) {
      successTimeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      toast.success(successMessage);
    }

    if (errorMessage) {
      errorTimeoutId = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      toast.error(errorMessage);
    }

    return () => {
      if (successTimeoutId) {
        clearTimeout(successTimeoutId);
      }

      if (errorTimeoutId) {
        clearTimeout(errorTimeoutId);
      }
    };
  }, [successMessage, errorMessage]);

  function handleOpenCreate() {
    setExpense(null);
    setIsExpenseModalOpen(true);
  }

  function handleOpenEdit(expense: BudgetTableProps) {
    setExpense(expense);
    setIsExpenseModalOpen(true);
  }

  function handleCloseModal() {
    setIsExpenseModalOpen(false);
    setExpense(null);
  }

  function handleExpenseDeleted(expense: BudgetTableProps) {
    setExpense(expense);
    setIsDeleteModalOpen(true);
  }

  async function handleExpenseSaved() {
    await queryClient.invalidateQueries({ queryKey: expensesQueryKey });
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-slate-700">
      <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-base font-medium text-slate-100">All expenses</h2>
          <p className="text-sm text-slate-400">
            {filteredData.length} transactions
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {data.length > 0 && (
            <div className="flex w-full min-w-0 items-center gap-2 border border-slate-700 bg-zinc-800 rounded-lg px-2 py-2 hover:bg-zinc-700 duration-200 sm:flex-1 text-slate-100">
              <IoSearchOutline width={13} height={13} />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full min-w-0 appearance-none bg-transparent focus:outline-none text-sm text-slate-100"
              />
            </div>
          )}

          {data.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleOpenCreate}
            className="bg-blue-500 text-slate-100 rounded-lg px-4 py-2 text-sm hover:bg-blue-600 duration-200 flex items-center gap-1"
          >
            <LuPlus />
            Add
          </button>

          <ExpenseModal
            open={isExpenseModalOpen}
            onClose={handleCloseModal}
            onSaved={handleExpenseSaved}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            editingExpense={expense}
            isSaving={isSavingExpense}
            setIsSaving={setIsSavingExpense}
          />

          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            isDeleting={isDeletingExpense}
            setIsDeleting={setIsDeletingExpense}
            onDeleted={handleExpenseSaved}
            expense={expense}
          />
        </div>
      </div>

      {isListLoading ? (
        <div className="flex flex-col items-center justify-center h-24 bg-zinc-900">
          <p className="text-slate-400 text-lg">Loading transactions...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 bg-zinc-900">
          <p className="text-slate-400 text-lg">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-zinc-900">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="font-normal text-slate-400 text-sm text-left px-5 py-3"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={`${row.buy}-${row.category}-${row.date}-${row.expense}-${data.indexOf(row)}`}
                    className="hover:bg-zinc-800"
                  >
                    <td className="px-5 py-3.5 text-slate-100 text-sm font-medium border-b border-slate-700">
                      {row.buy}
                    </td>
                    <td className="px-5 py-3.5 text-slate-100 text-sm font-medium border-b border-slate-700">
                      {row.category}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm font-medium border-b border-slate-700">
                      {row.date}
                    </td>
                    <td className="px-5 py-3.5 text-slate-100 text-sm font-medium border-b border-slate-700">
                      {row.expense}
                    </td>
                    <td className="px-5 py-3.5 border-b border-slate-700 text-slate-100">
                      <button
                        onClick={() => handleOpenEdit(row)}
                        aria-label={`Edit expense ${row.buy}`}
                      >
                        <ImPencil className="inline-block mr-2 hover:text-blue-500 cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleExpenseDeleted(row)}
                        aria-label={`Delete expense ${row.buy}`}
                      >
                        <FaRegTrashCan className="inline-block hover:text-red-500 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 sm:px-6">
            <div className="text-slate-400 text-sm">
              {(effectiveCurrentPage - 1) * itemsPerPage + 1}-
              {Math.min(
                effectiveCurrentPage * itemsPerPage,
                filteredData.length,
              )}{" "}
              of {filteredData.length}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={goToPreviousPage}
                disabled={effectiveCurrentPage === 1}
                className="bg-zinc-900 text-slate-400 rounded-lg px-2 py-2 text-sm hover:bg-zinc-700 duration-200"
              >
                <MdKeyboardArrowLeft width={24} height={24} />
              </button>

              <div className="text-slate-400 text-sm">
                {effectiveCurrentPage} of {totalPages}
              </div>

              <button
                onClick={goToNextPage}
                disabled={effectiveCurrentPage === totalPages}
                className="bg-zinc-900 text-slate-400 rounded-lg px-2 py-2 text-sm hover:bg-zinc-700 duration-200"
              >
                <MdKeyboardArrowRight width={24} height={24} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
