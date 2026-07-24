export function toDateInputValue(date: string): string {
  if (!date) {
    return "";
  }

  if (date.includes("/")) {
    const [day, month, year] = date.split("/");

    if (!day || !month || !year) {
      return "";
    }

    return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  if (date.includes("-")) {
    return date;
  }

  return "";
}

export function toDisplayDate(date: string): string {
  if (!date) {
    return "";
  }

  if (date.includes("-")) {
    const [year, month, day] = date.split("-");

    if (!year || !month || !day) {
      return "";
    }

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.padStart(4, "0")}`;
  }

  if (date.includes("/")) {
    return date;
  }

  return "";
}
