document.getElementById('year').textContent = new Date().getFullYear();

// Плавное появление блоков при скролле
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section, .card, .proj').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

// Меню (гамбургер)
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeNav() {
  nav.classList.remove('active');
  menuToggle?.classList.remove('is-active');
  menuToggle?.setAttribute('aria-expanded', 'false');
}
function openNav() {
  nav.classList.add('active');
  menuToggle?.classList.add('is-active');
  menuToggle?.setAttribute('aria-expanded', 'true');
}
if (menuToggle && nav) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', () => {
    nav.classList.contains('active') ? closeNav() : openNav();
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) closeNav();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
}

// Клики по кнопкам: скачать / посмотреть
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const dl = btn.getAttribute('data-download');
  if (dl) {
    e.preventDefault(); e.stopPropagation();
    const name = btn.getAttribute('data-filename') || dl.split('/').pop() || 'download';
    await forceDownload(dl, name);
    return;
  }

  const view = btn.getAttribute('data-view');
  if (view) {
    e.preventDefault(); e.stopPropagation();
    openPDF(view);
  }
});

// Скачивание (всегда файл, без открытия)
async function forceDownload(url, filename) {
  try {
    const res = await fetch(url, { cache: 'no-cache', credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = await res.arrayBuffer();
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    triggerDownloadFromBlob(blob, filename);
  } catch (_) {
    fallbackLink(url, filename);
  }
}
function triggerDownloadFromBlob(blob, filename) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  a.style.position = 'fixed'; a.style.left = '-9999px';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}
function fallbackLink(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.setAttribute('download', filename);
  a.style.position = 'fixed'; a.style.left = '-9999px';
  document.body.appendChild(a); a.click(); a.remove();
}

// Подготовка URL для PDF (подгоняем масштаб)
function fitPdfUrl(url) {
  if (!/\.pdf(?:$|\?)/i.test(url)) return url;
  const join = url.includes('#') ? '&' : '#';
  return url + join + 'zoom=page-fit&view=Fit&toolbar=0&navpanes=0&scrollbar=0';
}

// Детект: включён ли встроенный PDF-просмотр в браузере
function canInlinePDF() {
  // Chrome/Edge/Opera имеют navigator.pdfViewerEnabled (true/false)
  if ('pdfViewerEnabled' in navigator) return !!navigator.pdfViewerEnabled;
  // Firefox обычно поддерживает inline, вернём true по умолчанию
  return true;
}

// Модалка PDF с фолбэком на новую вкладку
function openPDF(url) {
  const src = fitPdfUrl(url);

  // Если в браузере отключён просмотр PDF — открываем новую вкладку
  if (!canInlinePDF()) {
    window.open(url, '_blank', 'noopener');
    return;
  }

  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');

  let loaded = false;
  const onLoad = () => { loaded = true; cleanup(); };
  const onError = () => { cleanup(); fallbackOpen(); };

  function cleanup() {
    frame.removeEventListener('load', onLoad);
    frame.removeEventListener('error', onError);
  }
  function fallbackOpen() {
    closePDF();
    window.open(url, '_blank', 'noopener');
  }

  frame.addEventListener('load', onLoad, { once: true });
  frame.addEventListener('error', onError, { once: true });

  // Таймаут: если за 2000 мс фрейм не загрузился — считаем, что просмотрщик отключён
  const t = setTimeout(() => {
    if (!loaded) { cleanup(); fallbackOpen(); }
  }, 2000);

  // Откроем модалку и поставим src
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  frame.src = src;

  // Если всё загрузилось — отменим таймер
  frame.addEventListener('load', () => clearTimeout(t), { once: true });
}

function closePDF() {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  frame.src = '';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

// Закрытие модалки
document.querySelector('.close')?.addEventListener('click', closePDF);
document.getElementById('pdfModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'pdfModal') closePDF();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePDF();
});
