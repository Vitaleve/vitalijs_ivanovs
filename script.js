// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Плавное появление секций
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
},{threshold:0.15});
document.querySelectorAll('.section, .card, .proj').forEach(el=>{
  el.classList.add('reveal'); io.observe(el);
});

/* ===== Делегирование событий для всех кнопок ===== */
document.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;

  // скачивание
  const dl = btn.getAttribute('data-download');
  if(dl){
    e.preventDefault(); e.stopPropagation();
    const name = btn.getAttribute('data-filename') || dl.split('/').pop() || 'download';
    await forceDownload(dl, name);
    return;
  }

  // просмотр
  const view = btn.getAttribute('data-view');
  if(view){
    e.preventDefault(); e.stopPropagation();
    openPDF(view);
    return;
  }
});

/* ===== ГАРАНТИРОВАННОЕ СКАЧИВАНИЕ, без открытия в браузере ===== */
async function forceDownload(url, filename){
  try{
    // 1) нормальный случай: fetch → arrayBuffer → Blob(octet-stream) → <a download>
    const res = await fetch(url, { cache: 'no-cache', credentials: 'same-origin' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    triggerDownloadFromBlob(blob, filename);
  }catch(err){
    // 2) fallback для file:// или жёстких ограничений
    try{
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function(){
        if(xhr.status === 200){
          const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
          triggerDownloadFromBlob(blob, filename);
        }else{
          // 3) последний шанс — <a download> (иногда браузер всё же откроет)
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          a.style.position = 'fixed'; a.style.left = '-9999px';
          document.body.appendChild(a); a.click(); a.remove();
        }
      };
      xhr.onerror = function(){
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', filename);
        a.style.position = 'fixed'; a.style.left = '-9999px';
        document.body.appendChild(a); a.click(); a.remove();
      };
      xhr.send();
    }catch(_){
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', filename);
      a.style.position = 'fixed'; a.style.left = '-9999px';
      document.body.appendChild(a); a.click(); a.remove();
    }
  }
}

function triggerDownloadFromBlob(blob, filename){
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename || 'download';
  a.style.position = 'fixed'; a.style.left = '-9999px';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=> URL.revokeObjectURL(href), 4000); // Safari успеет начать загрузку
}

/* ===== Просмотр PDF в модалке (страница целиком) ===== */
function fitPdfUrl(url){
  if(!/\.pdf(?:$|\?)/i.test(url)) return url;
  const join = url.includes('#') ? '&' : '#';
  return url + join + 'zoom=page-fit&view=Fit&toolbar=0&navpanes=0&scrollbar=0';
}
function openPDF(url){
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  frame.src = fitPdfUrl(url);
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closePDF(){
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  frame.src = '';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closePDF(); });
document.getElementById('pdfModal')?.addEventListener('click', (e)=>{ if(e.target.id === 'pdfModal') closePDF(); });
