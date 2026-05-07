/**
 * catalog-render.js
 *
 * Render genérico para boats / transfers:
 * - Imagen principal + thumbnails (incluyendo videos)
 * - Specs (size, capacity)
 * - Botón de WhatsApp con texto preconfigurado
 *
 * Las páginas pasan un objeto `I18N` global con los textos según el idioma.
 */

(function (global) {
  const VIDEO_RX = /\.(mp4|mov|webm)$/i;

  function isVideo(src) { return VIDEO_RX.test(src); }
  function safeId(name) {
    return String(name)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  }

  function createThumbnail(src, idx, ownerId) {
    if (isVideo(src)) {
      return `<div class="thumbnail thumbnail-video" onclick="setMain('${ownerId}', '${src}')" style="background:#000;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.8rem;">▶</div>`;
    }
    return `<img src="${src}" alt="Thumb ${idx + 1}" loading="lazy" class="thumbnail" onclick="setMain('${ownerId}', '${src}')">`;
  }

  global.setMain = function (ownerId, src) {
    const el = document.getElementById('main-' + ownerId);
    if (!el) return;
    if (isVideo(src)) {
      el.outerHTML = `<video id="main-${ownerId}" src="${src}" class="boat-main-image" autoplay muted loop playsinline></video>`;
    } else {
      el.outerHTML = `<img id="main-${ownerId}" src="${src}" alt="" class="boat-main-image">`;
    }
  };

  // --------- BOATS ----------
  global.renderBoats = function (list) {
    const container = document.getElementById('boats-container');
    if (!container) return;
    container.innerHTML = '';
    const i18n = global.I18N || {};
    list.forEach(boat => {
      const id = safeId(boat.name);
      const main = boat.images[0];
      const card = document.createElement('div');
      card.className = 'boat-card reveal';
      const mainTag = isVideo(main)
        ? `<video id="main-${id}" src="${main}" class="boat-main-image" autoplay muted loop playsinline></video>`
        : `<img id="main-${id}" src="${main}" alt="${boat.name}" class="boat-main-image" loading="lazy">`;
      card.innerHTML = `
        <div class="boat-images">${mainTag}
          <div class="boat-thumbnails">
            ${boat.images.slice(0, 6).map((m, i) => createThumbnail(m, i, id)).join('')}
          </div>
        </div>
        <div class="boat-info">
          <h3 class="boat-name">${boat.name}</h3>
          <div class="boat-specs">
            <span class="boat-spec">📏 ${boat.size}</span>
            <span class="boat-spec">👥 ${boat.capacity}</span>
          </div>
          <p class="boat-category">${boat.category}</p>
          <a href="https://wa.me/573146263274?text=${encodeURIComponent(i18n.ctaText ? i18n.ctaText(boat.name) : 'Hi, I am interested in ' + boat.name)}"
             target="_blank" class="whatsapp-btn">
            <svg class="whatsapp-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ${i18n.bookCta || 'Book via WhatsApp'}
          </a>
        </div>
      `;
      container.appendChild(card);
    });
    revealOnScroll();
  };

  // --------- TRANSFERS ----------
  global.renderTransfers = function (list) {
    const container = document.getElementById('transfers-container');
    if (!container) return;
    container.innerHTML = '';
    const i18n = global.I18N || {};
    const isEs = (i18n.lang === 'es');
    list.forEach(v => {
      const id = safeId(v.slug);
      const main = v.images[0];
      const cap = isEs ? (v.capacityEs || v.capacity) : v.capacity;
      const card = document.createElement('div');
      card.className = 'boat-card reveal';
      const mainTag = isVideo(main)
        ? `<video id="main-${id}" src="${main}" class="boat-main-image" autoplay muted loop playsinline></video>`
        : `<img id="main-${id}" src="${main}" alt="${v.name}" class="boat-main-image" loading="lazy">`;
      card.innerHTML = `
        <div class="boat-images">${mainTag}
          <div class="boat-thumbnails">
            ${v.images.slice(0, 6).map((m, i) => createThumbnail(m, i, id)).join('')}
          </div>
        </div>
        <div class="boat-info">
          <h3 class="boat-name">${v.name}</h3>
          <div class="boat-specs">
            <span class="boat-spec">${i18n.spec ? i18n.spec.type : '🚙'} ${v.type}</span>
            <span class="boat-spec">${i18n.spec ? i18n.spec.capacity : '👥'} ${cap}</span>
          </div>
          <a href="https://wa.me/573146263274?text=${encodeURIComponent(i18n.ctaText ? i18n.ctaText(v.name) : 'Hi, I am interested in the ' + v.name + ' transfer')}"
             target="_blank" class="whatsapp-btn">
            <svg class="whatsapp-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ${i18n.bookCta || 'Book via WhatsApp'}
          </a>
        </div>
      `;
      container.appendChild(card);
    });
    revealOnScroll();
  };

  // --------- DAY TRIPS gallery ----------
  global.renderDayTrips = function (items) {
    const container = document.getElementById('daytrips-container');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((m, idx) => {
      const tile = document.createElement('div');
      tile.className = 'mosaic-item' + (m.type === 'video' ? ' video' : '') + (idx === 0 ? ' wide' : '');
      tile.dataset.src = m.src;
      tile.dataset.type = m.type;
      tile.innerHTML = m.type === 'video'
        ? `<video src="${m.src}" muted playsinline preload="metadata"></video>`
        : `<img src="${m.src}" alt="Day trip ${idx + 1}" loading="lazy">`;
      tile.addEventListener('click', () => openLightbox(m));
      container.appendChild(tile);
    });
    revealOnScroll();
  };

  function openLightbox(m) {
    let lb = document.querySelector('.lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.innerHTML = `<button class="lightbox-close" aria-label="Close">×</button><div class="lightbox-content"></div>`;
      document.body.appendChild(lb);
      lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('active'); });
      lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('active'));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('active'); });
    }
    const c = lb.querySelector('.lightbox-content');
    c.innerHTML = m.type === 'video'
      ? `<video src="${m.src}" controls autoplay></video>`
      : `<img src="${m.src}" alt="">`;
    lb.classList.add('active');
  }

  // --------- Reveal on scroll ----------
  function revealOnScroll() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  // Sticky header scrolled
  document.addEventListener('DOMContentLoaded', () => {
    const h = document.querySelector('header');
    if (h) window.addEventListener('scroll', () => {
      h.classList.toggle('scrolled', window.scrollY > 30);
    });
    revealOnScroll();
  });
})(window);
