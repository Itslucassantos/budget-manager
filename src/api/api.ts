export const defaultSheet2BaseUrl = import.meta.env
  .VITE_DEFAULT_SHEET2_BASE_URL;

export function getSheet2BaseUrl(): string {
  if (typeof window === "undefined") {
    return defaultSheet2BaseUrl;
  }

  const storedUrl = window.localStorage.getItem("sheetsUrl");

  return storedUrl || defaultSheet2BaseUrl;
}
