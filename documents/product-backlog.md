Här listas alla krav som projektet bygger på, både funktionella, icke-funktionella, säkerhets- och organisationskrav. Varje krav har ett ID, beskrivning, beroenden och spårbarhet till kravspecifikationen. Backlogen används sedan som grund för sprintplanering, implementation och testning.

## Förklaring av tabell

* **Krav-ID** - Ett unikt ID som identifierar varje krav. Används för spårbarhet mellan Product Backlog/Sprints och Testspecifikation.
* **Krav** - Namn på kravet
* **Kravtyp**
  * Funktionellt - vad systemet ska göra funktionellt.
  * Icke-Funktionellt - hur systemet ska fungera.
  * Organisationskrav - tekniska och strukturella riktlinjer
  * Säkerhetskrav - specifika krav kopplat till säkerhet
* **Beskrivning** - Kort beskrivning vad kravet handlar om.
* **Spårbarhet** - Koppling till Kravspecifikationen.
* **Status** - Aktuell status.
* **Prioritet** -
  * "Hög" - Grundfunktionalitet och bör implementeras först.
  * "Medel" - Viktigt, men inte kritiskt
  * "Låg" - "Nice to have", kan skjutas upp

## K-0 - Organisationskrav

Här är alla de övergripande krav samlade som gäller för hela projektets struktur och som kontinuerligt ska uppfyllas. Därför refereras inte alla dessa som direkta beroenden.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Spårbarhet</th>
<th>Status</th>
</tr>
<tr>
<td>K-0.1</td>
<td>Programmeringsspråk</td>
<td>Organisationskrav</td>
<td>Utveckling ska ske i JavaScript och Visual Studio Code.</td>
<td>O-1</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.2</td>
<td>Backendteknik</td>
<td>Organisationskrav</td>
<td>Backend ska utvecklas med Node.js och Express.</td>
<td>O-2</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.3</td>
<td>Frontendteknik</td>
<td>Organisationskrav</td>
<td>Frontend ska byggas med webbkomponenter i HTML/CSS/JS.</td>
<td>O-4</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.4</td>
<td>Databas</td>
<td>Organisationskrav</td>
<td>MongoDB Atlas kommer att anslutas och användas som molnbaserad databas.</td>
<td>O-3</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.5</td>
<td>Kommentera kod</td>
<td>Organisationskrav</td>
<td>Klasser, funktioner och metoder ska dokumenteras med JSDoc. Radkommentarer ska förtydliga svår kod.</td>
<td>3.3</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.6</td>
<td>Jobba med moduler</td>
<td>Organisationskrav</td>
<td>All kod ska organiseras i moduler med separata ansvarsområden</td>
<td>3.2</td>
<td>

* [x]  
</td>
</tr>
<tr>
<td>K-0.7</td>
<td>Versionshantering</td>
<td>Organisationskrav</td>
<td>All källkod ska versionshanteras i GitLab</td>
<td>3.1</td>
<td>

* [x]  
</td>
</tr>
</table>

## K-1 - Slumpa en lek ([UC-1](documents\testspecifikation\UC-1))

* [x] Klar. Alla delkrav K-1.1 - K-1.7 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet kravspec.</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-1.1</td>
<td>Databasschema för lek</td>
<td>Funktionell</td>
<td>Skapa ett databasschema som kan användas för att hämta en lek från MongoDB Atlas.</td>
<td>K-0.4</td>
<td>US-1</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-1.2</td>
<td>Skapa endpoint för hämtning av lek</td>
<td>Funktionell</td>
<td>Skapa ett API som returnerar en slumpad lek.</td>
<td>K-1.1</td>
<td>US-1</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-1.3</td>
<td>Filtrering av lek - ålder</td>
<td>Funktionell</td>
<td>Filtrera slumpade lekar baserat på ålder.</td>
<td>K-1.2</td>
<td>US-8</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-1.4</td>
<td>Filtrering av lek - plats</td>
<td>Funktionell</td>
<td>Filtrera slumpade lekar baserat på inomhus/utomhus</td>
<td>K-1.2</td>
<td>US-6, US-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-1.5</td>
<td>Presentation av lek</td>
<td>Funktionell</td>
<td>Presentera slumpad lek i frontend med en tydlig rubrik och instruktioner, på ett responsivt sätt.</td>
<td>K-0.3, K-1.2, K-1.3, K-1.4</td>
<td>US-1, NF-1, NF-2, NF-4</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-1.6</td>
<td>Slumpa lek inom tre klick</td>
<td>Icke-funktionell</td>
<td>Från startsidan och menyn ska användaren bli presenterad en lek efter tre klick.</td>
<td>K-1.5</td>
<td>NF-3</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-1.7</td>
<td>Hantering av tom databas</td>
<td>Icke-Funktionell</td>
<td>Om databasen inte innehåller någon lek, ska ett felmeddelande presenteras för användaren.</td>
<td>K-0.3, K-1.2, K-1.3, K-1.4</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
</table>

