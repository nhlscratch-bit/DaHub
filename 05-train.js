/* ===== Train logic ===== */
let act=JSON.parse(localStorage.getItem('dahub_active_v3')||'{"min":0,"start":0,"claim":""}'),calcOn=localStorage.getItem('dahub_calc_v3')!=='0';
const saveAct=()=>localStorage.setItem('dahub_active_v3',JSON.stringify(act));
const wTs=w=>+String(w.id).split('_')[1]||0;
function todaySets(){const k=dayKey(Date.now());return workouts.filter(w=>dayKey(wTs(w))===k)}
function startWorkout(){if(!act.start){act.start=Date.now();saveAct();showNotificationToast('Workout started. Log your first set.')}updateTrain();document.getElementById('logCard').scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>document.getElementById('exerciseInput').focus({preventScroll:true}),500)}
function endSet(){if(isTimerRunning){pauseTimer()}resetTimer();startTimer();showNotificationToast('Rest started')}
function endSession(){if(act.start){act.min+=Math.max(1,Math.round((Date.now()-act.start)/60000));act.start=0;saveAct()}}
function claimXp(){const n=todaySets().length;
  if(!n){showNotificationToast('Log at least one set first');return}
  if(act.claim===dayKey(Date.now())){showNotificationToast('Already claimed today');return}
  endSession();act.claim=dayKey(Date.now());saveAct();awardXp(50+n*10,'Workout complete');updateTrain();updateHome()}
function toggleCalc(){calcOn=!calcOn;localStorage.setItem('dahub_calc_v3',calcOn?'1':'0');calcPrev()}
function calcPrev(){const t=document.getElementById('calcTgl');t.classList.toggle('on',calcOn);const w=parseFloat(document.getElementById('weightInput').value),r=parseInt(document.getElementById('repsInput').value);document.getElementById('calcPrev').textContent=calcOn&&w>0&&r>0?'Set volume: '+(w*r).toLocaleString()+' lbs':''}
function updateTimerUI(){const d=document.getElementById('timerDisplay');if(d)d.innerText=formatTime(timerRemaining);const c=document.getElementById('tRing');if(c)c.style.strokeDashoffset=326.7*(1-timerRemaining/timerDuration)}
const fmtDur=m=>m<60?m+'m':Math.floor(m/60)+'h '+(m%60)+'m';
function updateTrain(){
  const el=(i,v)=>{const e=document.getElementById(i);if(e)e.textContent=v};
  const vol=Math.round(workouts.reduce((a,w)=>a+w.weight*w.reps,0));
  const live=act.start?Math.round((Date.now()-act.start)/60000):0;
  const now=new Date(),ws=new Date(now.getFullYear(),now.getMonth(),now.getDate()-now.getDay()).getTime();
  const days=new Set(workouts.filter(w=>wTs(w)>=ws).map(w=>dayKey(wTs(w)))).size;
  el('stW',workouts.length);el('stV',fmtN(vol));el('stA',fmtDur(act.min+live));el('stWk',days+'/7');
  el('startTxt',act.start?'In Progress \u2022 '+fmtDur(live):'Start Workout');
  const pr=re=>{const m=workouts.filter(w=>re.test(w.exercise)).map(w=>w.weight);return m.length?Math.max(...m)+' lbs':'\u2014'};
  el('prBench',pr(/bench/i));el('prSquat',pr(/squat/i));el('prDead',pr(/dead/i));
  el('claimMsg',act.claim===dayKey(Date.now())?'Claimed today. Come back tomorrow.':todaySets().length?'Claim '+(50+todaySets().length*10)+' XP for today':'Earn XP \u2022 Unlock Rewards');
  calcPrev();
}
updateTimerUI();updateTrain();setInterval(updateTrain,2000);
document.getElementById('workoutLogForm').addEventListener('submit',()=>setTimeout(()=>{updateTrain();updateHome()},50));
