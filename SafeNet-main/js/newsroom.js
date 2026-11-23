import {news} from './news-sources.js';
export {news};
export const allowed=['publish','hold','reject'];
export function canEnterNewsroom(attempts){return [1,2,3,4,5,6,7,8,9].every(id=>attempts.some(a=>a.scenario_id===id));}
export function evaluateDesk(decisions){return news.map(n=>({id:n.id,correct:decisions[n.id]===n.verdict}));}
export function createNewsroom(host){
 let lang='bg', key='',state={decisions:{},checks:{},submitted:false}, active=news[0].id,notice='';
 const tr=(bg,en)=>lang==='bg'?bg:en,local=p=>p[lang];
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const countChecks=()=>Object.values(state.checks).reduce((sum,v)=>sum+v.length,0);
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify(state));notice='';}catch{notice=tr('Неуспешно запазване в браузъра.','Could not save in this browser.');}};
 const button=(text,fn,disabled=false)=>{const b=el('button',text,'button');b.type='button';b.disabled=disabled;b.onclick=fn;return b;};
 function assign(id,verdict){if(state.submitted||!news.some(n=>n.id===id)||!allowed.includes(verdict))return;state.decisions[id]=verdict;persist();render();}
 function render(){
  host.replaceChildren();const back=el('a',tr('Към кампанията','Back to campaign'),'back-link');back.href='#home';host.append(back);
  host.append(el('p',tr('НИВО 2 · РЕДАКТОР НА ИСТИНАТА','LEVEL 2 · THE TRUTH EDITOR'),'eyebrow'),el('h1',tr('Ти управляваш редакцията.','You run the newsroom.')));
  host.append(el('p',tr('Сравняваш учебни версии с истински архивни публикации на NASA и ESA. Учебните заглавия не са цитати от тези организации.','Compare training versions with real archived NASA and ESA releases. Training headlines are not quotations from those organisations.'),'simulation-label'));
  host.append(el('p',tr('Отвори новина и разследвай. Имаш 10 проверки за 6 публикации. Премести всяка към правилното бюро чрез влачене или бутон. Можеш да променяш решенията преди „Приключи смяната“.','Open a story and investigate. You have 10 checks for 6 stories. Move each to a desk by dragging or using a button. You can change decisions before ending your shift.')));
  host.append(el('p',`${tr('Проверки','Checks')}: ${countChecks()}/10 · ${tr('Разпределени','Assigned')}: ${Object.keys(state.decisions).length}/6`,'desk-stats'));
  const layout=el('div','','news-layout'),inbox=el('div','','news-inbox'),detail=el('article','','news-detail');
  news.forEach(n=>{const b=button(local(n.title),()=>{active=n.id;render();});b.className='news-card'+(active===n.id?' active':'');b.setAttribute('aria-pressed',String(active===n.id));b.draggable=!state.submitted;b.ondragstart=e=>e.dataTransfer.setData('text/plain',n.id);b.append(el('small',state.decisions[n.id]?label(state.decisions[n.id]):tr('Входяща публикация','Incoming story')));inbox.append(b);});
  const item=news.find(n=>n.id===active);detail.append(el('p',item.source,'eyebrow'),el('h2',local(item.title)),el('p',local(item.body)));
  const reference=el('aside','','real-source');
  reference.append(el('p',tr('ИСТИНСКА НОВИНА ЗА СРАВНЕНИЕ','REAL NEWS FOR COMPARISON'),'eyebrow'),el('h3',local(item.reference.title)),el('p',`${item.reference.publisher} · ${item.reference.date}`,'small'),el('p',local(item.reference.summary)));
  const original=el('a',tr('Отвори оригиналната публикация ↗','Open original publication ↗'),'source-link');original.href=item.reference.url;original.target='_blank';original.rel='noopener noreferrer';reference.append(original,el('p',tr('Кратко резюме на български/английски, не пълен цитат. Източникът е проверен на 23.11.2026. Архивните факти се оценяват към датата на публикацията.','A short BG/EN summary, not a full quotation. Source checked on 23 November 2026. Assess archive facts at the publication date.'),'small'));detail.append(reference);
  const tabs=el('div','','check-tools');
  for(const type of ['source','date','evidence']){const checked=(state.checks[item.id]||[]).includes(type);const names={source:tr('Източник','Source'),date:tr('Дата','Date'),evidence:tr('Доказателства','Evidence')};tabs.append(button(`${checked?'✓ ':''}${names[type]}`,()=>{state.checks[item.id]??=[];state.checks[item.id].push(type);persist();render();},checked||countChecks()>=10||state.submitted));}
  detail.append(tabs);
  for(const type of state.checks[item.id]||[])detail.append(el('p',local(item.checks[type]),'evidence-note'));
  if(countChecks()>=10&&!state.submitted)detail.append(el('p',tr('Бюджетът за проверки е изчерпан. Използвай събраните доказателства; несигурните новини могат да изчакат.','Your check budget is exhausted. Use your evidence; uncertain stories can wait.')));
  const actions=el('div','','desk-actions');allowed.forEach(v=>actions.append(button(label(v),()=>assign(item.id,v),state.submitted)));detail.append(actions);
  layout.append(inbox,detail);host.append(layout);
  const desks=el('div','','news-desks');allowed.forEach(v=>{const tray=el('section','','news-tray');tray.append(el('h3',label(v)));tray.ondragover=e=>e.preventDefault();tray.ondrop=e=>{e.preventDefault();assign(e.dataTransfer.getData('text/plain'),v);};news.filter(n=>state.decisions[n.id]===v).forEach(n=>tray.append(el('p',local(n.title))));desks.append(tray);});host.append(desks);
  if(!state.submitted)host.append(button(tr('Приключи смяната','End shift'),()=>{state.submitted=true;persist();render();},Object.keys(state.decisions).length!==news.length));
  else {const results=evaluateDesk(state.decisions),correct=results.filter(r=>r.correct).length;const report=el('section','','campaign');report.setAttribute('role','status');report.append(el('h2',tr(`Смяната приключи: ${correct}/6 правилни решения`,`Shift complete: ${correct}/6 correct decisions`)),el('p',tr('Точките от редакцията са отделни от кампанията: ','Newsroom points are separate from the campaign: ')+`${correct*100}/600`));news.forEach(n=>{report.append(el('h3',`${state.decisions[n.id]===n.verdict?'✓':'✕'} ${local(n.title)}`),el('p',`${tr('Подходящо бюро','Correct desk')}: ${label(n.verdict)}. ${local(n.why)}`));});report.append(button(tr('Нова тренировъчна смяна','New practice shift'),()=>{state={decisions:{},checks:{},submitted:false};persist();render();}));host.append(report);}
  host.append(el('p',notice||tr('Редакторският прогрес се пази само в този браузър за твоя профил.','Newsroom progress is stored only in this browser for your profile.'),'small'));
 }
 function label(v){return ({publish:tr('Одобри за учебната емисия','Approve for training feed'),hold:tr('Задръж за проверка','Hold for verification'),reject:tr('Отхвърли','Reject')})[v];}
 return {setPlayer(id){key='safenet.newsroom.v2.'+id;try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved.decisions==='object'&&saved.checks)state=saved;}catch{}},render(language){lang=language;render();}};
}

