# Volvevent – Website

Statische Website von **Volvevent** (Einzelunternehmen von Muhammet Hasan Gürcan, Ergolding) – IT- und Softwaredienstleistungen.

Live: <https://volveven.github.io/volvevent/>

## Aufbau

- Reines HTML, ein handgeschriebenes Stylesheet (`assets/css/styles.css`) und ein kleines Skript (`assets/js/app.js`, Mobile-Menü, E-Mail-Links).
- Nur die Startseite hat Scrollytelling (`assets/js/scroll.js`) mit selbst gehostetem GSAP 3.15 + ScrollTrigger und Lenis 1.3 (`assets/vendor/`, Lizenzen liegen bei). Bei „Bewegung reduzieren“ (prefers-reduced-motion) oder ohne JavaScript ist die Seite vollständig statisch; auf Bildschirmen unter 900 px wird nicht gepinnt.
- Kein Build-Schritt, keine CDNs, keine Cookies, kein Tracking.
- Schriften (Inter, Inter Tight – SIL Open Font License) liegen lokal unter `assets/fonts/`.
- Seiten: `index.html`, `impressum.html`, `datenschutz.html`, `agb.html`, `omnivoice-privacy.html`, `404.html`, dazu `robots.txt`, `sitemap.xml`, `assets/img/favicon.svg`, `assets/img/og-image.png`.

## Lokale Vorschau

```bash
# aus dem Elternverzeichnis starten, damit die Pfade wie auf GitHub Pages (/volvevent/) funktionieren
cd ..
python3 -m http.server 8000
# dann http://localhost:8000/volvevent/ öffnen
```

Alternativ direkt im Repository `python3 -m http.server` ausführen und `http://localhost:8000/` öffnen – dann funktionieren alle Seiten außer `404.html`, das für GitHub Pages absolute Pfade unter `/volvevent/` verwendet.

## Deployment (GitHub Pages)

1. Änderungen auf den Branch `main` pushen.
2. Im Repository unter **Settings → Pages** als Quelle „Deploy from a branch“, Branch `main`, Ordner `/ (root)` wählen.
3. GitHub Pages veröffentlicht die Seite unter `https://volveven.github.io/volvevent/`. Für unbekannte Pfade liefert GitHub Pages automatisch `404.html` aus.

Bei einer eigenen Domain müssen die absoluten URLs (Canonical, Open Graph, `sitemap.xml`, `robots.txt`) sowie `<base href>` in `404.html` angepasst werden.
