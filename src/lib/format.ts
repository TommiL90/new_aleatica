export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions & { locale?: string } = {},
) {
  if (!date) return "";

  try {
    const { locale, ...dateOpts } = opts;
    return new Intl.DateTimeFormat(locale ?? "es-ES", {
      month: dateOpts.month ?? "2-digit",
      day: dateOpts.day ?? "2-digit",
      year: dateOpts.year ?? "numeric",
      ...dateOpts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}

export function formatNumber(value: number | undefined, decimals = 2): string {
  if (value === undefined || value === null) return "";
  return Number(value).toFixed(decimals);
}


export const valueFormat = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return parseFloat(value).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
