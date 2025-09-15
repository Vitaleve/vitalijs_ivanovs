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
    openPDF(src);
  });
});
document.querySelector(".close")?.addEventListener("click",closePDF);
document.getElementById("pdfModal")?.addEventListener("click",e=>{
  const box=e.target.closest(".modal-content");
  if(!box)closePDF();
});
document.querySelector(".modal-content")?.addEventListener("click",e=>e.stopPropagation());

async function forceDownload(url,filename){
  try{
    const res=await fetch(url,{cache:"no-cache",credentials:"same-origin"});
    if(!res.ok)throw new Error();
    const blob=await res.blob();
    const href=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=href;
    a.download=filename||url.split("/").pop();
    a.style.display="none";
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(href);a.remove()},400);
  }catch(e){
    const a=document.createElement("a");
    a.href=url;
    a.download=filename||url.split("/").pop();
    a.style.display="none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
document.querySelectorAll("[data-download]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const url=btn.getAttribute("data-download");
    const name=btn.getAttribute("data-filename")||url.split("/").pop();
    forceDownload(url,name);
  });
});

const themeSegs=document.querySelectorAll(".theme-seg");
const themeSwitch=document.querySelector(".theme-switch");
function applyTheme(val){
  if(val==="light"||val==="dark"){document.documentElement.setAttribute("data-theme",val)}
  else{document.documentElement.setAttribute("data-theme","auto")}
  localStorage.setItem("theme",val);
  themeSwitch?.setAttribute("data-active",val);
  themeSegs.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===val)));
}
const savedTheme=localStorage.getItem("theme")||"auto";
applyTheme(savedTheme);
themeSegs.forEach(b=>b.addEventListener("click",()=>applyTheme(b.dataset.theme)));

const LS_LANG="site_lang";
const DEFAULT_LANG="de";

