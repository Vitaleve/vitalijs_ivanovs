history.scrollRestoration="auto";

const SCROLL_KEY="last_scroll_pos";
const saveScroll=()=>{try{localStorage.setItem(SCROLL_KEY,String(window.pageYOffset||window.scrollY||0))}catch(e){}};
window.addEventListener("beforeunload",saveScroll,{passive:true});
window.addEventListener("pagehide",saveScroll,{passive:true});
window.addEventListener("pageshow",()=>{if(location.hash)return;let s=0;try{s=parseInt(localStorage.getItem(SCROLL_KEY)||"0",10)||0}catch(_){ }if(s<=1){const t=()=>window.scrollTo(0,0);requestAnimationFrame(()=>{t();requestAnimationFrame(t)});setTimeout(t,0);setTimeout(t,60)}});

const y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();

const menuBtn=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuBtn&&nav){
  const open=()=>{menuBtn.classList.add("is-active");nav.classList.add("active")};
  const close=()=>{menuBtn.classList.remove("is-active");nav.classList.remove("active")};
  menuBtn.addEventListener("click",()=>{if(nav.classList.contains("active")){close()}else{open()}});
  document.addEventListener("click",e=>{if(window.innerWidth<=768&&!nav.contains(e.target)&&!menuBtn.contains(e.target))close()});
  window.addEventListener("resize",()=>{if(window.innerWidth>768)close()});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<=768)close()}));
}

function openPDF(src){
  const modal=document.getElementById("pdfModal");
  const frame=document.getElementById("pdfFrame");
  if(!modal||!frame)return;
  const withZoom=src+(src.includes("#")?"&":"#")+"zoom=page-width";
  document.body.classList.add("modal-open");
  frame.src=withZoom;
  modal.style.display="flex";
}
function closePDF(){
  const modal=document.getElementById("pdfModal");
  const frame=document.getElementById("pdfFrame");
  if(!modal||!frame)return;
  frame.src="";
  modal.style.display="none";
  document.body.classList.remove("modal-open");
}
document.querySelectorAll("[data-view]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();
    const src=btn.getAttribute("data-view");
    addStat(btn.getAttribute("data-stats-key")||"view");
    openPDF(src);
  });
});
document.querySelector(".close")?.addEventListener("click",closePDF);
document.getElementById("pdfModal")?.addEventListener("click",e=>{if(!e.target.closest(".modal-content"))closePDF()});
document.querySelector(".modal-content")?.addEventListener("click",e=>e.stopPropagation());

async function forceDownload(url,filename){
  try{
    const res=await fetch(url,{cache:"no-cache",credentials:"same-origin"});
    if(!res.ok)throw new Error();
    const blob=await res.blob();
    const href=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=href;a.download=filename||url.split("/").pop();a.style.display="none";
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(href);a.remove()},400);
  }catch(e){
    const a=document.createElement("a");
    a.href=url;a.download=filename||url.split("/").pop();a.style.display="none";
    document.body.appendChild(a);a.click();a.remove();
  }
}
document.querySelectorAll("[data-download]").forEach(btn=>{
  btn.addEventListener("click",()=>{const url=btn.getAttribute("data-download");const name=btn.getAttribute("data-filename")||url.split("/").pop();addStat(btn.getAttribute("data-stats-key")||name);forceDownload(url,name)});
});

function addStat(key){try{const k="dl:"+key;const cur=parseInt(localStorage.getItem(k)||"0",10);localStorage.setItem(k,String(cur+1))}catch(e){}}

