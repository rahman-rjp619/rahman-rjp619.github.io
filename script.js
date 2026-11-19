/* ===== 1. Boot screen ===== */
(function () {
  var ONLY_ONCE_PER_SESSION = true; // true = boot hanya tampil sekali per tab
  var SESSION_KEY = 'kd-boot-seen';

  var root = document.documentElement;
  var screen = document.getElementById('kd-boot-screen');
  if (!screen) { window.kdBootDone = true; return; }

  function notifyDone() {
    if (window.kdBootDone) return;
    window.kdBootDone = true;
    root.classList.remove('kd-booting');
    document.dispatchEvent(new Event('kd-boot-done'));
  }

  if (ONLY_ONCE_PER_SESSION) {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        screen.parentNode.removeChild(screen);
        notifyDone();
        return;
      }
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}
  }

  root.classList.add('kd-booting');

  var timeEl = document.getElementById('kd-time');
  var dateEl = document.getElementById('kd-date');
  var logEl = document.getElementById('kd-log');
  var progressEl = document.getElementById('kd-progress');
  var percentEl = document.getElementById('kd-percent');
  var statusEl = document.getElementById('kd-status');
  var skipBtn = document.getElementById('kd-skip');

  var progress = 0;
  var finished = false;
  var progressTimer, logTimer;

  function updateClock() {
    var now = new Date();
    timeEl.textContent = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    dateEl.textContent = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    }).format(now);
  }
  updateClock();
  var clockTimer = setInterval(updateClock, 1000);

  var messages = [
    { tag: '[ OK ]',  type: 'ok',    text: 'System environment initialized.' },
    { tag: '[LOAD]',  type: 'load',  text: 'Loading workspace components...' },
    { tag: '[ OK ]',  type: 'ok',    text: 'Interface modules are ready.' },
    { tag: '[SYNC]',  type: 'sync',  text: 'Synchronizing developer workspace...' },
    { tag: '[INFO]',  type: 'info',  text: 'Preparing personal portfolio...' },
    { tag: '[ OK ]',  type: 'ok',    text: 'KOERNIA.DEV connection established.' },
    { tag: '[READY]', type: 'ready', text: 'Workspace successfully loaded.' }
  ];
  var messageIndex = 0;

  function addLog(message) {
    var line = document.createElement('div');
    line.className = 'kd-log-line';
    var tag = document.createElement('span');
    tag.className = 'kd-tag ' + message.type;
    tag.textContent = message.tag;
    var text = document.createElement('span');
    text.className = 'kd-log-message';
    text.textContent = message.text;
    line.appendChild(tag);
    line.appendChild(text);
    logEl.appendChild(line);
    while (logEl.children.length > 6) { logEl.removeChild(logEl.firstChild); }
  }

  function onKey(event) {
    if (event.key === 'Enter' || event.key === 'Escape') closeScreen();
  }

  function closeScreen() {
    if (finished) return;
    finished = true;
    clearInterval(progressTimer);
    clearInterval(logTimer);
    clearInterval(clockTimer);
    document.removeEventListener('keydown', onKey);

    progressEl.style.width = '100%';
    percentEl.textContent = '100%';
    statusEl.textContent = 'SYSTEM READY';

    setTimeout(function () {
      screen.classList.add('kd-hidden');
      notifyDone();
      setTimeout(function () {
        if (screen.parentNode) screen.parentNode.removeChild(screen);
      }, 750);
    }, 350);
  }

  progressTimer = setInterval(function () {
    if (finished) return;
    progress += Math.random() * 3.5 + 1.5;
    if (progress >= 100) { progress = 100; clearInterval(progressTimer); }
    var value = Math.floor(progress);
    progressEl.style.width = value + '%';
    percentEl.textContent = String(value).padStart(2, '0') + '%';
    if (value >= 100) {
      statusEl.textContent = 'SYSTEM READY';
      setTimeout(closeScreen, 1000);
    }
  }, 110);

  logTimer = setInterval(function () {
    if (finished) return;
    if (messageIndex < messages.length) { addLog(messages[messageIndex]); messageIndex++; }
    else clearInterval(logTimer);
  }, 560);

  skipBtn.addEventListener('click', closeScreen);
  document.addEventListener('keydown', onKey);

  setTimeout(closeScreen, 15000); // pengaman
})();

