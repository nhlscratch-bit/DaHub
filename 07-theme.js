/* ===== DaHub theme: RGB glow on/off (saved per device) ===== */
function setRGB(on){
  document.body.classList.toggle('rgb',on);
  try{localStorage.setItem('dahub_rgb',on?'1':'0')}catch(e){}
  const b=document.getElementById('rgbBtn'),c=document.getElementById('rgbToggle');
  if(b)b.setAttribute('aria-pressed',on);if(c)c.checked=on;
}
function toggleRGB(){setRGB(!document.body.classList.contains('rgb'))}
(function(){let on=false;try{on=localStorage.getItem('dahub_rgb')==='1'}catch(e){}
  const go=()=>setRGB(on);document.readyState==='loading'?document.addEventListener('DOMContentLoaded',go):go()})();
