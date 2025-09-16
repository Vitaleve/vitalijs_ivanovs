history.scrollRestoration="auto";

const SCROLL_KEY="last_scroll_pos";
const saveScroll=()=>{try{localStorage.setItem(SCROLL_KEY,String(window.pageYOffset||window.scrollY||0))}catch(e){}};
window.addEventListener("beforeunload",saveScroll,{passive:true});
window.addEventListener("pagehide",saveScroll,{passive:true});
window.addEventListener("pageshow",()=>{
  if(location.hash) return;
  let saved=0;
  try{saved=parseInt(localStorage.getItem(SCROLL_KEY)||"0",10)||0}catch(_){}
  if(saved<=1){
    const toTop=()=>window.scrollTo(0,0);
    requestAnimationFrame(()=>{toTop();requestAnimationFrame(toTop);});
    setTimeout(toTop,0);
    setTimeout(toTop,60);
  }
});

const y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();

const menuBtn=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuBtn&&nav){
  menuBtn.addEventListener("click",()=>{menuBtn.classList.toggle("is-active");nav.classList.toggle("active")});
  document.addEventListener("click",e=>{if(!nav.contains(e.target)&&!menuBtn.contains(e.target)){menuBtn.classList.remove("is-active");nav.classList.remove("active")}});
  window.addEventListener("resize",()=>{if(window.innerWidth>768){menuBtn.classList.remove("is-active");nav.classList.remove("active")}})
}

function openPDF(src){
  const modal=document.getElementById("pdfModal");
  const frame=document.getElementById("pdfFrame");
  const status=document.getElementById("pdfStatus");
  if(!modal||!frame)return;
  const withZoom=src+(src.includes("#")?"&":"#")+"zoom=page-width";
  document.body.classList.add("modal-open");
  frame.src=withZoom;
  modal.style.display="flex";
  if(status){status.textContent="";updatePdfStatus(src,status)}
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
    if(window.plausible) plausible("View", {props:{file:src}});
    openPDF(src);
  });
});
document.querySelector(".close")?.addEventListener("click",closePDF);
document.getElementById("pdfModal")?.addEventListener("click",e=>{if(!e.target.closest(".modal-content"))closePDF()});
document.querySelector(".modal-content")?.addEventListener("click",e=>e.stopPropagation());

async function updatePdfStatus(url,el){
  try{
    const res=await fetch(url,{method:"HEAD"});
    const size=Number(res.headers.get("content-length")||0);
    const name=url.split("/").pop()||"Dokument";
    const human=size?humanSize(size):"";
    const t=document.documentElement.getAttribute("lang")==="de" ? `${name} · ${human} · PDF` : `${name} · ${human} · PDF`;
    el.textContent=t.trim();
  }catch(_){
    const name=url.split("/").pop()||"Dokument";
    el.textContent=name+" · PDF";
  }
}
function humanSize(n){
  if(n<=0)return "";
  const u=["B","KB","MB","GB","TB"];let i=0;let v=n;
  while(v>=1024&&i<u.length-1){v/=1024;i++}
  return `${v.toFixed(v>=10||i===0?0:1)} ${u[i]}`;
}

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
  btn.addEventListener("click",()=>{
    const url=btn.getAttribute("data-download");
    const name=btn.getAttribute("data-filename")||url.split("/").pop();
    addStat(btn.getAttribute("data-stats-key")||name);
    if(window.plausible) plausible("Download", {props:{file:name}});
    forceDownload(url,name);
  });
});

function addStat(key){
  try{
    const k="dl:"+key;
    const cur=parseInt(localStorage.getItem(k)||"0",10);
    localStorage.setItem(k,String(cur+1));
  }catch(e){}
}

const themeSegs=document.querySelectorAll(".theme-seg");
const themeSwitch=document.querySelector(".theme-switch");
let applyTimer=null;
let lock=false;
let currentTheme=localStorage.getItem("theme")||"auto";
const THUMB_MS=280;
const mql=window.matchMedia("(prefers-color-scheme: dark)");
function resolvedAuto(){return mql.matches?"dark":"light"}
function setThumb(val){
  themeSwitch?.setAttribute("data-active",val);
  themeSegs.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===val)));
}
function setHtmlTheme(val){
  let t=val==="auto"?resolvedAuto():val;
  document.documentElement.setAttribute("data-theme",t);
}
function applyTheme(val,instant){
  if(lock&&!instant)return;
  clearTimeout(applyTimer);
  localStorage.setItem("theme",val);
  setThumb(val);
  if(instant){
    setHtmlTheme(val);
    currentTheme=val;
    return;
  }
  lock=true;
  applyTimer=setTimeout(()=>{
    setHtmlTheme(val);
    currentTheme=val;
    lock=false;
  },THUMB_MS);
}
applyTheme(currentTheme,true);
themeSegs.forEach(b=>b.addEventListener("click",()=>applyTheme(b.dataset.theme,false)));
mql.addEventListener?.("change",()=>{if(currentTheme==="auto")setHtmlTheme("auto")});

