# LekIdag
## Projektansvarig

**Namn:** Mathilda Segerlund
**E-post:** mathilda.segerlund@gmail.com

## Bakgrund och Syfte
LekIdag riktar sig till föräldrar, barnvakter och pedagoger som på ett snabbt sätt önskar kunna aktivera barnen genom bland annat åldersanpassade lekar, pyssel och utmaningar. LekIdag är därför ett verktyg som genererar lekidéer, pyssel och utmaningar samt visar väder och närliggande lek- och badplatser och erbjuder vidare diskussion och inspiration via ett forum för registrerade användare.

## Övergripande mål
* Hämta och visa en slumpmässig lek baserat på val av ålder och plats.
* Hämta och visa ett slumpmässigt pyssel baserat på val av ålder och plats.
* Hämta och visa en slumpmässig utmaning baserat på val av ålder med ett lösningsförslag.
* Visa lokalt väder.
* Visa närliggande lek- och badplatser
* Visa ett forum som alla kan läsa, men endast registrerade användare kan skapa, redigera och ta bort egna inlägg.
* Erbjuda en lättanvänd webbsida som är anpassad för olika skärmstorlekar.

## Resursplan

### Tid

* Totalt ca 40h/vecka 
* Projektet sträcker sig över ca 10 veckor
* Tid fördelas mellan:
  * Planering och kravhantering
  * Design och implementation
  * Testning och kvalitetssäkring
  * Dokumentation i Wiki och reflektion

---

### Ansvarsfördelning

* Projektet genomförs individuellt, vilket innebär att samma person ansvarar för:
  * Kravanalys, design, implementation, testning, dokumentation och driftsättning

---

### Verktyg och tekniska resurser

* **Kod**: JavaScript, HTML, CSS
* **Utvecklingsmiljö**: Visual Studio Code
* **Backend**: Node.js, Express
* **Databas**: MongoDB Atlas
* **Frontend**: Webbkomponenter
* **Versionshantering**: Git + GitHub
* **CI/CD**: GitHub actions med automatiska pipelines för testning, bygg och driftsättning
* **Driftsättning**: DigitalOcean med Docker och Docker Compose
* **Autentisering:** JWT (access- och refresh tokens) 
* **Testning:** Jest (enhetstester) och Supertest (integrationstester)

---

### Externa tjänster och API:er

* **OpenWeatherMap API** – används för att hämta väderdata baserat på användarens koordinater
* **Leaflet + OpenStreetMap** – för att visa interaktiva kartor
* **Overpass API** – för att hämta platsdata om lek- och badplatser
* **Nominatim API** – för att omvandla koordinater till adresser
* **Geolocation API** – hämta användarens koordinater i webbläsaren

---

### Dokumentation

* Följande dokumentation finns tillgänglig i GitHub-repot:
  * Projektsvision
  * Projektplan
  * Projektets arkitektur
  * Kravspecifikation
  * Product backlog
  * Testplan och testspecifikation
  * Slutrapport
