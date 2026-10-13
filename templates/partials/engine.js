/* ==========================================================================
   SELFMADE — motor de slides
   Lê window.__POST__ (post.json), window.__SLIDE__ (índice) e window.__ROOT__
   (URL da raiz do repositório) e desenha o slide pedido.
   Markup de texto:  *palavra*  → destaque Instrument Serif itálico
                     ==palavra== → destaque principal (gradiente vermelho), 1 por peça
                     **palavra** → semibold
                     \n          → nova linha
   ========================================================================== */
(function () {
  const POST = window.__POST__ || { meta: {}, slides: [{ layout: "statement", title: "Sem dados" }] };
  const IDX = Number(window.__SLIDE__ || 0);
  const ROOT = (window.__ROOT__ || "../../").replace(/\/?$/, "/");
  const meta = POST.meta || {};
  const slides = POST.slides || [];
  const s = slides[IDX] || {};
  const total = slides.length;
  const isVertical = meta.format === "story" || meta.format === "reel";

  const W = 1080, H = isVertical ? 1920 : 1440;
  document.documentElement.style.setProperty("--W", W + "px");
  document.documentElement.style.setProperty("--H", H + "px");
  if (isVertical) {
    // 9:16 — manter conteúdo-chave fora dos 12 % de cima e 20 % de baixo (UI da plataforma)
    document.documentElement.style.setProperty("--safe-top", Math.round(H * 0.12) + "px");
    document.documentElement.style.setProperty("--safe-bottom", Math.round(H * 0.2) + "px");
  }

  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const md = (t) => esc(t)
    .replace(/==(.+?)==/g, '<span class="hl">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, '<span class="accent">$1</span>');
  const lines = (t) => String(t ?? "").split("\n").map((l) => `<span class="line">${md(l)}</span>`).join("");
  const asset = (p) => (/^(https?:|data:|file:)/.test(p) ? p : ROOT + p.replace(/^\//, ""));

  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    send: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>',
    arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    euro: '<path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    train: '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1M15 15l1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3M16 19l2 3"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    buoy: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
    form: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    insta: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  };
  const icon = (n) => `<span class="icon"><svg viewBox="0 0 24 24">${ICONS[n] || ICONS.arrow}</svg></span>`;

  // tema automático: ritmo escuro → superfície → claro, CTA final em vermelho
  const autoTheme = () => {
    if (IDX === 0) return "dark";
    if (s.layout === "cta" && IDX === total - 1) return "red";
    return IDX % 2 === 1 ? "light" : (IDX % 4 === 0 ? "dark" : "surface");
  };
  const theme = s.theme || autoTheme();
  const dark = theme !== "light";
  const logoIcon = asset(dark ? "brand/logos/selfmade-icon-white.png" : "brand/logos/selfmade-icon-red.png");
  const handle = meta.handle || "@selfmade_ngo";
  const pad = (n) => String(n).padStart(2, "0");

  const topbar = () => `
    <div class="topbar">
      <div class="brandmark"><img src="${logoIcon}" alt=""><span class="handle">${esc(handle)}</span></div>
      ${total > 1 && !isVertical ? `<div class="counter">${pad(IDX + 1)}/${pad(total)}</div>` : ""}
    </div>`;

  const footer = () => {
    if (isVertical) return "";
    const pct = total > 1 ? (IDX / (total - 1)) * 100 : 100;
    const swipe = IDX === 0 && total > 1 ? `<div class="swipe">${esc(meta.swipeLabel || "Arrasta")} ${icon("arrow")}</div>` : "";
    return `<div class="footer">
      <div class="progress"><div class="fill" style="width:${pct}%"></div><div class="plane" style="left:${pct}%"><svg viewBox="0 0 24 24" fill="currentColor">${ICONS.plane.replace(/<path /, '<path stroke="none" ')}</svg></div></div>
      ${swipe}</div>`;
  };

  // estilo KingUp: número discreto em cima, pílula "Arrasta" + pontos de paginação em baixo
  const kTop = () => `
    <div class="topbar k-topbar">
      <div class="brandmark"><img src="${logoIcon}" alt=""><span class="handle">${esc(handle)}</span></div>
      <div class="k-num">${pad(IDX + 1)}</div>
    </div>`;
  const kFooter = () => {
    const last = IDX === total - 1;
    const dots = Array.from({ length: total }, (_, k) => `<i class="${k === IDX ? "on" : ""}"></i>`).join("");
    return `<div class="k-footer">
      <div class="k-pill"><span class="k-pill-ico">${icon(last ? "message" : "arrow")}</span>${esc(last ? "Lê a legenda" : (meta.swipeLabel || "Arrasta para o lado"))}</div>
      <div class="k-dots">${dots}</div></div>`;
  };
  // objetos secundários desfocados nas margens (profundidade de campo, KingUp)
  const extras = (list) => (list || []).map((e) => `<div class="k-extra ${e.float ? "float" : ""}" style="z-index:${e.z ?? 2};width:${e.width}px;left:${e.left}px;top:${e.top}px;filter:blur(${e.blur ?? 10}px) drop-shadow(0 30px 40px rgba(0,0,0,.35));opacity:${e.opacity ?? 1};transform:rotate(${e.rotate || 0}deg)"><img src="${asset(e.src)}" alt=""></div>`).join("");

  // faixa de logótipos (parceiros/financiadores) sempre em contraste
  const pkLogos = (list, eu) => list?.length ? `<div class="pk-logos reveal" style="--i:6">${list.map((l) => typeof l === "string"
    ? `<img src="${asset(l)}" alt="">` : `<span class="pk-logo-item">${l.src ? `<img src="${asset(l.src)}" alt="" style="${l.h ? `height:${l.h}px;` : ""}${l.invert ? "filter:brightness(0) invert(1)" : ""}">` : ""}${l.text ? `<em>${esc(l.text)}</em>` : ""}</span>`).join("")}</div>` : "";
  // céu estrelado determinístico (mesmo resultado em todos os renders)
  const stars = () => { let seed = 7 + IDX * 13; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const sh = Array.from({ length: 170 }, () => `${Math.round(rnd() * W)}px ${Math.round(rnd() * H)}px 0 ${rnd() < .12 ? 1.4 : 0}px rgba(255,255,255,${(.25 + rnd() * .7).toFixed(2)})`).join(",");
    return `<div class="pk-stars" style="box-shadow:${sh}"></div>`; };

  const visual = (v) => {
    if (!v) return "";
    const pos = `width:${v.width || 860}px;${v.top != null ? `top:${v.top}px;` : `bottom:${v.bottom ?? 120}px;`}${v.left != null ? `left:${v.left}px;transform:rotate(${v.rotate || 0}deg);` : `transform:translateX(-50%) rotate(${v.rotate || 0}deg);`}`;
    const cls = `hero-visual ${v.front ? "front" : ""} ${v.float ? "float" : ""} ${v.rise ? "pop-in" : ""}`;
    const fade = v.fade ? '<div class="hero-fade"></div>' : "";
    if (v.type === "image") return `<div class="${cls}" style="${pos}"><img src="${asset(v.src)}" alt=""></div>${fade}`;
    if (v.type === "sequence") {
      // frames de uma animação 3D (render-3d --spin); o render-video escolhe o frame com window.__setTime(t)
      const imgs = Array.from({ length: v.count }, (_, k) => `<img data-k="${k}" src="${asset(`${v.dir}/frame-${String(k).padStart(3, "0")}.png`)}" alt="" style="${k ? "display:none" : ""}">`).join("");
      window.__setTime = (t) => {
        const k = Math.min(v.count - 1, Math.floor((t / ((v.duration || 5) * 1000)) * v.count));
        document.querySelectorAll(".hero-visual img[data-k]").forEach((im) => (im.style.display = Number(im.dataset.k) === k ? "" : "none"));
      };
      return `<div class="${cls} seq" style="${pos}">${imgs}</div>${fade}`;
    }
    if (v.type === "orb") {
      const size = v.size || 620;
      return `<div class="brand-orb pop" style="width:${size}px;height:${size}px;left:${v.left ?? (W - size) / 2}px;bottom:${v.bottom ?? -size * 0.28}px;--d:250ms"><img src="${asset("brand/logos/selfmade-icon-white.png")}" alt=""></div>`;
    }
    return "";
  };

  const R = (cls, i) => `class="${cls} reveal" style="--i:${i}"`;
  let body = "";
  switch (s.layout) {
    case "cover":
      body = `${topbar()}
        <div class="headline-wrap">
          ${s.eyebrow ? `<div ${R("eyebrow", 0)}>${esc(s.eyebrow)}</div>` : ""}
          <h1 ${R("display", 1)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h1>
        </div>
        ${s.subtitle ? `<p ${R("lead sub", 2)}>${md(s.subtitle)}</p>` : ""}
        ${footer()}`;
      break;
    case "statement":
      body = `${topbar()}<div class="content">
        ${s.eyebrow ? `<div ${R("eyebrow", 0)} style="margin-bottom:40px">${esc(s.eyebrow)}</div>` : ""}
        <h2 ${R("display", 1)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h2>
        ${s.body ? `<p ${R("body", 2)}>${md(s.body)}</p>` : ""}</div>${footer()}`;
      break;
    case "list":
      body = `${topbar()}<h2 ${R("display title", 0)}>${lines(s.title)}</h2>
        <div class="items">${(s.items || []).map((it, i) => `
          <div ${R("card item" + (it.key ? " key" : ""), i + 1)}>
            ${it.icon ? `<span style="color:var(--c-red-light)">${icon(it.icon)}</span>` : `<div class="num">${pad(i + 1)}</div>`}
            <div><h3>${md(it.title)}</h3>${it.text ? `<p>${md(it.text)}</p>` : ""}</div>
          </div>`).join("")}</div>${footer()}`;
      break;
    case "compare":
      body = `${topbar()}<h2 ${R("display title", 0)}>${lines(s.title)}</h2>
        <div class="cols">
          <div class="col bad"><div ${R("col-head", 1)}>${icon("x")} ${esc(s.bad?.label || "Evita")}</div>
            ${(s.bad?.items || []).map((t, i) => `<div ${R("card row", i + 2)}>${icon("x")}<span>${md(t)}</span></div>`).join("")}</div>
          <div class="col good"><div ${R("col-head", 1)}>${icon("check")} ${esc(s.good?.label || "Faz")}</div>
            ${(s.good?.items || []).map((t, i) => `<div ${R("card row" + (i === 0 ? " key" : ""), i + 2)}>${icon("check")}<span>${md(t)}</span></div>`).join("")}</div>
        </div>${footer()}`;
      break;
    case "steps":
      body = `${topbar()}<h2 ${R("display title", 0)}>${lines(s.title)}</h2>
        <div class="steps">${(s.steps || []).map((st, i) => `
          <div ${R("step", i + 1)}><div class="dot">${i + 1}</div><h3>${md(st.title)}</h3>${st.text ? `<p>${md(st.text)}</p>` : ""}</div>`).join("")}
        </div>${footer()}`;
      break;
    case "myth":
      body = `${topbar()}<div class="content">
        <div ${R("eyebrow", 0)} style="margin-bottom:56px">${esc(s.eyebrow || "Mito")}</div>
        <h2 ${R("display myth-text", 1)}>${lines(s.myth)}</h2>
        <div ${R("card key reality", 2)}>
          <div class="reality-head">${icon("check")} ${esc(s.realityLabel || "Realidade")}</div>
          <p>${md(s.reality)}</p>
        </div>
        ${s.chips?.length ? `<div ${R("chips", 3)}>${s.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : ""}
        </div>${footer()}`;
      break;
    case "stat":
      body = `${topbar()}<div class="content">
        ${s.eyebrow ? `<div ${R("eyebrow", 0)} style="margin-bottom:40px">${esc(s.eyebrow)}</div>` : ""}
        <div ${R("big", 1)}>${md(s.value)}</div>
        <div ${R("big-label", 2)}>${lines(s.label)}</div>
        ${s.body ? `<p ${R("body", 3)}>${md(s.body)}</p>` : ""}
        ${s.source ? `<div class="source">Fonte: ${esc(s.source)}</div>` : ""}</div>${footer()}`;
      break;
    case "quote":
      body = `${topbar()}<div class="content">
        <div class="mark">“</div><blockquote ${R("", 1)}>${md(s.quote)}</blockquote>
        <div ${R("who", 2)}>${s.photo ? `<img src="${asset(s.photo)}" alt="">` : ""}<div><div class="name">${esc(s.name)}</div><div class="role">${esc(s.role || "")}</div></div></div>
        </div>${footer()}`;
      break;
    case "cta":
      body = `${topbar()}<div class="content">
        ${s.eyebrow ? `<div ${R("eyebrow", 0)} style="margin-bottom:40px">${esc(s.eyebrow)}</div>` : ""}
        <h2 ${R("display", 1)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h2>
        ${s.body ? `<p ${R("body", 2)}>${md(s.body)}</p>` : ""}
        <div class="actions">
          ${s.button ? `<div class="pill pop rimrun" style="--d:500ms">${esc(s.button)} ${icon("arrow")}</div>` : ""}
          ${s.saveShare !== false ? `<div ${R("save-share", 4)}><span>${icon("bookmark")} Guarda</span><span>${icon("send")} Envia a um amigo</span></div>` : ""}
        </div>
        ${s.partners?.length ? `<div ${R("partners", 5)}>${s.partners.map((p) => `<img src="${asset(p)}" alt="">`).join("")}${s.partnersNote ? `<span class="eu-note">${esc(s.partnersNote)}</span>` : ""}</div>` : ""}
        </div>${footer()}`;
      break;
    /* ---------- Estilo KingUp (acabamento) + @marketingharry (estrutura) ---------- */
    case "k-hook":
      body = `<div class="k-topline reveal" style="--i:0"><img src="${logoIcon}" alt="">${esc(s.topline || "Mobilidade Internacional")} <span class="sep">|</span> ${esc(handle)}</div>
        <div class="k-hook-title">
          ${s.pre ? `<div ${R("k-pre", 1)}>${md(s.pre)}</div>` : ""}
          <h1 ${R("display k-main", 2)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h1>
          ${s.post ? `<div ${R("k-post", 3)}>${md(s.post)}</div>` : ""}
        </div>`;
      break;
    case "k-promise":
      body = `${kTop()}<div class="content">
        <p ${R("k-promise-text", 1)}>${lines(s.text)}</p>
        ${s.note ? `<div ${R("k-note", 2)}>${md(s.note)} ${icon("arrow")}</div>` : ""}
        </div>${kFooter()}`;
      break;
    case "k-lesson":
      body = `${kTop()}<div class="k-lesson">
        <div ${R("k-myth", 0)}><span class="k-x">${icon("x")}</span><span class="k-myth-label">${esc(s.mythLabel || "Mito")}</span><span class="k-myth-text">${md(s.myth)}</span></div>
        <h2 ${R("display k-title", 1)}>${lines(s.title)}</h2>
        <div ${R("k-proof", 2)}>
          <div class="k-proof-head"><span class="k-check">${icon("check")}</span>${esc(s.proofLabel || "Realidade")}</div>
          ${(s.rows || []).map((r) => `<div class="k-row"><span>${md(r[0] ?? r)}</span>${r[1] ? `<b>${md(r[1])}</b>` : ""}</div>`).join("")}
        </div>
        ${s.takeaway ? `<p ${R("k-takeaway", 3)}>${md(s.takeaway)}</p>` : ""}
        </div>${kFooter()}`;
      break;
    case "k-poster":
      body = `${kTop()}<div class="k-poster">
        ${s.eyebrow ? `<div ${R("k-chip", 0)}>${esc(s.eyebrow)}</div>` : ""}
        <h2 ${R("k-thin", 1)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h2>
        ${s.body ? `<p ${R("k-sub", 2)}>${md(s.body)}</p>` : ""}
        </div>${kFooter()}`;
      break;
    case "k-recap":
      body = `${kTop()}<div class="k-recap">
        <h2 ${R("display k-recap-title", 0)}>${lines(s.title)}</h2>
        <div ${R("k-table", 1)}>${(s.rows || []).map((r) => `
          <div class="k-trow"><span class="k-tmyth">${icon("x")}${md(r[0])}</span><span class="k-ttruth">${icon("check")}${md(r[1])}</span></div>`).join("")}</div>
        <div class="k-sticker pop" style="--d:450ms">
          <div class="k-sticker-title">${lines(s.cta)}</div>
          ${s.ctaSub ? `<div class="k-sticker-sub">${md(s.ctaSub)}</div>` : ""}
        </div>
        ${s.share ? `<div ${R("k-share", 5)}>${icon("send")} ${esc(s.share)}</div>` : ""}
        ${s.partners?.length ? `<div ${R("k-partners", 6)}>${s.partners.map((p) => `<img src="${asset(p)}" alt="">`).join("")}${s.partnersNote ? `<span>${esc(s.partnersNote)}</span>` : ""}<img class="k-self" src="${asset("brand/logos/selfmade-logo-white.png")}" alt=""></div>` : ""}
        </div>`;
      break;
    /* ---------- Campanha EYC · DiscoverEU — tema Pokémon GO (layouts pk-*) ---------- */
    case "pk-cover":
      body = `<div class="pk-cover">
        <img class="pk-logo reveal" style="--i:0" src="${asset("brand/logos/selfmade-logo-white.png")}" alt="Associação Selfmade">
        ${s.badge ? `<div ${R("pk-badge", 1)}><i></i><span>${md(s.badge)}</span></div>` : ""}
        <h1 ${R("pk-title pk-cover-title", 2)} style="${s.size ? `font-size:${s.size}px` : ""}">${lines(s.title)}</h1>
        ${s.sub ? `<div ${R("pk-sub-brand", 3)}>${esc(s.sub)}</div>` : ""}
        ${s.hook ? `<p ${R("pk-hook", 4)}>${md(s.hook)}</p>` : ""}
        </div>
        ${pkLogos(s.logos)}`;
      break;
    case "pk-quest":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        ${s.text ? `<p ${R("pk-text", 2)}>${md(s.text)}</p>` : ""}
        <div ${R("pk-stats", 3)}>${(s.stats || []).map((t) => `<div class="pk-stat"><b>${md(t.value)}</b><span>${md(t.label)}</span></div>`).join("")}</div>
        ${s.note ? `<p ${R("pk-note", 4)}>${md(s.note)}</p>` : ""}
        </div>${kFooter()}`;
      break;
    case "pk-missions":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        <div class="pk-missions">${(s.items || []).map((m, i) => `
          <div ${R("pk-mission", i + 2)}>
            <div class="pk-mnum">${i + 1}</div>
            <div class="pk-mbody"><p>${md(m.text)}</p>
              <div class="pk-xp"><div class="pk-xpbar"><i style="width:${m.xp ?? 70}%"></i></div><span>+${esc(m.points ?? 100)} XP</span></div></div>
          </div>`).join("")}</div>
        </div>${kFooter()}`;
      break;
    case "pk-trainer":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        <div ${R("pk-card pk-trainer", 2)}>
          <div class="pk-trainer-head"><div class="pk-avatar">${icon("user")}</div><div><div class="pk-tname">${esc(s.cardTitle || "Treinador(a)")}</div><div class="pk-tlevel">${md(s.cardSub || "")}</div></div></div>
          ${(s.rows || []).map((r) => `<div class="pk-trow"><span class="pk-tk">${icon(r.icon || "check")}${esc(r.k)}</span><b>${lines(r.v)}</b></div>`).join("")}
        </div>
        ${s.note ? `<p ${R("pk-note", 3)}>${md(s.note)}</p>` : ""}
        </div>${kFooter()}`;
      break;
    case "pk-map": {
      const st = s.stops || [];
      const pts = st.map((p) => [p.x, p.y]);
      let d = pts.length ? `M${pts[0][0]},${pts[0][1]}` : "";
      for (let k = 1; k < pts.length; k++) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k]; const cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
      const flag = (f) => { const [dir, cs] = f.split(":"); const c = cs.split(","); const n = c.length;
        const stops = c.map((col, k) => `${col} ${(k / n) * 100}% ${((k + 1) / n) * 100}%`).join(","); return `linear-gradient(${dir === "v" ? "90deg" : "180deg"},${stops})`; };
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        ${s.text ? `<p ${R("pk-text", 2)}>${md(s.text)}</p>` : ""}
        <div class="pk-map" style="height:${s.mapH || 640}px">
          <svg class="pk-route" viewBox="0 0 936 ${s.mapH || 640}" preserveAspectRatio="none"><path class="pk-route-glow" d="${d}"/><path class="pk-route-line" d="${d}"/></svg>
          ${st.map((p, k) => `<div class="pk-pin pop" style="left:${p.x}px;top:${p.y}px;--d:${300 + k * 180}ms"><div class="pk-pin-head"><i style="background:${flag(p.flag)}"></i></div><div class="pk-pin-label">${esc(p.name)}</div></div>`).join("")}
        </div>
        ${s.note ? `<p ${R("pk-note", 3)}>${md(s.note)}</p>` : ""}
        </div>${kFooter()}`;
      break;
    }
    case "pk-items":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        ${s.text ? `<p ${R("pk-text", 2)}>${md(s.text)}</p>` : ""}
        <div class="pk-grid">${(s.items || []).map((it, i) => `
          <div ${R("pk-item", i + 3)}><div class="pk-item-ico">${icon(it.icon)}</div><div><h3>${md(it.title)}</h3>${it.text ? `<p>${md(it.text)}</p>` : ""}</div></div>`).join("")}</div>
        </div>${kFooter()}`;
      break;
    case "pk-info":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        ${s.sub ? `<div ${R("pk-sub-brand pk-left", 2)}>${esc(s.sub)}</div>` : ""}
        ${s.text ? `<p ${R("pk-lead", 3)}>${md(s.text)}</p>` : ""}
        ${s.chips?.length ? `<div ${R("pk-chips", 4)}>${s.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>` : ""}
        </div>${kFooter()}`;
      break;
    case "pk-steps":
      body = `${kTop()}<div class="pk-body">
        ${s.kicker ? `<div ${R("pk-kicker", 0)}>${icon("zap")} ${esc(s.kicker)}</div>` : ""}
        <h2 ${R("pk-title", 1)}>${lines(s.title)}</h2>
        ${s.text ? `<p ${R("pk-text", 2)}>${md(s.text)}</p>` : ""}
        <div class="pk-steps">${(s.steps || []).map((st, i) => `
          <div ${R("pk-step", i + 3)}><div class="pk-step-ico">${icon(st.icon)}<b>${i + 1}</b></div><div><h3>${md(st.title)}</h3>${st.text ? `<p>${md(st.text)}</p>` : ""}</div></div>`).join("")}</div>
        ${s.note ? `<div ${R("pk-alert", 6)}>${md(s.note)}</div>` : ""}
        </div>${kFooter()}`;
      break;
    case "pk-cta":
      body = `${kTop()}<div class="pk-body pk-center">
        <h2 ${R("pk-title pk-cta-title", 0)}>${lines(s.title)}</h2>
        ${s.text ? `<p ${R("pk-lead", 1)}>${md(s.text)}</p>` : ""}
        <div class="pk-send pop" style="--d:350ms">${icon("send")}</div>
        ${s.button ? `<div class="pk-button pop rimrun" style="--d:550ms">${icon("link")} ${esc(s.button)}</div>` : ""}
        ${s.sub ? `<p ${R("pk-text", 4)}>${md(s.sub)}</p>` : ""}
        </div>${pkLogos(s.logos, true)}`;
      break;
    default:
      body = `${topbar()}<div class="content"><h2 class="display">${lines(s.title || "Layout desconhecido")}</h2></div>${footer()}`;
  }

  const bg = s.background ? `<div class="bg-image"><img src="${asset(s.background)}" alt=""></div>` : "";
  document.getElementById("stage").innerHTML = `
    <section class="slide theme-${theme} l-${s.layout || "statement"} ${s.align === "center" ? "center" : ""} ${s.valign === "top" ? "top" : ""} ${s.visual ? "has-visual" : ""} ${isVertical ? "vertical" : ""} ${String(s.layout).startsWith("k-") ? "kit-k" : ""} ${String(s.layout).startsWith("pk-") ? "kit-k kit-pk" : ""} ${window.__ANIM__ ? "anim" : ""}">
      ${bg}<div class="motif-orbit"></div>${String(s.layout).startsWith("pk-") && theme !== "light" ? stars() : ""}
      ${extras(s.extras)}${visual(s.visual)}
      <div class="frame">${body}</div>
    </section>`;
  // auto-ajuste: reduz o título até cada linha caber na largura da grelha (nunca sair das margens)
  document.fonts.ready.then(() => {
    document.querySelectorAll(".display, .big, .k-thin, .pk-title").forEach((el) => {
      const pk = el.classList.contains("pk-title");
      const max = pk ? el.clientWidth : (el.parentElement.clientWidth || (W - 144));
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > max + 1 && size > 60) { size -= 4; el.style.fontSize = size + "px"; }
    });
    document.body.dataset.ready = "1";
  });
})();
