document.getElementById('year').textContent = new Date().getFullYear();

(function setupScrollRestore(){
  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry ? navEntry.type === 'reload' : (performance.navigation && performance.navigation.type === 1);
  if (!isReload) return;
  if (location.hash) return;

  const saved = sessionStorage.getItem('scrollY');
  const y = saved ? parseInt(saved, 10) : 0;

  if (Number.isFinite(y) && y > 0) {
    let t0 = performance.now();
    const end = t0 + 800; // мягкая «поддержка» ~0.8с, без дерганий
    const target = y;
    const tick = () => {
      if (performance.now() > end) return;
      if (Math.abs(window.scrollY - target) > 2) window.scrollTo(0, target);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  sessionStorage.removeItem('scrollY');
})();

(function setupScrollSave(){
  const save = () => {
    if (location.hash) return;
    sessionStorage.setItem('scrollY', String(window.scrollY || document.documentElement.scrollTop || 0));
  };
  window.addEventListener('beforeunload', save, {capture:true});
  window.addEventListener('pagehide', save, {capture:true});
})();

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
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') nav.classList.remove('active'); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) nav.classList.remove('active'); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) nav.classList.remove('active'); });
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
