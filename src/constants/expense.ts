export const ALL_CATEGORIES_LABEL = "Categories";
export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Education",
  "Shopping",
  "Bills",
  "Other",
] as const;

export const EXPENSE_FILTER_CATEGORIES = [
  ALL_CATEGORIES_LABEL,
  ...EXPENSE_CATEGORIES,
] as const;