/* ===== 2. Tema gelap/terang, tombol next section, animasi nama ===== */
(function(){
  var root=document.documentElement;
  var storageKey='koernia-theme';
  var mode='dark';
  try{mode=window.localStorage.getItem(storageKey)==='light'?'light':'dark';}catch(e){}

  function applyTheme(next){
    var light=next==='light';
    root.setAttribute('data-theme',light?'light':'dark');
    var button=document.getElementById('themeToggle');
    if(button){
      button.setAttribute('aria-label',light?'Aktifkan mode gelap':'Aktifkan mode terang');
      button.innerHTML=light
        ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z"/><path d="M16.5 4.5v3m-1.5-1.5h3"/></svg>'
        : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
    }
  }

  applyTheme(mode);
  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('#themeToggle');
    if(!button)return;
    mode=root.getAttribute('data-theme')==='light'?'dark':'light';
    applyTheme(mode);
    try{window.localStorage.setItem(storageKey,mode);}catch(e){}
  });
})();
(function(){const ids=["about","skills","projects","journal","contact"].filter(function(id){return document.getElementById(id)});const btn=document.getElementById("pageNext");if(!btn||!ids.length)return;btn.addEventListener("click",()=>{const y=window.scrollY+window.innerHeight*.35;let next=ids.find(id=>document.getElementById(id).offsetTop>y);if(!next)next=ids[0];document.getElementById(next).scrollIntoView({behavior:"smooth",block:"start"});});})();
(function(){
  const el=document.getElementById('brandName');
  if(!el)return;

  const name='<kr>Kurnia Rahman</kr>';
  const typo='<kr>Kurnia Rahmna</kr>';
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.setAttribute('aria-label',name);

  if(reduceMotion){
    el.textContent=name;
    return;
  }

  let index=0;
  el.textContent='';

  function typeText(text,done){
    if(index>=text.length){
      if(done)done();
      return;
    }
    const char=text.charAt(index);
    index++;
    el.textContent=text.slice(0,index);
    const delay=char===' '?190:75+Math.random()*95;
    setTimeout(function(){typeText(text,done)},delay);
  }

  function correctTypo(){
    if(el.textContent.length>11){
      el.textContent=el.textContent.slice(0,-1);
      setTimeout(correctTypo,110+Math.random()*70);
      return;
    }
    index=el.textContent.length;
    setTimeout(function(){typeText(name)},160);
  }

  function startBrand(){
    setTimeout(function(){
      typeText(typo,function(){setTimeout(correctTypo,500+Math.random()*250)});
    },650);
  }
  if(window.kdBootDone||!document.getElementById('kd-boot-screen'))startBrand();
  else document.addEventListener('kd-boot-done',startBrand,{once:true});
})();