const I18N = {
  de: {
    title: "Bewerbungsunterlagen — Dein Name",
    nav: ["Über mich","Lebenslauf","Unterlagen","Projekte","Kontakt"],
    heroWord: "BEWERBUNG",
    heroSubtitle: "Pflichtpraktikum als Fachinformatiker für Anwendungsentwicklung",
    heroCta: "Unterlagen ansehen",
    about_h2: "Über mich",
    about_p: "Ich absolviere aktuell eine Umschulung zum Fachinformatiker für Anwendungsentwicklung und suche ab April 2026 ein Pflichtpraktikum. Während meiner Ausbildung habe ich Kenntnisse in Java, Python, Webentwicklung (HTML, CSS, JavaScript) und Datenbanken erworben. Mein Ziel ist es, praktische Erfahrung in einem professionellen Umfeld zu sammeln und meine Fähigkeiten weiterzuentwickeln.",
    cv_h2: "Lebenslauf",
    cv_item1_h3: "Umschulung · GFN GmbH — Fachrichtung IT",
    cv_item1_p: "Schwerpunkte: Java, Python, HTML, CSS, JavaScript. Praxisphase: 22.04.2026–18.01.2027.",
    cv_item2_h3: "Bisherige Erfahrungen",
    cv_item2_p: "Eigene Projekte im Bereich Webentwicklung, API-Design, Automatisierung und Benutzeroberflächen.",
    cv_btn: "Kompletter Lebenslauf unten",
    docs_h2: "Unterlagen",
    docs_card1_h3: "Anschreiben · Cover Letter",
    docs_card1_p: "Anschreiben für ein Pflichtpraktikum im IT-Bereich · Cover letter for an internship in software development.",
    docs_card1_buttons: { de_dl:"DE herunterladen", de_view:"DE ansehen", en_dl:"EN download", en_view:"EN view" },
    docs_card2_h3: "Lebenslauf · CV",
    docs_card2_p: "Aktueller Lebenslauf in Deutsch und Englisch · Current CV in German and English.",
    docs_card2_buttons: { de_dl:"DE herunterladen", de_view:"DE ansehen", en_dl:"EN download", en_view:"EN view" },
    docs_card3_h3: "Zeugnisse & Zertifikate",
    docs_card3_p: "Nachweise über Abschlüsse, Weiterbildungen und relevante Zertifikate.",
    docs_card3_buttons: { dl:"Herunterladen", view:"Im Browser ansehen" },
    docs_card4_h3: "Zeugnis (GFN GmbH)",
    docs_card4_p: "Zeugnis meiner Umschulung zum Fachinformatiker für Anwendungsentwicklung.",
    docs_card4_buttons: { dl:"Herunterladen", view:"Im Browser ansehen" },
    docs_card5_h3: "Alle Unterlagen (ZIP)",
    docs_card5_p: "Gesamtes Paket aller Dokumente.",
    docs_card5_buttons: { dl:"Herunterladen" },
    projects_h2: "Ausgewählte Projekte",
    proj1_h3: "Travel World UI",
    proj1_p: "Interaktives Hero mit Hover-Reveal, Collage-Layout und flüssiger Motion.",
    proj2_h3: "API · FastAPI",
    proj2_p: "Service-Design, Endpunkte, Fehlerbehandlung und einfache Authentifizierung.",
    contact_h2: "Kontakt",
    contact_email_label: "E-Mail:",
    contact_loc_label: "Standort:",
    copyright: "Alle Rechte vorbehalten.",
    modal_arialabel: "Dokument-Vorschau",
    modal_close_title: "Schließen"
  },
  en: {
    title: "Application Documents — Your Name",
    nav: ["About me","CV","Documents","Projects","Contact"],
    heroWord: "APPLICATION",
    heroSubtitle: "Mandatory internship as IT specialist for application development",
    heroCta: "View documents",
    about_h2: "About me",
    about_p: "I am currently retraining as an IT specialist in application development and I am looking for a mandatory internship starting April 2026. During my training I gained skills in Java, Python, web development (HTML, CSS, JavaScript) and databases. My goal is to gain hands-on experience in a professional environment and further develop my skills.",
    cv_h2: "CV",
    cv_item1_h3: "Retraining · GFN GmbH — IT focus",
    cv_item1_p: "Focus areas: Java, Python, HTML, CSS, JavaScript. Practical phase: 22/04/2026–18/01/2027.",
    cv_item2_h3: "Previous experience",
    cv_item2_p: "Personal projects in web development, API design, automation and user interfaces.",
    cv_btn: "Full résumé below",
    docs_h2: "Documents",
    docs_card1_h3: "Cover Letter",
    docs_card1_p: "Cover letter for a mandatory internship in software development.",
    docs_card1_buttons: { de_dl:"Download DE", de_view:"View DE", en_dl:"Download EN", en_view:"View EN" },
    docs_card2_h3: "CV / Résumé",
    docs_card2_p: "Up-to-date résumé in German and English.",
    docs_card2_buttons: { de_dl:"Download DE", de_view:"View DE", en_dl:"Download EN", en_view:"View EN" },
    docs_card3_h3: "Certificates",
    docs_card3_p: "Proof of degrees, trainings and relevant certificates.",
    docs_card3_buttons: { dl:"Download", view:"View in browser" },
    docs_card4_h3: "Certificate (GFN GmbH)",
    docs_card4_p: "Certificate of my retraining as an IT specialist in application development.",
    docs_card4_buttons: { dl:"Download", view:"View in browser" },
    docs_card5_h3: "All documents (ZIP)",
    docs_card5_p: "Complete package of all documents.",
    docs_card5_buttons: { dl:"Download" },
    projects_h2: "Selected projects",
    proj1_h3: "Travel World UI",
    proj1_p: "Interactive hero with hover-reveal, collage layout and smooth motion.",
    proj2_h3: "API · FastAPI",
    proj2_p: "Service design, endpoints, error handling and simple authentication.",
    contact_h2: "Contact",
    contact_email_label: "Email:",
    contact_loc_label: "Location:",
    copyright: "All rights reserved.",
    modal_arialabel: "Document preview",
    modal_close_title: "Close"
  }
};

function getLang(){
  const saved = localStorage.getItem(LS_LANG);
  if (saved && I18N[saved]) return saved;
  const browser = (navigator.language||"").slice(0,2).toLowerCase();
  return I18N[browser] ? browser : DEFAULT_LANG;
}