const LS_LANG="site_lang";
const DEFAULT_LANG="de";
const I18N={
  de:{title:"Vitalijs Ivanovs · Praktikum 2026",nav:["Über mich","Lebenslauf","Unterlagen","Projekte","Kontakt"],heroWord:"BEWERBUNG",heroSubtitle:"Pflichtpraktikum als Fachinformatiker für Anwendungsentwicklung",heroCta:"Unterlagen ansehen",qf_docs:"📄 Unterlagen",qf_contact:"📧 Kontakt",modal_close:"Schließen",qr_alt:"QR-Code zum Bewerbungsportal",form:{name:"Name",email:"E-Mail",message:"Nachricht",consent:"Ich stimme der Verarbeitung meiner Angaben zur Kontaktaufnahme zu.",send:"Senden",reset:"Zurücksetzen",ok:"Danke, die Nachricht wurde gesendet.",err:"Fehler beim Senden. Bitte versuchen Sie es später erneut.",invalid:"Bitte füllen Sie alle Felder korrekt aus."},meta:{desc:"Pflichtpraktikum als Fachinformatiker für Anwendungsentwicklung ab April 2026. Lebenslauf, Anschreiben, Projekte, Zertifikate.",ogtitle:"Vitalijs Ivanovs · Praktikum 2026",ogdesc:"Lebenslauf, Anschreiben, Projekte, Zertifikate."}},
  en:{title:"Vitalijs Ivanovs · Internship 2026",nav:["About me","CV","Documents","Projects","Contact"],heroWord:"APPLICATION",heroSubtitle:"Mandatory internship as IT specialist for application development",heroCta:"View documents",qf_docs:"📄 Documents",qf_contact:"📧 Contact",modal_close:"Close",qr_alt:"QR code to the application page",form:{name:"Name",email:"Email",message:"Message",consent:"I agree to the processing of my data for contacting me.",send:"Send",reset:"Reset",ok:"Thanks, your message has been sent.",err:"Sending failed. Please try again later.",invalid:"Please fill in all fields correctly."},meta:{desc:"Mandatory internship in application development starting April 2026. CV, cover letter, projects, certificates.",ogtitle:"Vitalijs Ivanovs · Internship 2026",ogdesc:"CV, cover letter, projects, certificates."}}
};

function getLangFromUrl(){
  const m=(location.search.match(/[?&]lang=(de|en)\b/i)||[])[1];
  return m?m.toLowerCase():null;
}
function getLang(){
  const fromUrl=getLangFromUrl();
  if(fromUrl&&I18N[fromUrl]) return fromUrl;
  const saved=localStorage.getItem(LS_LANG);
  if(saved&&I18N[saved])return saved;
  const b=(navigator.language||"").slice(0,2).toLowerCase();
  return I18N[b]?b:DEFAULT_LANG;
}
function setUrlLang(lang){
  const u=new URL(location.href);
  u.searchParams.set("lang",lang);
  history.replaceState({}, "", u.toString());
}

function setBrandWord(word){
  const brand=document.querySelector(".brand");
  if(!brand)return;
  brand.innerHTML=word.toUpperCase().split("").map(ch=>`<span>${ch}</span>`).join("");
}

function setMetaByLang(lang){
  const t=I18N[lang];
  const titleEl=document.querySelector("title");
  const descEl=document.querySelector('meta[name="description"]');
  const ogt=document.querySelector('meta[property="og:title"]');
  const ogd=document.querySelector('meta[property="og:description"]');
  const twt=document.querySelector('meta[name="twitter:title"]');
  const twd=document.querySelector('meta[name="twitter:description"]');
  if(titleEl) titleEl.textContent=t.meta.ogtitle;
  if(descEl) descEl.setAttribute("content",t.meta.desc);
  if(ogt) ogt.setAttribute("content",t.meta.ogtitle);
  if(ogd) ogd.setAttribute("content",t.meta.ogdesc);
  if(twt) twt.setAttribute("content",t.meta.ogtitle);
  if(twd) twd.setAttribute("content",t.meta.ogdesc);
}