/* ===== 3. Terminal interaktif ===== */
(function(){
var body=document.getElementById('ktBody'),term=document.getElementById('ktTerm'),chips=document.getElementById('ktChips');
if(!body||!term)return;
var P='root@koernia.dev';
var reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var busy=false,fast=false;
var SKILLS=['hr-operations/','attendance-data/','payroll-recap/','apps-script/','workflow-automation/','ui-ux/','blogger-xml/'];
var LINKS=[["whatsapp","https://wa.me/6282279274233","wa.me/6282279274233"],["instagram","https://instagram.com/koernia_rachman","instagram.com/koernia_rachman"],["threads","https://www.threads.com/@koernia_rachman","threads.com/@koernia_rachman"],["linkedin","https://www.linkedin.com/in/kurnia-rahman-1957b9169/","linkedin.com/in/kurnia-rahman-1957b9169"],["x","https://x.com/koernia_rachman","x.com/koernia_rachman"],["email","mailto:rahman.rajapalma@gmail.com","rahman.rajapalma@gmail.com"]];
var CODE=[
'<span class="kt-k">const</span> developer = {',
'  name: <span class="kt-s">"Kurnia Rahman"</span>,',
'  role: <span class="kt-r">"Personnel Operations &amp; System Builder"</span>,',
'  domain: <span class="kt-s">"koernia.dev"</span>,',
'  focus: [<span class="kt-s">"Attendance"</span>, <span class="kt-s">"Payroll Recap"</span>, <span class="kt-s">"Automation"</span>],',
'  access: <span class="kt-b">"granted"</span>',
'};'];
function sleep(ms){return new Promise(function(r){setTimeout(r,(fast||reduce)?0:ms)})}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function add(h,c){var d=document.createElement('div');d.className='kt-l'+(c?' '+c:'');d.innerHTML=h;body.appendChild(d);body.scrollTop=body.scrollHeight;return d}
function lock(b){busy=b;term.classList.toggle('kt-busy',b)}
function promptHtml(){return '<span class="kt-p">'+P+'</span><span class="kt-d">:~$</span> '}
async function typeCmd(cmd){
 var d=add(promptHtml()+'<span class="kt-c"></span><i class="kt-cur"></i>');
 var c=d.querySelector('.kt-c');
 for(var i=1;i<=cmd.length;i++){
  if(fast||reduce)break;
  c.textContent=cmd.slice(0,i);
  await sleep(36+Math.random()*52);
 }
 c.textContent=cmd;
 await sleep(280);
 var cu=d.querySelector('.kt-cur');if(cu)cu.remove();
}
async function spin(text,ms,okText){
 var d=add('<span class="kt-cm">'+esc(text)+'</span> <span class="kt-sp">|</span>');
 var sp=d.querySelector('.kt-sp'),f=['|','/','-','\\'],n=Math.max(1,Math.round(ms/90));
 for(var i=0;i<n;i++){if(fast||reduce)break;sp.textContent=f[i%4];await sleep(90)}
 sp.className='kt-ok';sp.textContent=okText;
}
async function lines(arr,gap){for(var i=0;i<arr.length;i++){add(arr[i]);await sleep(gap)}}
function dropIdle(){var o=body.querySelector('.kt-idle');if(o)o.remove()}
function idle(){dropIdle();add(promptHtml()+'<i class="kt-cur"></i>','kt-idle')}
async function boot(){
 body.textContent='';
 await sleep(350);
 await typeCmd('./access-profile.sh');
 await spin('checking access ...',650,'[ok] granted');
 await typeCmd('cat /profil.js');
 await spin('// fetching identity data ...',950,'[done]');
 await lines(CODE,95);
 await typeCmd('echo $ROLE');
 add('<span class="kt-r">Personnel Operations &amp; System Builder</span>');
}
var OUT={
 'ls skills/':async function(){add(SKILLS.map(function(s){return '<span class="kt-dir">'+s+'</span>'}).join('  '))},
 'cat contact.js':async function(){
  await lines(LINKS.map(function(l){var pad=new Array(Math.max(1,11-l[0].length)+1).join(' ');return '<span class="kt-k">'+l[0]+'</span>'+pad+'<a href="'+l[1]+'" target="_blank" rel="noopener">'+esc(l[2])+'</a>'}),110);
 }
};
async function exec(name){
 if(busy)return;
 lock(true);fast=false;
 try{
  if(name==='clear'){body.textContent=''}
  else if(name==='replay'){await boot()}
  else if(name==='cat logs.txt'){dropIdle();await typeCmd(name);document.dispatchEvent(new Event('koernia-open-log'))}
  else{dropIdle();await typeCmd(name);await OUT[name]()}
 }catch(e){}
 idle();lock(false);
}
if(chips)chips.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-cmd]');if(b)exec(b.getAttribute('data-cmd'))});
body.addEventListener('click',function(e){if(busy&&!(e.target.closest&&e.target.closest('a')))fast=true});
function go(){
 function run(){setTimeout(function(){exec('replay')},450)}
 if(window.kdBootDone||!document.getElementById('kd-boot-screen'))run();
 else document.addEventListener('kd-boot-done',run,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* ===== 4. Progress bar, reveal on scroll, menu mobile ===== */
(function(){
var reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
/* progress bar */
var bar=document.createElement('div');bar.id='krProg';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
var tick=false;
function upd(){var h=document.documentElement.scrollHeight-window.innerHeight;var p=h>0?Math.min(1,(window.pageYOffset||0)/h):0;bar.style.transform='scaleX('+p+')';tick=false}
window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
window.addEventListener('resize',upd);upd();
/* reveal on scroll */
var els=[].slice.call(document.querySelectorAll('.about-grid>*,.skill,.project,.panel,.contact,.section-head'));
if('IntersectionObserver' in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(en){
  if(!en.isIntersecting)return;
  var t=en.target;io.unobserve(t);t.classList.add('in');
  setTimeout(function(){t.classList.remove('rv','in');t.style.transitionDelay=''},900);
 })},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
 els.forEach(function(e,i){e.classList.add('rv');e.style.transitionDelay=((i%3)*70)+'ms';io.observe(e)});
}

/* menu */
var btn=document.getElementById('menuBtn'),nav=document.getElementById('navLinks');
if(btn&&nav){
 var setMenu=function(o){nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');btn.textContent=o?'\u2715':'\u2630'};
 btn.addEventListener('click',function(e){e.stopPropagation();setMenu(!nav.classList.contains('open'))});
 nav.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a'))setMenu(false)});
 document.addEventListener('click',function(e){if(!nav.contains(e.target))setMenu(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
}

/* Nav aktif mengikuti section */
var sectionLinks=[].slice.call(document.querySelectorAll('#navLinks a'));
var sectionTargets=sectionLinks.map(function(link){
 var hash=link.getAttribute('href').split('#')[1];
 return hash?{link:link,section:document.getElementById(decodeURIComponent(hash))}:null;
}).filter(function(item){return item&&item.section});
if('IntersectionObserver' in window&&sectionTargets.length){
 var navObserver=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
   if(!entry.isIntersecting)return;
   sectionTargets.forEach(function(item){
    var active=item.section===entry.target;
    item.link.classList.toggle('active',active);
    if(active)item.link.setAttribute('aria-current','location');
    else item.link.removeAttribute('aria-current');
   });
  });
 },{rootMargin:'-25% 0px -60% 0px'});
 sectionTargets.forEach(function(item){navObserver.observe(item.section)});
}
})();

/* ===== 5. Notifikasi akses (klik kanan / tekan lama) ===== */
(function () {
  const box = document.getElementById('koernia-access-alert');
  if (!box) return;

  let timer;
  let pressTimer;

  document.addEventListener('selectstart', function(e) { e.preventDefault(); });
  ['copy', 'cut'].forEach(function(event) {
    document.addEventListener(event, function(e) { e.preventDefault(); });
  });

  function showAccessAlert() {
    box.classList.add('koernia-show');
    clearTimeout(timer);
    timer = setTimeout(function () {
      box.classList.remove('koernia-show');
    }, 3000);
  }

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showAccessAlert();
  });

  document.addEventListener('touchstart', function() {
    clearTimeout(pressTimer);
    pressTimer = setTimeout(showAccessAlert, 650);
  }, {passive: true});

  ['touchend', 'touchmove', 'touchcancel'].forEach(function(event) {
    document.addEventListener(event, function() {
      clearTimeout(pressTimer);
    }, {passive: true});
  });
})();