function setBrandWord(word){
  const brand = document.querySelector(".brand");
  if(!brand) return;
  const letters = word.toUpperCase().split("").map(ch=>`<span>${ch}</span>`).join("");
  brand.innerHTML = letters;
}

function langOfUrl(u){
  if(!u) return "de";
  const s=u.toUpperCase();
  if(/(^|[_-])EN(\.|_|$)/.test(s)) return "en";
  if(/(^|[_-])DE(\.|_|$)/.test(s)) return "de";
  if(/\bEN\b/.test(s)) return "en";
  if(/\bDE\b/.test(s)) return "de";
  return "de";
}

function filterDocsByLang(lang){
  const cards=document.querySelectorAll("#docs .cards > .card");
  cards.forEach(card=>{
    const btns=card.querySelectorAll(".btn");
    let has=false;
    btns.forEach(btn=>{
      const url=btn.getAttribute("data-download")||btn.getAttribute("data-view")||"";
      const dl=langOfUrl(url);
      const show=(dl===lang);
      btn.style.display=show?"":"none";
      btn.setAttribute("aria-hidden",String(!show));
      if(show) has=true;
    });
    if(!has){
      card.style.display="none";
      card.setAttribute("aria-hidden","true");
    }else{
      card.style.display="";
      card.removeAttribute("aria-hidden");
    }
  });
}

const header=document.querySelector('.topbar');
function syncHeaderOffset(){ if(header){ document.body.style.paddingTop = header.offsetHeight + 'px'; } }
window.addEventListener('load', syncHeaderOffset);
window.addEventListener('resize', syncHeaderOffset);

