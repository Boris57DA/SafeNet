export function summarize(attempts, total) {
  const points = attempts.reduce((sum, a) => sum + a.points_earned, 0);
  return {
    points,
    completed: Math.min(
      new Set(attempts.map((a) => a.scenario_id)).size,
      total,
    ),
    level: 1 + Math.floor(points / 200),
  };
}
export function nextMission(scenarios, attempts, current) {
  const done = new Set(attempts.map((a) => a.scenario_id));
  return scenarios.find((s) => s.id !== current && !done.has(s.id))?.id ?? null;
}
export function gradeDemo(choice) {
  return {
    scenario_id: choice.scenario_id,
    choice_id: choice.id,
    is_correct: choice.is_correct,
    points_earned: choice.is_correct ? 100 : 0,
    feedback: choice.feedback,
    attempted_at: new Date().toISOString(),
  };
}
export function unlocked(id, scenarios, attempts) {
  const chapter = Math.floor((id - 1) / 3);
  const done = new Set(attempts.map(a => a.scenario_id));
  return scenarios.filter(s => Math.floor((s.id - 1) / 3) < chapter).every(s => done.has(s.id));
}