## K-2 - Slumpa ett pyssel ([UC-2](documents\testspecifikation\UC-2))

* [x] Klar. Alla delkrav K-2.1 - K-2.7 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-2.1</td>
<td>Databasschema för pyssel</td>
<td>Funktionell</td>
<td>Skapa ett databasschema som kan användas för att spara ett pyssel i MongoDB Atlas.</td>
<td>K-0.4</td>
<td>US-2</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-2.2</td>
<td>Skapa endpoint för hämtning av pyssel</td>
<td>Funktionell</td>
<td>Skapa ett API som returnerar ett slumpat pyssel.</td>
<td>K-2.1</td>
<td>US-2</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-2.3</td>
<td>Filtrering av pyssel - ålder</td>
<td>Funktionell</td>
<td>Filtrera slumpade pyssel baserat på ålder.</td>
<td>K-2.2</td>
<td>US-8</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-2.4</td>
<td>Filtrering av pyssel - plats</td>
<td>Funktionell</td>
<td>Filtrera slumpade pyssel baserat på inomhus/utomhus</td>
<td>K-2.2</td>
<td>US-6, US-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-2.5</td>
<td>Presentation av pyssel</td>
<td>Funktionell</td>
<td>Presentera slumpat pyssel i frontend med en tydlig rubrik och instruktioner, på ett responsivt sätt.</td>
<td>K-0.3,K-2.2, K-2.3, K-2.4</td>
<td>US-2, NF-1, NF-2, NF-4</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-2.6</td>
<td>Slumpa pyssel inom tre klick</td>
<td>Icke-funktionell</td>
<td>Från startsidan och menyn ska användaren bli presenterad ett pyssel efter tre klick.</td>
<td>K-1.5</td>
<td>NF-3</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-2.7</td>
<td>Hantering av tom databas</td>
<td>Icke-Funktionell</td>
<td>Om databasen inte innehåller något pyssel, ska ett felmeddelande presenteras för användaren.</td>
<td>K-0.3, K-2.2, K-2.3, K-2.4</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
</table>

## K-3 - Slumpa utmaning ([UC-3](documents\testspecifikation\UC-3))

* [x] Klar. Alla delkrav K-3.1 - K-3.5 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-3.1</td>
<td>Databasschema för utmaningar</td>
<td>Funktionell</td>
<td>Skapa ett databasschema som kan användas för att spara en utmaning med lösningsförslag i MongoDB Atlas.</td>
<td>K-0.4</td>
<td>US-5</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-3.2</td>
<td>Skapa endpoint för hämtning av utmaning</td>
<td>Funktionell</td>
<td>Skapa ett API som returnerar en slumpad utmaning.</td>
<td>K-3.1</td>
<td>US-5</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-3.3</td>
<td>Filtrering av utmaning - ålder</td>
<td>Funktionell</td>
<td>Filtrera slumpade utmaningar baserat på ålder.</td>
<td>K-3.2</td>
<td>US-8</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-3.4</td>
<td>Presentation av utmaning</td>
<td>Funktionell</td>
<td>Presentera slumpa utmaning i frontend med en tydlig rubrik, instruktioner och lösningsförslag, på ett responsivt sätt.</td>
<td>K-0.3, K-3.2, K-3.3</td>
<td>US-4, US-5, NF-1, NF-4</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-3.5</td>
<td>Hantering av tom databas</td>
<td>Icke-Funktionell</td>
<td>Om databasen inte innehåller någon utmaning, ska ett felmeddelande presenteras för användaren.</td>
<td>K-0.3, K-3.2, K-3.3</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
</table>

## K-4 - Visa väder ([UC-4](documents\testspecifikation\UC-4))

