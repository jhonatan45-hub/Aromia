(() => {
const D = window.AROMIA;
const C = D.contacto;

/* ---------- Iconos ---------- */
const ICONS = {
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z"/><path d="M9.2 8.6c.2-.4.5-.5.8-.5h.5l.9 2-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6 2 .9v.5c0 .4-.2.7-.5.9-1.6.9-6.9-3.4-6.2-6.3z" fill="currentColor" stroke="none"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
};
const icon = k => ICONS[k];
const fillIcons = root => root.querySelectorAll("svg[data-i]").forEach(s => s.outerHTML = ICONS[s.dataset.i]);

/* ---------- Utilidades ---------- */
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const wa = msg => "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg);
const money = n => "S/ " + Number(n).toFixed(2);
const cat = id => D.categorias.find(c => c.id === id);
const prod = id => D.productos.find(p => p.id === id);
const prodsOf = cid => D.productos.filter(p => p.cat === cid);
const presLabel = pr => pr && pr.label ? pr.label : "Presentación por confirmar";
const priceHtml = (p, i = 0) => { const pr = p.presentaciones[i]; return pr && pr.price != null ? `<span class="price">${money(pr.price)}</span>` : `<span class="price tbd">Precio por confirmar</span>`; };
const minPrice = p => { const ps = p.presentaciones.filter(x => x.price != null).map(x => x.price); return ps.length ? Math.min(...ps) : null; };
const priceFrom = p => { const m = minPrice(p); if (m == null) return `<span class="price tbd">Precio por confirmar</span>`; return `<span class="price">${p.presentaciones.length > 1 ? "Desde " : ""}${money(m)}</span>`; };

function pic(key, alt, sizes, eager){
  if (!key) return `<div class="ph" role="img" aria-label="Foto pendiente de ${esc(alt)}">Foto<br>próximamente</div>`;
  return `<img src="img/${key}-sm.jpg" srcset="img/${key}-sm.jpg 640w, img/${key}.jpg 1280w" sizes="${sizes || "(min-width:960px) 30vw, 50vw"}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/* ---------- Carrito ---------- */
const KEY = "aromia-carrito-v2";
let cart = [];
try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
cart = cart.filter(it => prod(it.id) && prod(it.id).presentaciones[it.p]);
let buyer = { nombre:"", entrega:"Delivery", fecha:"", lugar:"", nota:"" };
try { buyer = Object.assign(buyer, JSON.parse(localStorage.getItem(KEY + "-datos")) || {}); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); localStorage.setItem(KEY + "-datos", JSON.stringify(buyer)); } catch (e) {} };
const count = () => cart.reduce((s, it) => s + it.q, 0);
const lineInfo = it => { const p = prod(it.id), pr = p.presentaciones[it.p]; return { p, pr, sub: pr.price != null ? pr.price * it.q : null }; };
const allPriced = () => cart.every(it => lineInfo(it).sub != null);
const total = () => cart.reduce((s, it) => s + (lineInfo(it).sub || 0), 0);
function addToCart(id, p = 0, q = 1){
  const ex = cart.find(it => it.id === id && it.p === p);
  if (ex) ex.q += q; else cart.push({ id, p, q });
  save(); syncCount(true);
  toast(prod(id).nombre + " agregado");
}
function syncCount(pop){
  const n = count();
  document.querySelectorAll("[data-count]").forEach(el => { el.textContent = n; el.classList.toggle("zero", n === 0); if (pop) { el.classList.add("pop"); setTimeout(() => el.classList.remove("pop"), 220); } });
  document.querySelectorAll("[data-count-plain]").forEach(el => el.textContent = n);
  const showBar = n > 0 && !["carrito", "producto"].includes(current.base);
  document.getElementById("mbar").classList.toggle("show", showBar);
  document.body.classList.toggle("has-bar", showBar);
}
let tt;
function toast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600);
}
function cartMessage(){
  const L = ["Hola Aromía, quiero hacer este pedido:", ""];
  cart.forEach((it, i) => {
    const { p, pr, sub } = lineInfo(it);
    L.push(`${i + 1}. ${p.nombre}${pr.label ? " (" + pr.label + ")" : ""} x${it.q}${sub != null ? " · " + money(sub) : ""}`);
  });
  L.push("", "Total: " + (allPriced() ? money(total()) : "por confirmar"));
  const extra = [];
  if (buyer.nombre.trim()) extra.push("Nombre: " + buyer.nombre.trim());
  extra.push("Entrega: " + buyer.entrega + (buyer.lugar.trim() ? " · " + buyer.lugar.trim() : ""));
  if (buyer.fecha) extra.push("Fecha: " + buyer.fecha.split("-").reverse().join("/"));
  if (buyer.nota.trim()) extra.push("Comentarios: " + buyer.nota.trim());
  return L.concat([""], extra).join("\n");
}

/* ---------- Componentes ---------- */
const STEPS = [
  { t:"Elige tus postres favoritos.", s:"Explora la carta y agrega lo que quieras a tu pedido.",
    l:"Entra a <a href=\"#postres\">Nuestros postres</a>, elige la categoría, la presentación y la cantidad, y agrégalo a tu pedido. Puedes combinar varios postres." },
  { t:"Personaliza y confirma tu pedido.", s:"Envíalo por WhatsApp con la fecha y los detalles.",
    l:"Desde tu pedido escribe la fecha, el tipo de entrega y cualquier detalle. Al enviarlo por WhatsApp te confirmamos disponibilidad y el total." },
  { t:"Realiza el pago.", s:"Paga por el método indicado.",
    l:"Una vez confirmado el pedido, realiza el pago por el método indicado y envíanos la constancia por el mismo chat." },
  { t:"Recibe tu pedido o coordina el recojo.", s:"Delivery o recojo, como te quede mejor.",
    l:"Coordinamos contigo el delivery o el recojo. Solo queda disfrutar." }
];

function catCard(c, sizes){
  const n = prodsOf(c.id).length;
  return `<a class="cat" href="#postres.${c.id}">
    <div class="ph-box">${pic(c.img, c.nombre, sizes)}</div>
    <div class="cat-name"><span>${esc(c.nombre)}<small>${n} ${n === 1 ? "producto" : "productos"}</small></span>${icon("arrow")}</div>
  </a>`;
}
function prodCard(p){
  return `<article class="prod">
    <a href="#producto.${p.id}"><div class="ph-box">${pic(p.img, p.nombre, "(min-width:960px) 23vw, 64vw")}</div>
    <div><h3>${esc(p.nombre)}</h3>${priceFrom(p)}</div></a>
    <button class="btn btn-line add" data-add="${p.id}">${icon("plus")} Agregar</button>
  </article>`;
}
function prodRow(p){
  return `<article class="prow">
    <div class="ph-box">${pic(p.img, p.nombre, "(min-width:960px) 30vw, 108px")}</div>
    <div class="info">
      <h3><a href="#producto.${p.id}">${esc(p.nombre)}</a></h3>
      ${p.desc ? `<p class="desc">${esc(p.desc)}</p>` : `<p class="desc">Descripción próximamente.</p>`}
      <div class="foot">${priceFrom(p)}<button class="btn btn-line add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} a tu pedido">${icon("plus")} Agregar</button></div>
    </div>
  </article>`;
}
const crumbs = items => `<nav class="crumbs" aria-label="Ruta">${items.map((it, i) => i < items.length - 1 ? `<a href="#${it[1]}">${esc(it[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(it[0])}</span>`).join("")}</nav>`;
const stepsHtml = () => `<ol class="steps">${STEPS.map((s, i) => `<li><span class="num">${i + 1}</span><div><h3>${s.t}</h3><p>${s.s}</p></div></li>`).join("")}</ol>`;

/* ---------- Páginas ---------- */
const withPhoto = D.categorias.filter(c => c.img);
const pages = {
  inicio(){
    const dest = D.productos.filter(p => p.destacado);
    return {
      title: "Aromía · Postres artesanales",
      html: `
      <section class="hero" style="padding-bottom:0">
        <div class="wrap hero-in">
          <div class="hero-copy">
            <h1 class="display">Pequeños placeres, <span class="r">grandes momentos.</span></h1>
            <p class="lead">Postres artesanales hechos con ingredientes de calidad, para endulzar tus días.</p>
            <div class="btns">
              <a class="btn btn-vino" href="#postres">Ver productos ${icon("arrow")}</a>
              <a class="link r" data-wa="Hola Aromía, quiero hacer un pedido." href="#" target="_blank" rel="noopener">${icon("wa")} Pedir por WhatsApp</a>
            </div>
          </div>
          <figure class="hero-photo" style="margin-block:0">${pic("donas", "Caja de mini donas Aromía con glaseados de chocolate, fresa, pistacho y vainilla", "(min-width:960px) 55vw, 100vw", true)}</figure>
        </div>
        <nav class="chips" aria-label="Categorías">${D.categorias.map(c => `<a class="chip" href="#postres.${c.id}">${esc(c.nombre)}</a>`).join("")}</nav>
      </section>

      <section class="campaign">
        <div class="wrap campaign-in">
          <div>
            <span class="eyebrow">Placer en miniatura</span>
            <h2 class="display">No necesitas <s>una ocasión especial</s> para darte un gusto.</h2>
            <p>Un brownie a media tarde, un cheesecake después del almuerzo o una caja de mini donas porque sí.</p>
          </div>
          <figure>${pic("maracuya", "Cheesecake de maracuyá con cobertura brillante", "(min-width:960px) 40vw, 100vw")}
            <a class="tag" href="#producto.cheesecake-maracuya">Cheesecake de maracuyá ${icon("arrow")}</a></figure>
        </div>
      </section>

      <section>
        <div class="wrap">
          <div class="shead"><div><span class="eyebrow">Nuestros</span><h2 class="display">Postres</h2></div>
            <a class="link r" href="#postres">Ver todos ${icon("arrow")}</a></div>
          <div class="rail">${withPhoto.slice(0, 6).map(c => catCard(c, "(min-width:960px) 30vw, 44vw")).join("")}</div>
        </div>
      </section>

      <section style="padding-top:0">
        <div class="wrap">
          <div class="shead"><h2 class="display" style="font-size:clamp(1.9rem,7.4vw,3rem)">Para antojarte hoy</h2></div>
          <div class="rail wide">${dest.map(prodCard).join("")}</div>
        </div>
      </section>

      <div class="promos">
        <div class="promo vino"><div class="wrap promo-in">
          <div>
            <span class="eyebrow">Pedidos individuales</span>
            <h2 class="display">Tu antojo de siempre.</h2>
            <p>Elige tus postres favoritos y haz tu pedido de forma rápida y sencilla.</p>
            <a class="btn btn-crema" href="#postres">Elegir postres ${icon("arrow")}</a>
          </div>
          <figure>${pic("galletas", "Galletas con chispas de chocolate", "(min-width:960px) 22vw, 100vw")}</figure>
        </div></div>
        <div class="promo amarillo"><div class="wrap promo-in">
          <div>
            <span class="eyebrow">Pedidos al por mayor</span>
            <h2 class="display">Ideales para tus eventos.</h2>
            <p>Bocaditos y postres perfectos para reuniones, celebraciones, empresas y más.</p>
            <a class="btn btn-choco" href="#por-mayor">Cotizar mi evento ${icon("arrow")}</a>
          </div>
          <figure>${pic("surtido", "Bocaditos surtidos: brownie, mini cheesecake, galleta y empanadita", "(min-width:960px) 22vw, 100vw")}</figure>
        </div></div>
      </div>

      <section class="about">
        <div class="wrap about-in">
          <figure>${pic("pie", "Pie de limón con merengue dorado", "(min-width:960px) 40vw, 100vw")}</figure>
          <div>
            <span class="eyebrow">Nosotros</span>
            <h2 class="display">Hacemos pequeños postres para <span class="y">grandes momentos.</span></h2>
            <ul class="verbs"><li>Disfrutar</li><li>Compartir</li><li>Regalar</li><li>Celebrar</li></ul>
            <p>Postres en tamaño pequeño, pensados para que un antojo cualquiera se sienta especial.</p>
            <a class="btn btn-amarillo" href="#nosotros">Conócenos ${icon("arrow")}</a>
          </div>
        </div>
      </section>

      <section>
        <div class="wrap howto-in">
          <div>
            <span class="eyebrow r">Rápido, fácil y seguro</span>
            <h2 class="display" style="font-size:clamp(2.1rem,8.6vw,3.6rem)">¿Cómo hacer tu pedido?</h2>
          </div>
          <div>
            ${stepsHtml()}
            <div class="btns howto-foot">
              <a class="btn btn-vino" data-wa="Hola Aromía, quiero hacer un pedido." href="#" target="_blank" rel="noopener">${icon("wa")} Pedir por WhatsApp</a>
              <a class="link" href="#como-pedir">Ver detalles ${icon("arrow")}</a>
            </div>
          </div>
        </div>
      </section>`
    };
  },

  postres(id){
    if (id && cat(id)) return pages.categoria(id);
    return {
      title: "Nuestros postres · Aromía",
      html: `
      <div class="wrap phead">
        ${crumbs([["Inicio","inicio"],["Nuestros postres"]])}
        <h1 class="display">Nuestros <span class="r">postres</span></h1>
        <p class="lead">Elige una categoría para ver productos, presentaciones y precios.</p>
      </div>
      <div class="wrap page-sec"><div class="catgrid">${D.categorias.map(c => catCard(c, "(min-width:960px) 25vw, 50vw")).join("")}</div></div>`
    };
  },

  categoria(id){
    const c = cat(id), list = prodsOf(id);
    const others = D.categorias.filter(x => x.id !== id);
    return {
      title: c.nombre + " · Aromía",
      html: `
      <div class="wrap phead">
        ${crumbs([["Inicio","inicio"],["Nuestros postres","postres"],[c.nombre]])}
        <h1 class="display">${esc(c.nombre)}</h1>
        <p class="lead">${esc(c.intro)}</p>
      </div>
      <div class="wrap page-sec">
        <div class="plist">${list.length ? list.map(prodRow).join("") : `<p class="lead">Pronto agregaremos productos en esta categoría.</p>`}</div>
        <a class="link" href="#postres" style="margin-top:22px">${icon("back")} Todas las categorías</a>
      </div>
      <nav class="chips" aria-label="Otras categorías" style="padding-bottom:48px">${others.map(o => `<a class="chip" href="#postres.${o.id}">${esc(o.nombre)}</a>`).join("")}</nav>`
    };
  },

  producto(id){
    const p = prod(id);
    if (!p) return pages.postres();
    const c = cat(p.cat);
    const multi = p.presentaciones.length > 1 || !!p.presentaciones[0].label;
    const rel = D.productos.filter(x => x.id !== p.id && x.img).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
    return {
      title: p.nombre + " · Aromía",
      html: `
      <div class="wrap phead" style="padding-bottom:16px">
        ${crumbs([["Postres","postres"],[c.nombre,"postres." + c.id],[p.nombre]])}
      </div>
      <div class="wrap pd">
        <figure class="pd-photo" style="margin-block:0">${pic(p.img, p.nombre, "(min-width:960px) 50vw, 100vw", true)}</figure>
        <div>
          <span class="eyebrow r">${esc(c.nombre)}</span>
          <h1 class="display">${esc(p.nombre)}</h1>
          <p class="bigprice ${p.presentaciones[0].price == null ? "tbd" : ""}" id="pdPrice">${p.presentaciones[0].price == null ? "Precio por confirmar" : money(p.presentaciones[0].price)}</p>
          <p class="desc">${p.desc ? esc(p.desc) : "Descripción próximamente."}</p>
          <span class="field-label">Presentación</span>
          ${multi ? `<fieldset class="opts" id="pres"><legend class="sr">Presentación</legend>${p.presentaciones.map((pr, i) => `<label class="opt"><input type="radio" name="pres" id="pres-${i}" value="${i}" ${i === 0 ? "checked" : ""}><span>${esc(presLabel(pr))}</span></label>`).join("")}</fieldset>`
                  : `<p class="note" style="margin:0">Presentación por confirmar. Te la indicamos por WhatsApp.</p>`}
          <div class="buy">
            <div class="qty" role="group" aria-label="Cantidad"><button type="button" data-pq="-1" aria-label="Quitar uno">−</button><output id="pq">1</output><button type="button" data-pq="1" aria-label="Agregar uno">+</button></div>
            <button class="btn btn-vino" id="pdAdd" data-id="${p.id}">Agregar al pedido</button>
          </div>
          <a class="link r" style="margin-top:8px" data-wa="Hola Aromía, quisiera consultar por: ${esc(p.nombre)}." href="#" target="_blank" rel="noopener">${icon("wa")} Consultar por WhatsApp</a>
          <p><a class="link" href="#postres.${c.id}">${icon("back")} Volver a ${esc(c.nombre)}</a></p>
        </div>
      </div>
      <div class="wrap related"><h2 class="display">También te puede gustar</h2><div class="rail wide">${rel.map(prodCard).join("")}</div></div>`
    };
  },

  "por-mayor"(){
    const tipos = ["Cumpleaños","Reunión","Evento de empresa","Celebración familiar","Otro"];
    return {
      title: "Pedidos al por mayor · Aromía",
      html: `
      <div class="mayor-hero"><div class="wrap">
        ${crumbs([["Inicio","inicio"],["Pedidos al por mayor"]])}
        <div class="mayor-in">
          <div>
            <h1 class="display">Ideales para <span class="r">tus eventos.</span></h1>
            <p class="lead">Bocaditos y postres perfectos para reuniones, celebraciones, empresas y más. Armamos tu pedido a medida y te enviamos la cotización por WhatsApp.</p>
            <ul class="occ"><li>Empresas</li><li>Celebraciones</li><li>Reuniones</li><li>Cumpleaños</li><li>Eventos</li></ul>
          </div>
          <figure>${pic("surtido", "Bocaditos surtidos para eventos", "(min-width:960px) 45vw, 100vw", true)}</figure>
        </div>
      </div></div>
      <section><div class="wrap quote">
        <div>
          <span class="eyebrow r">Cotización</span>
          <h2 class="display">Cuéntanos de tu evento</h2>
          <p class="lead" style="margin-top:14px">Completa lo que sepas y envíalo. Con esos datos te respondemos con opciones, disponibilidad y precio.</p>
        </div>
        <form class="form" id="quoteForm" novalidate>
          <label for="q-tipo">Tipo de evento<select id="q-tipo">${tipos.map(t => `<option>${t}</option>`).join("")}</select></label>
          <label for="q-fecha">Fecha del evento<input id="q-fecha" type="date"></label>
          <label for="q-personas">Cantidad aproximada de personas<input id="q-personas" type="number" min="1" inputmode="numeric" placeholder="Ej.: 40"></label>
          <div><span class="field-label" style="margin-top:0">Postres de interés</span>
            <div class="checks">${D.categorias.map(c => `<label class="opt"><input type="checkbox" id="q-c-${c.id}" value="${esc(c.nombre)}"><span>${esc(c.nombre)}</span></label>`).join("")}</div></div>
          <label for="q-lugar">Distrito<input id="q-lugar" type="text" placeholder="Ej.: Miraflores"></label>
          <label for="q-nota">Comentarios<textarea id="q-nota" placeholder="Presupuesto, temática, colores, empaque…"></textarea></label>
          <a class="btn btn-vino btn-block" id="quoteSend" href="#" target="_blank" rel="noopener">${icon("wa")} Enviar cotización por WhatsApp</a>
        </form>
      </div></section>`
    };
  },

  "como-pedir"(){
    return {
      title: "Cómo pedir · Aromía",
      html: `
      <div class="wrap phead">
        ${crumbs([["Inicio","inicio"],["Cómo pedir"]])}
        <h1 class="display">¿Cómo hacer <span class="r">tu pedido?</span></h1>
        <p class="lead">Rápido, fácil y seguro. Así funciona, paso a paso.</p>
      </div>
      <div class="wrap page-sec">
        <ol class="bigsteps">${STEPS.map((s, i) => `<li><span class="n">0${i + 1}</span><h3>${s.t}</h3><p>${s.l}</p></li>`).join("")}</ol>
        <div class="info-grid">
          <div class="ibox vino"><h2 class="display">Pago</h2><p>Aceptamos Yape. ${C.yape ? "Número: " + esc(C.yape) + "." : "Te enviamos los datos al confirmar tu pedido."}</p><span class="pay">Yape</span></div>
          <div class="ibox amarillo"><h2 class="display">Delivery</h2><p>${esc(D.entrega.delivery)}</p></div>
          <div class="ibox choco"><h2 class="display">Recojo</h2><p>${esc(D.entrega.recojo)}</p></div>
        </div>
        <div class="btns" style="margin-top:32px">
          <a class="btn btn-vino" href="#postres">Elegir postres ${icon("arrow")}</a>
          <a class="link r" data-wa="Hola Aromía, tengo una consulta sobre mi pedido." href="#" target="_blank" rel="noopener">${icon("wa")} Pedir por WhatsApp</a>
        </div>
      </div>`
    };
  },

  nosotros(){
    const V = [
      ["Disfrutar","Un antojo a media tarde, solo para ti.","brownies","producto.brownies"],
      ["Compartir","Una caja abierta en la mesa, para todos.","donas","producto.mini-donas-surtidas"],
      ["Regalar","Un detalle dulce para alguien que quieres.","surtido","producto.caja-surtida"],
      ["Celebrar","Postres para cumpleaños, reuniones y eventos.","cheesecake","por-mayor"]
    ];
    return {
      title: "Nosotros · Aromía",
      html: `
      <div class="ab-hero"><div class="wrap">
        ${crumbs([["Inicio","inicio"],["Nosotros"]])}
        <span class="eyebrow y">Placer en miniatura</span>
        <h1 class="display">Hacemos pequeños postres para <span class="y">grandes momentos.</span></h1>
        <p class="lead">En Aromía preparamos postres artesanales en tamaño pequeño, con ingredientes de calidad y mucho cariño. Son para disfrutar a cualquier hora, compartir en la mesa, regalar a alguien que quieres o llevar a la celebración.</p>
      </div></div>
      <section><div class="wrap">
        <div class="mosaic">${V.map(v => `<a class="tile" href="#${v[3]}">${pic(v[2], v[0], "(min-width:720px) 25vw, 50vw")}<div class="cap"><b>${v[0]}</b><span>${v[1]}</span></div></a>`).join("")}</div>
        <div class="ab-quote"><p>No necesitas una ocasión especial para <span class="r">darte un gusto.</span></p></div>
        <div class="btns"><a class="btn btn-vino" href="#postres">Ver nuestros postres ${icon("arrow")}</a><a class="link" id="igLink" href="${esc(C.instagram)}" target="_blank" rel="noopener">${icon("ig")} Síguenos en Instagram</a></div>
      </div></section>`
    };
  },

  carrito(){
    if (!cart.length) return {
      title: "Tu pedido · Aromía",
      html: `<div class="wrap phead">${crumbs([["Inicio","inicio"],["Tu pedido"]])}<h1 class="display">Tu <span class="r">pedido</span></h1></div>
      <div class="wrap empty"><p class="lead" style="margin:0 0 22px">Aún no agregas postres. Elige tus favoritos y aparecerán aquí.</p><a class="btn btn-vino" href="#postres">Ver nuestros postres ${icon("arrow")}</a></div>`
    };
    return {
      title: "Tu pedido · Aromía",
      html: `
      <div class="wrap phead">${crumbs([["Inicio","inicio"],["Tu pedido"]])}<h1 class="display">Tu <span class="r">pedido</span></h1></div>
      <div class="wrap page-sec cart-grid">
        <div>
          <ul class="lines">${cart.map((it, i) => { const { p, pr, sub } = lineInfo(it); return `
            <li class="line">
              <a class="ph-box" href="#producto.${p.id}" aria-label="${esc(p.nombre)}">${pic(p.img, p.nombre, "76px")}</a>
              <div>
                <h3><a href="#producto.${p.id}">${esc(p.nombre)}</a></h3>
                <p class="meta">${esc(presLabel(pr))} · ${pr.price != null ? money(pr.price) + " c/u" : "precio por confirmar"}</p>
                <div class="line-ctl">
                  <div class="qty sm" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-cq="${i}" data-d="-1" aria-label="Quitar uno">−</button><output>${it.q}</output><button type="button" data-cq="${i}" data-d="1" aria-label="Agregar uno">+</button></div>
                  <span>${sub != null ? `<span class="price">${money(sub)}</span>` : ""}</span>
                  <button class="rm" data-rm="${i}">Eliminar</button>
                </div>
              </div>
            </li>`; }).join("")}</ul>
          <a class="link" href="#postres" style="margin-top:14px">${icon("back")} Seguir agregando postres</a>
        </div>
        <aside class="summary">
          <h2 class="display">Resumen</h2>
          <div class="row"><span>Productos</span><span>${count()}</span></div>
          <div class="row total"><span>Total</span><span>${allPriced() ? money(total()) : "Por confirmar"}</span></div>
          ${allPriced() ? "" : `<p class="note">Algunos precios se confirman por WhatsApp junto con la disponibilidad.</p>`}
          <form class="form" id="buyForm" novalidate>
            <label for="b-nombre">Tu nombre<input id="b-nombre" type="text" autocomplete="name" value="${esc(buyer.nombre)}"></label>
            <div><span class="field-label" style="margin:0 0 8px">Entrega</span>
              <div class="opts">${["Delivery","Recojo"].map(o => `<label class="opt"><input type="radio" name="entrega" id="b-${o}" value="${o}" ${buyer.entrega === o ? "checked" : ""}><span>${o}</span></label>`).join("")}</div></div>
            <label for="b-lugar" id="b-lugar-l">${buyer.entrega === "Recojo" ? "Hora aproximada de recojo" : "Distrito o dirección"}<input id="b-lugar" type="text" value="${esc(buyer.lugar)}"></label>
            <label for="b-fecha">Fecha deseada<input id="b-fecha" type="date" value="${esc(buyer.fecha)}"></label>
            <label for="b-nota">Comentarios<textarea id="b-nota" placeholder="Sabores, dedicatoria, alergias…">${esc(buyer.nota)}</textarea></label>
            <a class="btn btn-vino btn-block" id="sendOrder" href="${wa(cartMessage())}" target="_blank" rel="noopener">${icon("wa")} Enviar pedido por WhatsApp</a>
          </form>
          <button class="rm clear" id="clearCart">Vaciar pedido</button>
        </aside>
      </div>`
    };
  }
};

/* ---------- Enrutador ---------- */
let current = { base: "inicio", arg: "" };
const NAV_OF = { categoria:"postres", producto:"postres" };
function parse(){
  const h = decodeURIComponent(location.hash.slice(1));
  const i = h.indexOf(".");
  const base = (i < 0 ? h : h.slice(0, i)) || "inicio";
  return { base: pages[base] && base !== "categoria" ? base : "inicio", arg: i < 0 ? "" : h.slice(i + 1) };
}
function render(scroll = true){
  current = parse();
  const out = pages[current.base](current.arg);
  const app = document.getElementById("app");
  app.innerHTML = out.html;
  app.classList.remove("fade"); void app.offsetWidth; app.classList.add("fade");
  document.title = out.title;
  bindWa(app);
  const navKey = NAV_OF[current.base] || current.base;
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === navKey));
  closeMenu();
  syncCount(false);
  markAdded();
  if (current.base === "producto") initProduct();
  if (current.base === "carrito") initCart();
  if (current.base === "por-mayor") initQuote();
  if (scroll) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
}
function bindWa(root){ root.querySelectorAll("[data-wa]").forEach(a => a.href = wa(a.dataset.wa)); }
function markAdded(){
  document.querySelectorAll("[data-add]").forEach(b => {
    const n = cart.filter(it => it.id === b.dataset.add).reduce((s, it) => s + it.q, 0);
    b.classList.toggle("done", n > 0);
    b.innerHTML = n > 0 ? icon("check") + " En tu pedido (" + n + ")" : icon("plus") + " Agregar";
  });
}

/* ---------- Página de producto ---------- */
function initProduct(){
  const p = prod(current.arg); if (!p) return;
  let q = 1;
  const out = document.getElementById("pq");
  const sel = () => { const r = document.querySelector('input[name="pres"]:checked'); return r ? +r.value : 0; };
  const paint = () => { const pr = p.presentaciones[sel()]; const el = document.getElementById("pdPrice"); el.classList.toggle("tbd", pr.price == null); el.textContent = pr.price == null ? "Precio por confirmar" : money(pr.price * q) + (q > 1 ? " (" + q + " × " + money(pr.price) + ")" : ""); };
  document.querySelectorAll("[data-pq]").forEach(b => b.onclick = () => { q = Math.max(1, Math.min(99, q + +b.dataset.pq)); out.textContent = q; paint(); });
  document.querySelectorAll('input[name="pres"]').forEach(r => r.onchange = paint);
  document.getElementById("pdAdd").onclick = () => { addToCart(p.id, sel(), q); q = 1; out.textContent = 1; paint(); };
}

/* ---------- Página de carrito ---------- */
function initCart(){
  const send = document.getElementById("sendOrder");
  if (!send) return;
  const upd = () => { save(); send.href = wa(cartMessage()); };
  [["b-nombre","nombre"],["b-lugar","lugar"],["b-fecha","fecha"],["b-nota","nota"]].forEach(([id, k]) => {
    const el = document.getElementById(id); el.addEventListener("input", () => { buyer[k] = el.value; upd(); });
  });
  document.querySelectorAll('input[name="entrega"]').forEach(r => r.onchange = () => {
    buyer.entrega = r.value;
    const l = document.getElementById("b-lugar-l");
    l.firstChild.textContent = r.value === "Recojo" ? "Hora aproximada de recojo" : "Distrito o dirección";
    upd();
  });
  const clr = document.getElementById("clearCart");
  let armed = false;
  clr.onclick = () => {
    if (!armed) { armed = true; clr.textContent = "¿Seguro? Toca otra vez para vaciar"; setTimeout(() => { armed = false; clr.textContent = "Vaciar pedido"; }, 3500); return; }
    cart = []; save(); render(false); syncCount(true);
  };
}

/* ---------- Cotización ---------- */
function initQuote(){
  const f = document.getElementById("quoteForm"), send = document.getElementById("quoteSend");
  const build = () => {
    const g = id => document.getElementById(id).value.trim();
    const cats = [...f.querySelectorAll('input[type="checkbox"]:checked')].map(c => c.value);
    const L = ["Hola Aromía, quiero cotizar un pedido al por mayor.", "", "Tipo de evento: " + g("q-tipo")];
    if (g("q-fecha")) L.push("Fecha: " + g("q-fecha").split("-").reverse().join("/"));
    if (g("q-personas")) L.push("Personas aproximadas: " + g("q-personas"));
    if (cats.length) L.push("Postres de interés: " + cats.join(", "));
    if (g("q-lugar")) L.push("Distrito: " + g("q-lugar"));
    if (g("q-nota")) L.push("Comentarios: " + g("q-nota"));
    send.href = wa(L.join("\n"));
  };
  f.addEventListener("input", build); f.addEventListener("change", build); f.addEventListener("submit", e => e.preventDefault());
  build();
}

/* ---------- Eventos globales ---------- */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { e.preventDefault(); addToCart(add.dataset.add, 0, 1); markAdded(); return; }
  const cq = e.target.closest("[data-cq]");
  if (cq) { const it = cart[+cq.dataset.cq]; it.q += +cq.dataset.d; if (it.q < 1) cart.splice(+cq.dataset.cq, 1); save(); render(false); syncCount(true); return; }
  const rm = e.target.closest("[data-rm]");
  if (rm) { cart.splice(+rm.dataset.rm, 1); save(); render(false); syncCount(true); return; }
});

const burger = document.getElementById("burger"), mnav = document.getElementById("mnav");
function closeMenu(){ mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menú"); burger.querySelector("path").setAttribute("d", "M4 7h16M4 12h16M4 17h16"); document.body.style.overflow = ""; }
burger.addEventListener("click", () => {
  if (!mnav.hidden) return closeMenu();
  mnav.hidden = false; burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Cerrar menú");
  burger.querySelector("path").setAttribute("d", "M6 6l12 12M18 6 6 18"); document.body.style.overflow = "hidden";
});
mnav.addEventListener("click", e => { if (e.target.closest("a") && e.target.closest("a").getAttribute("href") === location.hash) closeMenu(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

fillIcons(document);
bindWa(document);
document.getElementById("ig").href = C.instagram;
document.getElementById("mail").textContent = C.email;
window.addEventListener("hashchange", () => render(true));
render(false);
})();