const themeSegs=document.querySelectorAll(".theme-seg");
const themeSwitch=document.querySelector(".theme-switch");
let themeAnimating=false;
function setThumb(target){themeSwitch?.setAttribute("data-active",target);themeSegs.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===target)))}
function applyThemeNow(val){if(val==="light"||val==="dark"){document.documentElement.setAttribute("data-theme",val)}else{document.documentElement.setAttribute("data-theme","auto")}localStorage.setItem("theme",val)}
function applyThemeSmooth(target){if(themeAnimating)return;themeAnimating=true;setThumb(target);const onDone=()=>{applyThemeNow(target);themeAnimating=false;themeSwitch?.removeEventListener('transitionend',onDone)};themeSwitch?.addEventListener('transitionend',onDone)}
const initialTheme=localStorage.getItem("theme")||"auto";applyThemeNow(initialTheme);setThumb(initialTheme);themeSegs.forEach(b=>b.addEventListener("click",()=>applyThemeSmooth(b.dataset.theme)));

const LS_LANG="site_lang";
const DEFAULT_LANG="de";
const I18N={
  de:{title:"Vitalijs Ivanovs Praktikum",nav:["Über mich","Lebenslauf","Unterlagen","Projekte","Kontakt"],heroWord:"BEWERBUNG",heroSubtitle:"Pflichtpraktikum als Fachinformatiker für Anwendungsentwicklung (IHK)",qf_docs:"📄 Unterlagen",qf_contact:"📧 Kontakt",modal_close:"Schließen",agree:"Ich stimme zu",send:"Senden",reset:"Reset",email_send:"E-Mail senden",copy:"Kopieren",copied_tt:"Kopiert",name_ph:"Vor- und Nachname",name_hint:"Vor- und Nachname.",email_ph:"name@firma.de",email_hint:"Beispiel: name@firma.de",msg_ph:"Ihre Nachricht...",msg_hint:"Mindestens 10 Zeichen"},
  en:{title:"Vitalijs Ivanovs Internship",nav:["About me","CV","Documents","Projects","Contact"],heroWord:"APPLICATION",heroSubtitle:"Mandatory internship as IT specialist for application development (IHK)",qf_docs:"📄 Documents",qf_contact:"📧 Contact",modal_close:"Close",agree:"I agree",send:"Send",reset:"Reset",email_send:"Send email",copy:"Copy",copied_tt:"Copied",name_ph:"First and last name",name_hint:"First and last name.",email_ph:"name@company.com",email_hint:"Example: name@company.com",msg_ph:"Your message...",msg_hint:"At least 10 characters"}
};

function getLang(){const s=localStorage.getItem(LS_LANG);if(s&&I18N[s])return s;const b=(navigator.language||"").slice(0,2).toLowerCase();return I18N[b]?b:DEFAULT_LANG}
function setBrandWord(word){const brand=document.querySelector(".brand");if(!brand)return;brand.innerHTML=word.toUpperCase().split("").map(ch=>`<span>${ch}</span>`).join("")}
function setText(el,txt){if(el)el.textContent=txt}
function setPlaceholder(el,txt){if(el)el.setAttribute("placeholder",txt)}
function hintNextTo(input){if(!input)return null;let n=input.parentElement?.querySelector("#"+input.id+"-hint");if(n)return n;let sib=input.nextElementSibling;while(sib){if(sib.tagName==="SMALL"||sib.tagName==="P"){return sib}sib=sib.nextElementSibling}return null}

