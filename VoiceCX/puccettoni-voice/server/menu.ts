// Puccettoni menu — source of truth for Phase 0 (mocked pricing/availability).
// In Phase 2 this is replaced by a sync from the Toast Menus API (real GUIDs + live prices).

export interface MenuItem {
  name: string;
  price: number;
  category: string;
  size?: string;
  aliases?: string[];
}

export const MENU: MenuItem[] = [
  // Combos
  { name: "Pizza 12\" Combo", price: 19.9, category: "Combos", aliases: ["pizza combo", "12 inch combo", "pizza twelve combo"] },
  { name: "Focaccia Sandwich Combo", price: 18.9, category: "Combos", aliases: ["focaccia combo"] },
  { name: "Panzerotto Combo", price: 18.9, category: "Combos" },
  { name: "Gnocchi Combo", price: 21.99, category: "Combos" },

  // Pizza (12")
  { name: "Margherita Classic", price: 9.9, category: "Pizza", size: "12\"", aliases: ["margherita", "margarita"] },
  { name: "Pepperoni", price: 11.9, category: "Pizza", size: "12\"", aliases: ["pepperoni pizza"] },
  { name: "Marinara", price: 11.9, category: "Pizza", size: "12\"" },
  { name: "Capricciosa", price: 12.9, category: "Pizza", size: "12\"" },
  { name: "Vegan", price: 12.9, category: "Pizza", size: "12\"", aliases: ["vegan pizza"] },
  { name: "Diavola", price: 12.9, category: "Pizza", size: "12\"", aliases: ["diavola", "spicy"] },
  { name: "Truffle Premium", price: 13.9, category: "Pizza", size: "12\"", aliases: ["truffle pizza", "truffle"] },
  { name: "Amalfi", price: 13.9, category: "Pizza", size: "12\"" },
  { name: "Mushrooms & Pepperoni", price: 13.9, category: "Pizza", size: "12\"", aliases: ["mushroom pepperoni"] },
  { name: "Create Your Pizza", price: 14.9, category: "Pizza", size: "12\"", aliases: ["create your own", "custom pizza", "build your own"] },
  { name: "Sicilian Rustic — Full Tray", price: 24.0, category: "Pizza", aliases: ["sicilian", "full tray", "rustic"] },

  // Focaccia sandwiches
  { name: "Calabria", price: 9.9, category: "Focaccia" },
  { name: "Bologna", price: 9.9, category: "Focaccia" },
  { name: "Napoli", price: 11.9, category: "Focaccia" },
  { name: "Capri", price: 12.9, category: "Focaccia" },
  { name: "Positano", price: 12.9, category: "Focaccia" },
  { name: "Venezia", price: 12.9, category: "Focaccia" },
  { name: "Roma", price: 12.9, category: "Focaccia" },

  // Gnocchi
  { name: "Arrabbiata (Vegan)", price: 13.9, category: "Gnocchi", aliases: ["arrabbiata"] },
  { name: "Cacio e Pepe", price: 13.9, category: "Gnocchi", aliases: ["cacio e pepe gnocchi"] },
  { name: "Pesto Meatballs", price: 13.9, category: "Gnocchi" },
  { name: "Sorrentina", price: 13.9, category: "Gnocchi" },

  // Panzerotti
  { name: "Classico Panzerotto", price: 9.9, category: "Panzerotti", aliases: ["classico", "classic panzerotto"] },
  { name: "Pepperoni Panzerotto", price: 9.9, category: "Panzerotti" },
  { name: "Truffle Panzerotto", price: 10.9, category: "Panzerotti" },
  { name: "Pesto Panzerotto", price: 10.9, category: "Panzerotti" },
  { name: "Nutella Panzerotto", price: 10.9, category: "Panzerotti" },

  // Desserts
  { name: "Cannolo Siciliano", price: 3.0, category: "Desserts", aliases: ["cannolo", "cannoli"] },
  { name: "Italian Chocolate Puff Pastry", price: 3.0, category: "Desserts" },
  { name: "Mini Nutella Panzerotto", price: 5.0, category: "Desserts" },
  { name: "Code d'Aragosta (3 pcs)", price: 7.0, category: "Desserts", aliases: ["lobster tail", "aragosta"] },
  { name: "Neapolitan Babà", price: 8.0, category: "Desserts", aliases: ["baba"] },
  { name: "Pastiera Napoletana", price: 8.5, category: "Desserts", aliases: ["pastiera"] },
  { name: "Tiramisu Cake Slice", price: 7.5, category: "Desserts", aliases: ["tiramisu"] },
  { name: "Ricotta Pistachio Cake", price: 7.5, category: "Desserts" },
  { name: "Mascarpone Limoncello Cake", price: 7.5, category: "Desserts", aliases: ["limoncello cake"] },
  { name: "Delizia al Limone di Sorrento", price: 9.0, category: "Desserts", aliases: ["delizia al limone", "lemon delight"] },
  { name: "Cake Ricotta & Pear", price: 9.0, category: "Desserts", aliases: ["ricotta pear"] },

  // Italian deli (1/2 LB unless noted)
  { name: "Porchetta — ½ LB", price: 18.0, category: "Deli", aliases: ["porchetta"] },
  { name: "Parma Ham — ½ LB", price: 13.0, category: "Deli", aliases: ["parma ham", "prosciutto"] },
  { name: "Mortadella — ½ LB", price: 10.0, category: "Deli", aliases: ["mortadella"] },
  { name: "Napoli Salami — ½ LB", price: 16.5, category: "Deli", aliases: ["napoli salami", "salami"] },
  { name: "Speck — ½ LB", price: 15.0, category: "Deli", aliases: ["speck"] },
  { name: "Spianata Calabra — ½ LB", price: 16.5, category: "Deli", aliases: ["spianata"] },
  { name: "Provolone — ½ LB", price: 15.0, category: "Deli", aliases: ["provolone"] },
  { name: "Black Truffle Sauce — 17.6 oz", price: 24.0, category: "Deli", aliases: ["truffle sauce"] },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/["'’.]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Pragmatic fuzzy match for Phase 0. The agent generally passes near-canonical names;
// in Phase 2 we match against Toast item GUIDs instead.
export function findItem(query: string): MenuItem | null {
  const q = normalize(query);
  if (!q) return null;

  // exact name
  for (const item of MENU) {
    if (normalize(item.name) === q) return item;
  }
  // alias exact
  for (const item of MENU) {
    if (item.aliases?.some((a) => normalize(a) === q)) return item;
  }
  // substring (name or alias contains the query, or vice versa)
  for (const item of MENU) {
    const n = normalize(item.name);
    if (n.includes(q) || q.includes(n)) return item;
    if (item.aliases?.some((a) => normalize(a).includes(q) || q.includes(normalize(a)))) return item;
  }
  // token overlap fallback
  const qTokens = new Set(q.split(" "));
  let best: { item: MenuItem; score: number } | null = null;
  for (const item of MENU) {
    const nTokens = normalize(item.name).split(" ");
    const score = nTokens.filter((t) => qTokens.has(t)).length;
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item ?? null;
}
