export const defaultSheet2BaseUrl =
  "https://sheet2api.com/v1/tJMgSP9sQSSC/budget/P%C3%A1gina1";

export function getSheet2BaseUrl(): string {
  if (typeof window === "undefined") {
    return defaultSheet2BaseUrl;
  }

  const storedUrl = window.localStorage.getItem("sheetsUrl");

  return storedUrl || defaultSheet2BaseUrl;
}