/* ===== 6. Log popup (logs.txt) ===== */
(function(){
  /* >>> PASTE: ganti teks PASTE_BASE64_LOG_DI_SINI dengan string base64 `encoded` dari template Blogger lama
         (isi di antara tanda kutip pada baris "var encoded='...';" di bagian #krLogPopup). <<< */
  var encoded='PASTE_BASE64_LOG_DI_SINI';
  var popup=document.getElementById('krLogPopup');
  var frame=document.getElementById('krLogFrame');
  var opened=false;
  var root=document.documentElement;
  function decodeHtml(value){
    var binary=atob(value), bytes=new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
  function currentTheme(){return root.getAttribute('data-theme')==='light'?'light':'dark';}
  function applyPopupTheme(theme){
    theme=theme==='light'?'light':'dark';
    if(popup)popup.setAttribute('data-theme',theme);
    try{
      if(frame&&frame.contentWindow&&frame.contentDocument&&frame.contentDocument.body){
        var body=frame.contentDocument.body;
        body.dataset.theme=theme;
        var toggles=frame.contentDocument.querySelectorAll('.theme-toggle');
        toggles.forEach(function(button){
          var next=theme==='light'?'gelap':'terang';
          button.setAttribute('aria-label','Aktifkan mode '+next);
          button.title='Aktifkan mode '+next;
        });
      }
    }catch(error){}
  }
  function openLog(){
    if(!popup||!frame)return;
    applyPopupTheme(currentTheme());
    if(!opened){
      var html;
      try{html=decodeHtml(encoded);}catch(e){console.warn('Data log (base64) belum diisi.');return;}
      frame.onload=function(){applyPopupTheme(currentTheme());};
      frame.srcdoc=html;opened=true;
    }
    popup.classList.add('is-open');popup.setAttribute('aria-hidden','false');
    document.body.classList.add('kr-log-open');
  }
  function closeLog(){
    if(!popup)return;
    popup.classList.remove('is-open');popup.setAttribute('aria-hidden','true');
    document.body.classList.remove('kr-log-open');
    var trigger=document.querySelector('#ktChips button[data-cmd="cat logs.txt"]');
    if(trigger)trigger.focus();
  }
  document.addEventListener('koernia-open-log',openLog);
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&popup&&popup.classList.contains('is-open'))closeLog();});
  document.addEventListener('contextmenu',function(event){if(popup&&popup.classList.contains('is-open')){event.preventDefault();event.stopPropagation();}},true);
  window.addEventListener('message',function(event){
    if(!frame||event.source!==frame.contentWindow||!event.data)return;
    if(event.data.type==='koernia-log-close'){closeLog();return;}
    if(event.data.type==='koernia-log-theme'&&popup)popup.setAttribute('data-theme',event.data.theme==='light'?'light':'dark');
  });
  if(window.MutationObserver){
    new MutationObserver(function(){if(popup&&popup.classList.contains('is-open'))applyPopupTheme(currentTheme());}).observe(root,{attributes:true,attributeFilter:['data-theme']});
  }
})();
