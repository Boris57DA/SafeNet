// Rebuild the SQL fixture after changing teaching content.
import { writeFileSync } from "node:fs";
import { scenarios, choices } from "../js/demo-data.js";
const sql = (value) =>
  typeof value === "number"
    ? String(value)
    : typeof value === "boolean"
      ? String(value)
      : "'" +
        (typeof value === "object" ? JSON.stringify(value) : value).replaceAll(
          "'",
          "''",
        ) +
        "'";
let output =
  "-- Fictional content only. Run after schema.sql. Safe to re-run.\nbegin;\n";
for (const [table, rows] of [
  ["scenarios", scenarios],
  ["choices", choices],
]) {
  const keys = Object.keys(rows[0]);
  output += `insert into public.${table} (${keys.join(",")}) values\n${rows.map((row) => "(" + keys.map((key) => sql(row[key])).join(",") + ")").join(",\n")}\non conflict (id) do update set ${keys
    .filter((key) => key !== "id")
    .map((key) => `${key}=excluded.${key}`)
    .join(",")};\n`;
}
output += "commit;\n";
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), output);