function applyTranslations(lang){
  const t=I18N[lang]||I18N[DEFAULT_LANG];
  document.title=t.title;
  document.documentElement.setAttribute("lang",lang);
  document.body.setAttribute("data-lang",lang);
  document.querySelectorAll(".lang-btn").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===lang)));
  const navLinks=document.querySelectorAll(".nav a");
  if(navLinks.length>=5){navLinks[0].textContent=t.nav[0];navLinks[1].textContent=t.nav[1];navLinks[2].textContent=t.nav[2];navLinks[3].textContent=t.nav[3];navLinks[4].textContent=t.nav[4];}
  const subtitle=document.querySelector(".subtitle"); if(subtitle)subtitle.textContent=t.heroSubtitle;
  setBrandWord(t.heroWord);
  const agreeLab=document.querySelector('.checklab span'); setText(agreeLab,t.agree);
  const sendBtn=document.getElementById('send-btn'); setText(sendBtn,t.send);
  const resetBtn=document.getElementById('reset-btn'); setText(resetBtn,t.reset);
  const mailBtn=document.getElementById('contact-email-btn'); setText(mailBtn,t.email_send);
  const copyBtn=document.getElementById('copy-email'); setText(copyBtn,t.copy);
  const tt=document.querySelector('.tooltip'); setText(tt,t.copied_tt);

  const nameInput=document.getElementById('cf-name')||document.querySelector('input[name="name"]');
  const emailInput=document.getElementById('cf-email')||document.querySelector('input[type="email"]');
  const msgArea=document.getElementById('cf-message')||document.querySelector('textarea[name="message"], textarea');

  setPlaceholder(nameInput,t.name_ph);
  setPlaceholder(emailInput,t.email_ph);
  setPlaceholder(msgArea,t.msg_ph);

  const hName=document.getElementById('hint-name')||hintNextTo(nameInput); setText(hName,t.name_hint);
  const hEmail=document.getElementById('hint-email')||hintNextTo(emailInput); setText(hEmail,t.email_hint);
  const hMin=document.getElementById('hint-minlen')||hintNextTo(msgArea); if(hMin){hMin.textContent=t.msg_hint}

  const modalClose=document.querySelector(".close"); if(modalClose){modalClose.setAttribute("aria-label",t.modal_close);modalClose.setAttribute("title",t.modal_close);}
}

function setLanguage(lang){if(!I18N[lang])lang=DEFAULT_LANG;localStorage.setItem(LS_LANG,lang);applyTranslations(lang)}
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang||"de")));
applyTranslations(getLang());

const sections=[...document.querySelectorAll("main section"),document.getElementById("contact")].filter(Boolean);
const linkMap=new Map();
document.querySelectorAll(".nav a").forEach(a=>{const id=a.getAttribute("href").replace("#","");linkMap.set(id,a)});
const io=new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    const id=ent.target.getAttribute("id");
    const link=linkMap.get(id);
    if(!link)return;
    if(ent.isIntersecting){document.querySelectorAll(".nav a").forEach(x=>x.classList.remove("active"));link.classList.add("active")}
  })
},{root:null,rootMargin:"-42% 0px -55% 0px",threshold:[0,0.25,0.5,0.75,1]});
sections.forEach(sec=>io.observe(sec));

const backBtn=document.getElementById("backToTop");
if(backBtn){
  window.addEventListener("scroll",()=>{const y=window.scrollY||window.pageYOffset; if(y>800){backBtn.classList.add("show")}else{backBtn.classList.remove("show")}},{passive:true});
  backBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

const copyBtnEl=document.getElementById("copy-email");
const mailLink=document.getElementById("mailto-link");
if(copyBtnEl&&mailLink){
  const text=mailLink.textContent.trim();
  copyBtnEl.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(text);copyBtnEl.classList.add("copied");setTimeout(()=>copyBtnEl.classList.remove("copied"),1200)}catch(_){ }});
}

const form=document.getElementById("contact-form");
if(form){
  const btn=document.getElementById("send-btn");
  form.addEventListener("submit",e=>{
    const msg=document.getElementById("cf-message")||document.querySelector('textarea[name="message"]');
    if(msg&&msg.value.trim().length<10){e.preventDefault();msg.focus();return}
    if(btn){btn.setAttribute("disabled","true");btn.textContent=(getLang()==="de"?"Senden…":"Sending…")}
  });
}

const inputs=document.querySelectorAll('input,textarea,select');
inputs.forEach(i=>i.addEventListener('focus',()=>{document.documentElement.classList.add('kb-open')}));
inputs.forEach(i=>i.addEventListener('blur',()=>{document.documentElement.classList.remove('kb-open')}));
