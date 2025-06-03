# LekIdag
LekIdag är en webbapplikation för föräldrar, barnvakter och pedagoger som snabbt vill hitta åldersanpassade lekar, pyssel och utmaningar för barn samt närliggande lekplatser och badplatser baserat på användarens plats. Webbsidan visar en lokal väderprognos och erbjuder möjlighet att registrera sig som användare för att kunna dela inspiration i ett forum.

## Översikt

### Huvudfunktioner
- Slumpa fram lekar och pyssel baserat på ålder och plats (inomhus/utomhus).
- Slumpa fram utmaningar med lösningsförslag baserat på ålder.
- Visa aktuell väderprognos baserat på användarens position.
- Visa karta med närliggande lekplatser och badplatser.
- Forum för att dela tips och finna inspiration från andra användare.
- Användarhantering med JWT (registrering, inloggning, uppdatering av e-post och lösenord samt borttagning av konto).

### Tekniker
- **Frontend**: Vite, Webb Komponenter, HTML, CSS, JavaScript
- **Backend**: Node.js, Express, MongoDB Atlas
- **API:er**: OpenWeatherMap, Geolocation API, Overpass API, Nominatim, Leaflet och OpenStreetMap
- **CI/CD & Deploy**: GitHub Actions, Docker Compose, NGINX, CSCloud
- **Testning**: Jest (enhetstester) och Supertest (integrationstester), Postman (API-tester), manuella testfall

## Installationsguide
Projektet använder **Docker Compose** för att starta backend och frontend i både utvecklings- och produktionsmiljö.

### Lokalt med Docker Compose
```bash
# Klona projektet
git clone https://gitlab.lnu.se/1dv613/student/ms228qs/projects/project-lekidag.git
cd project-lekidag

# Skapa .env med miljövariabler i projektets rotmapp
Lägg till följande variabler:
DB_CONNECTION_STRING="Lägg till din sträng från databas"
OPENWEATHER_API_KEY="Lägg till API-nyckel"
JWT_PRIVATE_KEY="Lägg till nyckel"
JWT_PUBLIC_KEY="Lägg till nyckel"
PORT=5000
LOG_LEVEL="silly"
LOGGER_MORGAN_FORMAT_ADD_REMOTE="false"

# Starta Docker Desktop
Docker Desktop tillhandahåller Docker Engine som agerar som den lokala servern som kör containrarna.

# Starta i utvecklingsmiljö
docker compose -f docker-compose.development.yml up --build

- Läser in docker-compose.development.yml som definierar vilka tjänster som ska startas.
- Bygger om alla Docker-bilder från respektive Dockerfile, så att den senaste koden och beroenden används.
- Startar frontend och backend i olika containrar.
- Kopplar ihop containrarna i ett gemensamt nätverk.
- Exponerar tjänsternas portar till den lokala datorn så att applikationen kan nås i webbläsaren under utveckling.

Frontend körs på: http://localhost:5173
Backend-API körs på: http://localhost:5000
```

### Produktionsmiljö
```bash
Applikationen är driftsatt med Docker Compose och NGINX på CSCloud:
[https://cscloud8-46.lnu.se](https://cscloud8-46.lnu.se)

Deploy sker manuellt via GitLab CI/CD (.gitlab-ci.yml) och SSH till servern. 
Backend körs på port 5000 och frontend serveras statiskt via NGINX på port 3000 med 
HTTPS och omdirigering från HTTP. HTTPS-certifikat hanteras via Lets Encrypt. 

### Översiktlig process
1. CI/CD-pipelinen i GitLab kör deployment manuellt till CSCloud via SSH.
 
2. Docker Compose använder docker-compose.production.yml som bygger:
- Backend med Dockerfile.production
- Frontend med Dockerfile.production

3. .env-filen skapas automatiskt med miljövariabler från GitLab.

4. NGINX serverar frontend på HTTPS med certifikat via Lets Encrypt

5. Applikationen körs på:

Frontend:
[https://cscloud8-46.lnu.se](https://cscloud8-46.lnu.se)

Backend API:
[https://cscloud8-46.lnu.se/api/v1](https://cscloud8-46.lnu.se/api/v1)
```

## CI/CD och testning
Projektet använder en GitHub Actions-pipeline för:

- Lint och test av frontend och backend
- Byggsteg för respektive Docker-image
- Manuell deployment via SSH och Docker Compose

Enhetstester och integrationstester körs med Jest och Supertest och API:er testas även manuellt med Postman. 
Manuella testfall finns dokumenterade.

## Projektstruktur och viktiga filer
Här är en översikt över de centrala filerna i projektet:

- `.gitlab-ci.yml`: Definierar CI/CD-pipelinen för test, build och deploy
- `docker-compose.development.yml`: Används för lokal utveckling. Startar frontend och backend i separata containrar.
- `docker-compose.production.yml`: Används vid produktion. Bygger Docker-bilder och hanterar miljövariabler automatiskt från GitLab.
- `Dockerfile` / `Dockerfile.production`: Bygger backend och frontend i olika miljöer. Production-versionerna är optimerade för driftsättning.
- `.env` (skapas lokalt): Innehåller känsliga miljövariabler för backend.
- `README.md`: Dokumentation av projekt, installation, drift, licens och teknikval.
- `LICENSE`: Licensfil (CC BY-NC 4.0) för att reglera icke-kommersiell användning.

## Dokumentation
Projektet är väl dokumenterat med projektvision, kravspecifikation, arkitektur, testfall och tillhörande rapporter.
README finns tillgänglig för varje del i projektet.

## Licens
Detta projekt är licensierat under [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

Du får:
- Använda, dela och modifiera projektet fritt för icke-kommersiella syften
- Sprida vidare under samma villkor, så länge du ger erkännande till upphovspersonen (Mathilda Segerlund)

Du får inte:
- Använda projektet i kommersiella sammanhang utan skriftligt tillstånd

> Jag förbehåller mig rätten att i framtiden licensiera projektet kommersiellt eller under annan licensform.

Vissa bilder i detta projekt är skapade med gratismaterial i Canva.
De är inte avsedda för kommersiell användning. Om du återanvänder projektet, ersätt gärna dessa med egna bilder.

## Upphovsrätt
© 2025 Mathilda Segerlund  
E-post: ms228qs@student.lnu.se

---

[![License: CC BY-NC 4.0](https://img.shields.io/badge/Licens-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
