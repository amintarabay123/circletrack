export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", label: "USD — Dólar EE.UU." },
  { code: "MXN", symbol: "$", label: "MXN — Peso mexicano" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — Libra esterlina" },
  { code: "CAD", symbol: "$", label: "CAD — Dólar canadiense" },
  { code: "AUD", symbol: "$", label: "AUD — Dólar australiano" },
  { code: "BRL", symbol: "R$", label: "BRL — Real brasileño" },
  { code: "COP", symbol: "$", label: "COP — Peso colombiano" },
  { code: "PEN", symbol: "S/", label: "PEN — Sol peruano" },
  { code: "CLP", symbol: "$", label: "CLP — Peso chileno" },
  { code: "ARS", symbol: "$", label: "ARS — Peso argentino" },
  { code: "DOP", symbol: "$", label: "DOP — Peso dominicano" },
  { code: "HNL", symbol: "L", label: "HNL — Lempira hondureño" },
  { code: "GTQ", symbol: "Q", label: "GTQ — Quetzal guatemalteco" },
  { code: "BOB", symbol: "Bs", label: "BOB — Boliviano" },
  { code: "NIO", symbol: "C$", label: "NIO — Córdoba nicaragüense" },
  { code: "CRC", symbol: "₡", label: "CRC — Colón costarricense" },
];

const symbolMap: Record<string, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.symbol])
);

export function getCurrencySymbol(code: string): string {
  return symbolMap[code] ?? code;
}
