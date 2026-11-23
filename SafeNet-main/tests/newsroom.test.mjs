import test from 'node:test';
import assert from 'node:assert/strict';
import {news,allowed,canEnterNewsroom,evaluateDesk} from '../js/newsroom.js';
test('newsroom requires all nine distinct missions',()=>{
 assert.equal(canEnterNewsroom(Array(9).fill({scenario_id:1})),false);
 assert.equal(canEnterNewsroom(Array.from({length:8},(_,i)=>({scenario_id:i+1}))),false);
 assert.equal(canEnterNewsroom(Array.from({length:9},(_,i)=>({scenario_id:i+1}))),true);
});
test('fictional feed covers true, false and uncertain stories in both languages',()=>{
 assert.equal(news.length,6);
 for(const verdict of allowed)assert.equal(news.filter(n=>n.verdict===verdict).length,2);
 for(const n of news)for(const language of ['bg','en']){
  assert.ok(n.title[language]&&n.body[language]&&n.why[language]);
  for(const type of ['source','date','evidence'])assert.ok(n.checks[type][language]);
 }
});
test('editor scoring distinguishes uncertain news from false news',()=>{
 const decisions=Object.fromEntries(news.map(n=>[n.id,n.verdict]));
 assert.equal(evaluateDesk(decisions).filter(r=>r.correct).length,6);
 decisions.bus='reject';assert.equal(evaluateDesk(decisions).filter(r=>r.correct).length,5);
 assert.equal(evaluateDesk({}).filter(r=>r.correct).length,0);
});
