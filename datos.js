/* =====================================================================
   AROMÍA · DATOS EDITABLES
   Aquí se cambian contacto, categorías, productos, presentaciones,
   precios y fotos. No hace falta tocar index.html.

   FOTOS: cada producto usa la clave "img". Para "brownies" la web carga
   img/brownies.jpg (1280 px de ancho) e img/brownies-sm.jpg (640 px).
   Para cambiar una foto, reemplaza esos dos archivos con el mismo nombre.
   Si "img" es null, se muestra un espacio de "Foto próximamente".

   PRECIOS: price: null se muestra como "Por confirmar".
   Escribe el número sin "S/", por ejemplo price: 12.5
   ===================================================================== */

window.AROMIA = {

  contacto: {
    whatsapp: "51931717663",                 // código de país + número, sin espacios ni "+"
    instagram: "https://www.instagram.com/aromia_pm/",
    email: "aromia.postres@gmail.com",
    yape: ""                                 // PENDIENTE: número o titular de Yape (opcional)
  },

  entrega: {
    delivery: "Coordinamos el delivery contigo por WhatsApp según tu distrito.", // PENDIENTE: zonas y costos
    recojo: "Coordinamos contigo el punto y la hora de recojo por WhatsApp."     // PENDIENTE: dirección y horario
  },

  categorias: [
    { id: "mini-donas",          nombre: "Mini donas",          img: "donas",       intro: "Donas pequeñas con glaseados de colores y toppings crocantes." },
    { id: "cheesecakes",         nombre: "Cheesecakes",         img: "cheesecake",  intro: "Relleno cremoso sobre base de galleta, con coberturas de fruta." },
    { id: "brownies-y-galletas", nombre: "Brownies y galletas", img: "brownies",    intro: "Chocolate por todos lados: brownies húmedos y galletas con chispas." },
    { id: "pie-de-limon",        nombre: "Pie de limón",        img: "pie",         intro: "Crema de limón, base crocante y merengue dorado." },
    { id: "queques",             nombre: "Queques",             img: null,          intro: "Queques caseros para acompañar el café o el lonche." },
    { id: "empanaditas",         nombre: "Empanaditas",         img: "empanaditas", intro: "Masa dorada y horneada, con borde trenzado." },
    { id: "otros",               nombre: "Otros postres",       img: "surtido",     intro: "Bocaditos surtidos y otras opciones para regalar o compartir." }
  ],

  /* presentaciones: lista de opciones. label vacío = "Presentación por confirmar".
     Ejemplo listo para usar:
     presentaciones: [ { label: "Unidad", price: 6 }, { label: "Caja x6", price: 32 } ] */
  productos: [
    { id: "mini-donas-surtidas",     cat: "mini-donas",          nombre: "Mini donas surtidas",
      img: "donas",       destacado: true,
      desc: "Glaseados de chocolate, fresa, pistacho y vainilla, con toppings crocantes y galleta triturada.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "cheesecake-frutos-rojos", cat: "cheesecakes",         nombre: "Cheesecake de frutos rojos",
      img: "cheesecake",  destacado: true,
      desc: "Relleno cremoso sobre base de galleta, cubierto con salsa de frutos rojos, fresas y arándanos.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "cheesecake-maracuya",     cat: "cheesecakes",         nombre: "Cheesecake de maracuyá",
      img: "maracuya",    destacado: false,
      desc: "Relleno cremoso sobre base de galleta, con cobertura brillante de maracuyá y sus semillas.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "brownies",                cat: "brownies-y-galletas", nombre: "Brownies",
      img: "brownies",    destacado: true,
      desc: "Brownie húmedo con chispas de chocolate y salsa de chocolate por encima.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "galletas-chispas",        cat: "brownies-y-galletas", nombre: "Galletas con chispas de chocolate",
      img: "galletas",    destacado: false,
      desc: "Galletas doradas por fuera, suaves por dentro y llenas de trozos de chocolate.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "pie-de-limon",            cat: "pie-de-limon",        nombre: "Pie de limón",
      img: "pie",         destacado: true,
      desc: "Crema de limón sobre base de galleta, con merengue dorado y ralladura de limón.",
      presentaciones: [ { label: "", price: null } ] },

    { id: "queque",                  cat: "queques",             nombre: "Queque",
      img: null,          destacado: false,
      desc: "",   // PENDIENTE: sabores y descripción
      presentaciones: [ { label: "", price: null } ] },

    { id: "empanaditas",             cat: "empanaditas",         nombre: "Empanaditas",
      img: "empanaditas", destacado: false,
      desc: "Masa dorada y horneada, con borde trenzado.", // PENDIENTE: rellenos disponibles
      presentaciones: [ { label: "", price: null } ] },

    { id: "caja-surtida",            cat: "otros",               nombre: "Caja de bocaditos surtidos",
      img: "surtido",     destacado: false,
      desc: "Brownie, mini cheesecake, galleta, empanadita y más, juntos en una caja para regalar o compartir.",
      presentaciones: [ { label: "", price: null } ] }
  ]
};
