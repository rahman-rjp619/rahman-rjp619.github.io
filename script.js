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
  var encoded='PCFET0NUWVBFIGh0bWw+Cgo8aHRtbCBsYW5nPSJpZCI+Cgo8aGVhZD4KCjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KCjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wIj4KCjxtZXRhIG5hbWU9InRoZW1lLWNvbG9yIiBjb250ZW50PSIjMTExNTEzIj4KCjx0aXRsZT5BRlRFUiBUSEUgTEFTVCBQQUNLRVQgLy8gS09FUk5JQS5ERVY8L3RpdGxlPgoKPHN0eWxlPgoKOnJvb3QgewoKICBjb2xvci1zY2hlbWU6IGRhcms7CgogIC0tYmc6ICMxNzFhMTg7CgogIC0tcGFuZWw6ICMxZTIzMjA7CgogIC0tc3VyZmFjZTogIzI1MmMyNzsKCiAgLS1ncmVlbjogI2E5YzdhYTsKCiAgLS1ncmVlbi1kaW06ICM5M2E4OTU7CgogIC0tY3lhbjogIzliYmZjMzsKCiAgLS1hbWJlcjogI2M5YjI4ZTsKCiAgLS12aW9sZXQ6ICNiNmE5YzY7CgogIC0tdGV4dDogI2QwZDVkMTsKCiAgLS1tdXRlZDogIzliYTY5ZTsKCiAgLS1ib3JkZXI6ICMzYjQ3NDA7CgogIC0tcGluazogI2M5OWViMDsKCiAgLS1oZWFkZXItYmc6ICMxYjIwMWQ7CgogIC0taW50cm8tZ2xvdzogIzI3MzMyYzsKCiAgLS1jYXJkLWJnOiAjMjAyNjIyRjU7CgogIC0tc2Nyb2xsLXRodW1iOiAjNTI2MjU3OwoKICAtLWhvdmVyLWJnOiAjMzAzYTMzOwoKfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIHsKCiAgY29sb3Itc2NoZW1lOiBsaWdodDsKCiAgLS1iZzogI2U3ZTllNTsKCiAgLS1wYW5lbDogI2VmZjFlZDsKCiAgLS1zdXJmYWNlOiAjZTFlNWRmOwoKICAtLWdyZWVuOiAjNDY2OTRkOwoKICAtLWdyZWVuLWRpbTogIzYzN2I2NzsKCiAgLS1jeWFuOiAjNDY3NzdlOwoKICAtLWFtYmVyOiAjODc2NjNhOwoKICAtLXZpb2xldDogIzcxNjE4MTsKCiAgLS10ZXh0OiAjMzAzODMzOwoKICAtLW11dGVkOiAjNjg3MzZjOwoKICAtLWJvcmRlcjogI2M1Y2RjNTsKCiAgLS1waW5rOiAjOTM2NDdhOwoKICAtLWhlYWRlci1iZzogI2UyZTZlMTsKCiAgLS1pbnRyby1nbG93OiAjZDRkZWQ1OwoKICAtLWNhcmQtYmc6ICNlZmYxZWRmNTsKCiAgLS1zY3JvbGwtdGh1bWI6ICNhNWIwYTc7CgogIC0taG92ZXItYmc6ICNkOWUwZGE7Cgp9CgpbaGlkZGVuXSB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfQoKLmludHJvLXNjcmVlbiB7CgogIHBvc2l0aW9uOiBmaXhlZDsKCiAgaW5zZXQ6IDA7CgogIHotaW5kZXg6IDI7CgogIGRpc3BsYXk6IGdyaWQ7CgogIHBsYWNlLWl0ZW1zOiBjZW50ZXI7CgogIHBhZGRpbmc6IDI0cHg7CgogIGJhY2tncm91bmQ6CgogICAgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgNTAlIDM4JSwgdmFyKC0taW50cm8tZ2xvdykgMCUsIHZhcigtLWJnKSA2NSUpLAoKICAgIHZhcigtLWJnKTsKCiAgaXNvbGF0aW9uOiBpc29sYXRlOwoKICBvcGFjaXR5OiAxOwoKICB0cmFuc2l0aW9uOiBvcGFjaXR5IC45cyBlYXNlOwoKfQoKLmludHJvLXNjcmVlbjo6YmVmb3JlLAoKLmludHJvLXNjcmVlbjo6YWZ0ZXIgewoKICBjb250ZW50OiAiIjsKCiAgcG9zaXRpb246IGFic29sdXRlOwoKICB6LWluZGV4OiAtMTsKCiAgd2lkdGg6IG1pbig3MnZ3LCA1ODBweCk7CgogIGFzcGVjdC1yYXRpbzogMTsKCiAgYm9yZGVyOiAxcHggc29saWQgIzgzYzdkMzFhOwoKICBib3JkZXItcmFkaXVzOiA1MCU7CgogIGJveC1zaGFkb3c6IDAgMCAwIDM0cHggIzgzYzdkMzBhLCAwIDAgMCA3MnB4ICNhM2Q2YTUwODsKCiAgcG9pbnRlci1ldmVudHM6IG5vbmU7Cgp9CgouaW50cm8tc2NyZWVuOjphZnRlciB7CgogIHdpZHRoOiBtaW4oNTJ2dywgNDEwcHgpOwoKICBib3JkZXItY29sb3I6ICNkOTliYjgxYzsKCiAgYm94LXNoYWRvdzogMCAwIDAgMjVweCAjZDk5YmI4MGEsIDAgMCA1NXB4ICM4M2M3ZDMwYzsKCn0KCi5pbnRyby1zY3JlZW4uaXMtY2xvc2luZyB7CgogIG9wYWNpdHk6IDA7CgogIHBvaW50ZXItZXZlbnRzOiBub25lOwoKfQoKLnBsYXllci1jYXJkIHsKCiAgcG9zaXRpb246IHJlbGF0aXZlOwoKICB3aWR0aDogbWluKDEwMCUsIDM5MHB4KTsKCiAgcGFkZGluZzogMzBweDsKCiAgYm9yZGVyOiAxcHggc29saWQgIzQyNTc0YTsKCiAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWN5YW4pOwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTsKCiAgYm94LXNoYWRvdzogMCAyMHB4IDcwcHggIzAwMDMsIDAgMCA0NXB4ICM4M2M3ZDMxMDsKCiAgdGV4dC1hbGlnbjogY2VudGVyOwoKfQoKLnBsYXllci1sYWJlbCB7IGNvbG9yOiB2YXIoLS1ncmVlbi1kaW0pOyBmb250LXNpemU6IDEwcHg7IGxldHRlci1zcGFjaW5nOiAycHg7IH0KCi5wbGF5ZXItbGFiZWw6OmJlZm9yZSB7IGNvbnRlbnQ6ICLil48iOyBtYXJnaW4tcmlnaHQ6IDhweDsgY29sb3I6IHZhcigtLWN5YW4pOyBmb250LXNpemU6IDhweDsgdGV4dC1zaGFkb3c6IDAgMCA5cHggdmFyKC0tY3lhbik7IH0KCi50cmFjay1tZXRhIHsKCiAgZGlzcGxheTogZmxleDsKCiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwoKICBnYXA6IDEycHg7CgogIG1hcmdpbjogLTRweCAwIDE4cHg7CgogIGNvbG9yOiB2YXIoLS1tdXRlZCk7CgogIGZvbnQtc2l6ZTogOXB4OwoKICBsZXR0ZXItc3BhY2luZzogMXB4OwoKfQoKLnRyYWNrLW1ldGEgc3BhbjpsYXN0LWNoaWxkIHsgY29sb3I6IHZhcigtLXBpbmspOyB9CgoudHJhY2stcHJvZ3Jlc3MgewoKICBoZWlnaHQ6IDNweDsKCiAgbWFyZ2luOiAwIDAgMjBweDsKCiAgb3ZlcmZsb3c6IGhpZGRlbjsKCiAgYmFja2dyb3VuZDogdmFyKC0tYm9yZGVyKTsKCn0KCi50cmFjay1wcm9ncmVzcyBzcGFuIHsKCiAgZGlzcGxheTogYmxvY2s7CgogIHdpZHRoOiAzNCU7CgogIGhlaWdodDogMTAwJTsKCiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB2YXIoLS1jeWFuKSwgdmFyKC0tZ3JlZW4pLCB2YXIoLS1waW5rKSk7CgogIGJveC1zaGFkb3c6IDAgMCAxMHB4ICM4M2M3ZDM4ODsKCn0KCi5hbGJ1bS1hcnQgewoKICB3aWR0aDogMTkwcHg7CgogIGFzcGVjdC1yYXRpbzogMTsKCiAgbWFyZ2luOiAyNHB4IGF1dG87CgogIGRpc3BsYXk6IGdyaWQ7CgogIHBsYWNlLWl0ZW1zOiBjZW50ZXI7CgogIGJvcmRlcjogMXB4IHNvbGlkICM0ODYwNTQ7CgogIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDUwJSwgI2Q5OWJiODMzIDAgMiUsIHRyYW5zcGFyZW50IDMlKSwgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA1MCUgNTAlLCAjMzM0ODNhIDAgMiUsIHRyYW5zcGFyZW50IDMlKSwgcmVwZWF0aW5nLXJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDUwJSwgdHJhbnNwYXJlbnQgMCAxNHB4LCAjODNjN2QzMjIgMTVweCAxNnB4KSwgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgIzI0MzUyYiwgIzEyMTcxNCA3MiUpOwoKICBjb2xvcjogdmFyKC0tY3lhbik7CgogIGZvbnQtc2l6ZTogMzhweDsKCiAgbGV0dGVyLXNwYWNpbmc6IC01cHg7CgogIHRleHQtc2hhZG93OiAwIDAgMjRweCAjODNjN2QzODg7Cgp9CgoucGxheWVyLWNhcmQgaDEgeyBmb250LXNpemU6IDE3cHg7IGxldHRlci1zcGFjaW5nOiAuNHB4OyBjb2xvcjogdmFyKC0tdGV4dCk7IH0KCi50cmFjay1zdWJ0aXRsZSB7IG1hcmdpbjogOHB4IDAgMjJweDsgY29sb3I6IHZhcigtLW11dGVkKTsgZm9udC1zaXplOiAxMHB4OyB9CgoucGxheWVyLXBsYXkgewoKICB3aWR0aDogNTRweDsKCiAgaGVpZ2h0OiA1NHB4OwoKICBkaXNwbGF5OiBncmlkOwoKICBwbGFjZS1pdGVtczogY2VudGVyOwoKICBtYXJnaW46IDAgYXV0bzsKCiAgYm9yZGVyOiAxcHggc29saWQgI2Q5OWJiODsKCiAgYm9yZGVyLXJhZGl1czogNTAlOwoKICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAjNTQzMzQ4LCAjMjgzYzM2IDc1JSk7CgogIGNvbG9yOiAjZjBiMmNlOwoKICBib3gtc2hhZG93OiAwIDAgMCA2cHggI2Q5OWJiODEyLCAwIDAgMjRweCAjZDk5YmI4MzM7Cgp9CgoucGxheWVyLXBsYXk6aG92ZXIgewoKICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCAjNzA0MzVkLCAjMzE1MjQ3IDc1JSk7CgogIGJvcmRlci1jb2xvcjogI2YwYjJjZTsKCiAgY29sb3I6ICNmZmYwZjc7CgogIGJveC1zaGFkb3c6IDAgMCAwIDhweCAjZDk5YmI4MWMsIDAgMCAzMHB4ICNkOTliYjg1NTsKCn0KCi5wbGF5ZXItcGxheSAuYXVkaW8taWNvbiB7IG1hcmdpbi1sZWZ0OiA0cHg7IH0KCi5wbGF5ZXItaGludCB7IG1hcmdpbjogMTZweCAwIDA7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGZvbnQtc2l6ZTogOXB4OyBsZXR0ZXItc3BhY2luZzogLjVweDsgfQoKLnBsYXllci1lcXVhbGl6ZXIgeyBoZWlnaHQ6IDIycHg7IG1hcmdpbjogMjBweCAwIDA7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBnYXA6IDRweDsgfQoKLnBsYXllci1lcXVhbGl6ZXIgc3BhbiB7IHdpZHRoOiAzcHg7IGhlaWdodDogNXB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1jeWFuKTsgb3BhY2l0eTogLjc1OyB9CgoucGxheWVyLWNhcmQuaXMtcGxheWluZyAucGxheWVyLWVxdWFsaXplciBzcGFuIHsgYW5pbWF0aW9uOiBlcXVhbGl6ZSAuN3MgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlOyB9CgoucGxheWVyLWVxdWFsaXplciBzcGFuOm50aC1jaGlsZCgzbikgeyBhbmltYXRpb24tZGVsYXk6IC0uNDVzOyB9CgoucGxheWVyLWVxdWFsaXplciBzcGFuOm50aC1jaGlsZCgybikgeyBhbmltYXRpb24tZGVsYXk6IC0uMnM7IH0KCkBrZXlmcmFtZXMgZXF1YWxpemUgeyB0byB7IGhlaWdodDogMjBweDsgb3BhY2l0eTogMTsgfSB9CgoqIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgfQoKaHRtbCwgYm9keSB7CgogIHdpZHRoOiAxMDAlOwoKICBoZWlnaHQ6IDEwMCU7CgogIG1hcmdpbjogMDsKCiAgb3ZlcmZsb3c6IGhpZGRlbjsKCn0KCmJvZHkgewoKICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7CgogIGNvbG9yOiB2YXIoLS10ZXh0KTsKCiAgZm9udC1mYW1pbHk6ICJKZXRCcmFpbnMgTW9ubyIsICJGaXJhIENvZGUiLCAiQ2FzY2FkaWEgQ29kZSIsIENvbnNvbGFzLCBtb25vc3BhY2U7CgogIHBhZGRpbmc6IDE4cHg7CgogIGZvbnQtc2l6ZTogMTRweDsKCn0KCi50ZXJtaW5hbCB7CgogIHdpZHRoOiAxMDAlOwoKICBtYXgtd2lkdGg6IDEwMDBweDsKCiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMzZweCk7CgogIGhlaWdodDogY2FsYygxMDBkdmggLSAzNnB4KTsKCiAgbWFyZ2luOiBhdXRvOwoKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1wYW5lbCk7CgogIGJveC1zaGFkb3c6IDAgMTVweCA1MHB4ICMwMDA0OwoKICBkaXNwbGF5OiBmbGV4OwoKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwoKICBvdmVyZmxvdzogaGlkZGVuOwoKICBvcGFjaXR5OiAxOwoKICB0cmFuc2l0aW9uOiBvcGFjaXR5IC43cyBlYXNlOwoKfQoKLnRlcm1pbmFsLmlzLW9wZW5pbmcgeyBvcGFjaXR5OiAwOyB9CgoudG9wYmFyIHsKCiAgZmxleDogMCAwIDQ0cHg7CgogIHBhZGRpbmc6IDAgMTZweDsKCiAgZGlzcGxheTogZmxleDsKCiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKCiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwoKICBnYXA6IDEycHg7CgogIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1oZWFkZXItYmcpOwoKfQoKLmJyYW5kIHsgY29sb3I6IHZhcigtLWdyZWVuKTsgZm9udC1zaXplOiAxMXB4OyBsZXR0ZXItc3BhY2luZzogLjVweDsgZm9udC13ZWlnaHQ6IDYwMDsgfQoKLnN0YXR1cyB7IGNvbG9yOiB2YXIoLS1ncmVlbi1kaW0pOyBmb250LXNpemU6IDEwcHg7IGxldHRlci1zcGFjaW5nOiAxcHg7IH0KCi50b3BiYXItYWN0aW9ucyB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTRweDsgfQoKLmludHJvLXRoZW1lLXRvZ2dsZSB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAyNHB4OyByaWdodDogMjRweDsgei1pbmRleDogMTsgfQoKLnRoZW1lLXRvZ2dsZSB7CgogIHdpZHRoOiAzNHB4OwoKICBoZWlnaHQ6IDM0cHg7CgogIGRpc3BsYXk6IGdyaWQ7CgogIHBsYWNlLWl0ZW1zOiBjZW50ZXI7CgogIHBhZGRpbmc6IDA7CgogIGJvcmRlci1jb2xvcjogdmFyKC0tYm9yZGVyKTsKCiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZSk7CgogIGNvbG9yOiB2YXIoLS1hbWJlcik7Cgp9CgoudGhlbWUtdG9nZ2xlOmhvdmVyIHsgY29sb3I6IHZhcigtLWN5YW4pOyBib3JkZXItY29sb3I6IHZhcigtLWN5YW4pOyB9CgoudGhlbWUtdG9nZ2xlOmZvY3VzLXZpc2libGUgeyBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tY3lhbik7IG91dGxpbmUtb2Zmc2V0OiAzcHg7IH0KCi50aGVtZS1pY29uIHsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsgZmlsbDogbm9uZTsgc3Ryb2tlOiBjdXJyZW50Q29sb3I7IHN0cm9rZS13aWR0aDogMS43OyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IH0KCi50aGVtZS1pY29uLW1vb24geyBkaXNwbGF5OiBub25lOyB9Cgpib2R5W2RhdGEtdGhlbWU9ImxpZ2h0Il0gLnRoZW1lLWljb24tc3VuIHsgZGlzcGxheTogbm9uZTsgfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIC50aGVtZS1pY29uLW1vb24geyBkaXNwbGF5OiBibG9jazsgfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIC5hbGJ1bS1hcnQgewoKICBib3JkZXItY29sb3I6ICNjNWQwYzY7CgogIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDUwJSwgIzkzNjQ3YTMzIDAgMiUsIHRyYW5zcGFyZW50IDMlKSwgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA1MCUgNTAlLCAjNjY4MTZhIDAgMiUsIHRyYW5zcGFyZW50IDMlKSwgcmVwZWF0aW5nLXJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDUwJSwgdHJhbnNwYXJlbnQgMCAxNHB4LCAjNDY3NzdlMjQgMTVweCAxNnB4KSwgbGluZWFyLWdyYWRpZW50KDE0NWRlZywgI2RiZTRkYSwgI2U5ZWNlNyA3MiUpOwoKICB0ZXh0LXNoYWRvdzogMCAwIDE4cHggIzQ2Nzc3ZTQ0OwoKfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIC5wbGF5ZXItcGxheSB7CgogIGJvcmRlci1jb2xvcjogI2E5Nzk4ZDsKCiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE0NWRlZywgI2VhZGRlMiwgI2RjZThkZiA3NSUpOwoKICBjb2xvcjogIzgwNTQ2YTsKCiAgYm94LXNoYWRvdzogMCAwIDAgNnB4ICM5MzY0N2ExMiwgMCAwIDI0cHggIzkzNjQ3YTFmOwoKfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIC5wbGF5ZXItcGxheTpob3ZlciB7CgogIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxNDVkZWcsICNlMWNiZDUsICNjYmRlZDAgNzUlKTsKCiAgYm9yZGVyLWNvbG9yOiAjODA1NDZhOwoKICBjb2xvcjogIzU3MzY0YTsKCn0KCmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAudHJhY2stcHJvZ3Jlc3MgeyBiYWNrZ3JvdW5kOiB2YXIoLS1ib3JkZXIpOyB9Cgpib2R5W2RhdGEtdGhlbWU9ImxpZ2h0Il0gLmF1ZGlvLWJ1dHRvbiB7IGJvcmRlci1jb2xvcjogIzlhYWE5YzsgYmFja2dyb3VuZDogI2UzZWJlMzsgY29sb3I6ICM0Zjc1NTY7IH0KCmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAuYXVkaW8tYnV0dG9uOmhvdmVyIHsgYm9yZGVyLWNvbG9yOiAjNjA3ZDY1OyBiYWNrZ3JvdW5kOiAjZDdlM2Q4OyB9Cgpib2R5W2RhdGEtdGhlbWU9ImxpZ2h0Il0gLmF1ZGlvLWJ1dHRvbi5pcy1wbGF5aW5nIHsgYm9yZGVyLWNvbG9yOiAjYTk3OThkOyBiYWNrZ3JvdW5kOiAjZjBlM2U4OyBjb2xvcjogIzgwNTQ2YTsgfQoKYm9keVtkYXRhLXRoZW1lPSJsaWdodCJdIC5wbGF5ZXItY2FyZCB7IGJvcmRlci1jb2xvcjogI2M1ZDBjNjsgYm9yZGVyLXRvcC1jb2xvcjogdmFyKC0tY3lhbik7IH0KCmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAuaW50cm8tc2NyZWVuOjpiZWZvcmUsCgpib2R5W2RhdGEtdGhlbWU9ImxpZ2h0Il0gLmludHJvLXNjcmVlbjo6YWZ0ZXIgeyBvcGFjaXR5OiAuNTU7IH0KCi53aW5kb3ctZG90cyB7IGRpc3BsYXk6IGZsZXg7IGdhcDogNnB4OyB9Cgoud2luZG93LWRvdHMgc3BhbiB7IHdpZHRoOiA4cHg7IGhlaWdodDogOHB4OyBib3JkZXItcmFkaXVzOiA1MCU7IGJhY2tncm91bmQ6ICM1MjYwNTY7IH0KCi53aW5kb3ctZG90cyBzcGFuOmZpcnN0LWNoaWxkIHsgYmFja2dyb3VuZDogI2E3N2Q3NzsgfQoKLndpbmRvdy1kb3RzIHNwYW46bnRoLWNoaWxkKDIpIHsgYmFja2dyb3VuZDogI2E5OWI3NjsgfQoKLndpbmRvdy1kb3RzIHNwYW46bnRoLWNoaWxkKDMpIHsgYmFja2dyb3VuZDogIzdkOWI4MzsgfQoKLmNvbnRlbnQgewoKICBwb3NpdGlvbjogcmVsYXRpdmU7CgogIHBhZGRpbmc6IDE4cHggMThweCA4cHg7CgogIGZsZXg6IDE7CgogIG1pbi1oZWlnaHQ6IDA7CgogIGRpc3BsYXk6IGZsZXg7CgogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CgogIG92ZXJmbG93OiBoaWRkZW47Cgp9CgoucGF0aCB7CgogIGZsZXgtc2hyaW5rOiAwOwoKICBjb2xvcjogdmFyKC0tbXV0ZWQpOwoKICBmb250LXNpemU6IDEycHg7CgogIG1hcmdpbi1ib3R0b206IDE4cHg7CgogIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlOwoKfQoKLnBhdGggLnBhdGgtdXNlciB7IGNvbG9yOiB2YXIoLS1ncmVlbik7IH0KCi5wYXRoIC5wYXRoLWhvbWUgeyBjb2xvcjogdmFyKC0tY3lhbik7IH0KCi5wYXRoIC5wYXRoLXByb21wdCB7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IH0KCi5wYXRoIC5wYXRoLWNvbW1hbmQgeyBjb2xvcjogdmFyKC0tYW1iZXIpOyB9CgoucGF0aCAucGF0aC1maWxlIHsgY29sb3I6IHZhcigtLXZpb2xldCk7IH0KCi5hcmNoaXZlIHsgZmxleC1zaHJpbms6IDA7ICAgY29sb3I6IHZhcigtLWdyZWVuLWRpbSk7IGZvbnQtc2l6ZTogMTFweDsgbGV0dGVyLXNwYWNpbmc6IDEuNXB4OyBtYXJnaW4tYm90dG9tOiA4cHg7IH0KCmgxIHsKCiAgZmxleC1zaHJpbms6IDA7CgogIGNvbG9yOiB2YXIoLS1ncmVlbik7CgogIGZvbnQtc2l6ZTogY2xhbXAoMjFweCwgM3Z3LCAzMnB4KTsKCiAgbGluZS1oZWlnaHQ6IDEuMjsKCiAgbGV0dGVyLXNwYWNpbmc6IDFweDsKCiAgbWFyZ2luOiAwIDAgN3B4OwoKICBmb250LXdlaWdodDogNjAwOwoKfQoKLnN1YnRpdGxlIHsKCiAgZmxleC1zaHJpbms6IDA7CgogIGNvbG9yOiB2YXIoLS1tdXRlZCk7CgogIGZvbnQtc2l6ZTogMTFweDsKCiAgbGV0dGVyLXNwYWNpbmc6IDEuMnB4OwoKICBtYXJnaW4tYm90dG9tOiAyMHB4OwoKfQoKLm91dHB1dCB7CgogIGZsZXg6IDE7CgogIG1pbi1oZWlnaHQ6IDA7CgogIG92ZXJmbG93LXk6IGF1dG87CgogIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDsKCiAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7CgogIGZvbnQtc2l6ZTogY2xhbXAoMTNweCwgMS4xdncsIDE1cHgpOwoKICBsaW5lLWhlaWdodDogMS43OwoKICBsZXR0ZXItc3BhY2luZzogMDsKCiAgY29sb3I6IHZhcigtLXRleHQpOwoKICBwYWRkaW5nLXJpZ2h0OiAxMnB4OwoKICBzY3JvbGxiYXItd2lkdGg6IHRoaW47CgogIHNjcm9sbGJhci1jb2xvcjogdmFyKC0tc2Nyb2xsLXRodW1iKSB0cmFuc3BhcmVudDsKCiAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjsKCiAgc2Nyb2xsLWJlaGF2aW9yOiBhdXRvOwoKfQoKLm91dHB1dDo6LXdlYmtpdC1zY3JvbGxiYXIgeyB3aWR0aDogNXB4OyB9Cgoub3V0cHV0Ojotd2Via2l0LXNjcm9sbGJhci10cmFjayB7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyB9Cgoub3V0cHV0Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7IGJhY2tncm91bmQ6IHZhcigtLXNjcm9sbC10aHVtYik7IGJvcmRlci1yYWRpdXM6IDEwcHg7IH0KCi5vdXRwdXQtbGluZSB7IGRpc3BsYXk6IGlubGluZTsgfQoKLm91dHB1dC1saW5lLnNlY3Rpb24geyBjb2xvcjogdmFyKC0tY3lhbik7IGZvbnQtd2VpZ2h0OiA2MDA7IH0KCi5vdXRwdXQtbGluZS5jb21tYW5kIHsgY29sb3I6IHZhcigtLWdyZWVuKTsgfQoKLm91dHB1dC1saW5lLnN5c3RlbSB7IGNvbG9yOiB2YXIoLS1hbWJlcik7IH0KCi5vdXRwdXQtbGluZS5jbG9zaW5nIHsgY29sb3I6IHZhcigtLXZpb2xldCk7IGZvbnQtd2VpZ2h0OiA2MDA7IH0KCi5vdXRwdXQtbGluZS5pbmZvIHsgY29sb3I6ICM5ZWM5ZmY7IH0KCmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAub3V0cHV0LWxpbmUuaW5mbyB7IGNvbG9yOiAjNDY2YjgzOyB9Cgoub3V0cHV0LWxpbmUud2FybmluZyB7IGNvbG9yOiB2YXIoLS1hbWJlcik7IH0KCi5vdXRwdXQtbGluZS5lcnJvciB7IGNvbG9yOiAjZjA4YjhiOyB9Cgpib2R5W2RhdGEtdGhlbWU9ImxpZ2h0Il0gLm91dHB1dC1saW5lLmVycm9yIHsgY29sb3I6ICM5YjRmNGY7IH0KCi5vdXRwdXQtbGluZS5zYWx1dGF0aW9uIHsgY29sb3I6IHZhcigtLWFtYmVyKTsgfQoKLmN1cnNvciB7CgogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKCiAgY29sb3I6IHZhcigtLWdyZWVuKTsKCiAgZm9udC1zaXplOiAxNXB4OwoKICBmb250LXdlaWdodDogNzAwOwoKICBsaW5lLWhlaWdodDogMTsKCiAgdGV4dC1zaGFkb3c6IDAgMCA3cHggY3VycmVudENvbG9yOwoKICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7CgogIG1hcmdpbi1sZWZ0OiAzcHg7CgogIG9wYWNpdHk6IDE7CgogIGFuaW1hdGlvbjogY3Vyc29yLWJsaW5rIC42NXMgc3RlcHMoMiwgZW5kKSBpbmZpbml0ZTsKCn0KCi5jdXJzb3I6OmJlZm9yZSB7IGNvbnRlbnQ6ICJfIjsgfQoKQGtleWZyYW1lcyBjdXJzb3ItYmxpbmsgewoKICA1MCUgeyBvcGFjaXR5OiAwOyB9Cgp9CgouY29udHJvbHMgewoKICBwb3NpdGlvbjogYWJzb2x1dGU7CgogIHJpZ2h0OiAzMHB4OwoKICBib3R0b206IDE4cHg7CgogIHotaW5kZXg6IDE7CgogIGRpc3BsYXk6IGZsZXg7CgogIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTsKCiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKCiAgZ2FwOiA4cHg7Cgp9CgouY29udHJvbHMtdG9nZ2xlIHsKCiAgZmxleDogMCAwIDM4cHg7CgogIHdpZHRoOiAzOHB4OwoKICBoZWlnaHQ6IDM0cHg7CgogIGRpc3BsYXk6IGdyaWQ7CgogIHBsYWNlLWl0ZW1zOiBjZW50ZXI7CgogIHBhZGRpbmc6IDA7CgogIGJvcmRlci1yYWRpdXM6IDRweDsKCiAgY29sb3I6IHZhcigtLWdyZWVuKTsKCiAgYm94LXNoYWRvdzogMCA0cHggMTRweCAjMDAwMjsKCn0KCi5jb250cm9scy10b2dnbGU6aG92ZXIgeyBjb2xvcjogdmFyKC0tY3lhbik7IH0KCi5jb250cm9scy1wYW5lbCB7CgogIGRpc3BsYXk6IGZsZXg7CgogIGZsZXg6IDAgMSBhdXRvOwoKICBmbGV4LXdyYXA6IHdyYXA7CgogIGFsaWduLWl0ZW1zOiBjZW50ZXI7CgogIGp1c3RpZnktY29udGVudDogY2VudGVyOwoKICBnYXA6IDEwcHg7CgogIHBhZGRpbmc6IDdweCA5cHg7CgogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7CgogIGJhY2tncm91bmQ6IHZhcigtLXBhbmVsKTsKCiAgYm94LXNoYWRvdzogMCA0cHggMTRweCAjMDAwMjsKCn0KCi5jb250cm9scy5pcy1jb2xsYXBzZWQgLmNvbnRyb2xzLXBhbmVsIHsgZGlzcGxheTogbm9uZTsgfQoKLmNvbnRyb2wtZ3JvdXAgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBmbGV4LXdyYXA6IHdyYXA7IGdhcDogOHB4OyB9CgpidXR0b24gewoKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlKTsKCiAgY29sb3I6IHZhcigtLWdyZWVuKTsKCiAgcGFkZGluZzogOHB4IDEycHg7CgogIGZvbnQtZmFtaWx5OiBpbmhlcml0OwoKICBmb250LXNpemU6IDExcHg7CgogIGxldHRlci1zcGFjaW5nOiAuNHB4OwoKICBjdXJzb3I6IHBvaW50ZXI7CgogIHRyYW5zaXRpb246IC4yczsKCn0KCmJ1dHRvbjpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWhvdmVyLWJnKTsgYm9yZGVyLWNvbG9yOiB2YXIoLS1ncmVlbi1kaW0pOyB9CgpidXR0b246ZGlzYWJsZWQgeyBvcGFjaXR5OiAuNTsgY3Vyc29yOiBkZWZhdWx0OyB9CgouYXVkaW8tYnV0dG9uIHsKCiAgd2lkdGg6IDM4cHg7CgogIGhlaWdodDogMzRweDsKCiAgZGlzcGxheTogZ3JpZDsKCiAgcGxhY2UtaXRlbXM6IGNlbnRlcjsKCiAgcGFkZGluZzogMDsKCiAgYm9yZGVyLWNvbG9yOiAjNjQ4YjZhOwoKICBiYWNrZ3JvdW5kOiAjMjAzMTI3OwoKICBjb2xvcjogI2EzZDZhNTsKCn0KCi5hdWRpby1idXR0b246aG92ZXIgeyBib3JkZXItY29sb3I6ICNhM2Q2YTU7IGJhY2tncm91bmQ6ICMyYTQwMzE7IH0KCi5hdWRpby1idXR0b24uaXMtcGxheWluZyB7CgogIGJvcmRlci1jb2xvcjogI2I4NmY5MDsKCiAgYmFja2dyb3VuZDogIzM4MjUzMjsKCiAgY29sb3I6ICNmMGE2YzU7Cgp9CgouYXVkaW8tYnV0dG9uLmlzLXBsYXlpbmc6aG92ZXIgeyBib3JkZXItY29sb3I6ICNmMGE2YzU7IGJhY2tncm91bmQ6ICM0YjMwNDI7IH0KCi5hdWRpby1pY29uIHsKCiAgd2lkdGg6IDA7CgogIGhlaWdodDogMDsKCiAgbWFyZ2luLWxlZnQ6IDNweDsKCiAgYm9yZGVyLXRvcDogN3B4IHNvbGlkIHRyYW5zcGFyZW50OwoKICBib3JkZXItYm90dG9tOiA3cHggc29saWQgdHJhbnNwYXJlbnQ7CgogIGJvcmRlci1sZWZ0OiAxMHB4IHNvbGlkIGN1cnJlbnRDb2xvcjsKCn0KCi5hdWRpby1idXR0b24uaXMtcGxheWluZyAuYXVkaW8taWNvbiB7CgogIHdpZHRoOiAxMHB4OwoKICBoZWlnaHQ6IDE0cHg7CgogIG1hcmdpbi1sZWZ0OiAwOwoKICBib3JkZXI6IDA7CgogIGJvcmRlci1sZWZ0OiAzcHggc29saWQgY3VycmVudENvbG9yOwoKICBib3JkZXItcmlnaHQ6IDNweCBzb2xpZCBjdXJyZW50Q29sb3I7Cgp9Cgoudm9sdW1lLWNvbnRyb2wgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDhweDsgICBjb2xvcjogdmFyKC0tbXV0ZWQpOyBmb250LXNpemU6IDExcHg7IH0KCmlucHV0W3R5cGU9InJhbmdlIl0gewoKICB3aWR0aDogNzhweDsKCiAgaGVpZ2h0OiAxMnB4OwoKICBhcHBlYXJhbmNlOiBub25lOwoKICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsKCiAgY3Vyc29yOiBwb2ludGVyOwoKfQoKaW5wdXRbdHlwZT0icmFuZ2UiXTo6LXdlYmtpdC1zbGlkZXItcnVubmFibGUtdHJhY2sgewoKICBoZWlnaHQ6IDZweDsKCiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTsKCiAgYm9yZGVyLXJhZGl1czogMTBweDsKCiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB2YXIoLS1jeWFuKSwgdmFyKC0tZ3JlZW4pIDM4JSwgdmFyKC0tYW1iZXIpIDcyJSwgdmFyKC0tcGluaykpOwoKfQoKaW5wdXRbdHlwZT0icmFuZ2UiXTo6LW1vei1yYW5nZS10cmFjayB7CgogIGhlaWdodDogNnB4OwoKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOwoKICBib3JkZXItcmFkaXVzOiAxMHB4OwoKICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHZhcigtLWN5YW4pLCB2YXIoLS1ncmVlbikgMzglLCB2YXIoLS1hbWJlcikgNzIlLCB2YXIoLS1waW5rKSk7Cgp9CgppbnB1dFt0eXBlPSJyYW5nZSJdOjotd2Via2l0LXNsaWRlci10aHVtYiB7CgogIGFwcGVhcmFuY2U6IG5vbmU7CgogIHdpZHRoOiAxM3B4OwoKICBoZWlnaHQ6IDEzcHg7CgogIG1hcmdpbi10b3A6IC00cHg7CgogIGJvcmRlcjogMnB4IHNvbGlkICMxODIwMWI7CgogIGJvcmRlci1yYWRpdXM6IDUwJTsKCiAgYmFja2dyb3VuZDogdmFyKC0tcGluayk7CgogIGJveC1zaGFkb3c6IDAgMCA3cHggdmFyKC0tcGluayk7Cgp9CgppbnB1dFt0eXBlPSJyYW5nZSJdOjotbW96LXJhbmdlLXRodW1iIHsKCiAgd2lkdGg6IDEwcHg7CgogIGhlaWdodDogMTBweDsKCiAgYm9yZGVyOiAycHggc29saWQgIzE4MjAxYjsKCiAgYm9yZGVyLXJhZGl1czogNTAlOwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1waW5rKTsKCiAgYm94LXNoYWRvdzogMCAwIDdweCB2YXIoLS1waW5rKTsKCn0KCi5mb290ZXIgewoKICBmbGV4OiAwIDAgYXV0bzsKCiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7CgogIHBhZGRpbmc6IDhweCAxOHB4OwoKICBkaXNwbGF5OiBmbGV4OwoKICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47CgogIGdhcDogMTBweDsKCiAgZmxleC13cmFwOiB3cmFwOwoKICBjb2xvcjogdmFyKC0tbXV0ZWQpOwoKICBmb250LXNpemU6IDEwcHg7CgogIGxldHRlci1zcGFjaW5nOiAuNHB4OwoKICBiYWNrZ3JvdW5kOiB2YXIoLS1oZWFkZXItYmcpOwoKfQoKLmZvb3RlciBzcGFuOmxhc3QtY2hpbGQgeyBjb2xvcjogdmFyKC0tcGluayk7IH0KLmZvb3Rlci1leGl0IHsgYXBwZWFyYW5jZTpub25lOyBib3JkZXI6MDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgY29sb3I6aW5oZXJpdDsgcGFkZGluZzowOyBtYXJnaW46MDsgZm9udDppbmhlcml0OyBsZXR0ZXItc3BhY2luZzppbmhlcml0OyBsaW5lLWhlaWdodDppbmhlcml0OyBjdXJzb3I6cG9pbnRlcjsgdmVydGljYWwtYWxpZ246YmFzZWxpbmU7IH0KLmZvb3Rlci1leGl0OmhvdmVyLC5mb290ZXItZXhpdDpmb2N1cy12aXNpYmxlIHsgY29sb3I6aW5oZXJpdDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgdGV4dC1kZWNvcmF0aW9uOm5vbmU7IG91dGxpbmU6bm9uZTsgfQoKQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7CgogIGJvZHkgeyBwYWRkaW5nOiAwOyB9CgogIC5pbnRyby10aGVtZS10b2dnbGUgeyB0b3A6IDE0cHg7IHJpZ2h0OiAxNHB4OyB9CgogIC5wbGF5ZXItY2FyZCB7IHBhZGRpbmc6IDI0cHggMjBweDsgfQoKICAuYWxidW0tYXJ0IHsgd2lkdGg6IDE2MHB4OyBtYXJnaW46IDE4cHggYXV0bzsgfQoKICAudGVybWluYWwgeyBoZWlnaHQ6IDEwMHZoOyBoZWlnaHQ6IDEwMGR2aDsgYm9yZGVyOiAwOyB9CgogIC50b3BiYXIgeyBmbGV4LWJhc2lzOiA0MnB4OyBwYWRkaW5nOiAwIDEycHg7IGdhcDogOHB4OyB9CgogIC5icmFuZCB7IGZvbnQtc2l6ZTogOXB4OyBsZXR0ZXItc3BhY2luZzogMDsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfQoKICAudG9wYmFyLWFjdGlvbnMgeyBnYXA6IDhweDsgfQoKICAuc3RhdHVzIHsgZm9udC1zaXplOiA5cHg7IH0KCiAgLnRoZW1lLXRvZ2dsZSB7IHdpZHRoOiAzMnB4OyBoZWlnaHQ6IDMycHg7IGZsZXgtc2hyaW5rOiAwOyB9CgogIC5jb250ZW50IHsgcGFkZGluZzogMThweCAxOHB4IDhweDsgfQoKICAucGF0aCB7IGZvbnQtc2l6ZTogMTFweDsgbWFyZ2luLWJvdHRvbTogMTVweDsgfQoKICBoMSB7IGZvbnQtc2l6ZTogMjNweDsgfQoKICAuc3VidGl0bGUgeyBmb250LXNpemU6IDEwcHg7IG1hcmdpbi1ib3R0b206IDE1cHg7IH0KCiAgLm91dHB1dCB7IGZvbnQtc2l6ZTogMTIuNXB4OyBsaW5lLWhlaWdodDogMS43NTsgcGFkZGluZy1yaWdodDogN3B4OyB9CgogIC5jb250cm9scyB7IHJpZ2h0OiAxNnB4OyBib3R0b206IDEycHg7IG1hcmdpbi10b3A6IDA7IHBhZGRpbmctdG9wOiAwOyB9CgogIC5jb250cm9scy10b2dnbGUgeyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiA2MDA7IGxldHRlci1zcGFjaW5nOiAtLjhweDsgfQoKICAuZm9vdGVyIHsgcGFkZGluZzogOHB4IDEycHg7IGZvbnQtc2l6ZTogOXB4OyB9Cgp9CgpAbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkgewoKICAqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHsKCiAgICBhbmltYXRpb24tZHVyYXRpb246IC4wMW1zICFpbXBvcnRhbnQ7CgogICAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjAxbXMgIWltcG9ydGFudDsKCiAgfQoKICAuY3Vyc29yIHsKCiAgICBhbmltYXRpb246IGN1cnNvci1ibGluayAxcyBzdGVwcygyLCBlbmQpIGluZmluaXRlICFpbXBvcnRhbnQ7CgogIH0KCn0KCgoKLyogS09FUk5JQS5ERVYg4oCUIGFyY2hpdmUgdGVybWluYWwgYWxpZ25lZCB3aXRoIHRoZSBCbG9nZ2VyIGhvbWUgdGVybWluYWwgKi8KOnJvb3QgewogIC0tYmc6IzE3MWMxYzsKICAtLXBhbmVsOiMyMDI4Mjc7CiAgLS1zdXJmYWNlOiMyNTJmMmQ7CiAgLS1ib3JkZXI6cmdiYSgxOTAsMjA1LDE5MCwuMTMpOwogIC0tdGV4dDojZTdlNmRjOwogIC0tbXV0ZWQ6I2E3YWZhNjsKICAtLWdyZWVuOiNhOWJlYTY7CiAgLS1ncmVlbi1kaW06Izg0OWY4YzsKICAtLWN5YW46IzlhYWZiZDsKICAtLWFtYmVyOiNkMGI1OGM7CiAgLS12aW9sZXQ6I2I1YTRjZjsKICAtLXBpbms6I2Q2YTViNTsKICAtLWhlYWRlci1iZzpsaW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgxODEsMTY0LDIwNywuMTApLHJnYmEoMTQ1LDE5OSwxODAsLjA3KSxyZ2JhKDIxNCwxNjUsMTgxLC4wNikpOwogIC0tY2FyZC1iZzpyZ2JhKDMyLDQwLDM5LC45Mik7CiAgLS1zY3JvbGwtdGh1bWI6cmdiYSgxNjksMTkwLDE2NiwuMzUpOwogIC0taG92ZXItYmc6cmdiYSgxNjksMTkwLDE2NiwuMTgpOwp9CmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSB7CiAgLS1iZzojZWRmMWVjOwogIC0tcGFuZWw6I2ZmZjsKICAtLXN1cmZhY2U6I2Y1ZjhmNTsKICAtLWJvcmRlcjpyZ2JhKDM4LDU4LDQ0LC4yMik7CiAgLS10ZXh0OiMyMDJkMjU7CiAgLS1tdXRlZDojNDY1NjRhOwogIC0tZ3JlZW46IzQxNjg0ZTsKICAtLWdyZWVuLWRpbTojNGI3MDRmOwogIC0tY3lhbjojMzQ1ZTc4OwogIC0tYW1iZXI6IzgwNTUxYzsKICAtLXZpb2xldDojNjI0Yjg3OwogIC0tcGluazojOTE0YzY4OwogIC0taGVhZGVyLWJnOmxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDk4LDc1LDEzNSwuMDgpLHJnYmEoNTAsMTA4LDg0LC4wOCkscmdiYSgxNDUsNzYsMTA0LC4wNikpOwogIC0tY2FyZC1iZzojZmZmOwogIC0tc2Nyb2xsLXRodW1iOiNhNWIwYTc7CiAgLS1ob3Zlci1iZzojZTVlZWU2Owp9Cmh0bWwsYm9keSxidXR0b24saW5wdXQsdGV4dGFyZWEsc2VsZWN0IHsKICBmb250LWZhbWlseTonSmV0QnJhaW5zIE1vbm8nLCdGaXJhIENvZGUnLCdDYXNjYWRpYSBDb2RlJyx1aS1tb25vc3BhY2UsU0ZNb25vLVJlZ3VsYXIsTWVubG8sQ29uc29sYXMsJ0xpYmVyYXRpb24gTW9ubycsbW9ub3NwYWNlOwp9CmJvZHkgeyBiYWNrZ3JvdW5kOnZhcigtLWJnKTsgY29sb3I6dmFyKC0tdGV4dCk7IH0KLnRlcm1pbmFsIHsKICBtYXgtd2lkdGg6MTAwJTsKICAvKiBEZXNrdG9wOiByZXNwZWN0IHRoZSAxOHB4IGJvZHkgaW5zZXQgc28gdGhlIGZvb3RlciBzdGF5cyBpbnNpZGUgdGhlIHZpZXdwb3J0LiAqLwogIGhlaWdodDpjYWxjKDEwMHZoIC0gMzZweCk7CiAgaGVpZ2h0OmNhbGMoMTAwZHZoIC0gMzZweCk7CiAgbWFyZ2luOjAgYXV0bzsKICBib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7CiAgYm9yZGVyLXJhZGl1czoxMnB4OwogIGJhY2tncm91bmQ6cmdiYSgzMiw0MCwzOSwuOTIpOwogIGJveC1zaGFkb3c6MCAyNXB4IDcwcHggcmdiYSgwLDAsMCwuMjgpOwp9CmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAudGVybWluYWwgeyBiYWNrZ3JvdW5kOiNmZmY7IH0KLnRvcGJhciB7CiAgYmFja2dyb3VuZDp2YXIoLS1oZWFkZXItYmcpOwogIGJvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Cn0KLmJyYW5kIHsgY29sb3I6dmFyKC0tZ3JlZW4pOyBmb250LWZhbWlseTppbmhlcml0OyB9Ci5zdGF0dXMgeyBjb2xvcjp2YXIoLS1ncmVlbi1kaW0pOyB9Ci5jb250ZW50IHsgYmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTQsMjAsMjAsLjI4KSxyZ2JhKDM0LDQzLDQ4LC4xNikpOyB9CmJvZHlbZGF0YS10aGVtZT0ibGlnaHQiXSAuY29udGVudCB7IGJhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZjVmOGY1LCNmZmYpOyB9Ci5wYXRoIHsgY29sb3I6dmFyKC0tbXV0ZWQpOyBmb250LWZhbWlseTppbmhlcml0OyB9Ci5wYXRoIC5wYXRoLXVzZXIsLm91dHB1dC1saW5lLmNvbW1hbmQgeyBjb2xvcjp2YXIoLS1ncmVlbik7IH0KLnBhdGggLnBhdGgtaG9tZSwub3V0cHV0LWxpbmUuc2VjdGlvbiB7IGNvbG9yOnZhcigtLWN5YW4pOyB9Ci5wYXRoIC5wYXRoLWNvbW1hbmQsLm91dHB1dC1saW5lLnN5c3RlbSwub3V0cHV0LWxpbmUud2FybmluZywub3V0cHV0LWxpbmUuc2FsdXRhdGlvbiB7IGNvbG9yOnZhcigtLWFtYmVyKTsgfQoucGF0aCAucGF0aC1maWxlLC5vdXRwdXQtbGluZS5jbG9zaW5nIHsgY29sb3I6dmFyKC0tdmlvbGV0KTsgfQouYXJjaGl2ZSB7IGNvbG9yOnZhcigtLWdyZWVuLWRpbSk7IH0KaDEgeyBjb2xvcjp2YXIoLS1ncmVlbik7IGZvbnQtZmFtaWx5OmluaGVyaXQ7IH0KLnN1YnRpdGxlIHsgY29sb3I6dmFyKC0tbXV0ZWQpOyB9Ci5vdXRwdXQgewogIGNvbG9yOnZhcigtLW11dGVkKTsKICBmb250LWZhbWlseTppbmhlcml0OwogIGZvbnQtc2l6ZToxMi41cHg7CiAgbGluZS1oZWlnaHQ6MS43NTsKICBsZXR0ZXItc3BhY2luZzowOwogIHNjcm9sbGJhci1jb2xvcjp2YXIoLS1zY3JvbGwtdGh1bWIpIHRyYW5zcGFyZW50Owp9Ci5vdXRwdXQtbGluZS5pbmZvIHsgY29sb3I6dmFyKC0tY3lhbik7IH0KLm91dHB1dC1saW5lLmVycm9yIHsgY29sb3I6dmFyKC0tcGluayk7IH0KLmN1cnNvciB7IGNvbG9yOnZhcigtLWFtYmVyKTsgdGV4dC1zaGFkb3c6MCAwIDdweCBjdXJyZW50Q29sb3I7IH0KLndpbmRvdy1kb3RzIHNwYW4geyBiYWNrZ3JvdW5kOiM5MWM3YTU7IH0KLndpbmRvdy1kb3RzIHNwYW46Zmlyc3QtY2hpbGQgeyBiYWNrZ3JvdW5kOiNlMjhiODI7IH0KLndpbmRvdy1kb3RzIHNwYW46bnRoLWNoaWxkKDIpIHsgYmFja2dyb3VuZDojZTRiZDc1OyB9CmJ1dHRvbiB7IGZvbnQtZmFtaWx5OmluaGVyaXQ7IH0KQG1lZGlhKG1heC13aWR0aDo3MDBweCkgewogIC50ZXJtaW5hbCB7IGJvcmRlcjowOyBib3JkZXItcmFkaXVzOjA7IGhlaWdodDoxMDB2aDsgaGVpZ2h0OjEwMGR2aDsgfQogIC5jb250ZW50IHsgcGFkZGluZzoxOHB4IDE2cHggMTJweDsgfQogIC5vdXRwdXQgeyBmb250LXNpemU6MTJweDsgfQp9Cgo8L3N0eWxlPgoKCjxzdHlsZSBpZD0ia3JBcmNoaXZlUHJvdGVjdGlvbiI+Cmh0bWwsYm9keSwqey13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lIWltcG9ydGFudDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50O3VzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50fQppbnB1dCx0ZXh0YXJlYSxbY29udGVudGVkaXRhYmxlPSJ0cnVlIl17LXdlYmtpdC11c2VyLXNlbGVjdDp0ZXh0IWltcG9ydGFudDt1c2VyLXNlbGVjdDp0ZXh0IWltcG9ydGFudH0KPC9zdHlsZT4KCjwvaGVhZD4KCjxib2R5PgoKPHNlY3Rpb24gY2xhc3M9ImludHJvLXNjcmVlbiIgaWQ9ImludHJvU2NyZWVuIiBhcmlhLWxhYmVsPSJQZW11dGFyIG11c2lrIj4KCiAgPGJ1dHRvbiBjbGFzcz0idGhlbWUtdG9nZ2xlIGludHJvLXRoZW1lLXRvZ2dsZSIgdHlwZT0iYnV0dG9uIiBhcmlhLWxhYmVsPSJBa3RpZmthbiBtb2RlIHRlcmFuZyIgdGl0bGU9IkFrdGlma2FuIG1vZGUgdGVyYW5nIj4KCiAgICA8c3ZnIGNsYXNzPSJ0aGVtZS1pY29uIHRoZW1lLWljb24tc3VuIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIj4KCiAgICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiPjwvY2lyY2xlPgoKICAgICAgPHBhdGggZD0iTTEyIDJ2Mm0wIDE2djJNNC45MyA0LjkzbDEuNDIgMS40Mm0xMS4zIDExLjMgMS40MiAxLjQyTTIgMTJoMm0xNiAwaDJNNC45MyAxOS4wN2wxLjQyLTEuNDJtMTEuMy0xMS4zIDEuNDItMS40MiI+PC9wYXRoPgoKICAgIDwvc3ZnPgoKICAgIDxzdmcgY2xhc3M9InRoZW1lLWljb24gdGhlbWUtaWNvbi1tb29uIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIj4KCiAgICAgIDxwYXRoIGQ9Ik0yMC4yIDE1LjFBOC42IDguNiAwIDAgMSA4LjkgMy44IDguNyA4LjcgMCAxIDAgMjAuMiAxNS4xWiI+PC9wYXRoPgoKICAgIDwvc3ZnPgoKICA8L2J1dHRvbj4KCiAgPGRpdiBjbGFzcz0icGxheWVyLWNhcmQiIGlkPSJwbGF5ZXJDYXJkIj4KCiAgICA8ZGl2IGNsYXNzPSJwbGF5ZXItbGFiZWwiPktPRVJOSUEuREVWIC8vIEFVRElPIEFSQ0hJVkU8L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJhbGJ1bS1hcnQiIGFyaWEtaGlkZGVuPSJ0cnVlIj4mZ3Q7XzwvZGl2PgoKICAgIDxoMT5BRlRFUiBUSEUgTEFTVCBQQUNLRVQ8L2gxPgoKICAgIDxwIGNsYXNzPSJ0cmFjay1zdWJ0aXRsZSI+U2FkbmVzcyBhbmQgU29ycm93IOKAlCBQaWFubyBWZXJzaW9uPC9wPgoKICAgIDxkaXYgY2xhc3M9InRyYWNrLW1ldGEiPjxzcGFuPkFSQ0hJVkUgVFJBQ0sgMDAxPC9zcGFuPjxzcGFuPjA0OjE3IC8vIExPU1NMRVNTPC9zcGFuPjwvZGl2PgoKICAgIDxkaXYgY2xhc3M9InRyYWNrLXByb2dyZXNzIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHNwYW4+PC9zcGFuPjwvZGl2PgoKICAgIDxidXR0b24gaWQ9InN0YXJ0QnV0dG9uIiBjbGFzcz0icGxheWVyLXBsYXkiIHR5cGU9ImJ1dHRvbiIgYXJpYS1sYWJlbD0iUHV0YXIgbXVzaWsgZGFuIGJ1a2EgdGVybWluYWwiIHRpdGxlPSJQdXRhciBtdXNpayI+CgogICAgICA8c3BhbiBjbGFzcz0iYXVkaW8taWNvbiIgYXJpYS1oaWRkZW49InRydWUiPjwvc3Bhbj4KCiAgICA8L2J1dHRvbj4KCiAgICA8ZGl2IGNsYXNzPSJwbGF5ZXItZXF1YWxpemVyIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjwvZGl2PgoKICAgIDxwIGNsYXNzPSJwbGF5ZXItaGludCIgaWQ9InBsYXllckhpbnQiPlRFS0FOIFBMQVkgVU5UVUsgTUVNVUxBSSBUUkFOU01JU0k8L3A+CgogIDwvZGl2PgoKPC9zZWN0aW9uPgoKPGRpdiBjbGFzcz0idGVybWluYWwiIGlkPSJ0ZXJtaW5hbCIgaGlkZGVuPgoKICA8aGVhZGVyIGNsYXNzPSJ0b3BiYXIiPgoKICAgIDxkaXYgY2xhc3M9IndpbmRvdy1kb3RzIj48c3Bhbj48L3NwYW4+PHNwYW4+PC9zcGFuPjxzcGFuPjwvc3Bhbj48L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJicmFuZCI+S09FUk5JQS5ERVYgLy8gUFJJVkFURSBDT05TT0xFPC9kaXY+CgogICAgPGRpdiBjbGFzcz0idG9wYmFyLWFjdGlvbnMiPgoKICAgICAgPGRpdiBjbGFzcz0ic3RhdHVzIj5BUkNISVZFRDwvZGl2PgoKICAgICAgPGJ1dHRvbiBpZD0idGhlbWVUb2dnbGUiIGNsYXNzPSJ0aGVtZS10b2dnbGUiIHR5cGU9ImJ1dHRvbiIgYXJpYS1sYWJlbD0iQWt0aWZrYW4gbW9kZSB0ZXJhbmciIHRpdGxlPSJBa3RpZmthbiBtb2RlIHRlcmFuZyI+CgogICAgICAgIDxzdmcgY2xhc3M9InRoZW1lLWljb24gdGhlbWUtaWNvbi1zdW4iIHZpZXdCb3g9IjAgMCAyNCAyNCIgYXJpYS1oaWRkZW49InRydWUiIGZvY3VzYWJsZT0iZmFsc2UiPgoKICAgICAgICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiPjwvY2lyY2xlPgoKICAgICAgICAgIDxwYXRoIGQ9Ik0xMiAydjJtMCAxNnYyTTQuOTMgNC45M2wxLjQyIDEuNDJtMTEuMyAxMS4zIDEuNDIgMS40Mk0yIDEyaDJtMTYgMGgyTTQuOTMgMTkuMDdsMS40Mi0xLjQybTExLjMtMTEuMyAxLjQyLTEuNDIiPjwvcGF0aD4KCiAgICAgICAgPC9zdmc+CgogICAgICAgIDxzdmcgY2xhc3M9InRoZW1lLWljb24gdGhlbWUtaWNvbi1tb29uIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIj4KCiAgICAgICAgICA8cGF0aCBkPSJNMjAuMiAxNS4xQTguNiA4LjYgMCAwIDEgOC45IDMuOCA4LjcgOC43IDAgMSAwIDIwLjIgMTUuMVoiPjwvcGF0aD4KCiAgICAgICAgPC9zdmc+CgogICAgICA8L2J1dHRvbj4KCiAgICA8L2Rpdj4KCiAgPC9oZWFkZXI+CgoKCiAgPG1haW4gY2xhc3M9ImNvbnRlbnQiPgoKICAgIDxkaXYgY2xhc3M9InBhdGgiPjxzcGFuIGNsYXNzPSJwYXRoLXVzZXIiPnJvb3RAa29lcm5pYS5kZXY8L3NwYW4+OjxzcGFuIGNsYXNzPSJwYXRoLWhvbWUiPn48L3NwYW4+PHNwYW4gY2xhc3M9InBhdGgtcHJvbXB0Ij4kPC9zcGFuPiA8c3BhbiBjbGFzcz0icGF0aC1jb21tYW5kIj5jYXQ8L3NwYW4+IDxzcGFuIGNsYXNzPSJwYXRoLWZpbGUiPi9kZXYvaGVhcnQvbGFzdF9tZXNzYWdlLnR4dDwvc3Bhbj48L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJhcmNoaXZlIj4jIEFSQ0hJVkUgLy8gVFJBTlNNSVNTSU9OIDAwMTwvZGl2PgoKICAgIDxoMT5BRlRFUiBUSEUgTEFTVCBQQUNLRVQ8L2gxPgoKICAgIDxkaXYgY2xhc3M9InN1YnRpdGxlIj5BIFRSQU5TTUlTU0lPTiBUSEFUIFdBUyBORVZFUiBTRU5UPC9kaXY+CgogICAgPGRpdiBpZD0ib3V0cHV0IiBjbGFzcz0ib3V0cHV0IiBhcmlhLWxpdmU9InBvbGl0ZSI+PHNwYW4gaWQ9ImN1cnNvciIgY2xhc3M9ImN1cnNvciIgYXJpYS1oaWRkZW49InRydWUiPjwvc3Bhbj48L2Rpdj4KCgoKICAgIDxkaXYgY2xhc3M9ImNvbnRyb2xzIGlzLWNvbGxhcHNlZCIgaWQ9ImF1ZGlvQ29udHJvbHMiPgoKICAgICAgPGJ1dHRvbiBpZD0iY29udHJvbHNUb2dnbGUiIGNsYXNzPSJjb250cm9scy10b2dnbGUiIHR5cGU9ImJ1dHRvbiIgYXJpYS1sYWJlbD0iVGFtcGlsa2FuIGtvbnRyb2wgYXVkaW8iIHRpdGxlPSJUYW1waWxrYW4ga29udHJvbCBhdWRpbyIgYXJpYS1leHBhbmRlZD0iZmFsc2UiIGFyaWEtY29udHJvbHM9ImNvbnRyb2xzUGFuZWwiPi8mZ3Q7PC9idXR0b24+CgogICAgICA8ZGl2IGNsYXNzPSJjb250cm9scy1wYW5lbCIgaWQ9ImNvbnRyb2xzUGFuZWwiIGhpZGRlbj4KCiAgICAgICAgPGRpdiBjbGFzcz0iY29udHJvbC1ncm91cCI+CgogICAgICAgICAgPGJ1dHRvbiBpZD0iYXVkaW9CdXR0b24iIGNsYXNzPSJhdWRpby1idXR0b24iIHR5cGU9ImJ1dHRvbiIgYXJpYS1sYWJlbD0iUHV0YXIgYXVkaW8iIHRpdGxlPSJQdXRhciBhdWRpbyI+CgogICAgICAgICAgICA8c3BhbiBjbGFzcz0iYXVkaW8taWNvbiIgYXJpYS1oaWRkZW49InRydWUiPjwvc3Bhbj4KCiAgICAgICAgICA8L2J1dHRvbj4KCiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXYgY2xhc3M9InZvbHVtZS1jb250cm9sIj4KCiAgICAgICAgICA8c3Bhbj5WT0w8L3NwYW4+CgogICAgICAgICAgPGlucHV0IHR5cGU9InJhbmdlIiBpZD0idm9sdW1lU2xpZGVyIiBtaW49IjAiIG1heD0iMTAwIiB2YWx1ZT0iMTAwIiBhcmlhLWxhYmVsPSJWb2x1bWUiPgoKICAgICAgICAgIDxzcGFuIGlkPSJ2b2x1bWVWYWx1ZSI+MTAwJTwvc3Bhbj4KCiAgICAgICAgPC9kaXY+CgogICAgICA8L2Rpdj4KCiAgICA8L2Rpdj4KCiAgPC9tYWluPgoKCgogIDxmb290ZXIgY2xhc3M9ImZvb3RlciI+CgogICAgPHNwYW4+S09FUk5JQS5ERVYgLy8gUEVSU09OQUwgQVJDSElWRTwvc3Bhbj4KCiAgICA8c3Bhbj5DT05ORUNUSU9OOiA8YnV0dG9uIGNsYXNzPSJmb290ZXItZXhpdCIgaWQ9ImFyY2hpdmVFeGl0IiB0eXBlPSJidXR0b24iIGFyaWEtbGFiZWw9IkV4aXQgLyB0dXR1cCBoYWxhbWFuIGFyc2lwIj5DTE9TRUQ8L2J1dHRvbj48L3NwYW4+CgogIDwvZm9vdGVyPgoKPC9kaXY+CgoKCjxhdWRpbyBpZD0iYmFja2dyb3VuZEF1ZGlvIiBwcmVsb2FkPSJhdXRvIj48L2F1ZGlvPgoKCgo8c2NyaXB0PgoKLyogQVVESU8gQ09ORklHVVJBVElPTiAqLwoKLy8gSXNpIHNyYyBkZW5nYW4gVVJMIE1QMyBwaWxpaGFubXUgbmFudGkuCgpjb25zdCBBVURJT19DT05GSUcgPSB7CgogIHNyYzogImh0dHBzOi8vY3MxLm1wMy5wbS9kb3dubG9hZC8zOTM4NzU5OS9VSEUxUkVKbGNtZDZkRlJoVDBOSFJHbzBaV2huTTIweFdHOXhkSHBJYjAwNE9WQkpOeTlLWlZoUVV6QjZNM2hTTW5WYU1VWjFRamRJWjFkRGVVOHJMM2RpYmtoVE9WaHBZM1p3V0ZobmNUWTNSazExVERWdk1pOU5kMnhpVlUxNWQwSnRhRzFTVWxwSk5pOVZRakpOUTBkU1ZXNUZSVkp0VDJKd1FUbFRVRGMvVG9zaGlyb19NYXN1ZGFfLV9TYWRuZXNzX2FuZF9zb3Jyb3dfcGlhbm9fdmVyc2lvbl8obXAzLnBtKS5tcDMiLAoKICB2b2x1bWU6IDEuMDAsCgogIGxvb3A6IHRydWUsCgogIGF1dG9wbGF5OiBmYWxzZQoKfTsKCgoKLyogVFlQRVdSSVRFUiBDT05GSUdVUkFUSU9OICovCgpjb25zdCBUWVBFX0NPTkZJRyA9IHsKCiAgc3BlZWQ6IDM2Cgp9OwoKCgovKiBMT0cgVEVSTUlOQUwgLy8gT1VUUFVUIEFSU0lQICovCgovKiBOQVNLQUggQVNMSSAtIDcgQkFHSUFOICovCgpjb25zdCBUUkFOU01JU1NJT04gPSBgMDEgLy8gVEhFIExBU1QgSEFORFNIQUtFCgpEYWh1bHUsIHNldGlhcCBwYWdpIHNlbGFsdSBhZGEgcGFrZXQKCnlhbmcga3V0dW5nZ3UgdGliYSBkaSBpbnRlcmZhY2UuCgoKClNlYnVhaCBub3RpZmlrYXNpIHNlZGVyaGFuYSwKCnNlYnVhaCByZXNwb25zIHNpbmdrYXQsCgphdGF1IHNla2FkYXIgdGFuZGEgYmFod2EKCnJlbW90ZSBob3N0IG1hc2loIGJlcmFkYSBkaSBzYW5hLgoKCgpBa3UgdGlkYWsgcGVybmFoIG1lbWludGEgYmFuZHdpZHRoIHlhbmcgYmVzYXIuCgpUaWRhayBwdWxhIG1lbWJ1dHVoa2FuIGtvbmVrc2kgYmVya2VjZXBhdGFuIHRpbmdnaS4KCgoKU2ViYWIgdGVya2FkYW5nLAoKc2F0dSBieXRlIGRhcmltdSBzdWRhaCBjdWt1cAoKdW50dWsgbWVtYnVhdCBzZWx1cnVoIHNpc3RlbSB0ZXJhc2EgaGlkdXAuCgpTYW1wYWkgc3VhdHUgaGFyaSwKCmhhbmRzaGFrZSB0ZXJha2hpciBpdHUgdGVyamFkaS4KCgoKVGFucGEgZXJyb3IuCgpUYW5wYSByZXRyYW5zbWlzc2lvbi4KClRhbnBhIHBlc2FuIHBlcnBpc2FoYW4uCgpIYW55YSBzZWJ1YWgga29uZWtzaQoKeWFuZyB0aWRhayBwZXJuYWgga2VtYmFsaSBlc3RhYmxpc2hlZC4KCgoKCgowMiAvLyBFTVBUWSBESVJFQ1RPUlkKCkFrdSBtYXNpaCBtZW55aW1wYW4gZGlyZWt0b3JpIGxhbWEgaXR1LgoKCgpCdWthbiBrYXJlbmEgbHVwYSBtZW5naGFwdXNueWEsCgp0ZXRhcGkga2FyZW5hIGRpIGRhbGFtbnlhCgphZGEgc3RydWt0dXIgeWFuZyBwZXJuYWgga2l0YSBiYW5ndW4gYmVyc2FtYS4KCgoKQmViZXJhcGEgZmlsZSBtdW5na2luIHN1ZGFoIHRpZGFrIGJlcmd1bmEuCgpCZWJlcmFwYSBtZXRhZGF0YSB0ZWxhaCBrZWhpbGFuZ2FuIGtvbnRla3MuCgpEYW4gc2ViYWdpYW4gYmVzYXIgaXNpbnlhCgp0YWsgbGFnaSBkYXBhdCBkaWJ1a2Egb2xlaCBzaXN0ZW0gc2VrYXJhbmcuCgoKCk5hbXVuIGFrdSBiZWx1bSB0ZWdhIG1lbGFrdWthbiBmb3JtYXQuCgpMdWN1LCBidWthbj8KCgoKU2VidWFoIGFkbWluaXN0cmF0b3IgeWFuZyB0ZXJiaWFzYQoKbWVuZ2hhcHVzIGZpbGUgdGlkYWsgdGVycGFrYWksCgpqdXN0cnUgbWVtYmlhcmthbiBzYXR1IGRpcmVrdG9yaQoKdGV0YXAgYmVyYWRhIGRpIHNhbmEgdGFucGEgdHVqdWFuLgoKCgpNdW5na2luIGthcmVuYSB0aWRhayBzZW11YSBkYXRhCgpoYXJ1cyBtZW1pbGlraSBmdW5nc2kKCmFnYXIgdGV0YXAgZGlhbmdnYXAgYmVyaGFyZ2EuCgoKCgoKMDMgLy8gTEFURU5DWSBPRiBNRU1PUklFUwoKQWRhIGthbGFueWEgYWt1IG1hc2loIG1lbWJ1a2EgdGVybWluYWwKCmhhbnlhIHVudHVrIG1lbWVyaWtzYSB0aW1lc3RhbXAgbGFtYS4KCgoKQnVrYW4gdW50dWsgbWVuY2FyaSBwZXJ1YmFoYW4sCgpidWthbiB1bnR1ayBtZW51bmdndSByZXNwb25zLgoKCgpBa3UgaGFueWEgaW5naW4gdGFodQoKa2FwYW4gdGVyYWtoaXIga2FsaQoKZHVhIHNpc3RlbSBpdHUgc2FsaW5nIGJlcnR1a2FyIGRhdGEuCgoKCldha3R1IGJlcmphbGFuLAoKc2VydmVyIGJlcmdhbnRpLAoKcHJvdG9rb2wgZGlwZXJiYXJ1aS4KCgoKVGV0YXBpIGFkYSBiZWJlcmFwYSB0aW1lc3RhbXAKCnlhbmcgcmFzYW55YSB0aWRhayBwZXJuYWggYmVuYXItYmVuYXIgbWVuamFkaSBtYXNhIGxhbHUuCgoKClNlb2xhaC1vbGFoIGphbSBzaXN0ZW0gdGVydXMgYmVyamFsYW4sCgpzZW1lbnRhcmEgc2F0dSBiYWdpYW4ga2VjaWwgZGFyaSBkaXJpa3UKCm1hc2loIGJlcmFkYSBkaSB3YWt0dSB5YW5nIHNhbWEuCgoKCgoKMDQgLy8gVU5ERUxJVkVSRUQgTUVTU0FHRQoKQWRhIHBlc2FuIHlhbmcga3V0dWxpcyBiZXJrYWxpLWthbGkuCgoKCkt1c2ltcGFuIGRhbGFtIGRyYWZ0LAoKa3ViZXJpIG5hbWEgZGVuZ2FuIHRhbmdnYWwsCgpsYWx1IGt1cGluZGFoa2FuIGtlIGRpcmVrdG9yaSB0ZXJzZW1idW55aS4KCgoKVGlkYWsgcGVybmFoIG1hc3VrIG91dGdvaW5nIHF1ZXVlLgoKVGlkYWsgcGVybmFoIG1lbGV3YXRpIGdhdGV3YXkuCgpCYWhrYW4gdGlkYWsgcGVybmFoIG1lbWlsaWtpIGRlbGl2ZXJ5IHN0YXR1cy4KCgoKTXVuZ2tpbiBidWthbiBrYXJlbmEgYWt1IHRhayBwdW55YSBzZXN1YXR1IHVudHVrIGRpa2F0YWthbi4KCgoKSGFueWEgc2FqYSwKCmFrdSBtdWxhaSBtZW1haGFtaQoKYmFod2EgdGlkYWsgc2V0aWFwIHBlc2FuCgptZW1idXR1aGthbiBwZW5lcmltYS4KCgoKQmViZXJhcGEgY3VrdXAgbWVuamFkaSBidWt0aQoKYmFod2EgcGFkYSBzdWF0dSB3YWt0dSwKCnBlcm5haCBhZGEgc2VzZW9yYW5nCgp5YW5nIGJlZ2l0dSBpbmdpbiBtZW55YW1wYWlrYW4gc2VzdWF0dS4KCgoKCgowNSAvLyBUSEUgT0xEIFZFUlNJT04KCgoKSmlrYSBzdWF0dSBoYXJpIGthdSBtZW5lbXVrYW4KCmJhY2t1cCBkYXJpIHNpc3RlbSB5YW5nIGxhbWEsCgptdW5na2luIGthdSBha2FuIG1lbGloYXQKCmJldGFwYSBzZWRlcmhhbmFueWEga29uZmlndXJhc2kgc2FhdCBpdHUuCgoKCkJlbHVtIGJhbnlhayBmaXJld2FsbC4KCkJlbHVtIGJhbnlhayBhdXRlbnRpa2FzaS4KCkJlbHVtIGFkYSBlbmtyaXBzaSBiZXJsYXBpcy4KCgoKU2VtdWFueWEgYmVyamFsYW4KCmRlbmdhbiBrZXBlcmNheWFhbiB5YW5nIHNlZGVyaGFuYS4KCgoKS2luaSBzaXN0ZW0gdGVsYWggamF1aCBsZWJpaCBhbWFuLAoKbGViaWggc3RhYmlsLAoKZGFuIGxlYmloIG1hdGFuZy4KCgoKSGFueWEgc2FqYSwKCnZlcnNpIHlhbmcgc2VrYXJhbmcKCnRpZGFrIGxhZ2kgbWVuZ2VuYWwgYmViZXJhcGEgaGFsCgp5YW5nIGRhaHVsdSB0ZXJhc2EgYmVnaXR1IGJpYXNhLgoKCgpEYW4gYWt1IHRpZGFrIHRhaHUKCmFwYWthaCBpdHUgc2VidWFoIGtlbWFqdWFuCgphdGF1IHNla2FkYXIgaGFyZ2EgZGFyaSBwZXJ1YmFoYW4uCgoKCgoKMDYgLy8gR1JBQ0VGVUwgU0hVVERPV04KCk1hbGFtIGluaSBha3UgbWVtdXR1c2thbgoKdW50dWsgdGlkYWsgbGFnaSBtZW5naXJpbSByZXF1ZXN0LgoKCgpCdWthbiBrYXJlbmEgaG9zdCB0dWp1YW4gdGlkYWsgdGVyc2VkaWEsCgpidWthbiBwdWxhIGthcmVuYSBha3Uga2VoaWxhbmdhbiBha3Nlcy4KCgoKQWt1IGhhbnlhIGluZ2luIG1lbWJpYXJrYW4gamFyaW5nYW4KCmJlcmphbGFuIHRhbnBhIGhhcnVzIG1lbnVuZ2d1CgpzYXR1IGFsYW1hdCB5YW5nIHNhbWEuCgoKCk11bmdraW4gc3VhdHUgaGFyaSBuYW50aSwKCmtldGlrYSBsb2cgaW5pIGRpYmFjYSBrZW1iYWxpLAoKYWt1IHRpZGFrIGxhZ2kgbWVuZ2luZ2F0CgpiZXJhcGEgbGFtYSBrb25la3NpIGl0dSBiZXJ0YWhhbi4KCgoKQWt1IGhhbnlhIGFrYW4gdGFodQoKYmFod2EgcGVybmFoIGFkYSBzYXR1IHNlc2kKCnlhbmcgbWVtYnVhdGt1IGVuZ2dhbiBtZW5la2FuIHRvbWJvbCBkaXNjb25uZWN0LgoKCgoKCjA3IC8vIExBU1QgVFJBTlNNSVNTSU9OCgpVbnR1a211LAoKCgp5YW5nIG11bmdraW4gc3VkYWggbGFtYQoKdGlkYWsgcGVybmFoIG1lbWJhY2EgbG9nIGluaS4KCgoKVGlkYWsgYWRhIGxhZ2kgcmVxdWVzdCB5YW5nIGt1a2lyaW0uCgpUaWRhayBhZGEgbGFnaSBwb3J0IHlhbmcga3V0dW5nZ3UgdGVyYnVrYS4KCgoKU2Vtb2dhIHNlcnZlci1tdSB0ZXRhcCBiZXJqYWxhbiwKCnNlbW9nYSBzZXRpYXAgcGFrZXQgbWVuZW11a2FuIHR1anVhbm55YSwKCmRhbiBzZW1vZ2EgdGlkYWsgYWRhIGxhZ2kKCnRpbWVvdXQgcGFkYSBoYWwtaGFsIHlhbmcga2F1IG5hbnRpa2FuLgoKCgpBa3UgYWthbiB0ZXRhcCBtZW1wZXJiYXJ1aSBzaXN0ZW1rdS4KCgoKQnVrYW4gdW50dWsgbWVuZ2hhcHVzIHNlbXVhIHlhbmcgcGVybmFoIGFkYSwKCm1lbGFpbmthbiBhZ2FyIHN1YXR1IGhhcmkgbmFudGkKCmFrdSBiaXNhIG1lbGloYXQga2VtYmFsaSBkaXJla3RvcmkgbGFtYSBpdHUKCnRhbnBhIG1lcmFzYSBoYXJ1cyBrZW1iYWxpIGtlIGRhbGFtbnlhLgoKCgpUZXJpbWEga2FzaWggdGVsYWggbWVuamFkaQoKYmFnaWFuIGRhcmkgc2VidWFoIHNlc2kKCnlhbmcgdGlkYWsgcGVybmFoIHRlcmNhdGF0CgpkYWxhbSBkb2t1bWVudGFzaSBtYW5hIHB1bi4KCgoKCgpyb290QGxpZmUuYWZ0ZXIuYnJlYWs6fiQgc2h1dGRvd24gLS1ncmFjZWZ1bAoKCgoKClNhdmluZyBtZW1vcmllcy4uLiBbT0tdCgoKCkNsb3Npbmcgb2xkIGNvbm5lY3Rpb25zLi4uIFtPS10KCgoKUmVsZWFzaW5nIG9jY3VwaWVkIHJlc291cmNlcy4uLiBbT0tdCgoKCldhaXRpbmcgZm9yIGZpbmFsIGFja25vd2xlZGdtZW50Li4uCgoKCk5vIHJlc3BvbnNlIHJlY2VpdmVkLgoKCgpDT05ORUNUSU9OIENMT1NFRC4KCgoKQnV0IHRoZSBsb2dzIHJlbWFpbi4KCgoKRU5EIE9GIFRSQU5TTUlTU0lPTiAvLyAweDAwMDAwMDAwYDsKCgoKY29uc3Qgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm91dHB1dCIpOwoKY29uc3QgY3Vyc29yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImN1cnNvciIpOwoKY29uc3QgaW50cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiaW50cm9TY3JlZW4iKTsKCmNvbnN0IHRlcm1pbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRlcm1pbmFsIik7Cgpjb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJzdGFydEJ1dHRvbiIpOwoKY29uc3QgcGxheWVyQ2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJwbGF5ZXJDYXJkIik7Cgpjb25zdCBwbGF5ZXJIaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInBsYXllckhpbnQiKTsKCmNvbnN0IGF1ZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImJhY2tncm91bmRBdWRpbyIpOwoKY29uc3QgYXVkaW9CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYXVkaW9CdXR0b24iKTsKCmNvbnN0IHZvbHVtZVNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ2b2x1bWVTbGlkZXIiKTsKCmNvbnN0IHZvbHVtZVZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInZvbHVtZVZhbHVlIik7Cgpjb25zdCBhdWRpb0NvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImF1ZGlvQ29udHJvbHMiKTsKCmNvbnN0IGNvbnRyb2xzVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImNvbnRyb2xzVG9nZ2xlIik7Cgpjb25zdCBjb250cm9sc1BhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImNvbnRyb2xzUGFuZWwiKTsKCmNvbnN0IHRoZW1lVG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIi50aGVtZS10b2dnbGUiKTsKCgoKZnVuY3Rpb24gc2V0VGhlbWUodGhlbWUsIHNhdmUgPSBmYWxzZSkgewoKICBjb25zdCBpc0xpZ2h0ID0gdGhlbWUgPT09ICJsaWdodCI7CgogIGRvY3VtZW50LmJvZHkuZGF0YXNldC50aGVtZSA9IGlzTGlnaHQgPyAibGlnaHQiIDogImRhcmsiOwogIHRyeSB7IHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyB0eXBlOiAia29lcm5pYS1sb2ctdGhlbWUiLCB0aGVtZTogaXNMaWdodCA/ICJsaWdodCIgOiAiZGFyayIgfSwgIioiKTsgfSBjYXRjaCAoZXJyb3IpIHt9CgogIHRoZW1lVG9nZ2xlcy5mb3JFYWNoKChidXR0b24pID0+IHsKCiAgICBjb25zdCBuZXh0TW9kZSA9IGlzTGlnaHQgPyAiZ2VsYXAiIDogInRlcmFuZyI7CgogICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbCIsIGBBa3RpZmthbiBtb2RlICR7bmV4dE1vZGV9YCk7CgogICAgYnV0dG9uLnRpdGxlID0gYEFrdGlma2FuIG1vZGUgJHtuZXh0TW9kZX1gOwoKICB9KTsKCiAgaWYgKHNhdmUpIHsKCiAgICB0cnkgewoKICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oImtvZXJuaWEtdGhlbWUiLCBpc0xpZ2h0ID8gImxpZ2h0IiA6ICJkYXJrIik7CgogICAgfSBjYXRjaCAoZXJyb3IpIHsKCiAgICAgIC8vIFRlbWEgdGV0YXAgYmVyZnVuZ3NpIG1lc2tpIHBlbnlpbXBhbmFuIGJyb3dzZXIgdGlkYWsgdGVyc2VkaWEuKgoKICAgIH0KCiAgfQoKfQoKCgpsZXQgY3VycmVudEluZGV4ID0gMDsKCmxldCB0eXBpbmdUaW1lciA9IG51bGw7CgpsZXQgdHJhbnNtaXNzaW9uU3RhcnRlZCA9IGZhbHNlOwoKbGV0IGFjdGl2ZUxpbmUgPSBudWxsOwoKY29uc3Qgb3V0cHV0Q2hhcmFjdGVycyA9IFtdOwoKCgpmdW5jdGlvbiBnZXRMaW5lQ2xhc3MobGluZSkgewoKICBpZiAoL15cZHsyfSBcL1wvLy50ZXN0KGxpbmUpKSByZXR1cm4gInNlY3Rpb24iOwoKICBpZiAoL15yb290QC8udGVzdChsaW5lKSkgcmV0dXJuICJjb21tYW5kIjsKCiAgaWYgKC9eXFtJTkZPXF18XlxbT0tcXS8udGVzdChsaW5lKSkgcmV0dXJuICJpbmZvIjsKCiAgaWYgKC9eXFtXQVJOXF0vLnRlc3QobGluZSkpIHJldHVybiAid2FybmluZyI7CgogIGlmICgvXlxbRVJST1JcXXxeXFtGQUlMXF0vLnRlc3QobGluZSkpIHJldHVybiAiZXJyb3IiOwoKICBpZiAoL14oU2F2aW5nIG1lbW9yaWVzfENsb3Npbmcgb2xkIGNvbm5lY3Rpb25zfFJlbGVhc2luZyBvY2N1cGllZCByZXNvdXJjZXMpLy50ZXN0KGxpbmUpKSByZXR1cm4gInN5c3RlbSI7CgogIGlmICgvXihXYWl0aW5nIGZvcnxObyByZXNwb25zZXxDT05ORUNUSU9OIENMT1NFRC58QVJDSElWRSBTVEFUVVM6fEVORCBPRiBUUkFOU01JU1NJT04pLy50ZXN0KGxpbmUpKSByZXR1cm4gImNsb3NpbmciOwoKICByZXR1cm4gIiI7Cgp9CgoKCmZ1bmN0aW9uIHByZXBhcmVPdXRwdXQoKSB7CgogIFRSQU5TTUlTU0lPTi5yZXBsYWNlKC9cbnsyLH0vZywgIlxuIikuc3BsaXQoIlxuIikuZm9yRWFjaCgobGluZSwgbGluZUluZGV4LCBsaW5lcykgPT4gewoKICAgIGNvbnN0IGxpbmVDbGFzcyA9IGdldExpbmVDbGFzcyhsaW5lKTsKCiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGluZS5sZW5ndGg7IGluZGV4KyspIHsKCiAgICAgIG91dHB1dENoYXJhY3RlcnMucHVzaCh7IGNoYXJhY3RlcjogbGluZS5jaGFyQXQoaW5kZXgpLCBsaW5lQ2xhc3MgfSk7CgogICAgfQoKICAgIGlmIChsaW5lSW5kZXggPCBsaW5lcy5sZW5ndGggLSAxKSB7CgogICAgICBvdXRwdXRDaGFyYWN0ZXJzLnB1c2goeyBjaGFyYWN0ZXI6ICJcbiIsIGxpbmVDbGFzcyB9KTsKCiAgICB9CgogIH0pOwoKfQoKCgpmdW5jdGlvbiBnZXRUeXBpbmdEZWxheShjaGFyYWN0ZXIpIHsKCiAgaWYgKGNoYXJhY3RlciA9PT0gIlxuIikgcmV0dXJuIDk1OwoKICByZXR1cm4gVFlQRV9DT05GSUcuc3BlZWQgKyBNYXRoLnJhbmRvbSgpICogNTI7Cgp9CgoKCmZ1bmN0aW9uIHR5cGVOZXh0Q2hhcmFjdGVyKCkgewoKICBpZiAoY3VycmVudEluZGV4ID49IG91dHB1dENoYXJhY3RlcnMubGVuZ3RoKSB7CgogICAgY3Vyc29yLnN0eWxlLmRpc3BsYXkgPSAibm9uZSI7CgogICAgcmV0dXJuOwoKICB9CgoKCiAgY29uc3QgbmV4dCA9IG91dHB1dENoYXJhY3RlcnNbY3VycmVudEluZGV4KytdOwoKICBpZiAobmV4dC5jaGFyYWN0ZXIgPT09ICJcbiIpIHsKCiAgICBvdXRwdXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIlxuIikpOwoKICAgIGFjdGl2ZUxpbmUgPSBudWxsOwoKICB9IGVsc2UgewoKICAgIGlmICghYWN0aXZlTGluZSkgewoKICAgICAgYWN0aXZlTGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNwYW4iKTsKCiAgICAgIGFjdGl2ZUxpbmUuY2xhc3NOYW1lID0gIm91dHB1dC1saW5lICIgKyBuZXh0LmxpbmVDbGFzczsKCiAgICAgIG91dHB1dC5hcHBlbmRDaGlsZChhY3RpdmVMaW5lKTsKCiAgICB9CgogICAgYWN0aXZlTGluZS50ZXh0Q29udGVudCArPSBuZXh0LmNoYXJhY3RlcjsKCiAgfQoKCgogIG91dHB1dC5hcHBlbmRDaGlsZChjdXJzb3IpOwoKICBvdXRwdXQuc2Nyb2xsVG9wID0gb3V0cHV0LnNjcm9sbEhlaWdodDsKCiAgdHlwaW5nVGltZXIgPSBzZXRUaW1lb3V0KHR5cGVOZXh0Q2hhcmFjdGVyLCBnZXRUeXBpbmdEZWxheShuZXh0LmNoYXJhY3RlcikpOwoKfQoKCgphdWRpby52b2x1bWUgPSBBVURJT19DT05GSUcudm9sdW1lOwoKYXVkaW8ubG9vcCA9IEFVRElPX0NPTkZJRy5sb29wOwoKYXVkaW8uYXV0b3BsYXkgPSBBVURJT19DT05GSUcuYXV0b3BsYXk7Cgp2b2x1bWVTbGlkZXIudmFsdWUgPSBNYXRoLnJvdW5kKEFVRElPX0NPTkZJRy52b2x1bWUgKiAxMDApOwoKCgpmdW5jdGlvbiB1cGRhdGVBdWRpb0J1dHRvbigpIHsKCiAgY29uc3QgaXNQbGF5aW5nID0gIWF1ZGlvLnBhdXNlZDsKCiAgYXVkaW9CdXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgiaXMtcGxheWluZyIsIGlzUGxheWluZyk7CgogIGlmIChpbnRyb1NjcmVlbi5oaWRkZW4pIHBsYXllckNhcmQuY2xhc3NMaXN0LnRvZ2dsZSgiaXMtcGxheWluZyIsIGlzUGxheWluZyk7CgogIGF1ZGlvQnV0dG9uLnNldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbCIsIGlzUGxheWluZyA/ICJKZWRhIGF1ZGlvIiA6ICJQdXRhciBhdWRpbyIpOwoKICBhdWRpb0J1dHRvbi50aXRsZSA9IGlzUGxheWluZyA/ICJKZWRhIGF1ZGlvIiA6ICJQdXRhciBhdWRpbyI7Cgp9CgoKCmFzeW5jIGZ1bmN0aW9uIHBsYXlBdWRpbygpIHsKCiAgaWYgKCFBVURJT19DT05GSUcuc3JjLnRyaW0oKSkgewoKICAgIGF1ZGlvQnV0dG9uLnNldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbCIsICJVUkwgYXVkaW8gYmVsdW0gZGlpc2kiKTsKCiAgICBhdWRpb0J1dHRvbi50aXRsZSA9ICJVUkwgYXVkaW8gYmVsdW0gZGlpc2kiOwoKICAgIHJldHVybjsKCiAgfQoKCgogIHRyeSB7CgogICAgYXdhaXQgYXVkaW8ucGxheSgpOwoKICAgIHVwZGF0ZUF1ZGlvQnV0dG9uKCk7CgogIH0gY2F0Y2ggKGVycm9yKSB7CgogICAgcGxheWVySGludC50ZXh0Q29udGVudCA9ICJBVURJTyBUSURBSyBEQVBBVCBESVBVVEFSIOKAlCBDT0JBIExBR0kiOwoKICAgIGF1ZGlvQnV0dG9uLnNldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbCIsICJLbGlrIHVudHVrIG1lbmNvYmEgbWVtdXRhciBhdWRpbyIpOwoKICAgIGF1ZGlvQnV0dG9uLnRpdGxlID0gIktsaWsgdW50dWsgbWVuY29iYSBtZW11dGFyIGF1ZGlvIjsKCiAgfQoKfQoKCgpmdW5jdGlvbiB3YWl0Rm9yVHJhbnNpdGlvbihlbGVtZW50LCBkdXJhdGlvbikgewoKICBpZiAod2luZG93Lm1hdGNoTWVkaWEoIihwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIikubWF0Y2hlcykgewoKICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsKCiAgfQoKCgogIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gewoKICAgIGxldCBmaW5pc2hlZCA9IGZhbHNlOwoKICAgIGxldCB0aW1lb3V0OwoKICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHsKCiAgICAgIGlmIChmaW5pc2hlZCkgcmV0dXJuOwoKICAgICAgZmluaXNoZWQgPSB0cnVlOwoKICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpOwoKICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCJ0cmFuc2l0aW9uZW5kIiwgb25UcmFuc2l0aW9uRW5kKTsKCiAgICAgIHJlc29sdmUoKTsKCiAgICB9OwoKICAgIGNvbnN0IG9uVHJhbnNpdGlvbkVuZCA9IChldmVudCkgPT4gewoKICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZWxlbWVudCAmJiBldmVudC5wcm9wZXJ0eU5hbWUgPT09ICJvcGFjaXR5IikgZmluaXNoKCk7CgogICAgfTsKCgoKICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigidHJhbnNpdGlvbmVuZCIsIG9uVHJhbnNpdGlvbkVuZCk7CgogICAgdGltZW91dCA9IHNldFRpbWVvdXQoZmluaXNoLCBkdXJhdGlvbiArIDE1MCk7CgogIH0pOwoKfQoKCgphc3luYyBmdW5jdGlvbiBvcGVuVGVybWluYWwoKSB7CgogIGlmICh0cmFuc21pc3Npb25TdGFydGVkKSByZXR1cm47CgogIHRyYW5zbWlzc2lvblN0YXJ0ZWQgPSB0cnVlOwoKICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7CgoKCiAgLy8gU3RhcnQgc2lsZW50bHkgd2l0aGluIHRoZSBidXR0b24gZ2VzdHVyZSBzbyB0aGUgYnJvd3NlciBwZXJtaXRzIHBsYXliYWNrLioKCiAgYXVkaW8ubXV0ZWQgPSB0cnVlOwoKICBjb25zdCBhdWRpb1JlYWR5ID0gQVVESU9fQ09ORklHLnNyYy50cmltKCkKCiAgICA/IGF1ZGlvLnBsYXkoKS50aGVuKCgpID0+IHRydWUpLmNhdGNoKCgpID0+IGZhbHNlKQoKICAgIDogUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTsKCgoKICB0ZXJtaW5hbC5oaWRkZW4gPSBmYWxzZTsKCiAgdGVybWluYWwuY2xhc3NMaXN0LmFkZCgiaXMtb3BlbmluZyIpOwoKICBjb25zdCB0ZXJtaW5hbFRyYW5zaXRpb24gPSB3YWl0Rm9yVHJhbnNpdGlvbih0ZXJtaW5hbCwgNzAwKTsKCiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCIocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSIpLm1hdGNoZXMpIHsKCiAgICB0ZXJtaW5hbC5jbGFzc0xpc3QucmVtb3ZlKCJpcy1vcGVuaW5nIik7CgogIH0gZWxzZSB7CgogICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsKCiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0ZXJtaW5hbC5jbGFzc0xpc3QucmVtb3ZlKCJpcy1vcGVuaW5nIikpOwoKICAgIH0pOwoKICB9CgogIGF3YWl0IHRlcm1pbmFsVHJhbnNpdGlvbjsKCgoKICBpbnRyb1NjcmVlbi5jbGFzc0xpc3QuYWRkKCJpcy1jbG9zaW5nIik7CgogIGF3YWl0IHdhaXRGb3JUcmFuc2l0aW9uKGludHJvU2NyZWVuLCA5MDApOwoKICBpbnRyb1NjcmVlbi5oaWRkZW4gPSB0cnVlOwoKCgogIGF1ZGlvLm11dGVkID0gZmFsc2U7CgogIGlmICghYXdhaXQgYXVkaW9SZWFkeSkgYXdhaXQgcGxheUF1ZGlvKCk7CgogIHVwZGF0ZUF1ZGlvQnV0dG9uKCk7CgogIHR5cGVOZXh0Q2hhcmFjdGVyKCk7Cgp9CgoKCnN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgb3BlblRlcm1pbmFsKTsKCgoKdGhlbWVUb2dnbGVzLmZvckVhY2goKGJ1dHRvbikgPT4gewoKICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB7CgogICAgY29uc3QgbmV4dFRoZW1lID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LnRoZW1lID09PSAibGlnaHQiID8gImRhcmsiIDogImxpZ2h0IjsKCiAgICBzZXRUaGVtZShuZXh0VGhlbWUsIHRydWUpOwoKICB9KTsKCn0pOwoKCgpjb250cm9sc1RvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsICgpID0+IHsKCiAgY29uc3QgaXNFeHBhbmRlZCA9IGNvbnRyb2xzVG9nZ2xlLmdldEF0dHJpYnV0ZSgiYXJpYS1leHBhbmRlZCIpID09PSAidHJ1ZSI7CgogIGNvbnRyb2xzVG9nZ2xlLnNldEF0dHJpYnV0ZSgiYXJpYS1leHBhbmRlZCIsIFN0cmluZyghaXNFeHBhbmRlZCkpOwoKICBjb250cm9sc1RvZ2dsZS5zZXRBdHRyaWJ1dGUoImFyaWEtbGFiZWwiLCBpc0V4cGFuZGVkID8gIlRhbXBpbGthbiBrb250cm9sIGF1ZGlvIiA6ICJTZW1idW55aWthbiBrb250cm9sIGF1ZGlvIik7CgogIGNvbnRyb2xzVG9nZ2xlLnRpdGxlID0gaXNFeHBhbmRlZCA/ICJUYW1waWxrYW4ga29udHJvbCBhdWRpbyIgOiAiU2VtYnVueWlrYW4ga29udHJvbCBhdWRpbyI7CgogIGNvbnRyb2xzUGFuZWwuaGlkZGVuID0gaXNFeHBhbmRlZDsKCiAgYXVkaW9Db250cm9scy5jbGFzc0xpc3QudG9nZ2xlKCJpcy1jb2xsYXBzZWQiLCBpc0V4cGFuZGVkKTsKCn0pOwoKCgphdWRpb0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsICgpID0+IHsKCiAgaWYgKGF1ZGlvLnBhdXNlZCkgewoKICAgIHBsYXlBdWRpbygpOwoKICB9IGVsc2UgewoKICAgIGF1ZGlvLnBhdXNlKCk7CgogICAgdXBkYXRlQXVkaW9CdXR0b24oKTsKCiAgfQoKfSk7CgoKCmF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoInBsYXkiLCB1cGRhdGVBdWRpb0J1dHRvbik7CgphdWRpby5hZGRFdmVudExpc3RlbmVyKCJwYXVzZSIsIHVwZGF0ZUF1ZGlvQnV0dG9uKTsKCgoKdm9sdW1lU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoImlucHV0IiwgKCkgPT4gewoKICBjb25zdCB2b2x1bWUgPSBOdW1iZXIodm9sdW1lU2xpZGVyLnZhbHVlKTsKCiAgYXVkaW8udm9sdW1lID0gdm9sdW1lIC8gMTAwOwoKICB2b2x1bWVWYWx1ZS50ZXh0Q29udGVudCA9IHZvbHVtZSArICIlIjsKCn0pOwoKCgpmdW5jdGlvbiBpbml0aWFsaXplKCkgewoKICBwcmVwYXJlT3V0cHV0KCk7CgogIGF1ZGlvLmF1dG9wbGF5ID0gZmFsc2U7CgoKCiAgaWYgKEFVRElPX0NPTkZJRy5zcmMudHJpbSgpKSB7CgogICAgYXVkaW8uc3JjID0gQVVESU9fQ09ORklHLnNyYzsKCiAgICBhdWRpby5sb2FkKCk7CgogIH0KCn0KCgoKbGV0IHNhdmVkVGhlbWUgPSBudWxsOwoKdHJ5IHsKCiAgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCJrb2VybmlhLXRoZW1lIik7Cgp9IGNhdGNoIChlcnJvcikgewoKICAvLyBHdW5ha2FuIHRlbWEgZ2VsYXAgamlrYSBwZW55aW1wYW5hbiBicm93c2VyIHRpZGFrIHRlcnNlZGlhLioKCn0KCnNldFRoZW1lKHNhdmVkVGhlbWUgPT09ICJsaWdodCIgPyAibGlnaHQiIDogImRhcmsiKTsKCmluaXRpYWxpemUoKTsKCjwvc2NyaXB0PgoKCjxzY3JpcHQgaWQ9ImtyQXJjaGl2ZUludGVyYWN0aW9uR3VhcmQiPgooZnVuY3Rpb24oKXsKICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCJjb250ZXh0bWVudSIsZnVuY3Rpb24oZXZlbnQpe2V2ZW50LnByZXZlbnREZWZhdWx0KCk7ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7fSx0cnVlKTsKICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCJzZWxlY3RzdGFydCIsZnVuY3Rpb24oZXZlbnQpewogICAgaWYoIShldmVudC50YXJnZXQgJiYgL14oSU5QVVR8VEVYVEFSRUEpJC8udGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpOwogIH0sdHJ1ZSk7Cn0pKCk7Cjwvc2NyaXB0PgoKPHNjcmlwdD4KKGZ1bmN0aW9uKCl7CiAgdmFyIGV4aXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FyY2hpdmVFeGl0Jyk7CiAgaWYoZXhpdClleGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpewogICAgdHJ5e3BhcmVudC5wb3N0TWVzc2FnZSh7dHlwZTona29lcm5pYS1sb2ctY2xvc2UnfSwnKicpO31jYXRjaChlKXt9CiAgfSk7Cn0pKCk7Cjwvc2NyaXB0PgoKPC9ib2R5PgoKPC9odG1sPg==';
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
