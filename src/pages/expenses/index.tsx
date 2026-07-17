import { Sidebar } from "../../components/sidebar";

export function Expenses() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <p>Welcome to the expenses page!</p>
      </div>
    </div>
  );
}
