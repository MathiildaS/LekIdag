Denna kravspecifikation beskriver funktionella och icke-funktionella krav och utgår från denna [Projektvision](documents\projektvision.md) som definierats för webbsidan LekIdag.

## 1. Funktionella krav

* **US-1**: Som användare vill jag få tips på en lek.
* **US-2**: Som användare vill jag få tips på ett pyssel.
* **US-3**: Som användare vill jag se en tydlig meny för att snabbt kunna få förslag på en lek eller ett pyssel.
* **US-4:** Som användare vill jag kunna använda både mobilen och datorn.
* **US-5**: Som användare vill jag aktivera mitt barn med en utmaning medan annan aktivitet förbereds.
* **US-6**: Som användare vill jag kunna välja om leken eller pysslet ska utföras inomhus eller utomhus.
* **US-7:** Som användare vill jag kunna se lokalt vädret för att kunna avgöra plats för aktivitet.
* **US-8:** Som användare vill jag välja lek, pyssel eller utmaning utifrån ålder.
* **US-9**: Som användare vill jag se en karta med badplatser nära mig.
* **US-10**: Som användare vill jag se en karta med lekparker nära mig.
* **US-11:** Som användare vill jag kunna registrera mig som användare för att skapa, redigera och ta bort inlägg i forumet.
* **US-12**: Som användare vill jag kunna välja att logga in och logga ut.
* **US-13**: Som användare vill jag kunna ändra mitt lösenord, ändra mina uppgifter och radera mitt användarkonto.
* **US-14**: Som användare vill jag kunna hålla mig inloggad.
* **US-15**: Som användare vill jag få ett meddelande om något går fel.
* **US-16**: Som utvecklare vill jag dokumentera koden så att den är enkel att förstå.
* **US-17**: Som utvecklare vill jag strukturera koden på ett sätt som gör den enkel att underhålla.
* **US-18**: Som utvecklare vill jag hantera lösenord säkert i databasen genom att salta och hasha dessa.
* **US-19:** Som utvecklare vill jag kunna förnya JWT med refresh token för fortsatt inloggningssession.
* **US-20**: Som användare vill jag kunna söka efter en plats manuellt för att se lekplatser och badplatser.
* **US-21:** Som användare vill jag se information som namn och adress för varje funnen lekplats och badplats.

## 2. Ickefunktionella produktkrav (non-functional product requirements)

* **NF-1:** Webbsidan ska vara responsiv
* **NF-2:** Webbsidan ska vara tydligt strukturerad och enkel att navigera på, med en enkel meny.
* **NF-3**: En lek eller ett pyssel ska kunna genereras inom tre klick från startsidan.
* **NF-4:** Lekar, pyssel och dagens utmaning ska presenteras på ett tydligt sätt.
* **NF-5:** Endast inloggade användare ska kunna använda forumet.
* **NF-6:** Felmeddelanden ska visas om något går fel.
* **NF-7**: Startsidan ska innehålla logotyp, menyval samt en välkomsttext med information kring sidans syfte.
* **NF-8:** Design, färgval och typsnitt ska vara enhetliga, lättlästa och anpassade för både barn och vuxna.

## 3. Organisationskrav (non-functional organizational requirements)

* **O-1:** Utvecklingen kommer att ske i programmeringsspråket Javascript och skrivas i Visual Studio Code.
* **O-2:** I backend kommer Node.js och Express användas.
* **O-3**: MongoDB Atlas kommer att användas som databas för molnbaserad lagring.
* **O-4**: Frontend kommer att byggas med webbkomponenter i HTML och CSS.
* **O-5:** Systemet kommer att driftsättas på CSCloud där NGINX kommer att användas för hantering av trafik och säkerställa en säker kommunikation.
* **O-6:** Systemet ska driftsättas i container med Docker.
* **O-7:** Kartor ska visas med hjälp av Leaflet och OpenStreetMap.
* **O-8**: Hämtning av lekplatser och badplatser kommer att ske genom Overpass API.
* **O-9**: De hämtade koordinaterna för lekplatser och badplatser omvandlas till platsinformation med Nominatim.
* **O-10:** Användarens position ska hämtas med hjälp av webbläsarens inbyggda Geolocation API.
* **O-11**: En CI/CD pipeline ska sättas upp på GitLab för projektet

### 3.1 Versionshantering

Versionshantering sker i GitLab med ett huvudrepo där utvecklingens historik spåras genom commits och merge requests.

### 3.2 Kodstandard

Hög återanvändbarhet, läsbarhet och underhållbarhet kommer att följas och uppnås genom en tydligt projektstruktur där källkoden kommer att delas upp i moduler. Varje modul kommer att ansvara för en specifik del i systemet.

### 3.3 Koddokumentation

JSDoc kommer att användas för att dokumentera klasser, funktioner/metoder och komponenter.

Radkommentarer kommer att användas vid behov, där koden är svår att förstå.

### 3.4 Säkerhet

Systemet kommer att använda JSON Web Tokens (JWT) tillsammans med refresh tokens för att öka säkerheten för registrerade användare och förbättra användarupplevelsen. Detta genom att göra det möjligt för användaren att vara fortsatt inloggad efter att JWT löpt ut och så länge refresh tokenen är giltig.

Följande säkerhetsåtgärder kommer även att vidtas:

* Vid driftsättning kommer trafiken krypteras med HTTPS (Let's Encrypt via NGINX).
* Autentisering och auktorisering kommer att krävas för åtkomst till skyddade resurser som forum.
* Lösenord kommer att hash:as och saltas före lagring i databasen för att säkerställa att de inte går att läsa i klartext.
* XSS-attacker kommer att förhindras genom validerad input.

## 4. Externa krav (non-functional external requirements)

### 4.1 Etiska krav

Då denna webbsida framförallt erbjuder okänslig information finns inga uppenbara risker för personlig skada. Tillförlitliga källor kommer att användas för visning av kartor och väderlek för att undvika vilseledande information. Olämpligt innehåll i forumet kommer att undvikas genom tydliga riktlinjer och användarvillkor samt noggrann bevakning av inlägg.

### 4.2 Lagar & Standarder

Alla personuppgifter kommer att hanteras på ett säkert sätt och i enlighet med GDPR. Användaren kommer att få tillgång till tydlig information kring sitt medlemskap och hur detta kan avslutas.