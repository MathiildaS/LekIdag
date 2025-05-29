# Project LekIdag - Frontend
Detta är frontend-delen av **LekIdag**. Applikationen är byggd med **Webb Komponenter** och **Vite** och kommunicerar med backend via ett RESTful API.

## Installationsguide
### Utan Docker (lokal utveckling)

```bash
cd project-lekidag-frontend
npm install
npm run dev
```
Frontend körs på: http://localhost:5173
Vite används som utvecklingsserver.

### Med Docker
#### Dockerfile (vid utveckling)
Denna Dockerfile används i lokal utveckling tillsammans med docker-compose.development.yml.

- Startar från en Node.js-bild (`node:20.17.0`)
- Installerar beroenden via `npm install`
- Startar utvecklingsservern (Vite) med `npm run dev`
- Exponerar port `5173` (Vite default)

#### Dockerfile.production (vid produktion)
Här sker ett tvåstegs-bygge för att skapa en optimerad produktionsversion av frontend som serveras med NGINX.

1. **Stage 1 (byggfas):**   
   - Installerar beroenden
   - Bygger frontend med `npm run build` i Node.js-miljö
   - Skapar statiska filer i en `dist/`-mapp

2. **Stage 2 (NGINX):**
   - Kopierar `dist/` till `/usr/share/nginx/html`, en NGINX container
   - Startar NGINX-server för att leverera filerna via port 80. 
   
Port 80 i NGINX mappas sedan till port 3000 på CSCloud via `docker-compose.production.yml`.
Den publika trafiken hanteras av en extern NGINX-server som omdirigerar till denna port.

## Webb Komponenter
Frontend är uppdelad i modulära **Webb Komponenter** där varje komponent är isolerad med Shadow DOM och ansvarar för ett specifikt användarflöde. Komponenterna kommunicerar med backend-API via fetch-anrop och om nödvändigt med JWT-autentisering (access/refresh tokens).

### Layout och routing

| Komponent            | Beskrivning |
|----------------------|-------------|
| `<layout-element>`   | Huvudlayout och meny, hanterar visning av sidor/övriga komponenter, lyssnar på inloggningshändelser |

### Lekar, pyssel och utmaningar

| Komponent             | Beskrivning                                        |
|-----------------------|----------------------------------------------------|
| `<games-element>`     | Välj åldersgrupp och plats, slumpa en lek         |
| `<crafts-element>`    | Välj åldersgrupp och plats, slumpa ett pyssel     |
| `<challenges-element>`| Välj åldersgrupp och plats, slumpa en utmaning    |

### Väder och kartor

| Komponent               | Beskrivning                                           |
|-------------------------|--------------------------------------------------------|
| `<weather-element>`     | Visar aktuell väderprognos baserat på användarens position |
| `<playgrounds-element>` | Visar karta med lekplatser (Leaflet + OpenStreetMap)     |
| `<swimmingarea-element>`| Visar karta med badplatser (Leaflet + OpenStreetMap)     |

### Autentisering och användarhantering

| Komponent             | Beskrivning                                     |
|------------------------|-------------------------------------------------|
| `<login-element>`      | Inloggningsformulär (access + refresh tokens)   |
| `<register-element>`   | Registreringsformulär                           |
| `<profile-element>`    | Visar och uppdaterar användarinfo (lösenord, e-post, radera konto) |

### Forum

| Komponent           | Beskrivning                                                                 |
|----------------------|------------------------------------------------------------------------------|
| `<forum-element>`    | Visar lista över foruminlägg, skapa nytt inlägg, visa detaljvy           |
|                      | Visar redigerings-/raderingsknappar om användaren är inloggad och författare |

### Övrigt

| Funktion              | Beskrivning                                                                 |
|------------------------|------------------------------------------------------------------------------|
| `fetchWithTokens()`    | Wrapper för fetch som automatiskt hanterar access/refresh tokens, felmeddelanden och popup |
| `getUserLocation()`    | Hämtar användarens lat/lon koordinater (med fallback)                                 |

### Komponentkommunikation
- <login-element> och <register-element> dispatchar user-login event
- <layout-element> lyssnar på inloggnings-/utloggningshändelser och uppdaterar visade komponenter
- `getUserLocation()` anropas i <layout-element> och positionen delas vidare till <weather-element>, <playgrounds-element> och <swimmingarea-element>

## Design och stil
#### Typsnitt
Indie Flower av Kimberly Geswein
DynaPuff av Toshi Omagari & Jennifer Daniel

Båda licensierade under SIL Open Font License 1.1

#### Stil
- `shared.js`: Återanvändbara stilar som importeras i respektive komponent.

Varje komponent importerar egna stilblock via <style> i sin shadow DOM.

## Bilder och resurser
Projektet använder bilder sparade i src/images/.
Vissa bilder är skapade via gratismaterial från Canva.
