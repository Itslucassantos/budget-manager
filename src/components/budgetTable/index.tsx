import { ImPencil } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import ModalExpense from "./modalExpense";
import { LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

export interface BudgetTableProps {
  uid: string;
  buy: string;
  category: string;
  date: string;
  expense: string;
}

export function BudgetTable() {
  const [data, setData] = useState<BudgetTableProps[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<BudgetTableProps | null>(
    null,
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Categories");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCategory =
        selectedCategory === "Categories" || item.category === selectedCategory;

      const matchesSearchTerm =
        item.buy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.expense.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearchTerm;
    });
  }, [data, selectedCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
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
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      toast.success(successMessage);
    }

    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  function handleOpenCreate() {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  }

  function handleOpenEdit(expense: BudgetTableProps) {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  }

  function handleCloseModal() {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-slate-700">
      <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-base font-medium text-slate-100">All expenses</h2>
          <p className="text-sm text-slate-400">{data.length} transactions</p>
        </div>

        <div className="flex gap-2 mt-4">
          {data.length > 0 && (
            <div className="flex w-full min-w-0 items-center gap-2 border border-slate-700 bg-zinc-800 rounded-lg px-2 py-2 hover:bg-zinc-700 duration-200 sm:flex-1 text-slate-100">
              <IoSearchOutline width={13} height={13} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full min-w-0 appearance-none bg-transparent focus:outline-none text-sm text-slate-100"
              />
            </div>
          )}

          {data.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

          <ModalExpense
            open={isExpenseModalOpen}
            onClose={handleCloseModal}
            setData={setData}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            editingExpense={editingExpense}
          />
        </div>
      </div>

      {data.length === 0 ? (
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
                  <tr key={row.uid} className="hover:bg-zinc-800">
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
                      <button onClick={() => handleOpenEdit(row)}>
                        <ImPencil className="inline-block mr-2 hover:text-blue-500 cursor-pointer" />
                      </button>
                      <button>
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
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, data.length)} of{" "}
              {data.length}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="bg-zinc-900 text-slate-400 rounded-lg px-2 py-2 text-sm hover:bg-zinc-700 duration-200"
              >
                <MdKeyboardArrowLeft width={24} height={24} />
              </button>

              <div className="text-slate-400 text-sm">
                {currentPage} of {totalPages}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
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
