import { ImPencil } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import ModalExpense from "./modalExpense";

export function BudgetTable() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Categories");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

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

  const data = [
    {
      id: 1,
      buy: "Uber",
      category: "Transport",
      date: "13/07/2026",
      expense: "34,90",
    },
    {
      id: 2,
      buy: "Uber",
      category: "Transport",
      date: "13/07/2026",
      expense: "35,90",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-base font-medium text-gray-700">All expenses</h2>
          <p className="text-sm text-gray-500">20 transactions</p>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-2 border border-gray-300 bg-gray-200 rounded-md px-2 py-1 hover:bg-gray-300 duration-200">
            <IoSearchOutline width={13} height={13} />
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="appearance-none bg-transparent focus:outline-none text-sm text-gray-700"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-200 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 duration-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button onClick={() => setIsExpenseModalOpen(true)}>
            Add expense
          </button>

          <ModalExpense
            open={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="font-medium text-gray-500 text-sm text-left px-5 py-3"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 text-gray-700 text-sm font-medium border-b border-gray-200">
                  {row.buy}
                </td>
                <td className="px-5 py-3.5 text-gray-700 text-sm font-medium border-b border-gray-200">
                  {row.category}
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-sm font-medium border-b border-gray-200">
                  {row.date}
                </td>
                <td className="px-5 py-3.5 text-gray-700 text-sm font-medium border-b border-gray-200">
                  {row.expense}
                </td>
                <td className="px-5 py-3.5 border-b border-gray-200">
                  <ImPencil className="inline-block mr-2" />
                  <FaRegTrashCan className="inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
