import { writeFileSync } from "node:fs";
const tables = [
  {
    name: "scenarios",
    x: 40,
    y: 130,
    fields: [
      "PK  id : integer",
      "category : jsonb (bg/en)",
      "title : jsonb (bg/en)",
      "description : jsonb (bg/en)",
      "sender : text",
      "message : jsonb (bg/en)",
      "fake_link : text",
      "difficulty_level : smallint",
      "minutes : smallint",
      "icon : text",
      "created_at : timestamptz",
    ],
  },
  {
    name: "choices",
    x: 440,
    y: 130,
    fields: [
      "PK  id : integer",
      "FK  scenario_id : integer",
      "position : smallint",
      "text : jsonb (bg/en)",
      "is_correct : boolean",
      "feedback : jsonb (bg/en)",
    ],
  },
  {
    name: "attempts",
    x: 840,
    y: 130,
    fields: [
      "PK  id : uuid",
      "FK  user_id : uuid",
      "FK  scenario_id : integer",
      "FK  choice_id : integer",
      "is_correct : boolean",
      "points_earned : integer",
      "feedback : jsonb (bg/en)",
      "attempted_at : timestamptz",
    ],
  },
  {
    name: "auth.users (Supabase)",
    x: 840,
    y: 530,
    fields: ["PK  id : uuid", "System-managed identity"],
  },
];
let svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="#f4f7f6"/><g font-family="Arial, sans-serif" fill="#142d32"><text x="40" y="55" font-size="30" font-weight="bold">SafeNet Academy · Stage 2 database</text><text x="40" y="88" font-size="17">Three application tables · BG/EN content · Auth-owned attempts</text>';
for (const t of tables) {
  const h = 66 + t.fields.length * 25;
  svg += `<rect x="${t.x}" y="${t.y}" width="320" height="${h}" rx="12" fill="white" stroke="#b8ccc3"/><path d="M${t.x + 12} ${t.y}h296q12 0 12 12v36h-320v-36q0-12 12-12" fill="#142d32"/><text x="${t.x + 18}" y="${t.y + 31}" fill="white" font-size="20" font-weight="bold">${t.name}</text>`;
  t.fields.forEach(
    (f, i) =>
      (svg += `<text x="${t.x + 18}" y="${t.y + 75 + i * 25}" font-size="15">${f}</text>`),
  );
}
svg +=
  '<g stroke="#227154" stroke-width="2" fill="none"><path d="M360 210H440"/><path d="M760 260H840"/><path d="M200 471V505H805V335H840"/><path d="M1000 530V396"/></g><g font-size="16" fill="#227154"><text x="370" y="200">1 : N</text><text x="770" y="250">1 : N</text><text x="470" y="495">scenario 1 : N attempts</text><text x="1010" y="490">1 : N</text></g><g font-size="17"><text x="40" y="575" font-weight="bold">Integrity and access</text><text x="40" y="610">UNIQUE attempts(user_id, scenario_id)</text><text x="40" y="640">Composite FK: attempts(choice_id, scenario_id)</text><text x="40" y="666">references choices(id, scenario_id)</text><text x="40" y="705">RLS: read own attempts; writes only via submit_answer RPC.</text><text x="40" y="735">Correctness and points are computed in PostgreSQL.</text><text x="40" y="795" fill="#586e72">Design artifact — verify the deployed structure with supabase/verify.sql.</text></g></g></svg>';
writeFileSync(new URL("../docs/ER_DIAGRAM.svg", import.meta.url), svg);
