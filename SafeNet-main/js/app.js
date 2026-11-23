import { translations } from "./translations.js";
import { loadData, submitAnswer, isLive, getPlayerId } from "./supabase-client.js";
import {createNewsroom,canEnterNewsroom} from './newsroom.js';
import { summarize, nextMission, unlocked } from "./game.js";
const $ = (id) => document.getElementById(id);
const newsroomHost=document.createElement('section');
newsroomHost.id='newsroom-view'; newsroomHost.hidden=true;
$('main').append(newsroomHost);
const newsroom=createNewsroom(newsroomHost);
// Езикът и данните са отделни: преводът не нулира опитите.
let lang = "bg",
  data = { scenarios: [], choices: [], attempts: [] },
  current = 1,
  busy = false,
  selected = null,
  errorKey = "",
  ready = false,
  saveError = false;
const t = (key) => translations[lang][key];
const local = (value) => (typeof value === "object" ? value[lang] : value);
function node(tag, text, className) {
  const e = document.createElement(tag);
  e.textContent = text; // Данните се показват като текст, не се изпълняват като HTML.
  if (className) e.className = className;
  return e;
}
function activeAttempt() {
  return data.attempts.find((a) => a.scenario_id === current);
}
function showError(key) {
  errorKey = key;
  $("error").hidden = !key;
  $("error").textContent = key ? t(key) : "";
}
function render() {
  document.documentElement.lang = lang;
  document
    .querySelectorAll("[data-i18n]")
    .forEach((e) => (e.textContent = t(e.dataset.i18n)));
  document
    .querySelectorAll("[data-lang]")
    .forEach((e) =>
      e.setAttribute("aria-pressed", String(e.dataset.lang === lang)),
    );
  $("connection-label").textContent = errorKey === "failed"
    ? t("failed")
    : ready ? t(isLive ? "live" : "demo") : t("loading");
  showError(errorKey);
  const stats = summarize(data.attempts, data.scenarios.length);
  $("points").textContent = stats.points;
  $("completed").textContent = `${stats.completed} / ${data.scenarios.length}`;
  $("level").textContent = canEnterNewsroom(data.attempts)?'02':'01';
  let campaign = $('campaign');
  if (!campaign) {
    campaign = node('section','','campaign'); campaign.id='campaign';
    $('mission-cards').before(campaign);
  }
  campaign.replaceChildren();
  const finished = data.scenarios.length > 0 && stats.completed === data.scenarios.length;
  campaign.append(node('p',lang==='bg'?'ОПЕРАЦИЯ: БЕЗОПАСЕН КЛУБ':'OPERATION: SAFE CLUB','eyebrow'));
  campaign.append(node('h2', finished ? (lang==='bg'?'Кампанията е завършена!':'Campaign complete!') : (lang==='bg'?'Три глави. Девет решения. Един по-сигурен клуб.':'Three chapters. Nine decisions. One safer club.')));
  const bar=document.createElement('progress'); bar.max=data.scenarios.length||9;bar.value=stats.completed;bar.setAttribute('aria-label',lang==='bg'?'Прогрес на кампанията':'Campaign progress'); campaign.append(bar);
  campaign.append(node('p',lang==='bg'?'Започни с основите, разкрий пробива и спаси училищния турнир. Завърши трите мисии в една глава, за да отключиш следващата. Грешките не те спират — прочети обяснението и продължи.':'Learn the basics, investigate the breach and save the school tournament. Complete all three missions in a chapter to unlock the next. Mistakes do not block you — read the explanation and continue.'));
  const chapterNames=lang==='bg'?['Дигитална самозащита','Пробив в клуба','Операция възстановяване']:['Digital self-defence','Club breach','Recovery operation'];
  const chapters=node('div','','chapter-list');
  chapterNames.forEach((name,i)=>{
    const count=data.scenarios.filter(s=>Math.floor((s.id-1)/3)===i && data.attempts.some(a=>a.scenario_id===s.id)).length;
    chapters.append(node('span',`${i+1}. ${name} · ${count}/3 ${count===3?'✓':''}`,'pill'));
  });campaign.append(chapters);
  const newsLink=node('a',lang==='bg'?'Ниво 2: Редактор на истината':'Level 2: The truth editor','button primary');
  if(canEnterNewsroom(data.attempts))newsLink.href='#newsroom';
  else {newsLink.setAttribute('aria-disabled','true');newsLink.textContent=lang==='bg'?'Ниво 2 се отключва след 9 мисии':'Complete 9 missions to unlock Level 2';}
  campaign.append(newsLink);
  if(finished){
    const correct=data.attempts.filter(a=>a.is_correct).length;
    const rank=correct>=8?(lang==='bg'?'Киберпазител':'Cyber guardian'):correct>=5?(lang==='bg'?'Дигитален детектив':'Digital detective'):(lang==='bg'?'Начинаещ защитник':'Safety explorer');
    campaign.append(node('h3',`★ ${rank} · ${stats.points} / ${data.scenarios.length*100} XP`));
    campaign.append(node('p',lang==='bg'?`Правилни решения: ${correct}/${data.scenarios.length}. Отвори завършените мисии по-долу, за да преговориш. Новите точки се дават само при първия отговор.`:`Correct decisions: ${correct}/${data.scenarios.length}. Reopen completed missions below to review. Only the first answer earns points.`));
    const mistakes=data.scenarios.filter(s=>data.attempts.some(a=>a.scenario_id===s.id&&!a.is_correct));
    if(mistakes.length)campaign.append(node('p',(lang==='bg'?'За преговор: ':'Review: ')+mistakes.map(s=>local(s.title)).join(' · ')));
  }
  $("mission-cards").replaceChildren();
  for (const scenario of data.scenarios) {
    const done = data.attempts.some((a) => a.scenario_id === scenario.id);
    const card = node("a", "", "mission-card");
    card.href = `#mission/${scenario.id}`;
    const locked=!unlocked(scenario.id,data.scenarios,data.attempts);
    if(locked){card.removeAttribute('href');card.classList.add('locked');card.setAttribute('aria-disabled','true');}
    const top = node("div", "", "card-top");
    top.append(
      node("span", scenario.icon, "mission-icon"),
      node(
        "span",
        done ? t("done") : `${scenario.minutes} ${t("minutes")}`,
        "small",
      ),
    );
    card.append(
      top,
      node("h3", local(scenario.title)),
      node("p", local(scenario.description)),
    );
    const action = node("div", "", "card-action");
    action.append(
      node("span", locked?(lang==='bg'?'Завърши предишната глава':'Finish the previous chapter'):t("open")),
      node("span", done ? "✓" : "+100 XP"),
    );
    card.append(action);
    $("mission-cards").append(card);
  }
  renderMission();
  if(!newsroomHost.hidden)newsroom.render(lang);
}
function renderMission() {
  const scenario = data.scenarios.find((s) => s.id === current);
  if (!scenario) return;
  const attempt = activeAttempt();
  $("mission-category").textContent = local(scenario.category);
  $("mission-title").textContent = local(scenario.title);
  $("mission-description").textContent = local(scenario.description);
  $("sender").textContent = scenario.sender;
  $("message").textContent = local(scenario.message);
  $("fake-link").textContent = scenario.fake_link;
  $("choices").replaceChildren();
  data.choices
    .filter((c) => c.scenario_id === current)
    .forEach((choice, index) => {
      const button = node("button", "", "choice");
      button.type = "button";
      button.classList.toggle(
        "selected",
        choice.id === (attempt?.choice_id ?? selected),
      );
      button.setAttribute(
        "aria-pressed",
        String(choice.id === (attempt?.choice_id ?? selected)),
      );
      button.disabled = busy || Boolean(attempt);
      button.append(
        node("span", String.fromCharCode(65 + index), "choice-letter"),
        node("span", local(choice.text)),
      );
      button.addEventListener("click", () => answer(choice));
      $("choices").append(button);
    });
  $("feedback").hidden = !attempt;
  if (attempt) {
    $("feedback").classList.toggle("wrong", !attempt.is_correct);
    $("feedback").replaceChildren(
      node(
        "strong",
        `${t(attempt.is_correct ? "correct" : "wrong")} +${attempt.points_earned} ${t("earned")}`,
      ),
      node("p", local(attempt.feedback)),
    );
  }
  $("next").hidden = !attempt;
  $("next").textContent = t(
    nextMission(data.scenarios, data.attempts, current) ? "next" : "finish",
  );
  $("save-status").textContent = busy
    ? t("saving")
    : saveError
      ? t("saveFailed")
      : attempt
        ? t(isLive ? "saved" : "savedLocal")
        : "";
}
async function answer(choice) {
  // Блокираме повторния клик, докато записът приключи.
  if (busy || activeAttempt()) return;
  busy = true;
  selected = choice.id;
  saveError = false;
  renderMission();
  try {
    const attempt = await submitAnswer(choice);
    data.attempts = data.attempts.filter(
      (a) => a.scenario_id !== attempt.scenario_id,
    );
    data.attempts.push(attempt);
  } catch {
    saveError = true;
  } finally {
    busy = false;
    render();
  }
}
function route(focus = true) {
  if (location.hash === "#main") return;
  if(location.hash==='#newsroom'){
    if(canEnterNewsroom(data.attempts)){
      $('home-view').hidden=true;$('mission-view').hidden=true;newsroomHost.hidden=false;
      render();
      document.querySelectorAll('nav a').forEach(a=>a.removeAttribute('aria-current'));
      const heading=newsroomHost.querySelector('h1');heading.tabIndex=-1;
      if(focus){heading.focus();window.scrollTo(0,0);}return;
    }
    location.hash='home';
  }
  newsroomHost.hidden=true;
  // Hash навигацията работи и на статичен GitHub Pages хостинг.
  const isMission = location.hash.startsWith("#mission");
  const id = Number(location.hash.split("/")[1]);
  current = data.scenarios.some((s) => s.id === id)
    ? id
    : (nextMission(data.scenarios, data.attempts, 0) ??
      data.scenarios[0]?.id ??
      1);
  if(!unlocked(current,data.scenarios,data.attempts)) current=nextMission(data.scenarios,data.attempts,0)??1;
  selected = null;
  saveError = false;
  $("home-view").hidden = isMission;
  $("mission-view").hidden = !isMission;
  document.querySelectorAll("nav a").forEach((e) => {
    if (e.hash === (isMission ? "#mission" : "#home"))
      e.setAttribute("aria-current", "page");
    else e.removeAttribute("aria-current");
  });
  render();
  if (focus) {
    $(isMission ? "mission-title" : "home-title").focus({
      preventScroll: true,
    });
    window.scrollTo(0, 0);
  }
}
document.querySelectorAll("[data-lang]").forEach((button) =>
  button.addEventListener("click", () => {
    lang = button.dataset.lang;
    render();
  }),
);
$("next").addEventListener("click", () => {
  const id = nextMission(data.scenarios, data.attempts, current);
  location.hash = id ? `mission/${id}` : "home";
});
window.addEventListener("hashchange", () => route());
render();
try {
  data = await loadData();
  newsroom.setPlayer(await getPlayerId());
  ready = true;
  if (!data.scenarios.length) showError("empty");
  route(false);
} catch {
  showError("failed");
  $("connection-label").textContent = t("failed");
}
