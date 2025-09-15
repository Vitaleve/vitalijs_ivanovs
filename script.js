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

const langBtns=document.querySelectorAll(".lang-btn");
function setLang(active){langBtns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===active)))}
langBtns.forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
setLang("de");
