# vartu-pasaule-site

SIA „Elks AK“ (zīmols „Vārtu pasaule“) mājaslapa.
Vārtu ražošana, pārdošana un uzstādīšana. Nītaure, Cēsu novads.

**Statiska lapa. Nav WordPress, nav PHP, nav datubāzes.**
Uz servera nonāk tikai HTML, CSS, JS un attēli.

## Dokumentācija

- [PAMACIBA.md](PAMACIBA.md) - kā labot saturu (klientam)
- [UZSTADISANA.md](UZSTADISANA.md) - uzstādīšana, nodošana, serveris (tehniski)
- [VAJADZIGAS-BILDES.md](VAJADZIGAS-BILDES.md) - kādas bildes vēl vajag no klienta

## Tehniski

| | |
|---|---|
| Ģenerators | Eleventy 3 |
| Saturs | Markdown + JSON repozitorijā |
| Redaktors | Sveltia CMS, `/admin/` |
| Būvēšana | GitHub Actions |
| Izvietošana | statiski faili uz klienta Apache servera |

```
npm ci
npm start     # http://localhost:8080
npm run build # -> _site/
```
