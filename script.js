document.getElementById('year').textContent = new Date().getFullYear();

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.section, .card, .proj').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeNav(){
  nav.classList.remove('active');
  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded','false');
}
function openNav(){
  nav.classList.add('active');
  menuToggle.classList.add('is-active');
  menuToggle.setAttribute('aria-expanded','true');
}

if (menuToggle && nav) {
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.addEventListener('click', () => {
    if (nav.classList.contains('active')) closeNav(); else openNav();
  });
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeNav(); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) closeNav();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeNav(); });
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const dl = btn.getAttribute('data-download');
  if (dl) {
    e.preventDefault();
    e.stopPropagation();
    const name = btn.getAttribute('data-filename') || dl.split('/').pop() || 'download';
    await forceDownload(dl, name);
    return;
  }

  const view = btn.getAttribute('data-view');
  if (view) {
    e.preventDefault();
    e.stopPropagation();
    openPDF(view);
  }
});

async function forceDownload(url, filename) {
  try {
    const res = await fetch(url, { cache: 'no-cache', credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    triggerDownloadFromBlob(blob, filename);
  } catch (_) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
          triggerDownloadFromBlob(blob, filename);
        } else {
          fallbackLink(url, filename);
        }
      };
      xhr.onerror = function () { fallbackLink(url, filename); };
      xhr.send();
    } catch (_) {
      fallbackLink(url, filename);
    }
  }
}

function triggerDownloadFromBlob(blob, filename) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

function fallbackLink(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function fitPdfUrl(url) {
  if (!/\.pdf(?:$|\?)/i.test(url)) return url;
  const join = url.includes('#') ? '&' : '#';
  return url + join + 'zoom=page-fit&view=Fit&toolbar=0&navpanes=0&scrollbar=0';
}

function openPDF(url) {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  frame.src = fitPdfUrl(url);
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePDF() {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  frame.src = '';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePDF(); });
document.getElementById('pdfModal')?.addEventListener('click', (e) => { if (e.target.id === 'pdfModal') closePDF(); });