function applyTranslations(lang){
  const t = I18N[lang] || I18N[DEFAULT_LANG];
  document.title = t.title;
  document.documentElement.setAttribute("lang", lang);
  const navLinks = document.querySelectorAll(".nav a");
  if (navLinks.length >= 5) {
    navLinks[0].textContent = t.nav[0];
    navLinks[1].textContent = t.nav[1];
    navLinks[2].textContent = t.nav[2];
    navLinks[3].textContent = t.nav[3];
    navLinks[4].textContent = t.nav[4];
  }
  setBrandWord(t.heroWord);
  const subtitle = document.querySelector(".subtitle");
  if (subtitle) subtitle.textContent = t.heroSubtitle;
  const cta = document.querySelector(".cta");
  if (cta) cta.textContent = t.heroCta;
  const about = document.getElementById("about");
  if (about){
    const h2 = about.querySelector("h2");
    const p  = about.querySelector("p");
    if(h2) h2.textContent = t.about_h2;
    if(p)  p.textContent  = t.about_p;
  }
  const cv = document.getElementById("cv");
  if (cv){
    const h2 = cv.querySelector("h2");
    const items = cv.querySelectorAll(".timeline article");
    const btn = cv.querySelector(".btn.ghost[href='#docs']");
    if(h2) h2.textContent = t.cv_h2;
    if(items[0]){
      const h3 = items[0].querySelector("h3");
      const p  = items[0].querySelector("p");
      if(h3) h3.textContent = t.cv_item1_h3;
      if(p)  p.textContent  = t.cv_item1_p;
    }
    if(items[1]){
      const h3 = items[1].querySelector("h3");
      const p  = items[1].querySelector("p");
      if(h3) h3.textContent = t.cv_item2_h3;
      if(p)  p.textContent  = t.cv_item2_p;
    }
    if(btn) btn.textContent = t.cv_btn;
  }
  const docs = document.getElementById("docs");
  if (docs){
    const h2 = docs.querySelector("h2");
    if(h2) h2.textContent = t.docs_h2;
    const cards = docs.querySelectorAll(".cards > .card");
    if(cards[0]){
      const h3 = cards[0].querySelector("h3");
      const p  = cards[0].querySelector("p");
      const [b1,b2,b3,b4] = cards[0].querySelectorAll(".doc-actions .btn");
      if(h3) h3.textContent = t.docs_card1_h3;
      if(p)  p.textContent  = t.docs_card1_p;
      if(b1) b1.textContent = t.docs_card1_buttons.de_dl;
      if(b2) b2.textContent = t.docs_card1_buttons.de_view;
      if(b3) b3.textContent = t.docs_card1_buttons.en_dl;
      if(b4) b4.textContent = t.docs_card1_buttons.en_view;
    }
    if(cards[1]){
      const h3 = cards[1].querySelector("h3");
      const p  = cards[1].querySelector("p");
      const [b1,b2,b3,b4] = cards[1].querySelectorAll(".doc-actions .btn");
      if(h3) h3.textContent = t.docs_card2_h3;
      if(p)  p.textContent  = t.docs_card2_p;
      if(b1) b1.textContent = t.docs_card2_buttons.de_dl;
      if(b2) b2.textContent = t.docs_card2_buttons.de_view;
      if(b3) b3.textContent = t.docs_card2_buttons.en_dl;
      if(b4) b4.textContent = t.docs_card2_buttons.en_view;
    }
    if(cards[2]){
      const h3 = cards[2].querySelector("h3");
      const p  = cards[2].querySelector("p");
      const [b1,b2] = cards[2].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card3_h3;
      if(p)  p.textContent  = t.docs_card3_p;
      if(b1) b1.textContent = t.docs_card3_buttons.dl;
      if(b2) b2.textContent = t.docs_card3_buttons.view;
    }
    if(cards[3]){
      const h3 = cards[3].querySelector("h3");
      const p  = cards[3].querySelector("p");
      const [b1,b2] = cards[3].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card4_h3;
      if(p)  p.textContent  = t.docs_card4_p;
      if(b1) b1.textContent = t.docs_card4_buttons.dl;
      if(b2) b2.textContent = t.docs_card4_buttons.view;
    }
    if(cards[4]){
      const h3 = cards[4].querySelector("h3");
      const p  = cards[4].querySelector("p");
      const [b1] = cards[4].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card5_h3;
      if(p)  p.textContent  = t.docs_card5_p;
      if(b1) b1.textContent = t.docs_card5_buttons.dl;
    }
  }
  const projects = document.getElementById("projects");
  if (projects){
    const h2 = projects.querySelector("h2");
    const items = projects.querySelectorAll(".projects .proj");
    if(h2) h2.textContent = t.projects_h2;
    if(items[0]){
      const h3 = items[0].querySelector("h3");
      const p  = items[0].querySelector("p");
      if(h3) h3.textContent = t.proj1_h3;
      if(p)  p.textContent  = t.proj1_p;
    }
    if(items[1]){
      const h3 = items[1].querySelector("h3");
      const p  = items[1].querySelector("p");
      if(h3) h3.textContent = t.proj2_h3;
      if(p)  p.textContent  = t.proj2_p;
    }
  }
  const contact = document.getElementById("contact");
  if (contact){
    const h2 = contact.querySelector("h2");
    const ps = contact.querySelectorAll("p");
    const tiny = contact.querySelector(".tiny");
    if(h2) h2.textContent = t.contact_h2;
    if(ps[0]){
      const emailLabel = ps[0].querySelector("span");
      if(emailLabel) emailLabel.textContent = t.contact_email_label;
    }
    if(ps[1]){
      ps[1].innerHTML = `<span>${t.contact_loc_label}</span> Mastershausen, DE – Koblenz, DE`;
    }
    if(tiny){
      const year = new Date().getFullYear();
      tiny.textContent = `© ${year} · ${t.copyright}`;
    }
  }
  const modalContent = document.querySelector(".modal-content");
  const modalClose = document.querySelector(".close");
  if(modalContent) modalContent.setAttribute("aria-label", t.modal_arialabel);
  if(modalClose){
    modalClose.setAttribute("aria-label", t.modal_close_title);
    modalClose.setAttribute("title", t.modal_close_title);
  }
  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.setAttribute("aria-pressed", String(b.dataset.lang===lang));
  });
  filterDocsByLang(lang);
  syncHeaderOffset();
}

function setLanguage(lang){
  if(!I18N[lang]) lang = DEFAULT_LANG;
  localStorage.setItem(LS_LANG, lang);
  applyTranslations(lang);
}

const langBtns=document.querySelectorAll(".lang-btn");
langBtns.forEach(b=>{
  b.addEventListener("click",()=>{
    const lang=b.dataset.lang||"de";
    setLanguage(lang);
  });
});
applyTranslations(getLang());
