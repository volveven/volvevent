/* Volvevent – minimales JavaScript: Menü, E-Mail-Links, dezente Einblendungen.
   Keine Cookies, kein Local Storage, keine externen Anfragen. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  /* Mobile Navigation ---------------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var panel = document.getElementById("nav-panel");
  var mq = window.matchMedia("(max-width: 820px)");

  function setOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".nav__label").textContent = open ? "Schließen" : "Menü";
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    var onChange = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* E-Mail-Adresse zusammensetzen (leichter Schutz vor Adress-Sammlern) ---- */
  function address(el) {
    return el.getAttribute("data-u") + "@" + el.getAttribute("data-d");
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-mail]"), function (el) {
    var addr = address(el);
    if (el.tagName === "A") {
      el.href = "mailto:" + addr;
    } else {
      var a = document.createElement("a");
      a.href = "mailto:" + addr;
      a.textContent = addr;
      el.replaceWith(a);
    }
  });

  /* Dezente Einblendung --------------------------------------------------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  Array.prototype.forEach.call(items, function (el) { io.observe(el); });
})();
