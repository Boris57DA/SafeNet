import { config } from "./config.js";
import { gradeDemo } from "./game.js";
export const isLive = Boolean(config.url && config.publicKey);
const demoKey = "safenet.demo.attempts.v1";
let client;
async function getClient() {
  if (client) return client;
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.url))
    throw Error("Invalid Supabase URL");
  if (config.publicKey.startsWith("sb_secret_"))
    throw Error("Secret keys must never be used in a browser");
  const { createClient } = await import(
    "https://esm.sh/@supabase/supabase-js@2.49.1"
  );
  client = createClient(config.url, config.publicKey);
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  if (!data.session) {
    const result = await client.auth.signInAnonymously();
    if (result.error) throw result.error;
  }
  return client;
}
export async function loadData() {
  // Частично попълнени настройки са грешка, а не повод за тихо демо.
  if (Boolean(config.url) !== Boolean(config.publicKey))
    throw Error("Both URL and public key are required");
  if (!isLive) {
    const { scenarios, choices } = await import("./demo-data.js");
    return {
      scenarios,
      choices,
      attempts: JSON.parse(localStorage.getItem(demoKey) || "[]"),
    };
  }
  const db = await getClient();
  const results = await Promise.all([
    db.from("scenarios").select("*").order("id"),
    db.from("choices").select("id,scenario_id,position,text").order("position"),
    db.from("attempts").select("*").order("attempted_at"),
  ]);
  for (const result of results) if (result.error) throw result.error;
  return {
    scenarios: results[0].data,
    choices: results[1].data,
    attempts: results[2].data,
  };
}
export async function submitAnswer(choice) {
  if (!isLive) {
    const attempts = JSON.parse(localStorage.getItem(demoKey) || "[]");
    const old = attempts.find((a) => a.scenario_id === choice.scenario_id);
    if (old) return old;
    const attempt = gradeDemo(choice);
    attempts.push(attempt);
    localStorage.setItem(demoKey, JSON.stringify(attempts));
    return attempt;
  }
  const db = await getClient();
  // Изпращаме само ID на избора. SQL функцията определя потребителя и точките.
  const { data, error } = await db.rpc("submit_answer", {
    p_choice_id: choice.id,
  });
  if (error) throw error;
  return data;
}
export async function getPlayerId(){
  if(!isLive)return 'demo';
  const db=await getClient();
  const {data,error}=await db.auth.getSession();
  if(error||!data.session)throw Error('Missing session');
  return data.session.user.id;
}
