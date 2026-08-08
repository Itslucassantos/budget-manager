import { getSheet2BaseUrl } from "./api";

export type ExpenseRecord = {
  buy: string;
  category: string;
  date: string;
  expense: string;
};

type GetExpensesOptions = {
  searchTerm?: string;
  limit?: number;
  signal?: AbortSignal;
};

type ExpensePayload = {
  buy: string;
  category: string;
  date: string;
  expense: string;
};

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function parseExpenseToNumber(value: string): number {
  const normalized = value
    .replace("R$", "")
    .replace(/\s+/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    throw new Error("Invalid expense value");
  }

  return parsed;
}

function normalizeExpenseForDisplay(value: unknown): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  const text = normalizeText(value);

  if (!text) {
    return "";
  }

  const parsed = Number(text.replace(",", "."));

  if (Number.isNaN(parsed)) {
    return text;
  }

  return parsed.toFixed(2);
}

function normalizeRow(row: Record<string, unknown>): ExpenseRecord {
  return {
    buy: normalizeText(row.buy),
    category: normalizeText(row.category),
    date: normalizeText(row.date),
    expense: normalizeExpenseForDisplay(row.expense),
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function buildIdentityParams(expense: ExpenseRecord): URLSearchParams {
  const params = new URLSearchParams();
  params.set("buy", expense.buy);
  params.set("category", expense.category);
  params.set("date", expense.date);
  params.set("expense", String(parseExpenseToNumber(expense.expense)));
  params.set("limit", "1");

  return params;
}

export async function getExpenses(
  options: GetExpensesOptions = {},
): Promise<ExpenseRecord[]> {
  const { searchTerm = "", limit = 200, signal } = options;

  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const normalizedSearch = searchTerm.trim();

  if (normalizedSearch) {
    params.set("query_type", "or");
    params.set("buy", normalizedSearch);
    params.set("category", normalizedSearch);
    params.set("date", normalizedSearch);
    params.set("expense", normalizedSearch);
  }

  const baseUrl = getSheet2BaseUrl();

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    signal,
  });
  const rows =
    await parseJsonResponse<Array<Record<string, unknown>>>(response);

  return rows.map((row) => normalizeRow(row));
}

export async function createExpense(
  payload: ExpensePayload,
): Promise<ExpenseRecord> {
  const baseUrl = getSheet2BaseUrl();

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buy: payload.buy,
      category: payload.category,
      date: payload.date,
      expense: parseExpenseToNumber(payload.expense),
    }),
  });

  const created = await parseJsonResponse<Record<string, unknown>>(response);
  return normalizeRow(created);
}

export async function updateExpense(
  original: ExpenseRecord,
  payload: ExpensePayload,
): Promise<void> {
  const params = buildIdentityParams(original);

  const baseUrl = getSheet2BaseUrl();

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buy: payload.buy,
      category: payload.category,
      date: payload.date,
      expense: parseExpenseToNumber(payload.expense),
    }),
  });

  const updatedRows =
    await parseJsonResponse<Array<Record<string, unknown>>>(response);

  if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
    throw new Error("No rows matched for update");
  }
}

export async function deleteExpense(expense: ExpenseRecord): Promise<void> {
  const params = buildIdentityParams(expense);

  const baseUrl = getSheet2BaseUrl();

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: "DELETE",
  });

  await parseJsonResponse(response);
}
