# Uzstādīšana un nodošana

Tehniskā pamācība. Visas darbības ir vienreizējas.

---

## 1. Repozitorijs pāriet klientam

Šobrīd repozitorijs ir uz `vasilyanaptyp-oss`. Tas jāpārceļ uz klienta kontu,
lai īpašnieks ir klients, nevis izpildītājs.

1. Klients izveido bezmaksas GitHub kontu: https://github.com/signup
2. Šajā repozitorijā: **Settings → General → Danger Zone → Transfer ownership**
3. Ieraksta klienta lietotājvārdu, apstiprina
4. Klients pieņem pārcelšanu (atnāk e-pastā)
5. Klients pievieno Arturu kā līdzstrādnieku:
   **Settings → Collaborators → Add people**

Pēc tam klients var jebkurā brīdī Arturu noņemt, un lapa turpina strādāt.
Vēsture, Actions un Pages pārceļas kopā ar repozitoriju.

---

## 2. Pieslēgšanās redaktoram ar lietotājvārdu un paroli

Sveltia CMS runā ar GitHub tieši no pārlūka. Lai parādītos poga
**Sign in with GitHub**, vajag nelielu starpnieku, kas veic OAuth apmaiņu.
Oficiālais ir `sveltia-cms-auth` uz Cloudflare Workers, bezmaksas plānā.

Starpnieks jāuztaisa **uz klienta Cloudflare konta**, lai arī tas pieder
klientam.

### 2.1. Cloudflare Worker

1. Bezmaksas konts: https://dash.cloudflare.com/sign-up
2. Atver https://github.com/sveltia/sveltia-cms-auth un nospiež
   **Deploy to Cloudflare Workers**
3. Pēc izvietošanas pieraksta adresi, piemēram
   `https://sveltia-cms-auth.vartupasaule.workers.dev`

### 2.2. GitHub OAuth App

1. https://github.com/settings/developers → **New OAuth App**
2. Aizpilda:
   - Application name: `Vartu pasaule CMS`
   - Homepage URL: repozitorija adrese
   - Authorization callback URL: **Worker adrese + `/callback`**
3. **Generate a new client secret**, saglabā Client ID un Client Secret

### 2.3. Savieno

Cloudflare panelī pie Worker: **Settings → Variables** pievieno:

| Nosaukums | Vērtība |
|---|---|
| `GITHUB_CLIENT_ID` | no OAuth App |
| `GITHUB_CLIENT_SECRET` | no OAuth App (kā Secret) |
| `ALLOWED_DOMAINS` | `vartupasaule.lv` |

### 2.4. Ieraksta konfigurācijā

`src/admin/config.yml`, augšā:

```yaml
backend:
  name: github
  repo: KLIENTA-KONTS/vartu-pasaule-site   # nomainīt OWNER
  branch: main
  base_url: https://sveltia-cms-auth.KLIENTS.workers.dev   # nomainīt
```

Saglabā, ieliek repozitorijā. Gatavs.

### Pagaidu risinājums, kamēr tas nav izdarīts

Izņem `base_url` rindu. Tad redaktorā ir poga **Sign in with Token**, un
pieslēdzas ar GitHub Personal Access Token (fine-grained, tiesības
`Contents: Read and write` tikai šim repozitorijam). Strādā uzreiz, bez
Cloudflare, bet klientam jāglabā gara atslēga, tāpēc tas nav ilgtermiņa
risinājums.

---

## 3. Izlikšana uz klienta servera

Serveris: `185.151.30.174`, Apache. Uz to nonāk **tikai statiski faili**.

1. Andris iedod FTP vai SFTP piekļuvi
2. Repozitorijā **Settings → Secrets and variables → Actions → New secret**:

| Nosaukums | Piemērs |
|---|---|
| `FTP_SERVER` | `vartupasaule.lv` vai `185.151.30.174` |
| `FTP_USERNAME` | hostinga lietotājs |
| `FTP_PASSWORD` | hostinga parole |
| `FTP_DIR` | `/public_html/` |