* [x] Klar. Alla delkrav K-4.1 - K-4.6 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-4.1</td>
<td>Anslut till väder-API</td>
<td>Funktionell</td>
<td>Anslut till externt väder API (OpenWeatherMap)</td>
<td>K-0.4</td>
<td>US-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-4.2</td>
<td>Hämta GPS-position</td>
<td>Funktionell</td>
<td>Hämta användarens aktuella position med Geolocation API.</td>
<td>K-0.3</td>
<td>US-7</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-4.3</td>
<td>Endpoint för väder</td>
<td>Funktionell</td>
<td>Ta emot användarens koordinater och hämta lokal väderdata.</td>
<td>K-4.1, K-4.2</td>
<td>US-7</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-4.4</td>
<td>Presentation av väder</td>
<td>Funktionell</td>
<td>Presentera vädret i frontend med ikon och temperatur, på ett responsivt sätt.</td>
<td>K-0.3, K-4.3</td>
<td>US-7, NF-1</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-4.5</td>
<td>Ange en standardposition om användare nekar platsdelning</td>
<td>Funktionell</td>
<td>Om användaren inte vill eller kan dela sin plats visas Stockholm som stad</td>
<td>K-4.2, K-4.3</td>
<td>US-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-4.6</td>
<td>Felmeddelande om vädret ej kan visas</td>
<td>Icke-Funktionell</td>
<td>Om vädret inte kan visas på korrekt sätt, ska ett felmeddelande presenteras istället</td>
<td>K-4.3</td>
<td>NF-6, US-15</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
</table>

## K-5 - Visa karta med närliggande lekplatser ([UC-5](documents\testspecifikation\UC-5))

* [x] Klar. Alla delkrav K-5.0 - K-5.7 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-5.0</td>
<td>Hämta GPS-position</td>
<td>Funktionell</td>
<td>Hämta användarens aktuella position med Geolocation API.</td>
<td>...</td>
<td>US-10</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-5.1</td>
<td>Visa karta</td>
<td>Funktionell</td>
<td>Visa karta med användarens aktuella position</td>
<td>K-4.2</td>
<td>US-10, O-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-5.2</td>
<td>Markera lekplatser</td>
<td>Funktionell</td>
<td>Visa närmsta lekplatserna utifrån användarens position</td>
<td>K-5.1</td>
<td>US-10, O-8, O-9</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-5.3</td>
<td>Sökfält</td>
<td>Funktionell</td>
<td>Visa en sökruta för att manuellt söka efter en plats</td>
<td>K-5.1, K-4.2</td>
<td>US-20, O-8</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-5.4</td>
<td>Felmeddelande om karta ej kan visas</td>
<td>Icke-Funktionell</td>
<td>Om kartan inte kan visas på korrekt sätt, ska ett felmeddelande presenteras istället</td>
<td>K-5.1, K-5.2, K-5.3</td>
<td>NF-6, US-15, O-8</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-5.5</td>
<td>Ange en standardposition om användare nekar platsdelning</td>
<td>Funktionell</td>
<td>Om användaren inte vill eller kan dela sin plats visas Stockholm som stad</td>
<td>K-5.1</td>
<td>US-15, K-5.0, O-10</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-5.6</td>
<td>Visa popup för varje markör</td>
<td>Funktionell</td>
<td>Visa popup med namn, adress och "Vägbeskrivning" på varje markör</td>
<td>K-5.2</td>
<td>US-21, O-9</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-5.7</td>
<td>Anpassa karta efter skärmstorlek</td>
<td>Icke-funktionell</td>
<td>Kartan ska vara responsiv och anpassas i storlek utifrån bildskärm</td>
<td>K-5.1</td>
<td>US-4, US-23, NF-1</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
</table>

## K-6 - Användarhantering ([UC-6](documents\testspecifikation\UC-6))

