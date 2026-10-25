// PlotMitra — trained Chandigarh property AI (prices per sq.ft)
const BOT_LOGO = `<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="8" width="22" height="15" rx="5" fill="#4f46e5"/><rect x="9" y="12" width="5" height="5" rx="2.5" fill="#fff"/><rect x="18" y="12" width="5" height="5" rx="2.5" fill="#fff"/><circle cx="11.5" cy="14.5" r="1.4" fill="#4f46e5"/><circle cx="20.5" cy="14.5" r="1.4" fill="#4f46e5"/><rect x="13" y="18.5" width="6" height="1.8" rx="0.9" fill="#fff"/><rect x="14" y="4" width="4" height="4" rx="2" fill="#10b981"/><line x1="16" y1="8" x2="16" y2="9" stroke="#10b981" stroke-width="1.4"/><rect x="2" y="14" width="3" height="4" rx="1.5" fill="#0ea5e9"/><rect x="27" y="14" width="3" height="4" rx="1.5" fill="#0ea5e9"/><path d="M9 25l-2 4M23 25l2 4" stroke="#10b981" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const inr = n => "Rs " + Math.round(n).toLocaleString("en-IN");
function parseAmt(s){let m=s.match(/(\d+(?:\.\d+)?)\s*(crore|cr|lakh|l|k|thousand)/i);if(!m){let n=s.match(/(\d{5,})/);return n?+n[1]:0;}let v=parseFloat(m[1]),u=m[2].toLowerCase();if(u[0]==="c")return v*1e7;if(u[0]==="l")return v*1e5;return v*1e3;}
function spaAsk(raw){
  const s=raw.toLowerCase(), H=(...w)=>w.some(x=>s.includes(x));
  const S=(typeof SECTORS!=="undefined")?SECTORS:{};
  const secName=Object.keys(S).find(k=>s.includes(k.toLowerCase()));
  if(/^(hi|hii+|hello|hey|namaste|sat sri|ram ram|yo|good (morning|evening|afternoon))\b/.test(s)||H("namaste","sat sri akal"))
    return "Namaste! I'm <b>PlotMitra</b>, your Chandigarh land guide. Rates now per sq.ft. Try: <i>'price of Sec 34'</i>, <i>'best sector under 1Cr'</i>, <i>'EMI on 50L'</i>, <i>'legal checklist'</i>.";
  if(H("thank","shukriya","dhanyavad","great","nice","awesome")) return "Anytime! Next: post your need on the <b>Dealers</b> page, or list a property on <b>Marketplace</b>.";
  if(H("who are you","your name","about yourself")) return "I'm <b>PlotMitra</b> — trained on Chandigarh/Mohali/Zirakpur rates (per sq.ft), growth, EMI/ROI math, RERA law and this site's dealer listings.";
  if(H("bye","see you","good night")) return "Bye! I'm on the 🏠 button 24x7. Good luck with your land hunt!";
  if(secName&&H("price","rate","cost","worth","value","sq","gaj","yard","bhav")){const d=S[secName];return `<b>${secName}</b> (${d.zone}): <b>${inr(d.base/9)}/sq.ft</b> in 2026, CAGR ${(d.growth*100).toFixed(1)}%. 5-yr view: <b>${inr(d.base/9*Math.pow(1+d.growth,5))}/sq.ft</b>. ${d.growth>0.09?"High-growth pick.":"Premium stable pick."} Forecast it on the <b>Predict</b> page.`;}
  if(secName&&(H("good","worth","invest","buy","future","growth","review","opinion"))){const d=S[secName];return `<b>${secName}</b>: ${inr(d.base/9)}/sq.ft, ${(d.growth*100).toFixed(1)}%/yr. Verdict: ${d.growth>0.095?"Excellent for 5+ yr growth. Entry still cheap.":d.growth>0.08?"Balanced safety + growth.":"Premium/safe, moderate upside; best for own use or long hold."} Yield ~2.5-3.5%.`;}
  if(H("compare","vs ","versus","difference","which is better")){const rows=Object.entries(S).sort((a,b)=>b[1].growth-a[1].growth).map(([k,d])=>`${k}: ${inr(d.base/9)} (${(d.growth*100).toFixed(1)}%)`).join("<br>");return "Prices per sq.ft, sorted by fastest growth:<br>"+rows+"<br><br><b>Growth</b> → Zirakpur/Mohali Rd. <b>Balance</b> → Sec 34/44/35. <b>Safety</b> → Sec 8/9/17. Give me budget + years for one exact pick.";}
  if(H("under ","budget","lakh","crore","afford","lac")||/\b\d+\s*(l|cr)/.test(s)){
    const amt=parseAmt(s);
    if(amt&&amt<1e7) return `Budget ~<b>${inr(amt)}</b>: <b>Zirakpur</b> (~Rs 6,444/sq.ft = ~${Math.floor(amt/6444)} sq.ft) or <b>Mohali Rd</b> (~Rs 8,000/sq.ft = ~${Math.floor(amt/8000)} sq.ft). Both 10%+ CAGR.`;
    if(amt&&amt<2.5e7) return `Budget ~<b>${inr(amt)}</b>: best balance — <b>Sec 44</b> (~Rs 13,111/sq.ft), <b>Sec 34</b> (~Rs 14,667/sq.ft) or <b>Sec 35</b>. Good resale + rental.`;
    if(amt&&amt>=2.5e7) return `Budget ~<b>${inr(amt)}</b>: premium open — <b>Sec 9 / Sec 8 / SCO Sec 17</b> (commercial, highest rent). Or split: Sec 34 plot + Zirakpur plot for safety + growth.`;
    return "Tell me budget like <i>'under 80 lakh'</i> or <i>'1.5Cr for 5 years'</i> and I'll name sector + plot size.";
  }
  if(H("best sector","where to buy","where to invest","which sector","top sector","hot")) return "Top picks: 🥇 <b>Zirakpur</b> (~Rs 6,444/sq.ft, 11.2%) 🥈 <b>Mohali Rd</b> (~Rs 8,000/sq.ft, 10.4%) 🥉 <b>Sec 44</b> (~Rs 13,111/sq.ft, inside Chd). Share your budget and time horizon, and I will pick the exact sector for you.";
  if(H("predict","future","forecast","2030","2028","2029","2031","2032","double","5 year","10 year")){const y=((s.match(/(\d+)\s*(yr|year)/)||[])[1]||5);if(secName){const d=S[secName],f=d.base/9*Math.pow(1+d.growth,+y);return `<b>${secName}</b> in ${y} yrs: <b>${inr(f)}/sq.ft</b> at ${(d.growth*100).toFixed(1)}%/yr. An 1800 sq.ft plot = <b>${inr(f*1800)}</b>. Exact math on <b>Predict</b> page.`;}return `Rule: future price = today's price x (1 + yearly growth)^years. E.g. Sec 34 (8.9%), 5 yrs = <b>${inr(132000/9*Math.pow(1.089,5))}/sq.ft</b>. Say <i>'Sec 44 in 7 years'</i> or open <b>Predict</b>.`;}
  if(H("sell","exit","book profit")) return "Sell when: 3-yr gain >35% OR yield <2% OR you can move to higher CAGR. Sec 34/44 since 2021 = up ~45% — good time to book a <i>partial</i> profit. List free on <b>Marketplace</b>.";
  if(H("buy now","right time","market down","crash","bubble","wait or buy")) return "Chandigarh rarely crashes (fixed supply, planned city). Trend +7-11%/yr. Waiting usually costs more than the 3-5% discount you could negotiate today. Buy ready-title, hold 5+ yrs.";
  if(H("emi","loan","finance","interest","down payment","eligib")){const P=parseAmt(s)||5000000;const R=(s.match(/(\d+(?:\.\d+)?)\s*%/)||[])[1]||9,Y=(s.match(/(\d+)\s*(yr|year)/)||[])[1]||20;const r=R/1200,N=Y*12,e=P*r*Math.pow(1+r,N)/(Math.pow(1+r,N)-1);return `Loan: <b>${inr(P)}</b> @ ${R}% x ${Y}yrs = EMI <b>${inr(e)}/mo</b>, total <b>${inr(e*N)}</b>. Banks usually fund about 80% of the price; keep the EMI under 40% of your income. Full tool on <b>Calculators</b>.`;}
  if(H("roi","return","profit","rental","rent ","yield","lease")) return "Chandigarh: growth 7-11%/yr + rent 2.5-3.5%. Rs 2Cr flat = Rs 40-55K/mo. Yield = annual rent / price x 100. ROI tool is on <b>Calculators</b>.";
  if(H("stamp","duty","registry","registration","tax","capital gain","rera","legal","paper","document","fraud","check","verify","title","mutation","gpa","agreement")) return "Legal pack: 1) RERA ID (agent+project) 2) 30-yr title chain + EC 3) no HUDA/estate dues 4) CLU if converted 5) <b>registered sale deed only</b> (never GPA alone) 6) khasra + physical measurement match. Cost ~7% stamp + 1% registration + 1-2% agent.";
  if(H("dealer","broker","agent","contact","phone","number","list","propert","for sale","available","site visit")) return "Live sellers (<b>Dealers</b> page): UT Land Hub ★4.9 (Sec 17), Goyal ★4.8 (Sec 34), Chawla ★4.6 (SCO), Green Acres ★4.4 (budget). Each card has <b>Call + WhatsApp</b> + their properties. Post your need on the buyer board — they'll call you.";
  if(H("how to buy","process","steps","procedure","guide me","beginner","new buyer")) return "Steps: 1) budget + loan pre-approval 2) shortlist 2 sectors (ask me) 3) visits + compare Rs/sq.ft 4) legal (title/RERA/dues) 5) pay token money only against a written receipt 6) registered deed + mutation. Which step are you currently on?";
  if(H("negotiat","bargain","discount","offer price")) return "What works: quote recent deals on the same street, offer 5-8% below ask with 15-day close, ask seller to share stamp cost, keep a backup plot. Motivated sellers often accept 8-12% below the asking price.";
  if(H("nri","abroad","oci","foreign")) return "NRIs: residential/commercial OK (no farm land). Registered + attested POA needed. TDS ~12.5% LTCG on sale. Always pay through your NRO account, never in cash.";
  if(H("construction","build cost","build house","material")) return "Build cost: Rs 1,800-2,500/sq.ft. An 1800 sq.ft plot = Rs 35-45L to build + ~10% approvals. Sec 34/44 allow G+2.";
  if(H("sco","shop","showroom","commercial","office")) return "Commercial (Sec 17/22/34): 2-3x residential price, 5-6% yield vs 2.5%. Specialists: Chawla Estates + UT Land Hub on Dealers page.";
  if(H("flat","apartment","floor","builder")) return "Flats: Zirakpur 3BHK Rs 70-90L (value), Sec 35/44 floors Rs 1.2-1.8Cr. Check approved plan, occupancy certificate, stilt + backup. Avoid floors sold on GPA alone without a registered sale deed.";
  if(H("marla","kanal","sq ft","sqft","gaj","bigha","acre","convert","unit")) return "1 sq.yd = 9 sq.ft. 1 marla = 30.25 sq.yd (272 sq.ft). 1 kanal = 500 sq.yd (4500 sq.ft). 1 acre = 4840 sq.yd. So an 1800 sq.ft plot ≈ 200 sq.yd ≈ 6.6 marla.";
  if(H("rent vs buy","rent or buy")) return "If you plan to stay 5+ years, buying beats renting (8%+ growth vs 3% rent). For under 3 years, rent Sec 35/44 (Rs 25-40K 2-3BHK) and invest the rest. Breakeven ~4-5 yrs.";
  if(H("mohali","kharar","zirakpur","panchkula","peer muchalla","dhakoli")) return "Greater-Chandigarh: <b>Zirakpur</b> ~Rs 6,444/sq.ft (11.2%), <b>Mohali Rd</b> ~Rs 8,000/sq.ft (10.4%) — highest growth, lowest entry. Panchkula ~Rs 9-10K/sq.ft. Best for budget + 5-10 yr horizon.";
  const sug=["best sector under 1Cr for 5 years","price of Sec 34","compare Sec 34 vs Zirakpur","EMI on 50 lakh","legal checklist","talk to a dealer"];
  return `Tell me a bit more — try:<br>• ${sug.map(x=>`<i>'${x}'</i>`).join("<br>• ")}<br><br>Or send <b>budget + goal</b> (e.g. <i>'80L, growth, 5 years'</i>). I cover all 10 areas: ${Object.keys(S).join(", ")}.`;
}
function spaTime(){const d=new Date();return d.getHours()+":"+String(d.getMinutes()).padStart(2,"0");}
function spaToggle(){document.getElementById("spaPop").classList.toggle("open");}
function spaBubble(who,text){
  const c=document.getElementById("spaChat");
  if(who==="u")c.innerHTML+=`<div class="um"><span>${text.replace(/</g,"&lt;")}</span><div class="stamp">${spaTime()}</div></div>`;
  else c.innerHTML+=`<div class="bm"><div class="ava">${BOT_LOGO}</div><div><span>${text}</span><div class="stamp">PlotMitra • ${spaTime()}</div></div></div>`;
  c.scrollTop=9999;
}
function spaSend(txt){
  const i=document.getElementById("spaIn"),t=(txt||i.value).trim();if(!t)return;
  spaBubble("u",t);i.value="";
  const c=document.getElementById("spaChat");
  c.innerHTML+=`<div class="bm typ" id="spaTyp"><div class="ava">${BOT_LOGO}</div><span>typing…</span></div>`;c.scrollTop=9999;
  setTimeout(()=>{document.getElementById("spaTyp")?.remove();spaBubble("b",spaAsk(t));},550);
}
document.addEventListener("DOMContentLoaded",()=>{
  if(document.getElementById("spaFab"))return;
  document.body.insertAdjacentHTML("beforeend",
  `<div id="spaFab" onclick="spaToggle()" title="Chat with PlotMitra">${BOT_LOGO}<div id="spaDot"></div></div>
  <div id="spaPop"><div id="spaHead"><div id="spaAva">${BOT_LOGO}</div>
  <div><b>PlotMitra</b> <span style="background:#10b981;font-size:10px;padding:2px 8px;border-radius:999px">AI • online</span><br><small>Chandigarh land guide — buy • sell • predict</small></div></div>
  <div id="spaChat"></div>
  <div id="spaChips"><button onclick="spaSend('best sector under 1Cr for 5 years')">Best under 1Cr</button><button onclick="spaSend('price of Sec 34')">Sec 34 rate</button><button onclick="spaSend('compare Sec 34 vs Zirakpur')">Compare</button><button onclick="spaSend('EMI on 50 lakh')">EMI help</button><button onclick="spaSend('legal checklist')">Legal</button><button onclick="spaSend('talk to a dealer')">Dealers</button></div>
  <div id="spaRow"><input id="spaIn" placeholder="Ask PlotMitra…"><button onclick="spaSend()">Send</button></div></div>`);
  spaBubble("b","Namaste! I'm <b>PlotMitra</b> — rates now per sq.ft. Ask me anything, e.g. <i>'price of Sec 44'</i> or <i>'best sector under 1Cr'</i>.");
  document.getElementById("spaIn").addEventListener("keydown",e=>{if(e.key==="Enter")spaSend();});
});
