function buildDate(year: string, month: string, day: string): Date | null {
  if (!day || !month || !year) {
    return null;
  }

  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function parseFlexibleDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    return buildDate(year ?? "", month ?? "", day ?? "");
  }

  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    return buildDate(year ?? "", month ?? "", day ?? "");
  }

  return null;
}

export function parseDateInputValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-");
  return buildDate(year ?? "", month ?? "", day ?? "");
}

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
