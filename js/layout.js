/* ==========================================================================
   Sublimo — shared layout
   Builds the header navbar, mobile menu and footer on every page,
   so you only edit them here. Add or rename pages in NAV below.
   ========================================================================== */
(function () {
  const NAV = [
    { href: "index.html",    key: "nav.home",     label: "Home" },
    { href: "work.html",     key: "nav.work",     label: "Our work" },
    { href: "products.html", key: "nav.products", label: "Products" },
    { href: "order.html",    key: "nav.order",    label: "How to order" },
    { href: "reviews.html",  key: "nav.reviews",  label: "Reviews" },
    { href: "about.html",    key: "nav.about",    label: "About" }
  ];
  const MESSENGER = "https://m.me/sublimoph";
  const page = document.body.dataset.page || "index";
  const isCurrent = (href) => href.replace(".html", "") === page;
  const current = (href) => (isCurrent(href) ? ' aria-current="page"' : "");

  const sprite = `
<svg width="0" height="0" class="absolute" aria-hidden="true"><defs>
  <symbol id="mark" viewBox="0 0 874 729"><polygon points="79,0 273,0 166,175 166,563 313,563 436,365 631,365 405,729 0,729 0,127"/><polygon points="468,0 874,0 874,603 795,729 600,729 708,555 708,166 560,166 436,365 243,365"/></symbol>
  <symbol id="msgr" viewBox="0 0 24 24"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.87c.17-.08.36-.09.53-.04.91.25 1.88.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63z" fill="currentColor"/></symbol>
  <symbol id="arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
</defs></svg>`;

  const brand = `
<a href="index.html" class="flex items-center gap-3" aria-label="Sublimo home">
  <svg class="h-7 w-8.5 fill-paper" aria-hidden="true"><use href="#mark"/></svg>
  <img src="img/wordmark-white.png" alt="" width="1231" height="218" class="hidden h-3.5 w-auto opacity-95 sm:block">
</a>`;

  const header = `
<header id="hdr" class="fixed inset-x-0 top-0 z-60 transition-colors duration-300">
  <div class="wrap flex h-19 items-center gap-3 lg:h-21">
    <div class="mr-auto">${brand}</div>
    <nav class="hidden items-center lg:flex" aria-label="Main">
      ${NAV.map(n => `<a class="navlink" href="${n.href}"${current(n.href)}><span data-i18n="${n.key}">${n.label}</span></a>`).join("")}
    </nav>
    <div class="flex items-center gap-1.5 sm:gap-3 lg:ml-5">
      <div class="lang inline-flex gap-0.5" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="true">EN</button>
        <button type="button" data-lang="tl" aria-pressed="false">TL</button>
      </div>
      <a class="btn btn-acc btn-sm" href="${MESSENGER}" target="_blank" rel="noopener">
        <span class="xl:hidden" data-i18n="cta.short">Order</span><span class="hidden xl:inline" data-i18n="cta.start">Start your order</span>
      </a>
      <button class="burger lg:hidden" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><i></i><i></i></button>
    </div>
  </div>
</header>

<div class="menu fixed inset-0 z-55 overflow-auto bg-ink pt-28" id="menu" hidden>
  <div class="wrap">
    <nav class="grid gap-1" aria-label="Mobile">
      ${NAV.map((n, i) => `<a href="${n.href}"${current(n.href)}><small>${String(i + 1).padStart(2, "0")}</small><span data-i18n="${n.key}">${n.label}</span></a>`).join("")}
    </nav>
    <div class="mt-10 flex flex-wrap gap-6 border-t border-line pt-7 pb-10 text-muted">
      <a href="${MESSENGER}" target="_blank" rel="noopener">m.me/sublimoph</a><span>Tabaco City, Albay</span>
    </div>
  </div>
</div>`;

  const social = (href, label, path) =>
    `<a href="${href}" target="_blank" rel="noopener" aria-label="${label}" class="group grid size-11.5 place-items-center border border-line transition-colors hover:border-mint hover:bg-mint"><svg viewBox="0 0 24 24" class="size-4.5 fill-paper group-hover:fill-[#04110e]"><path d="${path}"/></svg></a>`;

  const footer = `
<footer class="border-t border-line pt-14 pb-[calc(2.25rem+env(safe-area-inset-bottom,0px))]">
  <div class="wrap grid gap-10 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
    <div class="grid gap-4">
      ${brand}
      <small class="max-w-xs font-display text-[.8rem] font-semibold uppercase tracking-[.18em] text-muted" data-i18n="foot">Design it. Print it. Wear it. · Tabaco City, PH</small>
    </div>
    <nav aria-label="Footer">
      <p class="mb-3 font-display text-[.76rem] font-bold uppercase tracking-[.2em] text-mint" data-i18n="foot.pages">Pages</p>
      <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-muted-2">
        ${NAV.map(n => `<li><a class="transition-colors hover:text-mint" href="${n.href}" data-i18n="${n.key}">${n.label}</a></li>`).join("")}
      </ul>
    </nav>
    <div>
      <p class="mb-3 font-display text-[.76rem] font-bold uppercase tracking-[.2em] text-mint" data-i18n="foot.follow">Follow us</p>
      <div class="flex gap-2">
        ${social("https://www.facebook.com/sublimoph", "Facebook", "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.6V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V13h2.7v8h3.2z")}
        ${social("https://www.instagram.com/sublimo.25/", "Instagram", "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1 1 .1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-1 .1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-1-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 6 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1zM12 3c-2.4 0-2.8 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.2 3 9.6 3 12s0 2.8.1 3.7c.1 3.3 1.9 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7C20.8 5 19 3.2 15.7 3.1 14.8 3 14.4 3 12 3z")}
        ${social("https://www.tiktok.com/@sublimoapparel", "TikTok", "M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v2.6c-1.3.1-2.5-.3-3.9-1.1v5c0 6.3-6.9 8.3-9.6 3.8-1.8-2.9-.7-8 5-8.2v2.8c-.4.1-.9.2-1.3.3-1.3.4-2 1.2-1.8 2.7.4 2.7 5.3 3.5 4.9-1.8V3h2.8z")}
      </div>
    </div>
  </div>
</footer>`;

  document.body.insertAdjacentHTML("afterbegin", sprite + header);
  const main = document.querySelector("main");
  (main || document.body).insertAdjacentHTML(main ? "afterend" : "beforeend", footer);
})();
