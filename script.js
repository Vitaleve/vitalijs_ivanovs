history.scrollRestoration="auto";

const SCROLL_KEY="last_scroll_pos";
const saveScroll=()=>{try{localStorage.setItem(SCROLL_KEY,String(window.pageYOffset||window.scrollY||0))}catch(e){}};
window.addEventListener("beforeunload",saveScroll,{passive:true});
window.addEventListener("pagehide",saveScroll,{passive:true});
window.addEventListener("pageshow",e=>{
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
  btn.addEventListener("click",()=>{
    const url=btn.getAttribute("data-download");
    const name=btn.getAttribute("data-filename")||url.split("/").pop();
    addStat(btn.getAttribute("data-stats-key")||name);
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
function applyTheme(val){
  if(val==="light"||val==="dark"){document.documentElement.setAttribute("data-theme",val)}
  else{document.documentElement.setAttribute("data-theme","auto")}
  localStorage.setItem("theme",val);
  themeSwitch?.setAttribute("data-active",val);
  themeSegs.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===val)));
}
applyTheme(localStorage.getItem("theme")||"auto");
themeSegs.forEach(b=>b.addEventListener("click",()=>applyTheme(b.dataset.theme)));

const LS_LANG="site_lang";
const DEFAULT_LANG="de";
const I18N={
  de:{title:"Vitalijs Ivanovs Praktikum",nav:["Über mich","Lebenslauf","Unterlagen","Projekte","Kontakt"],heroWord:"BEWERBUNG",heroSubtitle:"Pflichtpraktikum als Fachinformatiker für Anwendungsentwicklung",heroCta:"Unterlagen ansehen",qf_docs:"📄 Unterlagen",qf_contact:"📧 Kontakt",modal_close:"Schließen",qr_alt:"QR-Code zum Bewerbungsportal"},
  en:{title:"Vitalijs Ivanovs Praktikum",nav:["About me","CV","Documents","Projects","Contact"],heroWord:"APPLICATION",heroSubtitle:"Mandatory internship as IT specialist for application development",heroCta:"View documents",qf_docs:"📄 Documents",qf_contact:"📧 Contact",modal_close:"Close",qr_alt:"QR code to the application page"}
};

function getLang(){
  const saved=localStorage.getItem(LS_LANG);
  if(saved&&I18N[saved])return saved;
  const b=(navigator.language||"").slice(0,2).toLowerCase();
  return I18N[b]?b:DEFAULT_LANG;
}

function setBrandWord(word){
  const brand=document.querySelector(".brand");
  if(!brand)return;
  brand.innerHTML=word.toUpperCase().split("").map(ch=>`<span>${ch}</span>`).join("");
}

function applyTranslations(lang){
  const t=I18N[lang]||I18N[DEFAULT_LANG];
  document.title=t.title;
  document.documentElement.setAttribute("lang",lang);
  document.body.setAttribute("data-lang",lang);
  document.querySelectorAll(".lang-btn").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===lang)));
  const navLinks=document.querySelectorAll(".nav a");
  if(navLinks.length>=5){navLinks[0].textContent=t.nav[0];navLinks[1].textContent=t.nav[1];navLinks[2].textContent=t.nav[2];navLinks[3].textContent=t.nav[3];navLinks[4].textContent=t.nav[4];}
  const subtitle=document.querySelector(".subtitle"); if(subtitle)subtitle.textContent=t.heroSubtitle;
  const cta=document.querySelector(".cta"); if(cta)cta.textContent=t.heroCta;
  setBrandWord(t.heroWord);
  const qfDocs=document.querySelector(".qf-docs"); if(qfDocs)qfDocs.textContent=t.qf_docs;
  const qfContact=document.querySelector(".qf-contact"); if(qfContact)qfContact.textContent=t.qf_contact;
  const modalClose=document.querySelector(".close"); if(modalClose){modalClose.setAttribute("aria-label",t.modal_close);modalClose.setAttribute("title",t.modal_close);}
  const qrImg=document.getElementById("qr-img"); if(qrImg){qrImg.alt=t.qr_alt;qrImg.src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data="+encodeURIComponent(location.href);}
}

function setLanguage(lang){
  if(!I18N[lang])lang=DEFAULT_LANG;
  localStorage.setItem(LS_LANG,lang);
  applyTranslations(lang);
}

document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang||"de")));
applyTranslations(getLang());

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
