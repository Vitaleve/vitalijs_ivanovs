const y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();

/* Burger / mobile nav */
const menuBtn=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuBtn&&nav){
  menuBtn.addEventListener("click",()=>{menuBtn.classList.toggle("is-active");nav.classList.toggle("active")});
  document.addEventListener("click",e=>{if(!nav.contains(e.target)&&!menuBtn.contains(e.target)){menuBtn.classList.remove("is-active");nav.classList.remove("active")}});
  window.addEventListener("resize",()=>{if(window.innerWidth>768){menuBtn.classList.remove("is-active");nav.classList.remove("active")}})
}

/* Modal PDF preview */
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

/* Force download */
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

/* Theme switch with smooth fade */
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

/* I18N */
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
    contact_email_btn: "E-Mail senden",
    contact_linkedin_btn: "LinkedIn öffnen",
    copyright: "Alle Rechte vorbehalten.",
    modal_arialabel: "Dokument-Vorschau",
    modal_close_title: "Schließen",
    qf_docs: "📄 Unterlagen",
    qf_contact: "📧 Kontakt",
    qr_text: "📱 Scanne den QR-Code für schnellen Zugriff:",
    qr_alt: "QR-Code zum Bewerbungsportal"
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
    contact_email_btn: "Send email",
    contact_linkedin_btn: "Open LinkedIn",
    copyright: "All rights reserved.",
    modal_arialabel: "Document preview",
    modal_close_title: "Close",
    qf_docs: "📄 Documents",
    qf_contact: "📧 Contact",
    qr_text: "📱 Scan the QR code for quick access:",
    qr_alt: "QR code to the application page"
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
function toggleDocCards(lang){
  document.querySelectorAll(".de-only").forEach(el=>el.hidden = (lang!=="de"));
  document.querySelectorAll(".en-only").forEach(el=>el.hidden = (lang!=="en"));
}
const headerEl=document.querySelector('.topbar');
const qfEl=document.querySelector('.quick-footer');
function syncOffsets(){
  const h=headerEl?headerEl.offsetHeight:0;
  const qf= (qfEl && getComputedStyle(qfEl).display!=="none") ? qfEl.offsetHeight : 0;
  document.body.style.paddingTop = h+'px';
  document.body.style.paddingBottom = Math.max(0,qf-10)+'px';
}
window.addEventListener('load',syncOffsets);
window.addEventListener('resize',syncOffsets);

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

    const cards = docs.querySelectorAll(".cards > .card:not(.de-only):not(.en-only)");
    if(cards[0]){
      const h3 = cards[0].querySelector("h3");
      const p  = cards[0].querySelector("p");
      const [b1,b2] = cards[0].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card3_h3;
      if(p)  p.textContent  = t.docs_card3_p;
      if(b1) b1.textContent = t.docs_card3_buttons.dl;
      if(b2) b2.textContent = t.docs_card3_buttons.view;
    }
    if(cards[1]){
      const h3 = cards[1].querySelector("h3");
      const p  = cards[1].querySelector("p");
      const [b1,b2] = cards[1].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card4_h3;
      if(p)  p.textContent  = t.docs_card4_p;
      if(b1) b1.textContent = t.docs_card4_buttons.dl;
      if(b2) b2.textContent = t.docs_card4_buttons.view;
    }
    if(cards[2]){
      const h3 = cards[2].querySelector("h3");
      const p  = cards[2].querySelector("p");
      const [b1] = cards[2].querySelectorAll(".card-actions .btn");
      if(h3) h3.textContent = t.docs_card5_h3;
      if(p)  p.textContent  = t.docs_card5_p;
      if(b1) b1.textContent = t.docs_card5_buttons.dl;
    }
  }

  const contact = document.getElementById("contact");
  if (contact){
    const h2 = contact.querySelector("h2");
    const ps = contact.querySelectorAll("p");
    const tiny = contact.querySelector(".tiny");
    if(h2) h2.textContent = t.contact_h2;
    if(ps[0]){ const s=ps[0].querySelector("span"); if(s) s.textContent=t.contact_email_label; }
    if(ps[1]){ ps[1].innerHTML = `<span>${t.contact_loc_label}</span> Mastershausen – Koblenz, DE`; }
    if(tiny){
      const year = new Date().getFullYear();
      tiny.textContent = `© ${year} · ${t.copyright}`;
    }
    const emailBtn=document.getElementById("contact-email-btn");
    const liBtn=document.getElementById("contact-linkedin-btn");
    if(emailBtn) emailBtn.textContent = t.contact_email_btn;
    if(liBtn) liBtn.textContent = t.contact_linkedin_btn;
  }

  const qfDocs=document.querySelector(".qf-docs");
  const qfContact=document.querySelector(".qf-contact");
  if(qfDocs) qfDocs.textContent = t.qf_docs;
  if(qfContact) qfContact.textContent = t.qf_contact;

  const modalContent = document.querySelector(".modal-content");
  const modalClose = document.querySelector(".close");
  if(modalContent) modalContent.setAttribute("aria-label", t.modal_arialabel);
  if(modalClose){
    modalClose.setAttribute("aria-label", t.modal_close_title);
    modalClose.setAttribute("title", t.modal_close_title);
  }

  // QR по текущему URL
  const qrText=document.querySelector(".qr-box p");
  const qrImg=document.getElementById("qr-img");
  if(qrText) qrText.textContent = t.qr_text;
  if(qrImg){
    qrImg.alt = t.qr_alt;
    const url = window.location.href;
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data="+encodeURIComponent(url);
  }

  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.setAttribute("aria-pressed", String(b.dataset.lang===lang));
  });

  toggleDocCards(lang);
  syncOffsets();
}

/* language switch */
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

/* init */
applyTranslations(getLang());
