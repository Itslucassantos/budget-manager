import { useContext, useState } from "react";
import { AppShell } from "../../components/appShell";
import toast from "react-hot-toast";
import { defaultSheet2BaseUrl } from "../../api/api";
import { AuthContext } from "../../contexts/authContext";

export function Settings() {
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState<number | null>(() => {
    const storedBudget = localStorage.getItem("budget");

    if (!storedBudget) {
      return null;
    }

    const parsedBudget = parseFloat(storedBudget);
    return Number.isNaN(parsedBudget) ? null : parsedBudget;
  });
  const [sheetsUrl, setSheetsUrl] = useState<string>(() => {
    if (typeof window === "undefined") {
      return defaultSheet2BaseUrl;
    }

    return window.localStorage.getItem("sheetsUrl") || defaultSheet2BaseUrl;
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (budget === null || budget < 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }

    localStorage.setItem("budget", budget.toString());
    toast.success("Budget updated successfully.");
  }

  function handleConnectSheets(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!sheetsUrl) {
      toast.error("Please enter a valid Sheets2API URL.");
      return;
    }

    const trimmedUrl = sheetsUrl.trim();

    localStorage.setItem("sheetsUrl", trimmedUrl);
    toast.success("Sheets2API URL saved successfully.");
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg md:text-2xl text-slate-100 font-medium">
            Settings
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Manage your account and integrations
          </p>
        </div>

        <div className="bg-zinc-900 border border-slate-700 flex flex-col rounded-lg p-4 w-full md:max-w-[70%]">
          <h2 className="text-lg md:text-xl text-slate-100 font-medium">
            Profile
          </h2>

          <div className="flex gap-4 mt-3 items-center">
            <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-lg font-medium">
              <span className="text-2xl font-medium text-blue-400">
                {user?.name
                  ? user.name.charAt(0) +
                    user.name.charAt(user.name.lastIndexOf(" ") + 1)
                  : "AN"}
              </span>
            </div>

            <div>
              <p className="text-base font-medium text-slate-100">
                {user?.name}
              </p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div>
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
              <label htmlFor="budget" className="text-sm text-slate-100">
                Monthly budget (R$)
              </label>
              <input
                type="number"
                placeholder="5000"
                name="budget"
                className="w-full min-w-0 bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200 *:focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={budget ?? ""}
                onChange={(e) =>
                  setBudget(e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 duration-200"
              >
                Save changes
              </button>
            </form>
          </div>
        </div>

        <div className="bg-zinc-900 border border-slate-700 flex flex-col rounded-lg p-4 w-full md:max-w-[70%]">
          <h3 className="text-base md:text-base text-slate-100 font-medium">
            Google Sheets Integration
          </h3>
          <p className="text-sm md:text-base text-slate-400">
            Connect your "Budget" spreadsheet via Sheets2API.
          </p>

          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={handleConnectSheets}
          >
            <label htmlFor="sheets" className="text-sm text-slate-100">
              Sheets2API URL
            </label>
            <input
              type="text"
              placeholder="https://sheets2api.com/your-api-endpoint"
              name="sheets"
              className="w-full min-w-0 bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200 *:focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sheetsUrl}
              onChange={(e) => setSheetsUrl(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 duration-200"
            >
              Connect spreadsheet
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
