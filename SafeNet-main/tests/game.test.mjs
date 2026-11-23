import test from "node:test";
import assert from "node:assert/strict";
import { summarize, nextMission, gradeDemo, unlocked } from "../js/game.js";
import { scenarios, choices } from "../js/demo-data.js";
import { translations } from "../js/translations.js";
test('chapters unlock only after all previous missions, including wrong answers',()=>{
  assert.equal(scenarios.length,9); assert.equal(choices.length,27);
  assert.equal(unlocked(4,scenarios,[]),false);
  const chapterOne=[1,2,3].map(scenario_id=>({scenario_id,is_correct:false}));
  assert.equal(unlocked(4,scenarios,chapterOne),true);
  assert.equal(unlocked(7,scenarios,chapterOne),false);
  assert.equal(unlocked(9,scenarios,[1,2,3,4,5,6].map(scenario_id=>({scenario_id}))),true);
});
test("all missions have three choices and exactly one correct answer", () => {
  for (const s of scenarios) {
    const rows = choices.filter((c) => c.scenario_id === s.id);
    assert.equal(rows.length, 3);
    assert.equal(rows.filter((c) => c.is_correct).length, 1);
  }
});
test("correct and incorrect answers earn expected points", () => {
  assert.equal(gradeDemo(choices[0]).points_earned, 0);
  assert.equal(gradeDemo(choices[1]).points_earned, 100);
});
test("progress and next mission skip already completed scenarios", () => {
  const attempts = [gradeDemo(choices[1])];
  assert.deepEqual(summarize(attempts, 3), {
    points: 100,
    completed: 1,
    level: 1,
  });
  assert.equal(nextMission(scenarios, attempts, 1), 2);
  assert.equal(
    nextMission(
      scenarios,
      scenarios.map((s) => ({ scenario_id: s.id })),
      1,
    ),
    null,
  );
});
test("both languages contain the same UI keys and all scenario translations", () => {
  assert.deepEqual(
    Object.keys(translations.bg).sort(),
    Object.keys(translations.en).sort(),
  );
  for (const s of scenarios)
    for (const key of ["title", "description", "category", "message"])
      for (const lang of ["bg", "en"]) assert.ok(s[key][lang]);
  for (const c of choices)
    for (const lang of ["bg", "en"]) {
      assert.ok(c.text[lang]);
      assert.ok(c.feedback[lang]);
    }
});
test("demo saves once and survives reload without awarding duplicate points", async () => {
  // Unit tests always use demo mode and never contact the live database.
  const { config } = await import("../js/config.js");
  config.url = "";
  config.publicKey = "";
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
  };
  const { loadData, submitAnswer } = await import("../js/supabase-client.js");
  const first = await submitAnswer(choices[1]);
  const again = await submitAnswer(choices[0]);
  assert.equal(first.choice_id, again.choice_id);
  const state = await loadData();
  assert.equal(state.attempts.length, 1);
  assert.equal(summarize(state.attempts, 3).points, 100);
});