* [x] Klar. Alla delkrav K-6.1 - K-6.12 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-6.1</td>
<td>Databasschema för användare</td>
<td>Funktionell</td>
<td>Skapa ett databasschema som kan användas för att spara en användare i MongoDB Atlas.</td>
<td>K-0.4</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.2</td>
<td>Skapa registreringsformulär</td>
<td>Funktionell</td>
<td>Visa ett formulär där användaren kan skriva in sin mail, ett användarnamn och lösenord för att registrera sig som användare och sparas i databasen.</td>
<td>K-6.1</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.3</td>
<td>Kontrollera om användare finns</td>
<td>Funktionell</td>
<td>Kontrollera att e-post/användarnamn inte redan existerar i databasen.</td>
<td>K-6.2</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-6.4</td>
<td>Hasha och salta lösenord</td>
<td>Organisationskrav/ Säkerhet</td>
<td>När användaren sparar ett lösenord ska det hashas och saltas innan det sparas i databasen.</td>
<td>K-6.1, K-6.2</td>
<td>3.4</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.5</td>
<td>Skapa inloggningsformulär</td>
<td>Funktionell</td>
<td>Visa ett formulär där användaren kan skriva in sitt användarnamn och lösenord för inloggning.</td>
<td>K-6.1</td>
<td>US-12</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.6</td>
<td>Autentisiering med JWT</td>
<td>Organisationskrav/ Säkerhet</td>
<td>När användaren loggar in ska JWT genereras för att validera användaren.</td>
<td>K-6.5</td>
<td>3.4</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-6.7</td>
<td>Refresh Token</td>
<td>Organisationskrav/ Säkerhet</td>
<td>När JWT löper ut, ska refresh token användas för att skapa ny JWT och hålla användaren inloggad.</td>
<td>K-6.6</td>
<td>3.4</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-6.8</td>
<td>Ändra lösenord</td>
<td>Funktionell</td>
<td>Inloggad användare ska kunna ändra sitt lösenord</td>
<td>K-6.1, K-6.5</td>
<td>US-13</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.9</td>
<td>Radera konto</td>
<td>Funktionell</td>
<td>Inloggad användare ska kunna radera sitt konto</td>
<td>K-6.1, K-6.5</td>
<td>US-13</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.10</td>
<td>Sanera formulärdata</td>
<td>Organisationskrav/ Säkerhet</td>
<td>Det som skrivs i formulär ska saneras innan det lagras.</td>
<td>K-6.2, K-6.5, K-6.8</td>
<td>3.4</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-6.11</td>
<td>Felmeddelande vid felaktig inloggning</td>
<td>Icke-Funktionell</td>
<td>Vid felaktigt angivet användarnamn/ lösenord ska felmeddelande visas.</td>
<td>K-6.5</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-6.12</td>
<td>Felmeddelande vid felaktig registrering</td>
<td>Icke-Funktionell</td>
<td>Om registrering misslyckas ska felmeddelande visas.</td>
<td>K-6.2, K-6.3</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
</table>

## K-7 - Hantera forum ([UC-7](documents\testspecifikation\UC-7))

* [x] Klar. Alla delkrav K-7.1 - K-7.8 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-7.1</td>
<td>Databasschema för foruminlägg</td>
<td>Funktionell</td>
<td>Skapa ett databasschema som kan användas för att skapa ett inlägg i forumet MongoDB Atlas.</td>
<td>K-0.4</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.2</td>
<td>Endpoint för forum</td>
<td>Funktionell</td>
<td>Skapa ett API som tar emot och returnerar foruminlägg.</td>
<td>K-7.1</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.3</td>
<td>Skapa, ändra och radera foruminlägg som inloggad användare</td>
<td>Funktionell</td>
<td>Tillåt en inloggad användare att skapa, ändra och radera foruminlägg</td>
<td>K-7.2, K-6.4</td>
<td>US-11, NF-5</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.4</td>
<td>Uppdatera/radera</td>
<td>Funktionell</td>
<td>Endast inloggad användare får uppdatera och radera sina egna inlägg</td>
<td>K-7.3</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.5</td>
<td>Presentera forum</td>
<td>Funktionell</td>
<td>Forumet ska visas som en tabell med en översikt av skapade trådar.</td>
<td>K-7.2</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.6</td>
<td>Presentera forumtråd i frontend</td>
<td>Funktionell</td>
<td>Visa forumtråd med författare, titel, textinnehåll och datum </td>
<td>K-7.5</td>
<td>US-11</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-7.7</td>
<td>Felmeddelande om forum inte visas som det ska</td>
<td>Icke-funktionellt</td>
<td>Om fel vid forumvisning uppstår ska felmeddelande visas.</td>
<td>K-7.2, K-7.6</td>
<td>US-15, NF-6</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-7.8</td>
<td>Sanera formulärdata</td>
<td>Organisationskrav/ Säkerhet</td>
<td>Det som skrivs i forumet ska saneras innan det lagras i databasen.</td>
<td>K-7.3</td>
<td>3.4</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
</table>

## K-8 - Driftsättning ([UC-8](documents\testspecifikation\UC-8))

