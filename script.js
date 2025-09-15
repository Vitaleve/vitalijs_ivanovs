const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

const isFileProto=location.protocol==='file:';

const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{threshold:0.15});
document.querySelectorAll('.section,.card,.proj').forEach(el=>{el.classList.add('reveal');io.observe(el)});

const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
function closeNav(){nav?.classList.remove('active');menuToggle?.classList.remove('is-active');menuToggle?.setAttribute('aria-expanded','false')}
function openNav(){nav?.classList.add('active');menuToggle?.classList.add('is-active');menuToggle?.setAttribute('aria-expanded','true')}
if(menuToggle&&nav){
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.addEventListener('click',()=>{nav.classList.contains('active')?closeNav():openNav()});
  nav.addEventListener('click',e=>{if(e.target.tagName==='A')closeNav()});
  document.addEventListener('click',e=>{if(!e.target.closest('.nav')&&!e.target.closest('.menu-toggle'))closeNav()});
  window.addEventListener('resize',()=>{if(window.innerWidth>768)closeNav()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
}

function normalizePath(p){
  if(/^https?:\/\//i.test(p))return p;
  if(isFileProto)return p.replace(/^\.?\//,'');
  return new URL(p,document.baseURI).href;
}

document.addEventListener('click',async(e)=>{
  const b=e.target.closest('button');if(!b)return;
  const dl=b.getAttribute('data-download');
  if(dl){
    e.preventDefault();e.stopPropagation();
    const src=normalizePath(dl);
    const name=b.getAttribute('data-filename')||dl.split('/').pop()||'download';
    await forceDownload(src,name);
    return;
  }
  const v=b.getAttribute('data-view');
  if(v){
    e.preventDefault();e.stopPropagation();
    openPDF(v);
  }
});

async function forceDownload(url,filename){
  if(isFileProto||/^file:\/\//i.test(url)){
    const a=document.createElement('a');a.href=url;a.download=filename;a.style.position='fixed';a.style.left='-9999px';
    document.body.appendChild(a);a.click();a.remove();return;
  }
  try{
    const r=await fetch(url,{cache:'no-cache',credentials:'same-origin'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const buf=await r.arrayBuffer();
    const blob=new Blob([buf],{type:'application/octet-stream'});
    const href=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=href;a.download=filename;a.style.position='fixed';a.style.left='-9999px';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(href),4000);
  }catch{
    const a=document.createElement('a');a.href=url;a.download=filename;a.style.position='fixed';a.style.left='-9999px';
    document.body.appendChild(a);a.click();a.remove();
  }
}

function openPDF(path){
  const modal=document.getElementById('pdfModal');
  const frame=document.getElementById('pdfFrame');
  if(!modal||!frame)return;

  const src=normalizePath(path);
  if(isFileProto){
    frame.src=src+'#zoom=page-width';
  }else{
    const viewer='https://unpkg.com/pdfjs-dist@3.11.174/web/viewer.html?file='+
      encodeURIComponent(src)+'#zoom=page-width&pagemode=none';
    frame.src=viewer;
  }

  modal.style.display='flex';
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}

function closePDF(){
  const modal=document.getElementById('pdfModal');
  const frame=document.getElementById('pdfFrame');
  if(!modal||!frame)return;
  frame.src='';
  modal.style.display='none';
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

document.querySelector('.close')?.addEventListener('click',closePDF);
document.getElementById('pdfModal')?.addEventListener('click',e=>{if(e.target.id==='pdfModal')closePDF()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePDF()});
