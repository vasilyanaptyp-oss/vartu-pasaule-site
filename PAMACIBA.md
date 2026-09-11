# Kā labot mājaslapu

Šī pamācība ir domāta cilvēkam, kas nav programmētājs. Nekas te nav sarežģīts.

---

## Īsumā

Mājaslapa sastāv no parastiem failiem. Nav ne WordPress, ne datubāzes, tāpēc
nav arī ko uzlauzt un nav ko atjaunināt. Tekstus un bildes maina caur
redaktoru, kas atveras pārlūkā.

**Redaktora adrese:** `https://vartupasaule.lv/admin/`

Kad tur kaut ko saglabā, lapa pati pārbūvējas un pēc 1-2 minūtēm jaunais
teksts jau ir redzams mājaslapā. Neko papildus spiest nevajag.

---

## 1. Pieslēgšanās

1. Atver `https://vartupasaule.lv/admin/`
2. Nospiež **Sign in with GitHub**
3. Ieraksta savu GitHub lietotājvārdu un paroli
4. Gatavs

GitHub ir vieta, kur glabājas mājaslapas faili. Konts ir bez maksas un
abonēšanas maksas nav. Ja parole aizmirsta, to atjauno GitHub lapā tāpat kā
jebkuru citu paroli.

> Ja pieslēgšanās poga vēl nav uzstādīta, tā vietā būs poga
> **Sign in with Token**. Tad vajadzīga piekļuves atslēga, ko iedeva Arturs.
> Tas ir pagaidu risinājums pirmajās dienās.

---

## 2. Kas ir redaktorā

Pēc pieslēgšanās kreisajā pusē ir četras sadaļas.

### Uzņēmuma dati
Adrese, tālruņi, e-pasts, darba laiks, pilsētu saraksts, reģistrācijas
numuri. **Šie dati parādās visās lapās uzreiz.** Ja maina tālruni šeit,
tas nomainās arī kājenē, sadaļā Kontakti un pogā augšā.

### Lapu teksti
- **Sākumlapa** - lielais virsraksts, teksts zem tā, galvenā bilde,
  komplektācijas saraksts, skaitļi joslā.
- **Par mums** - stāsts par uzņēmumu.

### Vārtu veidi
Seši vārtu veidi, katram sava lapa. Var labot esošos vai pievienot jaunu.
Katram veidam ir:
- **Nosaukums** - parādās virsrakstā un pieteikuma formā
- **Adrese lapā** - piemēram `pacelamie-varti`. Tikai mazie latīņu burti,
  cipari un defise. Bez garumzīmēm un mīkstinājuma zīmēm.
- **Secība** - kārtas numurs sarakstā (1, 2, 3...)
- **Īss apraksts** - teksts, ko redz sarakstā
- **Bilde** - ja bildes nav, atstāj tukšu. Lapā parādīsies kārtīgs
  paziņojums "Šī veida foto drīz būs", nevis tukša vieta.
- **Lapas teksts** - garākais apraksts

### Darbu galerija
Bildes. Katrai bildei ir secības numurs un apraksts.

---

## 3. Kā nomainīt tekstu

1. Kreisajā pusē izvēlas sadaļu
2. Uzklikšķina uz ieraksta
3. Izlabo tekstu
4. Augšā nospiež **Save**

Pēc 1-2 minūtēm izmaiņas ir mājaslapā. Ja neparādās, pārlādē lapu ar
`Ctrl + F5`.

---

## 4. Kā pievienot bildi

1. Atver ierakstu, kur bilde jāievieto
2. Pie lauka **Bilde** nospiež **Choose an image**
3. Nospiež **Upload** un izvēlas failu no datora
4. Nospiež **Save**

**Ieteikumi bildēm:**
- Platums vismaz 1200 punkti, lai nav izplūdusi
- Formāts JPG vai PNG, arī WebP der
- Viens fails ne lielāks par 2 MB
- Nosaukumā labāk bez garumzīmēm: `varti-cesis.jpg`, nevis `vārti Cēsīs.jpg`

Bildes izmērus ierakstīt nevajag. Lapa tos nolasa pati.

---

## 5. Kā pievienot jaunu vārtu veidu

1. Sadaļā **Vārtu veidi** nospiež **New Vārtu veids**
2. Aizpilda laukus
3. **Save**

Jaunais veids automātiski parādās:
- sākumlapas sarakstā
- izvēlnē augšā
- pieteikuma formas izkrītošajā sarakstā
- kājenē

Neko citur pierakstīt nevajag.

---

## 6. Ko labāk neaiztikt

- **Adrese lapā** (slug) jau publicētiem vārtu veidiem. Ja to nomaina,
  vecā saite pārstāj strādāt un Google atrastā lapa dos kļūdu.
- **Reģistrācijas un PVN numurs** - tie ir oficiāli dati.
- Ja kaut kas sagājis greizi: viss saglabājas vēsturē. Arturs var atgriezt
  jebkuru iepriekšējo versiju.

---

## 7. Ja kaut kas nestrādā

| Problēma | Ko darīt |
|---|---|
| Redaktors neatveras | Pārbaudi adresi: beigās jābūt `/admin/` ar slīpsvītru |
| Saglabāju, bet lapā nemainās | Pagaidi 2 minūtes, tad `Ctrl + F5` |
| Nevaru pieslēgties | Atjauno GitHub paroli |
| Bilde neaugšupielādējas | Pārbaudi, vai fails nav lielāks par 2 MB |

---

## 8. Kas maksā naudu

Nekas. Ne redaktors, ne GitHub konts, ne pārbūvēšana pēc saglabāšanas.
Maksā tikai domēns `vartupasaule.lv` un hostings, kas jums jau ir.
