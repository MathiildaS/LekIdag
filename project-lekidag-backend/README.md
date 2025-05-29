# Project LekIdag - Backend
Detta är backend-delen av **LekIdag**, en RESTful API-server byggd med **Node.js**, **Express** och använder **MongoDB Atlas**. 
Backend hanterar användarautentisering, hantering av data och datalagring, väder- och platsdata och forumfunktioner.

## Funktionalitet
- JWT-autentisering med access & refresh tokens
- CRUD endpoints för användarhantering (registrera, uppdatera profil, radera konto) och forumfunktionalitet.
- Endpoints för hämtning av slumpmässiga lekar, pyssel och utmaningar. Väder, lekplatser och badplatser.
- API-integrationer:
  - **OpenWeatherMap** för väder
  - **Overpass API / Nominatim** för platsdata (lekplatser, badplatser)
- Loggning via **Winston** och **Morgan**
- Testning med **Jest** + **Supertest**
- CI/CD via GitLab

## Installationsguide
### Utan Docker (lokal utveckling)
```bash
cd project-lekidag-backend
npm install
npm run dev
```
Servern körs på: http://localhost:5000

Kräver en .env-fil i projektets rotkatalog.

### Med Docker
#### Dockerfile (vid utveckling)
Denna Dockerfile används i lokal utveckling tillsammans med docker-compose.development.yml.

- Startar från en Node.js-bild (`node:20.17.0`)
- Installerar beroenden via `npm install`
- Startar utvecklingsservern (Vite) med `npm run dev`
- Exponerar port `5000`

#### Dockerfile.production (vid produktion)
Här sker ett tvåstegs-bygge för att skapa en optimerad produktionsversion av backend.

1. **Stage 1 (byggfas):**   
   - Installerar endast produktionsberoenden (npm ci --omit=dev)
   - Inkluderar dumb-init för korrekt signalhantering

2. **Stage 2:**
   - Kopierar in kompilerade node_modules och källkod
   - Kör som icke-root-användare
   - Startar med dumb-init och node src/server.js
   - Exponerar port 5000

Detta används av docker-compose.production.yml i samband med GitLab CI/CD och deployment till CSCloud.

### Miljövariabler
Backend använder variabler från .env i projektets rotkatalog.

DB_CONNECTION_STRING="Lägg till din sträng från databas"
OPENWEATHER_API_KEY="Lägg till API-nyckel"
JWT_PRIVATE_KEY="Lägg till nyckel"
JWT_PUBLIC_KEY="Lägg till nyckel"
PORT=5000
LOG_LEVEL="silly"
LOGGER_MORGAN_FORMAT_ADD_REMOTE="false"

## API-struktur
Alla endpoints är versionerade och tillgängliga via /api/v1

### Autentisering

| Metod | Endpoint         | Beskrivning                 |
|-------|------------------|-----------------------------|
| POST  | `/auth/register` | Skapa ny användare          |
| POST  | `/auth/login`    | Logga in och få tokens      |
| POST  | `/auth/logout`   | Logga ut                    |
| POST  | `/auth/refresh`  | Förnya access token         |

### Användarhantering

| Metod | Endpoint         | Beskrivning                 |
|-------|------------------|-----------------------------|
| GET   | `/user/profile`  | Hämta användarprofil        |
| PUT   | `/user/password` | Ändra lösenord              |
| PUT   | `/user/email`    | Ändra e-post                |
| DELETE| `/user/delete`   | Radera konto                |

### Hämtning av lekar, pyssel och utmaningar

| Metod | Endpoint              | Beskrivning        |
|-------|-----------------------|--------------------|
| GET   | `/games/random`       | Slumpa lek         |
| GET   | `/crafts/random`      | Slumpa pyssel      |
| GET   | `/challenges/random`  | Slumpa utmaning    |

### Väder och platser

| Metod | Endpoint             | Beskrivning                         |
|-------|----------------------|--------------------------------------|
| GET   | `/weather`           | Hämta väder med lat/lon              |
| GET   | `/playgrounds`       | Hämta lekplatser via Overpass. Koordinater omvandlas till adresser via Nominatim (reverse geocoding)        |
| GET   | `/swimming-areas`    | Hämta badplatser via Overpass. Koordinater omvandlas till adresser via Nominatim (reverse geocoding)        |

### Forum

| Metod | Endpoint           | Beskrivning                          |
|-------|--------------------|---------------------------------------|
| GET   | `/forum`           | Hämta alla foruminlägg                |
| GET   | `/forum/:id`       | Hämta ett specifikt inlägg            |
| POST  | `/forum`           | Skapa nytt inlägg (kräver inloggning) |
| PUT   | `/forum/:id`       | Uppdatera inlägg (kräver inloggning) |
| DELETE| `/forum/:id`       | Radera inlägg (kräver inloggning) |

## Testning
**Verktyg:** Jest + Supertest
- test/unit/ – enhetstester (controllers)
- test/integration/ – integrationstester för hela API-flödet för användarhantering

**Kör tester utan docker:**
```bash
npm test
```

**Kör tester med docker-compose:**
```bash
docker compose run --rm backend npm test
```

