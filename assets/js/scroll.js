/* Volvevent – Scrollytelling der Startseite (nur index.html).
   Benötigt die lokal eingebundenen Bibliotheken GSAP + ScrollTrigger (assets/vendor/)
   und optional Lenis. Bei „Bewegung reduzieren“ oder ohne diese Bibliotheken bleibt
   die Seite vollständig statisch. */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("st")) return;          // reduzierte Bewegung → statisch
  if (!window.gsap || !window.ScrollTrigger) {          // Bibliotheken fehlen → statisch
    root.classList.remove("st");
    return;
  }
  window.__stReady = true;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* Smooth Scroll (Lenis v1) – eine einzige Schleife über gsap.ticker ---- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      anchors: true,
      autoRaf: false
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Während das mobile Menü geöffnet ist, nicht scrollen
    new MutationObserver(function () {
      if (document.body.classList.contains("nav-open")) lenis.stop();
      else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  var q = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Scroll-Fortschritt -------------------------------------------------- */
  gsap.to(".scroll-progress", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.2 }
  });

  /* Hero: Zeilen maskiert einblenden ------------------------------------- */
  gsap.set(".hero__title .line__inner", { yPercent: 110, y: 0 });
  gsap.set(".hero__intro", { y: 16 });
  gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 })
    .to(".hero__eyebrow", { opacity: 1, duration: 0.6 })
    .to(".hero__title .line__inner", { yPercent: 0, duration: 1.1, stagger: 0.12 }, "-=0.35")
    .to(".hero__intro", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".facts", { "--draw": 1, duration: 1.1, ease: "power2.inOut" }, "-=0.55")
    .to(".facts__item", { opacity: 1, duration: 0.6, stagger: 0.08 }, "-=0.75");

  /* Hero beim Herausscrollen leicht zurücknehmen */
  var heroOut = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__title", { scale: 0.96, y: -40, opacity: 0.35, transformOrigin: "left bottom", ease: "none", scrollTrigger: heroOut });
  gsap.to(".hero__intro .lead, .hero__intro .hero__actions", { y: -24, opacity: 0.35, ease: "none", scrollTrigger: heroOut });

  /* Leistungen: Desktop gepinnt mit Zähler, Mobil einfache Einblendung --- */
  var mm = gsap.matchMedia();
  var section = document.getElementById("leistungen");
  var items = section ? q(".service", section) : [];

  mm.add("(min-width: 900px)", function () {
    if (!section || items.length < 2) return;
    section.classList.add("is-stepped");
    var reel = section.querySelector(".steps__reel");
    var fill = section.querySelector(".steps__fill");
    var n = items.length;

    gsap.set(items, { opacity: 0, y: 30 });
    gsap.set(items[0], { opacity: 1, y: 0 });
    gsap.set(reel, { yPercent: 0 });
    gsap.set(fill, { scaleX: 1 / n });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () { return "+=" + Math.round((n - 1) * window.innerHeight * 0.9); },
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    tl.to({}, { duration: 0.4 });
    for (var i = 1; i < n; i++) {
      var label = "step" + i;
      tl.addLabel(label)
        .to(items[i - 1], { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, label)
        .fromTo(items[i], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, label + "+=0.3")
        .to(reel, { yPercent: -100 * i / n, duration: 0.6, ease: "power2.inOut" }, label + "+=0.1")
        .to(fill, { scaleX: (i + 1) / n, duration: 0.6, ease: "power2.inOut" }, label + "+=0.1")
        .to({}, { duration: 0.5 });
    }

    return function () {
      section.classList.remove("is-stepped");
    };
  });

  mm.add("(max-width: 899px)", function () {
    items.forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 20, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  });

  /* Abschnitts-Labels, Titel und Linien ---------------------------------- */
  function reveal(targets, vars, trigger, start) {
    q(targets).forEach(function (el) {
      gsap.from(el, Object.assign({
        opacity: 0, y: 20, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: trigger || el, start: start || "top 86%", once: true }
      }, vars || {}));
    });
  }
  reveal("#leistungen .eyebrow, #gruender .eyebrow", { y: 10, duration: 0.6 });
  reveal("#leistungen .section__title", { y: 28 });

  q(".draw").forEach(function (el) {
    if (el.classList.contains("facts")) return; // im Hero-Intro animiert
    gsap.fromTo(el, { "--draw": 0 }, {
      "--draw": 1, duration: 1.2, ease: "power2.inOut",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* Gründer: Name, Bio, Listen gestaffelt -------------------------------- */
  var founderIntro = document.querySelector("#gruender .section__body > .st-group");
  if (founderIntro) {
    gsap.from(founderIntro.children, {
      opacity: 0, y: 20, duration: 0.8, ease: "power2.out", stagger: 0.1,
      scrollTrigger: { trigger: founderIntro, start: "top 82%", once: true }
    });
  }
  q("#gruender .rule-list").forEach(function (list) {
    gsap.from(list.children, {
      opacity: 0, y: 10, duration: 0.5, ease: "power2.out", stagger: 0.06,
      scrollTrigger: { trigger: list, start: "top 88%", once: true }
    });
  });

  /* Kontakt: Hintergrund von Weiß zu Schwarz ----------------------------- */
  var contact = document.getElementById("kontakt");
  if (contact) {
    gsap.fromTo(contact, { backgroundColor: "#ffffff" }, {
      backgroundColor: "#000000", ease: "none",
      scrollTrigger: { trigger: contact, start: "top 90%", end: "top 45%", scrub: true }
    });
    var contactParts = q(".eyebrow, .contact__title, .contact__text, .contact__grid, .contact__actions", contact);
    gsap.set(contactParts, { opacity: 0, y: 24 });
    gsap.to(contactParts, {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1,
      scrollTrigger: { trigger: contact, start: "top 45%", once: true }
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