* [x] Klar. Alla delkrav K-8.1 - K-8.4 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-8.1</td>
<td>Driftsättningsplattform</td>
<td>Organisationskrav</td>
<td>Webbsidan ska driftsättas.</td>
<td>...</td>
<td>O-5</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-8.2</td>
<td>HTTPS/SSL</td>
<td>Organisationskrav</td>
<td>Applikationen ska köras över HTTPS vid driftsättning för säker kryptering.</td>
<td>K-8.1</td>
<td>O-5</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-8.3</td>
<td>Docker-compose</td>
<td>Organisationskrav</td>
<td>Applikationen ska köras i container med Docker</td>
<td>K-8.1</td>
<td>O-6</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-8.4</td>
<td>CI/CD GitLab</td>
<td>Organisationskrav</td>
<td>CI/CD-pipeline konfiguration för automatiserad testning, bygg och driftsättning.</td>
<td>K-8.1, K-8.3</td>
<td>O-5, O-6, O-11</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
</table>

## K-9 - Visa karta med närliggande badplatser ([UC-9](documents\testspecifikation\UC-9))

* [x] Klar. Alla delkrav K-9.1 - K-9.7 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-9.1</td>
<td>Visa karta</td>
<td>Funktionell</td>
<td>Visa karta med användarens aktuella position</td>
<td>K-4.2</td>
<td>US-9, O-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-9.2</td>
<td>Markera badplatser</td>
<td>Funktionell</td>
<td>Visa närmsta badplatserna utifrån användarens position</td>
<td>K-9.1</td>
<td>O-8, O-9</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-9.3</td>
<td>Sökfält</td>
<td>Funktionell</td>
<td>Visa en sökruta för att manuellt söka efter en plats</td>
<td>K-9.1, K-4.2</td>
<td>US-9, O-8</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-9.4</td>
<td>Felmeddelande om karta ej kan visas</td>
<td>Icke-Funktionell</td>
<td>Om kartan inte kan visas på korrekt sätt, ska ett felmeddelande presenteras istället</td>
<td>K-9.1, K-9.2, K-9.3</td>
<td>NF-6, US-15, O-8</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-9.5</td>
<td>Ange en standardposition om användare nekar platsdelning</td>
<td>Funktionell</td>
<td>Om användaren inte vill eller kan dela sin plats visas Stockholm som stad</td>
<td>K-9.1</td>
<td>K-4.2</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-9.6</td>
<td>Visa popup för varje markör</td>
<td>Funktionell</td>
<td>Visa popup med namn, adress och "Vägbeskrivning" på varje markör</td>
<td>K-9.2</td>
<td>US-9</td>
<td>

* [x]  
</td>
<td>Låg</td>
</tr>
<tr>
<td>K-9.7</td>
<td>Anpassa karta efter skärmstorlek</td>
<td>Icke-funktionell</td>
<td>Kartan ska vara responsiv och anpassas i storlek utifrån bildskärm</td>
<td>K-9.1</td>
<td>NF-1</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
</table>

## K-10 - Design och responsivitet ([UC-10](documents\testspecifikation\UC-10))

* [x] Klar. Alla delkrav K-10.1 - K-10.4 implementerade och testade.

<table>
<tr>
<th>Krav-ID</th>
<th>Krav</th>
<th>Kravtyp</th>
<th>Beskrivning</th>
<th>Beroenden</th>
<th>Spårbarhet</th>
<th>Status</th>
<th>Prioritet</th>
</tr>
<tr>
<td>K-10.1</td>
<td>Responsiv helhet</td>
<td>Icke-funktionellt</td>
<td>Gränssnittet ska vara mobilanpassat och fungera på olika skärmstorlekar, inklusive mobil, surfplatta och laptop</td>
<td>K-0.3</td>
<td>NF-1</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-10.2</td>
<td>Responsiva komponenter</td>
<td>Icke-funktionellt</td>
<td>Alla komponenter ska presenteras på ett responsivt sätt vid olika skärmstorlekar</td>
<td>K-1, K-2, K-3, K-4, K-5, K-6, K-7, K-9</td>
<td>NF-1, NF-2</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
<tr>
<td>K-10.3</td>
<td>Layout</td>
<td>Icke-funktionellt</td>
<td>Färg, typsnitt och layout ska vara enhetligt, lättläst och visuellt tilltalande för barn och vuxna</td>
<td>K-0.3</td>
<td>NF-2, O-4, NF-8</td>
<td>

* [x]  
</td>
<td>Medel</td>
</tr>
<tr>
<td>K-10.4</td>
<td>Startsida</td>
<td>Icke-funktionellt</td>
<td>Startsidan ska vara uppbyggd med menyval, logga, välkomst- och informationstext kring webbsidan.</td>
<td>K-0.3</td>
<td>NF-7</td>
<td>

* [x]  
</td>
<td>Hög</td>
</tr>
</table>