3. Pārsauc `.github/workflows/deploy-hosting.yml.disabled` par
   `deploy-hosting.yml`
4. Nospiež **Actions → Izlikt uz hostinga → Run workflow**

No šī brīža katrs saglabājums redaktorā pats aizceļo uz serveri.

### Ja Actions nav pieejams

Var arī ar roku: lokāli `npm ci && npm run build`, tad `_site/` saturu
augšupielādē ar FileZilla. Rezultāts tāds pats.

---

## 4. Servera sakārtošana

Divas lietas serverī ir jālabo. Abas neietekmē lapas darbību, bet ietekmē
uzticamību un Google.

### 4.1. HTTPS nestrādā

Sertifikāts pieder citai vietnei, tāpēc pārlūks rāda brīdinājumu.

**Risinājums: bezmaksas Let's Encrypt sertifikāts.**

Ja hostingam ir cPanel / DirectAdmin / Plesk:
- cPanel: **Security → SSL/TLS Status → Run AutoSSL**
- DirectAdmin: **SSL Certificates → Free & automatic certificate from Let's Encrypt**
- Plesk: **SSL/TLS Certificates → Install a free basic certificate**

Ja ir root piekļuve serverim:

```
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d vartupasaule.lv -d www.vartupasaule.lv
```

Certbot pats ieraksta Apache konfigurācijā un pats atjauno ik pēc 60 dienām.

**Pēc tam** `.htaccess` failā atkomentē HTTPS pāradresācijas bloku (tas ir
sagatavots un atzīmēts ar komentāru). Pirms sertifikāts strādā, to ieslēgt
nedrīkst, citādi visi apmeklētāji redzēs brīdinājumu.

### 4.2. PHP 5.6.40

PHP 5.6 vairs nesaņem drošības ielāpus kopš 2018. gada.

**Šai lapai PHP nav vajadzīgs vispār.** Lapa ir tīri statiska, tāpēc
teorētiski PHP var arī izslēgt.

Ja uz tā paša servera darbojas kaut kas cits, kam PHP vajag, jāatjauno
versija uz 8.2 vai 8.3:
- cPanel: **Select PHP Version → 8.2**
- DirectAdmin: **Select PHP Version**
- Ar root: `sudo apt install php8.2 libapache2-mod-php8.2 && sudo a2dismod php5.6 && sudo a2enmod php8.2 && sudo systemctl restart apache2`

Ja PHP vairs nevienam nav vajadzīgs, tīrākais variants ir to izslēgt pavisam:
`sudo a2dismod php5.6 && sudo systemctl restart apache2`.

### 4.3. Kad domēns strādā

Nomaina `src/_data/site.json` laukā `url` adresi uz `https://vartupasaule.lv`,
ja tā mainījusies, un pārbauda, vai `robots.txt` un `sitemap.xml` atveras:
- `https://vartupasaule.lv/robots.txt`
- `https://vartupasaule.lv/sitemap.xml`

Tad pieteic lapu Google Search Console un izveido Google Business Profile.

---

## 5. Vietējā izstrāde

```
npm ci
npm start
```

Atveras `http://localhost:8080`. Izmaiņas failos pārbūvējas uzreiz.

Vienreizējs būvējums:

```
npm run build      # rezultāts _site/
```

---

## 6. Kas kur atrodas

| Mape | Kas tur ir |
|---|---|
| `src/_data/` | Uzņēmuma dati, sākumlapas un "Par mums" teksti |
| `src/content/gates/` | Vārtu veidi, katrs savā failā |
| `src/content/gallery/` | Galerijas bildes |
| `src/assets/img/` | Visas bildes |
| `src/assets/css/style.css` | Viss dizains |
| `src/assets/js/app.js` | Izvēlne, forma, animācijas |
| `src/admin/` | Satura redaktors |
| `src/_includes/` | Lapu veidnes |
| `_site/` | Uzbūvētā lapa. Šo mapi liek uz servera |
