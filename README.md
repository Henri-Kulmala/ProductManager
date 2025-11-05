# ProductManager

## Tietokantapalvelun valinta ja vertailu

Projektin alkuvaiheessa vertailimme useita pilvipohjaisia tietokantapalveluita, joiden avulla sovelluksen backend voitaisiin julkaista erillään cPanelin ympäristöstä. Tavoitteena oli löytää ratkaisu, joka on:

- turvallinen ja luotettava myös kaupallisessa käytössä  
- helppo integroida Node.js + Prisma -ympäristöön  
- yhteensopiva Render-alustalla ajettavan backendin kanssa  
- **ilmainen** tai erittäin edullinen kehityskäyttöön  

Kolme realistisinta vaihtoehtoa olivat **Neon (PostgreSQL)**, **PlanetScale (MySQL)** ja **Railway (PostgreSQL / MySQL)**.  

### 🔹 Neon (PostgreSQL)

**Neon** on moderni, täysin hallittu PostgreSQL-palvelu, joka tarjoaa ilmaisen “Free Tier” -tason.  
Neon on suunniteltu erityisesti kehittäjille, jotka tarvitsevat jatkuvasti päällä olevan ja turvallisen tietokantayhteyden ilman porttien avaamista tai IP-listauksia.

**Ominaisuudet:**
- Pysyvä **ilmainen taso** (1 projektikanta, 0,5 GB tallennustilaa)
- **TLS-suojattu yhteys** ja automaattinen `sslmode=require`
- **EU-alueen valinta** (GDPR-yhteensopiva)
- Toimii suoraan **Prisman ja Renderin** kanssa ilman lisäkonfiguraatiota
- Erittäin kevyt ja nopea käyttöönotto — täydellinen seminaari- ja tuotetietosovelluksiin

**Sopii erityisen hyvin:**
- PostgreSQL-kieliperhettä tukeville sovelluksille
- Node.js / Prisma -projekteihin
- Ratkaisuihin, joissa ei ole tarvetta raskaille transaktioille tai klustereille

---

### 🔹 PlanetScale (MySQL)

**PlanetScale** perustuu MySQL:ään ja on pitkään ollut suosittu opiskelija- ja startup-käytössä.  
PlanetScale tunnetaan hyvästä Prisma-yhteensopivuudesta ja skaalautuvuudestaan.  
Vuonna 2024 kuitenkin poistettiin ilmainen “Hobby” -taso, joten palvelu on nykyisin **maksullinen**.

**Ominaisuudet:**
- Erittäin helppo käyttöönotto ja haarapohjainen “branch” -kehitysmalli
- Integroitu migraatioiden hallinta (deploy requests)
- SSL-yhteys ja nopea API
- **Ei enää täysin ilmaista käyttöä**, vain kokeilua varten

**Sopii erityisen hyvin:**
- Maksulliseen tuotantokäyttöön, jossa tarvitaan MySQL-ympäristöä
- Tiimeille, jotka hyödyntävät haaraperusteisia migraatioprosesseja

**Haasteet:**
- Ei pysyvää free-tasoa (ei sovellu opiskeluprojektiin)
- Yhteensopiva vain MySQLin kanssa → Prisma-providerin vaihto vaaditaan

---

### 🔹 Railway (PostgreSQL / MySQL)

**Railway** on palvelu, joka tarjoaa konttipohjaisen alustan ja tietokantapalveluita.  
Se soveltuu pieniin projekteihin ja on helposti kytkettävissä GitHub-repoon.  
Railway tarjoaa ilmaisen kokeilun, mutta tietokanta **vanhenee 30 päivän jälkeen**.

**Ominaisuudet:**
- Tukee sekä PostgreSQL- että MySQL-tietokantoja
- Helppo integraatio GitHub CI/CD -putkiin
- Automaattinen ympäristömuuttujien hallinta
- Free-tier (1 GB) on aikarajoitettu → ei pysyvä ratkaisu

**Sopii erityisen hyvin:**
- Nopea prototyyppien testaus
- Lyhytkestoiset kehitysympäristöt
- Käyttöönoton harjoittelu CI/CD:n kanssa

---

### 🟢 Valittu ratkaisu: **Neon (PostgreSQL)**

Valitsimme **Neon**-tietokantapalvelun, koska se täyttää kaikki projektin vaatimukset:

| Kriteeri | Neon | PlanetScale | Railway |
|-----------|-------|--------------|----------|
| **Tietokantamoottori** | PostgreSQL | MySQL | PostgreSQL / MySQL |
| **Free-tier (pysyvä)** | ✅ Kyllä | ❌ Ei | ⚠️ 30 päivää |
| **SSL-yhteys** | ✅ Automaattinen | ✅ Automaattinen | ✅ Automaattinen |
| **EU-alue (GDPR)** | ✅ | ⚠️ Rajoitetusti | ⚠️ |
| **Yhteensopivuus Prisman kanssa** | ✅ Erinomainen | ✅ Erinomainen | ✅ Hyvä |
| **Helppo käyttöönotto Renderissä** | ✅ | ✅ | ✅ |
| **Soveltuu pitkäaikaiseen kehitykseen** | ✅ | ❌ | ⚠️ Ei (rajoitettu) |

**Yhteenveto:**
- Neon tarjoaa **turvallisen ja pysyvän ilmaisen PostgreSQL-tietokannan**, joka soveltuu sekä kouluprojektiin että pieneen tuotantoympäristöön.  
- Palvelu on **täysin TLS-suojattu** ja toimii saumattomasti Render-alustalla ilman IP-listauksia tai palomuurimuutoksia.  
- Koska sovelluksen data on julkista tuoteinformaatiota, Neonin tietosuojamalli ja EU-alueen palvelimet täyttävät kaikki käytännön vaatimukset.  
- Ratkaisu mahdollistaa lisäksi helpon skaalautuvuuden maksulliseen tasoon tulevaisuudessa ilman teknisiä muutoksia.

**Valinnan peruste:**  
> Neon tarjoaa parhaan tasapainon ilmaisuuden, turvallisuuden ja kehityskelpoisuuden välillä.  
> Se mahdollistaa PostgreSQL-pohjaisen tietokannan käytön Prisma ORM:n kautta ilman konfiguraatiosotkuja tai rajoituksia, joita muissa palveluissa esiintyi.

---


