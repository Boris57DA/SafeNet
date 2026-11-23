// Explicit integration test: creates two anonymous test accounts and one attempt.
// Tokens stay in memory; only non-sensitive pass/fail results are written.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {config} from '../js/config.js';
const checks=[];
async function request(path,token,body){
  const response=await fetch(config.url+path,{method:body?'POST':'GET',headers:{apikey:config.publicKey,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();
  return {status:response.status,ok:response.ok,data};
}
const a=await request('/auth/v1/signup',null,{});
assert.equal(a.ok,true,`Auth failed (${a.status})`);
const b=await request('/auth/v1/signup',null,{});
assert.equal(b.ok,true,`Second auth failed (${b.status})`);
checks.push('Two separate anonymous sessions created');
const token=a.data.access_token,other=b.data.access_token;
const scenarios=await request('/rest/v1/scenarios?select=id',token);
assert.equal(scenarios.ok,true);assert.equal(scenarios.data.length,3);
const choices=await request('/rest/v1/choices?select=id,scenario_id,position,text',token);
assert.equal(choices.ok,true);assert.equal(choices.data.length,9);
checks.push('Read 3 scenarios and 9 public choice labels');
const hidden=await request('/rest/v1/choices?select=*',token);
assert.ok([401,403].includes(hidden.status));
checks.push('Reading correctness/feedback directly is denied');
const first=await request('/rest/v1/rpc/submit_answer',token,{p_choice_id:31});
assert.equal(first.ok,true);assert.equal(first.data.points_earned,100);
const repeat=await request('/rest/v1/rpc/submit_answer',token,{p_choice_id:32});
assert.equal(repeat.ok,true);assert.equal(repeat.data.id,first.data.id);assert.equal(repeat.data.choice_id,31);
checks.push('RPC records correct points; repeated submission returns original attempt');
const mine=await request('/rest/v1/attempts?select=id',token);
assert.equal(mine.ok,true);assert.equal(mine.data.length,1);
const theirs=await request('/rest/v1/attempts?select=id',other);
assert.equal(theirs.ok,true);assert.equal(theirs.data.length,0);
const targeted=await request(`/rest/v1/attempts?select=id&user_id=eq.${a.data.user.id}`,other);
assert.equal(targeted.ok,true);assert.equal(targeted.data.length,0);
checks.push('RLS hides another user’s attempt, including explicit user_id filtering');
const direct=await request('/rest/v1/attempts',token,{user_id:a.data.user.id,scenario_id:1,choice_id:12,is_correct:true,points_earned:100,feedback:{bg:'test',en:'test'}});
assert.ok([401,403].includes(direct.status));
checks.push('Direct INSERT into attempts is denied');
const invalid=await request('/rest/v1/rpc/submit_answer',token,{p_choice_id:-1});
assert.equal(invalid.ok,false);checks.push('Invalid choice is rejected');
const report={date:new Date().toISOString(),project:'xcheihbhpljumvmqcwjf',checks,status:'passed',testAccountsCreated:2,testAttemptsCreated:1};
writeFileSync(new URL('../docs/evidence/live-security-checks.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
