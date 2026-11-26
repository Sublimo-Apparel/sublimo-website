/* ==========================================================================
   Sublimo — behaviour
   Language toggle, menu, section sub-navbar, size tabs, lightbox,
   and the scroll/motion effects. Every feature checks that its elements
   exist, so the same file works on every page.
   ========================================================================== */
(function () {
  const D = window.SUBLIMO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  /* ---------- Language (EN / TL) ---------- */
  const EN = { ...D.EN };
  $$("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if (!(k in EN)) EN[k] = el.textContent; });
  $$("[data-i18n-html]").forEach(el => { EN[el.dataset.i18nHtml] = el.innerHTML; });
  let lang = "en";
  const t = k => (lang === "tl" && D.TL[k] !== undefined ? D.TL[k] : EN[k] ?? "");

  function renderFabrics() {
    const grid = $("#fab-grid"); if (!grid) return;
    grid.innerHTML = D.FABRICS.map(f => `
      <article class="grid content-start gap-3 bg-ink px-5.5 pt-6.5 pb-6 transition-colors hover:bg-ink-2">
        <div class="font-display text-[clamp(3.2rem,5vw,4.4rem)] font-extrabold leading-[.85] tabular-nums">${f.g}<small class="ml-1.5 text-[.9rem] tracking-[.2em] text-mint">GSM</small></div>
        <div class="h-0.75 bg-ink-3" role="img" aria-label="${f.g} of 200 GSM"><i class="block h-full bg-mint" style="width:${f.g / 2}%"></i></div>
        <h3 class="text-[1.6rem]">${f.n}</h3>
        <p class="text-[.95rem] text-muted">${f[lang]}</p>
      </article>`).join("");
  }
  const table = (rows, waist) => {
    const h = [t("tbl.size"), waist ? t("tbl.waist") : t("tbl.width"), t("tbl.length")];
    return `<div class="overflow-x-auto"><table class="size-table"><thead><tr>${h.map(x => `<th scope="col">${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>`;
  };
  const card = (a, b, rows, w) => `<div class="min-w-0"><h3 class="text-[1.9rem]">${a}</h3><p class="mt-1.5 mb-3.5 font-display text-[.78rem] font-semibold uppercase tracking-[.16em] text-muted">${b}</p>${table(rows, w)}</div>`;
  function renderSizes() {
    const a = $("#panel-adult"), k = $("#panel-kids"); if (!a || !k) return;
    a.innerHTML = card(t("sz.tops"), t("sz.tops.for"), D.ADULT_TOPS) + card(t("sz.up"), t("sz.up.for"), D.ADULT_UP) + card(t("sz.shorts"), t("sz.shorts.for"), D.ADULT_SHORTS, true);
    k.innerHTML = card(t("sz.tops"), t("sz.tops.for"), D.KID_TOPS) + card(t("sz.up"), t("sz.up.for"), D.KID_UP) + card(t("sz.shorts"), t("sz.shorts.for"), D.KID_SHORTS, true);
  }
  function renderReviews() {
    $$("[data-rv]").forEach(el => {
      const r = D.REVIEWS[el.dataset.rv];
      el.innerHTML = lang === "tl" ? `“${r.orig}”`
        : `“${r.en}”<span class="mt-3 block font-body text-[.95rem] font-normal italic text-muted">“${r.orig}”</span>`;
    });
  }
  /* ---------- Layout studio designs (from data/designs.json) ---------- */
  const PAGE = 6;
  const designs = { all: [], filter: "All", shown: PAGE };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const src = p => String(p || "").replace(/^\/+/, "");   // keep paths relative (works on GitHub Pages)
  const TYPE_TL = { "All": "Lahat", "Long sleeves": "Long sleeves" };
  function renderDesigns() {
    const grid = $("#designs"); if (!grid || !designs.all.length) return;
    const ORDER = ["Jersey", "Polo", "Chinese collar", "Shirt", "Long sleeves", "Shorts", "Singlet", "Warmer"];
    const rank = tp => (ORDER.indexOf(tp) + 1 || 99);
    const types = ["All", ...[...new Set(designs.all.map(d => d.type).filter(Boolean))].sort((a, b) => rank(a) - rank(b))];
    $("#design-filters").innerHTML = types.length > 2 ? types.map(tp =>
      `<button type="button" data-type="${esc(tp)}" aria-pressed="${tp === designs.filter}" class="chip shrink-0 cursor-pointer transition-colors hover:border-mint aria-pressed:border-mint aria-pressed:bg-mint aria-pressed:text-[#04110e]">${esc(lang === "tl" ? (TYPE_TL[tp] || tp) : tp)}</button>`).join("") : "";
    const list = designs.all.map((d, i) => ({ ...d, n: i + 1 })).filter(d => designs.filter === "All" || d.type === designs.filter);
    grid.innerHTML = list.slice(0, designs.shown).map(d => {
      const desc = lang === "tl" && d.description_tl ? d.description_tl : d.description;
      return `<button type="button" data-zoom data-src="${esc(src(d.image))}" data-cap="${esc(d.name)}" class="group grid grid-rows-[auto_1fr] cursor-zoom-in overflow-hidden border border-line bg-ink-2 text-left transition-colors hover:border-mint">
        <img src="${esc(src(d.image))}" alt="${esc(d.name)} ${esc(d.type)} mockup" loading="lazy" class="aspect-square w-full object-cover">
        <span class="grid content-start gap-1.5 px-5 pt-4.5 pb-5.5"><small class="font-display text-[.78rem] font-bold uppercase tracking-[.18em] text-mint">Layout/${String(d.n).padStart(3, "0")} · ${esc(d.type)}</small><b class="font-display text-[1.9rem] font-extrabold uppercase leading-[.9]">${esc(d.name)}</b>${desc ? `<span class="text-[.95rem] text-muted">${esc(desc)}</span>` : ""}</span>
      </button>`;
    }).join("");
    $("#designs-more").hidden = list.length <= designs.shown;
  }
  if ($("#designs")) {
    fetch("data/designs.json", { cache: "no-cache" }).then(r => r.json()).then(list => {
      designs.all = Array.isArray(list) ? list.filter(d => d && d.image && d.name) : []; renderDesigns();
    }).catch(() => { $("#designs").innerHTML = `<p class="text-muted">Designs couldn't load. Open the site through Live Server or GitHub Pages.</p>`; });
    $("#design-filters").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if (!b) return; designs.filter = b.dataset.type; designs.shown = PAGE; renderDesigns(); });
    $("#designs-more").addEventListener("click", () => { designs.shown += PAGE; renderDesigns(); });
  }

  function applyLang(l) {
    lang = l; document.documentElement.lang = l === "tl" ? "tl" : "en";
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    renderFabrics(); renderSizes(); renderReviews(); renderDesigns();
    try { localStorage.setItem("sublimo-lang", l); } catch (e) {}
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));
  let saved = "en"; try { saved = localStorage.getItem("sublimo-lang") || "en"; } catch (e) {}
  applyLang(saved === "tl" ? "tl" : "en");

  /* ---------- Header + mobile menu ---------- */
  const hdr = $("#hdr"), burger = $("#burger"), menu = $("#menu");
  const onScroll = () => hdr.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    menu.hidden = !open; burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener("click", () => setMenu(menu.hidden));
  addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  addEventListener("resize", () => { if (innerWidth >= 1024 && !menu.hidden) setMenu(false); });

  /* ---------- Smooth scroll (Lenis, optional) ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    try { lenis = new Lenis({ lerp: .09, smoothWheel: true }); const raf = n => { lenis.raf(n); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    catch (e) { lenis = null; }
  }
  const subnav = $("#subnav");
  const offset = () => hdr.offsetHeight + (subnav ? subnav.offsetHeight : 0) + 8;
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -offset(), duration: 1.2 });
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset(), behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", id);
  }));

  /* ---------- Section sub-navbar: highlight the section in view ---------- */
  if (subnav) {
    const links = $$("a", subnav);
    const secs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
    const mark = id => links.forEach(a => {
      const on = a.getAttribute("href") === "#" + id;
      a.setAttribute("aria-current", String(on));
      if (on) a.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => io.observe(s));
    if (secs[0]) mark(secs[0].id);
  }

  /* ---------- Size tabs ---------- */
  const tabs = [["tab-adult", "panel-adult"], ["tab-kids", "panel-kids"]];
  tabs.forEach(([tb]) => { const b = document.getElementById(tb); if (b) b.addEventListener("click", () =>
    tabs.forEach(([t2, p2]) => { const on = t2 === tb; document.getElementById(t2).setAttribute("aria-selected", String(on)); document.getElementById(p2).hidden = !on; })); });

  /* ---------- Lightbox ---------- */
  const lb = $("#lb");
  if (lb) {
    const li = $("#lb-img"), lc = $("#lb-cap");
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-zoom]"); if (!b) return;
      li.src = b.dataset.src; li.alt = $("img", b).alt;
      lc.textContent = b.dataset.cap || $("span", b).textContent;
      if (lb.showModal) lb.showModal();
    });
    $("#lb-close").addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  }

  /* ---------- Hero specks ---------- */
  const cv = $("#specks");
  if (cv) {
    const ctx = cv.getContext("2d"); let W, H, pts = [];
    const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = cv.width = r.width * d; H = cv.height = r.height * d;
      pts = Array.from({ length: Math.round(r.width * r.height / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.2 + .4) * d, v: (Math.random() * .15 + .03) * d, a: Math.random() * .6 + .2, m: Math.random() < .18 })); };
    const draw = () => { ctx.clearRect(0, 0, W, H); for (const p of pts) { ctx.globalAlpha = p.a; ctx.fillStyle = p.m ? "#5CFFDD" : "#F4F5F1"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      if (!reduce) { p.y -= p.v; if (p.y < 0) { p.y = H; p.x = Math.random() * W; } } } if (!reduce) requestAnimationFrame(draw); };
    size(); draw(); addEventListener("resize", () => { size(); if (reduce) draw(); });
  }

  /* ================= Motion layer ================= */
  const hooks = [];
  document.documentElement.classList.add("js");

  // Scramble text
  const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+";
  function scramble(el, dur) {
    if (reduce) return; const fin = el.textContent, st = performance.now();
    const tick = now => { const p = Math.min(1, (now - st) / dur); let s = "";
      for (let i = 0; i < fin.length; i++) { const c = fin[i]; s += (c === " " || c === "·" || i / fin.length < p) ? c : GL[Math.random() * GL.length | 0]; }
      el.textContent = s; if (p < 1) requestAnimationFrame(tick); else el.textContent = fin; };
    requestAnimationFrame(tick);
  }
  $$(".hero h1 span").forEach((s, i) => setTimeout(() => scramble(s, 850), 150 + i * 200));

  // Reveal on scroll
  const rvSel = "[data-rv-item], .label, .lede, .stat, .chip, .item, .step, .tabs";
  if (!reduce && "IntersectionObserver" in window) {
    const els = $$(rvSel).filter(el => !el.closest(".hero, .menu, .assemble, header, #subnav"));
    els.forEach(el => { el.classList.add("rv"); const sib = [...el.parentElement.children].filter(c => c.matches(rvSel)); el.style.transitionDelay = Math.min(sib.indexOf(el), 6) * 80 + "ms"; });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); if (e.target.classList.contains("label")) scramble(e.target, 650); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
  }

  // Count-up numbers
  if (!reduce) $$(".stats .stat b").forEach(b => {
    const tn = b.firstChild; if (!tn || tn.nodeType !== 3) return; const m = tn.nodeValue.trim().match(/^(\d+)$/); if (!m) return;
    const to = +m[1]; tn.nodeValue = "0";
    const io2 = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; io2.disconnect(); const st = performance.now();
      const step = n => { const p = Math.min(1, (n - st) / 1500); tn.nodeValue = String(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
    io2.observe(b);
  });

  // Letters assemble on scroll
  const as = $("#assemble");
  if (as) {
    const letters = $$(".letters span", as), flies = $$(".fly", as), n = letters.length;
    const seeds = letters.map((_, i) => ({ x: (i - (n - 1) / 2) * 24, y: (Math.random() - .5) * 70, r: (Math.random() - .5) * 60 }));
    const fpos = [[-36, -26], [36, -24], [-34, 26], [35, 25]];
    const upd = () => {
      let e = 1;
      if (!reduce) { const r = as.getBoundingClientRect(), total = r.height - innerHeight; const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1; e = 1 - Math.pow(1 - Math.min(1, p * 1.3), 3); }
      const k = 1 - e;
      letters.forEach((l, i) => { const s = seeds[i]; l.style.transform = `translate(${s.x * k}vw,${s.y * k}vh) rotate(${s.r * k}deg)`; l.style.opacity = (.25 + .75 * e).toFixed(3); });
      flies.forEach((f, i) => { const [fx, fy] = fpos[i]; f.style.transform = `translate(-50%,-50%) translate(${fx * (1 + k * .9)}vw,${fy * (1 + k * .9)}vh) rotate(${(i % 2 ? 5 : -5) * (1 + k * 2)}deg)`; f.style.opacity = Math.min(1, .15 + e * 1.2).toFixed(3); });
      as.classList.toggle("done", e > .97);
    };
    upd(); if (!reduce) hooks.push(upd);
  }

  // Custom cursor (mouse only)
  if (fine && !reduce) {
    const c = document.createElement("div"); c.className = "cursor"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
    let mx = -100, my = -100, cx = -100, cy = -100;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener("mouseover", e => { c.classList.toggle("hot", !!e.target.closest("a, button, [data-hot]")); });
    hooks.push(() => { cx += (mx - cx) * .2; cy += (my - cy) * .2; c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; });
  }

  // Scroll-velocity marquee
  const mqEl = $(".marquee"), mqTrack = $(".marquee-track");
  if (mqEl && !reduce) {
    let lastY = scrollY, vel = 0;
    hooks.push(() => {
      const y = scrollY; vel = vel * .88 + (y - lastY) * .12; lastY = y;
      const v = Math.max(-12, Math.min(12, vel)); mqEl.style.transform = `skewX(${(-v * .6).toFixed(2)}deg)`;
      const an = mqTrack.getAnimations ? mqTrack.getAnimations()[0] : null; if (an) an.playbackRate = 1 + Math.min(5, Math.abs(v) * .35);
    });
  }

  if (hooks.length) { const loop = () => { hooks.forEach(f => f()); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();
