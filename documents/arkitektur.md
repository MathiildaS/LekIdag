## LekIdag - Huvudkomponenter
Projektet bygger på en fullstack-arkitektur och följer till stor del en lagerarkitektur där:

* Frontend är uppbyggd av webbkomponenter och representerar presentationslagret.
* Backend utgör applikationslagret och ansvarar för affärslogiken.
* Databasen (MongoDB Atlas) utgör databas-/lagringslagret.

### **Frontend (Web Components)**

* Representerar användargränssnittet och hanterar all interaktion med användaren.
* Visar väder, slumpade lekar, pyssel och utmaningar samt karta med lekplatser/badplatser och ett forum.
* Hanterar användarhantering (inloggning, registrering, profiländring, utloggning) för att kunna delta i forum.
* Kommunicera med backend via fetch.
* Använder Geolocation API för att hämta användarens koordinater.
* Använder Leaflet + OpenStreetMap för att visa interaktiva kartor.
* Använder JavaScript, HTML och CSS för att skapa webb komponenter.

### **Backend (Node.js / Express)**

* Tar emot och behandlar anrop från frontend.
* Kommunicerar med externa API:er som OpenWeatherMap, Overpass API, Nominatim API.
* Kommunicerar med databas för att hämta lekar, pyssel, utmaningar, foruminlägg och spara samt hämta användardata. Mongoose används som för schema och datavalidering.
* Ansvarar för autentisering med JWT och refresh tokens.
* Hanterar användarregistrering, inloggning, uppdatering av e-post och lösenord samt radering av konto.

### **Databas (MongoDB Atlas)**

* Lagrar användardata, foruminlägg, lekar, pyssel och utmaningar.

### **Externa API:er**

* OpenWeatherMap API för hämtning av aktuellt väder baserat på användarens position.
* Geolocation API för att hämta användarens position i webbläsaren.
* Leaflet för att rita kartor.
* OpenStreetMap för att hämta kartbilderna som Leaflet använder för att rita kartan.
* Overpass API för att hämta platsdata baserat på koordinater och taggar (lekplatser och badplatser).
* Nominatim API för reverse geocoding vilket omvandlar koordinater till adresser.

### **Driftsättning**

* Applikationen containeriseras med Docker och hanteras via Docker Compose
* NGINX för HTTPS och dirigering av trafik.
* Driftsättning på DigitalOcean VPS.
* GitHub actions används för att köra automatiska pipelines med lint, Jest- och Supertest-tester, bygg och deploy. Pipelines körs vid varje push och merge request.