function applyTranslations(lang){
  const t=I18N[lang]||I18N[DEFAULT_LANG];
  document.documentElement.setAttribute("lang",lang);
  document.body.setAttribute("data-lang",lang);
  document.querySelectorAll(".lang-btn").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===lang)));
  const navLinks=document.querySelectorAll(".nav a");
  if(navLinks.length>=5){
    navLinks[0].textContent=t.nav[0];
    navLinks[1].textContent=t.nav[1];
    navLinks[2].textContent=t.nav[2];
    navLinks[3].textContent=t.nav[3];
    navLinks[4].textContent=t.nav[4];
  }
  const subtitle=document.querySelector(".subtitle"); if(subtitle)subtitle.textContent=t.heroSubtitle;
  const cta=document.querySelector(".cta"); if(cta)cta.textContent=t.heroCta;
  setBrandWord(t.heroWord);
  const qfDocs=document.querySelector(".qf-docs"); if(qfDocs)qfDocs.textContent=t.qf_docs;
  const qfContact=document.querySelector(".qf-contact"); if(qfContact)qfContact.textContent=t.qf_contact;
  const modalClose=document.querySelector(".close"); if(modalClose){modalClose.setAttribute("aria-label",t.modal_close);modalClose.setAttribute("title",t.modal_close);}
  const qrImg=document.getElementById("qr-img"); if(qrImg){qrImg.alt=t.qr_alt;qrImg.src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data="+encodeURIComponent(location.href);}
  setMetaByLang(lang);
}

function setLanguage(lang){
  if(!I18N[lang])lang=DEFAULT_LANG;
  localStorage.setItem(LS_LANG,lang);
  setUrlLang(lang);
  applyTranslations(lang);
}

document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang||"de")));
applyTranslations(getLang());
setUrlLang(document.documentElement.getAttribute("lang")||"de");

const sections=[...document.querySelectorAll("main section"),document.getElementById("contact")].filter(Boolean);
const linkMap=new Map();
document.querySelectorAll(".nav a").forEach(a=>{const id=a.getAttribute("href").replace("#","");linkMap.set(id,a);});
const io=new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    const id=ent.target.getAttribute("id");
    const link=linkMap.get(id);
    if(!link)return;
    if(ent.isIntersecting){document.querySelectorAll(".nav a").forEach(x=>x.classList.remove("active"));link.classList.add("active");}
  });
},{root:null,rootMargin:"-40% 0px -55% 0px",threshold:[0,0.25,0.5,0.75,1]});
sections.forEach(sec=>io.observe(sec));

const FORM_ENDPOINT="https://formspree.io/f/mandzzal";
const cf=document.getElementById("contactForm");
const cfStatus=document.getElementById("cf-status");
const cfReset=document.getElementById("cf-reset");
function setStatus(msg,ok){
  if(!cfStatus)return;
  cfStatus.textContent=msg;
  cfStatus.classList.remove("ok","err");
  if(msg) cfStatus.classList.add(ok?"ok":"err");
}
function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
async function sendForm(data){
  const res=await fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)});
  if(!res.ok)throw new Error("bad");
  return true;
}
cf?.addEventListener("submit",async e=>{
  e.preventDefault();
  const lang=document.documentElement.getAttribute("lang")||"de";
  const name=document.getElementById("cf-name")?.value.trim()||"";
  const email=document.getElementById("cf-email")?.value.trim()||"";
  const message=document.getElementById("cf-message")?.value.trim()||"";
  const hp=document.getElementById("cf-website")?.value.trim()||"";
  const consent=document.getElementById("cf-consent")?.checked||false;
  if(hp){return}
  if(!name||!validateEmail(email)||!message||!consent){setStatus(I18N[lang].form.invalid,false);return}
  const payload={name,email,message,lang,ts:new Date().toISOString()};
  try{
    await sendForm(payload);
    setStatus(I18N[lang].form.ok,true);
    cf.reset();
  }catch(err){
    setStatus(I18N[lang].form.err,false);
  }
});
cfReset?.addEventListener("click",()=>{cf?.reset();setStatus("",true)});

const copyBtn=document.getElementById("copy-email");
copyBtn?.addEventListener("click",async()=>{
  const a=document.getElementById("mailto-link");
  const email=a?.textContent?.trim()||"";
  try{
    await navigator.clipboard.writeText(email);
    copyBtn.textContent=document.documentElement.getAttribute("lang")==="de"?"Kopiert":"Copied";
    setTimeout(()=>{copyBtn.textContent=document.documentElement.getAttribute("lang")==="de"?"Kopieren":"Copy"},1200);
  }catch(_){}
});
