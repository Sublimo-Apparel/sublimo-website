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
  const PAGE = 6, NEW_DAYS = 30, SETS = "Sets";
  const MSGR = "https://m.me/sublimoph";
  const designs = { all: [], filter: "All", shown: PAGE };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const src = p => String(p || "").replace(/^\/+/, "");   // keep paths relative (works on GitHub Pages)
  const TYPE_TL = { "All": "Lahat", [SETS]: "Mga terno" };
  const code = d => "Layout/" + String(d.n).padStart(3, "0");
  const isNew = d => { if (!d.added) return false; const t0 = Date.parse(d.added); return !isNaN(t0) && (Date.now() - t0) / 864e5 <= NEW_DAYS; };
  const setOf = d => d.set ? designs.all.filter(x => x.set === d.set) : [];
  const orderText = (d, o = {}) => {
    const tl = lang === "tl";
    let s = tl ? `Hi Sublimo! Interesado po ako sa design na katulad ng "${d.name}" (${code(d)}).`
               : `Hi Sublimo! I'm interested in a design like "${d.name}" (${code(d)}).`;
    if (o.team) s += tl ? ` Team/grupo: ${o.team}.` : ` Team/group: ${o.team}.`;
    if (o.qty) s += tl ? ` Dami: ${o.qty} pcs.` : ` Quantity: ${o.qty} pcs.`;
    if (o.note) s += ` ${o.note}`;
    return s;
  };
  const orderLink = (d, o) => `${MSGR}?text=${encodeURIComponent(orderText(d, o))}`;
  const orderBtn = (d, extra = "") => `<button type="button" data-order-ask="${d.n}" class="btn btn-acc btn-sm cursor-pointer ${extra}"><svg aria-hidden="true"><use href="#msgr"/></svg><span>${lang === "tl" ? "I-order ito" : "Order this design"}</span></button>`;

  function renderDesigns() {
    const grid = $("#designs"); if (!grid || !designs.all.length) return;
    const ORDER = ["Jersey", "Polo", "Chinese collar", "Shirt", "Long sleeves", "Shorts", "Singlet", "Warmer"];
    const rank = tp => (ORDER.indexOf(tp) + 1 || 99);
    const types = ["All", ...[...new Set(designs.all.map(d => d.type).filter(Boolean))].sort((a, b) => rank(a) - rank(b))];
    if (designs.all.some(d => d.set)) types.push(SETS);
    $("#design-filters").innerHTML = types.length > 2 ? types.map(tp =>
      `<button type="button" data-type="${esc(tp)}" aria-pressed="${tp === designs.filter}" class="chip shrink-0 cursor-pointer transition-colors hover:border-mint aria-pressed:border-mint aria-pressed:bg-mint aria-pressed:text-[#04110e]">${tp === SETS ? '<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/><path d="M11 7h4v6"/></svg>' : ""}${esc(lang === "tl" ? (TYPE_TL[tp] || tp) : (tp === SETS ? "Matching sets" : tp))}</button>`).join("") : "";
    let list = designs.all;
    if (designs.filter === SETS) {
      const names = [...new Set(list.filter(d => d.set).map(d => d.set))];
      list = names.flatMap(s => list.filter(d => d.set === s));
    } else if (designs.filter !== "All") list = list.filter(d => d.type === designs.filter);
    grid.innerHTML = list.slice(0, designs.shown).map(d => {
      const desc = lang === "tl" && d.description_tl ? d.description_tl : d.description;
      const pieces = setOf(d).length;
      return `<article class="grid grid-rows-[auto_1fr] overflow-hidden border border-line bg-ink-2 transition-colors hover:border-mint">
        <button type="button" data-zoom data-design="${d.n}" data-src="${esc(src(d.image))}" data-cap="${esc(d.name)}" class="group relative block cursor-zoom-in overflow-hidden" aria-label="${esc(d.name)}: view larger">
          <img src="${esc(src(d.image))}" alt="${esc(d.name)} ${esc(d.type)} mockup" loading="lazy" decoding="async" class="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]">
          ${isNew(d) ? `<span class="absolute top-3 left-3 bg-mint px-2.5 py-1 font-display text-[.75rem] font-extrabold uppercase tracking-[.18em] text-[#04110e] shadow-lg">${lang === "tl" ? "Bago" : "New"}</span>` : ""}
          ${pieces > 1 ? `<span class="absolute top-3 right-3 flex items-center gap-1.5 bg-ink/85 px-2.5 py-1 font-display text-[.75rem] font-bold uppercase tracking-[.16em] text-paper backdrop-blur"><svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/><path d="M11 7h4v6"/></svg>${lang === "tl" ? "Terno" : "Set"} · ${pieces}</span>` : ""}
        </button>
        <div class="grid content-start gap-1.5 px-5 pt-4.5 pb-5.5">
          <small class="font-display text-[.78rem] font-bold uppercase tracking-[.18em] text-mint">${code(d)} · ${esc(d.type)}</small>
          <b class="font-display text-[1.9rem] font-extrabold uppercase leading-[.9]">${esc(d.name)}</b>
          ${desc ? `<span class="text-[.95rem] text-muted">${esc(desc)}</span>` : ""}
          <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            ${orderBtn(d)}
            ${pieces > 1 ? `<button type="button" data-zoom data-design="${d.n}" data-src="${esc(src(d.image))}" data-cap="${esc(d.name)}" class="cursor-pointer font-display text-[.8rem] font-bold uppercase tracking-[.16em] text-muted-2 underline decoration-mint underline-offset-4 hover:text-mint">${lang === "tl" ? `Tingnan ang terno (${pieces})` : `See the full set (${pieces})`}</button>` : ""}
          </div>
        </div>
      </article>`;
    }).join("");
    $("#designs-more").hidden = list.length <= designs.shown;
  }

  // Lightbox content for a design: big image, order button, and the rest of its set
  function fillDesignBox(n) {
    const d = designs.all.find(x => x.n === n), box = $("#lb-extra"); if (!d || !box) return;
    $("#lb-img").src = src(d.image); $("#lb-img").alt = `${d.name} ${d.type} mockup`;
    $("#lb-cap").textContent = `${d.name} · ${d.type}`;
    const set = setOf(d);
    box.innerHTML = `<div class="mt-4 flex justify-center">${orderBtn(d)}</div>` + (set.length > 1 ? `
      <p class="mt-6 text-center font-display text-[.8rem] font-bold uppercase tracking-[.2em] text-mint">${lang === "tl" ? "Kumpletong terno" : "Complete the set"} · ${esc(d.set)}</p>
      <div class="mt-3 flex flex-wrap justify-center gap-2">${set.map(x => `<button type="button" data-set-pick="${x.n}" aria-current="${x.n === d.n}" class="w-20 cursor-pointer border-2 border-transparent bg-ink-2 text-left aria-current:border-mint sm:w-24"><img src="${esc(src(x.image))}" alt="" class="aspect-square w-full object-cover"><span class="block truncate px-1.5 py-1 font-display text-[.68rem] font-bold uppercase tracking-[.1em]">${esc(x.type)}</span></button>`).join("")}</div>` : "");
  }

  // "Order this design" asks for confirmation first, then opens Messenger with the message
  let orderDlg, orderCur;
  function orderDialog() {
    if (orderDlg) return orderDlg;
    orderDlg = document.createElement("dialog");
    orderDlg.id = "order-dlg";
    orderDlg.setAttribute("aria-labelledby", "od-title");
    orderDlg.className = "m-auto w-[min(92vw,520px)] max-h-[92vh] overflow-y-auto border border-line bg-ink-2 p-0 text-paper backdrop:bg-[rgb(5_6_5/.88)]";
    document.body.appendChild(orderDlg);
    orderDlg.addEventListener("click", e => { if (e.target === orderDlg) orderDlg.close(); });
    orderDlg.addEventListener("input", () => updateOrderPreview());
    orderDlg.addEventListener("click", e => {
      if (e.target.closest("[data-od-cancel]")) orderDlg.close();
      const go = e.target.closest("[data-od-go]");
      if (go) {
        const txt = orderText(orderCur, orderOpts());
        try { navigator.clipboard && navigator.clipboard.writeText(txt).catch(() => {}); } catch (err) {}
        setTimeout(() => { orderDlg.close(); toast(lang === "tl" ? "Nakopya rin ang mensahe. I-paste sa Messenger kung wala pa." : "Message also copied. Paste it in Messenger if it isn't filled in."); }, 50);
      }
    });
    return orderDlg;
  }
  const orderOpts = () => ({
    team: ($("#od-team") || {}).value?.trim(),
    qty: ($("#od-qty") || {}).value?.trim(),
    note: ($("#od-note") || {}).value?.trim()
  });
  function updateOrderPreview() {
    if (!orderCur) return;
    const o = orderOpts();
    $("#od-preview").textContent = orderText(orderCur, o);
    $("#od-go").href = orderLink(orderCur, o);
  }
  function openOrder(n) {
    const d = designs.all.find(x => x.n === n); if (!d) return;
    orderCur = d;
    const tl = lang === "tl", dlg = orderDialog();
    const field = (id, label, attrs) => `<label class="grid gap-1.5"><span class="font-display text-[.76rem] font-bold uppercase tracking-[.18em] text-muted">${label}</span><input id="${id}" ${attrs} class="min-h-11 w-full border border-line bg-ink px-3.5 py-2.5 text-[16px] text-paper outline-none placeholder:text-muted focus:border-mint"></label>`;
    dlg.innerHTML = `
      <div class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <p id="od-title" class="font-display text-[1.6rem] font-extrabold uppercase leading-none">${tl ? "I-order ang design na ito?" : "Order this design?"}</p>
        <button type="button" data-od-cancel aria-label="${tl ? "Isara" : "Close"}" class="grid size-10 shrink-0 cursor-pointer place-items-center border border-line text-xl hover:border-mint hover:text-mint">×</button>
      </div>
      <div class="grid gap-5 p-5">
        <div class="flex items-center gap-4">
          <img src="${esc(src(d.image))}" alt="" class="size-24 shrink-0 border border-line object-cover">
          <div class="grid gap-1"><small class="font-display text-[.76rem] font-bold uppercase tracking-[.18em] text-mint">${code(d)} · ${esc(d.type)}</small><b class="font-display text-[1.6rem] font-extrabold uppercase leading-[.95]">${esc(d.name)}</b>${d.set ? `<span class="text-[.9rem] text-muted">${tl ? "Bahagi ng terno" : "Part of the"} ${esc(d.set)} ${tl ? "" : "set"}</span>` : ""}</div>
        </div>
        <p class="text-[.95rem] text-muted-2">${tl ? "Dadalhin ka namin sa Messenger kasama ang mensaheng ito. Puwede kang magdagdag ng detalye (opsyonal) para mas mabilis ang quote." : "We'll open Messenger with this message. Add details if you like (optional) so we can quote you faster."}</p>
        <div class="grid gap-3 sm:grid-cols-[1fr_120px]">
          ${field("od-team", tl ? "Pangalan ng team o grupo" : "Team or group name", `type="text" maxlength="60" autocomplete="organization" placeholder="${tl ? "hal. Tabaco Titans" : "e.g. Tabaco Titans"}"`)}
          ${field("od-qty", tl ? "Dami" : "Quantity", `type="number" min="1" max="9999" inputmode="numeric" placeholder="15"`)}
        </div>
        ${field("od-note", tl ? "Ibang detalye" : "Other details", `type="text" maxlength="140" placeholder="${tl ? "hal. Kailangan bago Dis 15, ibang kulay" : "e.g. Need it by Dec 15, different colors"}"`)}
        <div class="grid gap-2 border-l-2 border-mint bg-ink px-4 py-3">
          <span class="font-display text-[.72rem] font-bold uppercase tracking-[.2em] text-mint">${tl ? "Mensaheng ipapadala" : "Your message"}</span>
          <p id="od-preview" class="text-[.95rem]"></p>
        </div>
      </div>
      <div class="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-line bg-ink-2 px-5 py-4">
        <button type="button" data-od-cancel class="btn btn-sm cursor-pointer">${tl ? "Kanselahin" : "Cancel"}</button>
        <a id="od-go" data-od-go href="#" target="_blank" rel="noopener" class="btn btn-acc btn-sm"><svg aria-hidden="true"><use href="#msgr"/></svg><span>${tl ? "Ituloy sa Messenger" : "Continue to Messenger"}</span></a>
      </div>`;
    updateOrderPreview();
    dlg.showModal();
    setTimeout(() => { const t = $("#od-team"); if (t && matchMedia("(pointer: fine)").matches) t.focus(); }, 30);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-order-ask]"); if (!a) return;
    e.preventDefault(); openOrder(+a.dataset.orderAsk);
  });
  let toastTimer;
  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); el.className = "fixed inset-x-4 bottom-5 z-[95] mx-auto max-w-md bg-paper px-5 py-3.5 text-center text-[.95rem] font-semibold text-ink shadow-2xl transition-opacity duration-300"; document.body.appendChild(el); }
    el.textContent = msg; el.style.opacity = "1"; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 3500);
  }

  if ($("#designs")) {
    fetch("data/designs.json", { cache: "no-cache" }).then(r => r.json()).then(list => {
      designs.all = (Array.isArray(list) ? list.filter(d => d && d.image && d.name) : []).map((d, i) => ({ ...d, n: i + 1 }));
      renderDesigns();
    }).catch(() => { $("#designs").innerHTML = `<p class="text-muted">Designs couldn't load. Open the site through Live Server or GitHub Pages.</p>`; });
    $("#design-filters").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if (!b) return; designs.filter = b.dataset.type; designs.shown = PAGE; renderDesigns(); });
    $("#designs-more").addEventListener("click", () => { designs.shown += PAGE; renderDesigns(); });
  }

  /* ---------- About page staff (from data/team.json) ---------- */
  const staff = { all: [] };
  const ROLE_TL = {
    "Production Manager": "Production Manager", "Production Assistant": "Production Assistant",
    "Graphic Designer": "Graphic Designer", "Social Media Manager": "Social Media Manager",
    "Customer Service Representative": "Customer Service", "On-call Staff": "On-call na staff"
  };
  const initials = n => String(n || "").replace(/\b[A-Z]\.\s*/g, "").split(/\s+/).filter(Boolean).map(w => w[0]).filter((c, i, arr) => i === 0 || i === arr.length - 1).join("").toUpperCase();
  function renderStaff() {
    const grid = document.getElementById("staff-grid"); if (!grid || !staff.all.length) return;
    const e = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    grid.innerHTML = staff.all.map(p => {
      const role = lang === "tl" ? (ROLE_TL[p.role] || p.role) : p.role;
      const pic = p.photo
        ? `<img src="${e(String(p.photo).replace(/^\/+/, ""))}" alt="${e(p.name)}" loading="lazy" decoding="async" class="aspect-square w-full object-cover">`
        : `<div class="relative grid aspect-square w-full place-items-center overflow-hidden bg-ink" aria-hidden="true">
             <svg viewBox="0 0 874 729" class="absolute -right-6 -bottom-6 w-3/4 fill-paper opacity-[.04]"><use href="#mark"/></svg>
             <span class="font-display text-[clamp(3rem,9vw,5rem)] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-mint)]">${e(initials(p.name))}</span>
           </div>`;
      return `<figure data-rv-item class="grid content-start border border-line bg-ink-2">${pic}
        <figcaption class="grid gap-1.5 px-4 pt-3.5 pb-4"><b class="font-display text-[1.35rem] font-extrabold uppercase leading-[.95] md:text-[1.55rem]">${e(p.name)}</b><span class="font-display text-[.74rem] font-bold uppercase tracking-[.16em] text-mint">${e(role)}</span></figcaption></figure>`;
    }).join("");
  }
  if (document.getElementById("staff-grid")) {
    fetch("data/team.json", { cache: "no-cache" }).then(r => r.json()).then(list => {
      staff.all = Array.isArray(list) ? list.filter(p => p && p.name) : []; renderStaff();
      if (!staff.all.length) document.getElementById("staff").hidden = true;
    }).catch(() => { document.getElementById("staff").hidden = true; });
  }

  function applyLang(l) {
    lang = l; document.documentElement.lang = l === "tl" ? "tl" : "en";
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    renderFabrics(); renderSizes(); renderReviews(); renderDesigns(); renderStaff();
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
  }
  burger.addEventListener("click", () => setMenu(menu.hidden));
  addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  addEventListener("resize", () => { if (innerWidth >= 1024 && !menu.hidden) setMenu(false); });

  /* ---------- In-page links (native scrolling: no scroll-jacking, no lag) ---------- */
  const subnav = $("#subnav");
  const offset = () => hdr.offsetHeight + (subnav ? subnav.offsetHeight : 0) + 8;
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + scrollY - offset();
    const near = Math.abs(top - scrollY) < innerHeight * 1.2;   // short hops glide on desktop; long ones jump straight there
    scrollTo({ top, behavior: (!reduce && fine && near) ? "smooth" : "instant" });
    history.replaceState(null, "", id);
  }));

  /* ---------- Section sub-navbar: highlight the section in view ---------- */
  if (subnav) {
    const links = $$("a", subnav);
    const secs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
    const mark = id => links.forEach(a => {
      const on = a.getAttribute("href") === "#" + id;
      a.setAttribute("aria-current", String(on));
      if (on) {   // slide the tab strip sideways only. Never scroll the page itself
        const strip = a.parentElement, l = a.offsetLeft, r = l + a.offsetWidth;
        if (l < strip.scrollLeft || r > strip.scrollLeft + strip.clientWidth) strip.scrollTo({ left: Math.max(0, l - 20), behavior: "auto" });
      }
    });
    // Current section = the last one whose top has passed just below the menus (or the last one at the very bottom)
    let curId = null, ticking = false, lock = 0;
    const pick = () => {
      ticking = false;
      if (Date.now() < lock) return;
      const line = offset() + 24;
      let id = secs[0] && secs[0].id;
      for (const s of secs) if (s.getBoundingClientRect().top <= line) id = s.id;
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) id = secs[secs.length - 1].id;
      if (id !== curId) { curId = id; mark(id); }
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }, { passive: true });
    addEventListener("resize", pick);
    links.forEach(a => a.addEventListener("click", () => {   // light up the tapped tab right away
      curId = a.getAttribute("href").slice(1); mark(curId); lock = Date.now() + 700;
      setTimeout(pick, 750);
    }));
    pick();
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
      const pick = e.target.closest("[data-set-pick]");
      if (pick) { fillDesignBox(+pick.dataset.setPick); return; }
      const b = e.target.closest("[data-zoom]"); if (!b) return;
      const extra = $("#lb-extra");
      if (b.dataset.design) fillDesignBox(+b.dataset.design);
      else {
        li.src = b.dataset.src; li.alt = ($("img", b) || {}).alt || "";
        lc.textContent = b.dataset.cap || ($("span", b) || {}).textContent || "";
        if (extra) extra.innerHTML = "";
      }
      if (lb.showModal && !lb.open) lb.showModal();
    });
    $("#lb-close").addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  }

  /* ---------- Hero specks ---------- */
  const cv = $("#specks");
  if (cv) {
    const ctx = cv.getContext("2d"); let W, H, pts = [];
    const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = cv.width = r.width * d; H = cv.height = r.height * d;
      pts = Array.from({ length: Math.min(160, Math.round(r.width * r.height / (fine ? 9000 : 16000))) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.2 + .4) * d, v: (Math.random() * .15 + .03) * d, a: Math.random() * .6 + .2, m: Math.random() < .18 })); };
    let running = false;
    const draw = () => { ctx.clearRect(0, 0, W, H); for (const p of pts) { ctx.globalAlpha = p.a; ctx.fillStyle = p.m ? "#5CFFDD" : "#F4F5F1"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      if (!reduce) { p.y -= p.v; if (p.y < 0) { p.y = H; p.x = Math.random() * W; } } } if (running) requestAnimationFrame(draw); };
    size(); draw(); addEventListener("resize", () => { size(); if (!running) draw(); });
    if (!reduce) new IntersectionObserver(es => { const vis = es[0].isIntersecting && !document.hidden; if (vis && !running) { running = true; requestAnimationFrame(draw); } else if (!vis) running = false; }).observe(cv);
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
  if (!reduce && fine && "IntersectionObserver" in window) {   // phones: no fade-ins, content is simply there
    const els = $$(rvSel).filter(el => !el.closest(".hero, .page-head, .menu, .assemble, header, #subnav") && el.getBoundingClientRect().top > innerHeight);
    els.forEach(el => { el.classList.add("rv"); const sib = [...el.parentElement.children].filter(c => c.matches(rvSel)); el.style.transitionDelay = Math.min(sib.indexOf(el), 3) * 50 + "ms"; });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); if (e.target.classList.contains("label")) scramble(e.target, 650); } }), { rootMargin: "0px 0px 15% 0px" });   // start just BEFORE things scroll into view
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
    let asVis = false;
    new IntersectionObserver(es => { asVis = es[0].isIntersecting; }).observe(as);
    upd(); if (!reduce) hooks.push(() => { if (asVis) upd(); });
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
  if (mqEl && !reduce && fine) {   // desktop only: phones just get the plain scrolling banner
    let lastY = scrollY, vel = 0, mqVis = false;
    new IntersectionObserver(es => { mqVis = es[0].isIntersecting; }).observe(mqEl);
    hooks.push(() => {
      if (!mqVis) { lastY = scrollY; return; }
      const y = scrollY; vel = vel * .88 + (y - lastY) * .12; lastY = y;
      const v = Math.max(-12, Math.min(12, vel)); mqEl.style.transform = `skewX(${(-v * .6).toFixed(2)}deg)`;
      const an = mqTrack.getAnimations ? mqTrack.getAnimations()[0] : null; if (an) an.playbackRate = 1 + Math.min(5, Math.abs(v) * .35);
    });
  }

  if (hooks.length) { const loop = () => { hooks.forEach(f => f()); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
})();
