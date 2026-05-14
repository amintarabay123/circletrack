export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  // ── Latin America ──────────────────────────────────────
  { code: "USD", symbol: "$",    label: "USD — Dólar EE.UU." },
  { code: "MXN", symbol: "$",    label: "MXN — Peso mexicano" },
  { code: "COP", symbol: "$",    label: "COP — Peso colombiano" },
  { code: "PEN", symbol: "S/",   label: "PEN — Sol peruano" },
  { code: "CLP", symbol: "$",    label: "CLP — Peso chileno" },
  { code: "ARS", symbol: "$",    label: "ARS — Peso argentino" },
  { code: "DOP", symbol: "$",    label: "DOP — Peso dominicano" },
  { code: "HNL", symbol: "L",    label: "HNL — Lempira hondureño" },
  { code: "GTQ", symbol: "Q",    label: "GTQ — Quetzal guatemalteco" },
  { code: "BOB", symbol: "Bs",   label: "BOB — Boliviano" },
  { code: "NIO", symbol: "C$",   label: "NIO — Córdoba nicaragüense" },
  { code: "CRC", symbol: "₡",    label: "CRC — Colón costarricense" },
  { code: "BRL", symbol: "R$",   label: "BRL — Real brasileño" },
  { code: "PYG", symbol: "₲",    label: "PYG — Guaraní paraguayo" },
  { code: "UYU", symbol: "$U",   label: "UYU — Peso uruguayo" },
  { code: "VES", symbol: "Bs.S", label: "VES — Bolívar venezolano" },
  { code: "PAB", symbol: "B/.",  label: "PAB — Balboa panameño" },
  { code: "CUP", symbol: "$",    label: "CUP — Peso cubano" },

  // ── Caribbean ──────────────────────────────────────────
  { code: "XCD", symbol: "EC$",  label: "XCD — Dólar del Caribe Oriental (EC$)" },
  { code: "TTD", symbol: "TT$",  label: "TTD — Dólar de Trinidad y Tobago" },
  { code: "JMD", symbol: "J$",   label: "JMD — Dólar jamaicano" },
  { code: "BBD", symbol: "Bds$", label: "BBD — Dólar de Barbados" },
  { code: "HTG", symbol: "G",    label: "HTG — Gourde haitiano" },
  { code: "BSD", symbol: "B$",   label: "BSD — Dólar bahameño" },
  { code: "KYD", symbol: "CI$",  label: "KYD — Dólar de las Islas Caimán" },

  // ── Europe ─────────────────────────────────────────────
  { code: "EUR", symbol: "€",    label: "EUR — Euro" },
  { code: "GBP", symbol: "£",    label: "GBP — Libra esterlina" },
  { code: "CHF", symbol: "Fr",   label: "CHF — Franco suizo" },

  // ── North America ──────────────────────────────────────
  { code: "CAD", symbol: "$",    label: "CAD — Dólar canadiense" },

  // ── Oceania ────────────────────────────────────────────
  { code: "AUD", symbol: "$",    label: "AUD — Dólar australiano" },
  { code: "NZD", symbol: "$",    label: "NZD — Dólar neozelandés" },
  { code: "FJD", symbol: "$",    label: "FJD — Dólar fiyiano" },
  { code: "WST", symbol: "T",    label: "WST — Tālā samoano" },
  { code: "TOP", symbol: "T$",   label: "TOP — Paʻanga tongano" },

  // ── Philippines ────────────────────────────────────────
  { code: "PHP", symbol: "₱",    label: "PHP — Peso filipino (paluwagan)" },

  // ── South & Southeast Asia ─────────────────────────────
  { code: "INR", symbol: "₹",    label: "INR — Rupia india (chit fund)" },
  { code: "PKR", symbol: "₨",    label: "PKR — Rupia pakistaní (committee)" },
  { code: "BDT", symbol: "৳",    label: "BDT — Taka bangladesí" },
  { code: "LKR", symbol: "Rs",   label: "LKR — Rupia ceilanesa" },
  { code: "NPR", symbol: "Rs",   label: "NPR — Rupia nepalesa (dhukuti)" },
  { code: "IDR", symbol: "Rp",   label: "IDR — Rupia indonesia (arisan)" },
  { code: "MYR", symbol: "RM",   label: "MYR — Ringgit malayo" },
  { code: "SGD", symbol: "S$",   label: "SGD — Dólar singapurense" },
  { code: "THB", symbol: "฿",    label: "THB — Baht tailandés" },
  { code: "VND", symbol: "₫",    label: "VND — Dong vietnamita" },
  { code: "KHR", symbol: "៛",    label: "KHR — Riel camboyano" },

  // ── Africa (West) ──────────────────────────────────────
  { code: "NGN", symbol: "₦",    label: "NGN — Naira nigeriana (ajo/esusu)" },
  { code: "GHS", symbol: "GH₵",  label: "GHS — Cedi ghanés (susu)" },
  { code: "XOF", symbol: "CFA",  label: "XOF — Franco CFA Oeste africano (tontine)" },
  { code: "GNF", symbol: "FG",   label: "GNF — Franco guineano" },
  { code: "SLL", symbol: "Le",   label: "SLL — Leone de Sierra Leona" },
  { code: "GMD", symbol: "D",    label: "GMD — Dalasi gambiano" },
  { code: "SEN", symbol: "CFA",  label: "SEN — Franco CFA senegalés" },
  { code: "CVE", symbol: "Esc",  label: "CVE — Escudo caboverdiano" },

  // ── Africa (East) ──────────────────────────────────────
  { code: "KES", symbol: "KSh",  label: "KES — Chelín keniano (chama)" },
  { code: "TZS", symbol: "TSh",  label: "TZS — Chelín tanzano" },
  { code: "UGX", symbol: "USh",  label: "UGX — Chelín ugandés" },
  { code: "ETB", symbol: "Br",   label: "ETB — Birr etíope (equb/iqub)" },
  { code: "RWF", symbol: "RF",   label: "RWF — Franco ruandés (tontine)" },
  { code: "BIF", symbol: "Fr",   label: "BIF — Franco burundés" },
  { code: "SOS", symbol: "Sh",   label: "SOS — Chelín somalí" },
  { code: "ERN", symbol: "Nfk",  label: "ERN — Nakfa eritreo" },

  // ── Africa (Southern) ──────────────────────────────────
  { code: "ZAR", symbol: "R",    label: "ZAR — Rand sudafricano (stokvel)" },
  { code: "ZMW", symbol: "ZK",   label: "ZMW — Kwacha zambiano" },
  { code: "MWK", symbol: "MK",   label: "MWK — Kwacha malauí" },
  { code: "MOZ", symbol: "MT",   label: "MZN — Metical mozambiqueño" },
  { code: "ZWL", symbol: "Z$",   label: "ZWL — Dólar zimbabuense" },
  { code: "BWP", symbol: "P",    label: "BWP — Pula botsuanesa" },
  { code: "NAD", symbol: "$",    label: "NAD — Dólar namibio" },
  { code: "LSL", symbol: "L",    label: "LSL — Loti lesotense" },
  { code: "SZL", symbol: "L",    label: "SZL — Lilangeni suazi" },
  { code: "MGA", symbol: "Ar",   label: "MGA — Ariary malgache" },

  // ── Africa (Central) ───────────────────────────────────
  { code: "XAF", symbol: "FCFA", label: "XAF — Franco CFA Central africano" },
  { code: "CDF", symbol: "FC",   label: "CDF — Franco congoleño" },
  { code: "AOA", symbol: "Kz",   label: "AOA — Kwanza angoleño" },

  // ── Africa (North) ─────────────────────────────────────
  { code: "EGP", symbol: "E£",   label: "EGP — Libra egipcia (gameya/gam'iya)" },
  { code: "MAD", symbol: "د.م.", label: "MAD — Dírham marroquí (daret)" },
  { code: "DZD", symbol: "DA",   label: "DZD — Dinar argelino" },
  { code: "TND", symbol: "DT",   label: "TND — Dinar tunecino" },
  { code: "LYD", symbol: "LD",   label: "LYD — Dinar libio" },

  // ── Middle East ────────────────────────────────────────
  { code: "SAR", symbol: "﷼",    label: "SAR — Riyal saudí (jamiya)" },
  { code: "AED", symbol: "د.إ",  label: "AED — Dírham emiratí" },
  { code: "ILS", symbol: "₪",    label: "ILS — Séquel israelí" },
  { code: "JOD", symbol: "JD",   label: "JOD — Dinar jordano" },
  { code: "QAR", symbol: "﷼",    label: "QAR — Riyal catarí" },
  { code: "KWD", symbol: "KD",   label: "KWD — Dinar kuwaití" },
  { code: "BHD", symbol: "BD",   label: "BHD — Dinar bareiní" },

  // ── East Asia ──────────────────────────────────────────
  { code: "CNY", symbol: "¥",    label: "CNY — Yuan chino (renminbi)" },
  { code: "JPY", symbol: "¥",    label: "JPY — Yen japonés" },
  { code: "KRW", symbol: "₩",    label: "KRW — Won surcoreano" },
  { code: "HKD", symbol: "HK$",  label: "HKD — Dólar de Hong Kong" },
  { code: "TWD", symbol: "NT$",  label: "TWD — Nuevo dólar taiwanés" },
  { code: "MOP", symbol: "P",    label: "MOP — Pataca macaense" },
];

const symbolMap: Record<string, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.symbol])
);

export function getCurrencySymbol(code: string): string {
  return symbolMap[code] ?? code;
}
