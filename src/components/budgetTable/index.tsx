import { ImPencil } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";

export function BudgetTable() {
  const columns = [
    { key: "buy", label: "BUY" },
    { key: "category", label: "CATEGORY" },
    { key: "date", label: "DATE" },
    { key: "expense", label: "EXPENSE" },
    { key: "actions", label: "ACTIONS" },
  ];
  const data = [
    {
      id: 1,
      buy: "Uber",
      category: "Transporte",
      date: "13/07/2026",
      expense: "34,90",
    },
    {
      id: 2,
      buy: "Uber",
      category: "Transporte",
      date: "13/07/2026",
      expense: "35,90",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2>All expenses</h2>
        <p>20 transactions</p>
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
