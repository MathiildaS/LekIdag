# Slutrapport - LekIdag

Projektet har resulterat i en fullt fungerande webbapplikation där användare kan:

* Slumpa lekar, pyssel och utmaningar baserat på ålder och plats (K-1, K-2, K-3)
* Se aktuell lokal väderprognos via OpenWeatherMap (K-4)
* Se karta över närliggande lekplatser och badplatser via Leaflet och Overpass API (K-5, K-9)
* Registrera konto, logga in, ändra lösenord, ändra e-post, logga ut och radera sitt konto med JWT-baserad autentisering (K-6)
* Delta i forum. Möjlighet att skapa, visa, uppdatera och radera inlägg med åtkomstkontroll (K-7)

Webbapplikationen är anpassad och testad för olika skärmstorlekar (K-10)

## Förbättringsområden

* WebSocket-stöd i forumet för realtidsuppdatering
* Bilduppladdning i foruminlägg
* Möjlighet att kommentera andras foruminlägg
* Möjlighet att spara lekar/pyssel/utmaningar
* Göra applikationen till en PWA

## **Utvecklingsprocess**

Projektet har utvecklats iterativt, med fokus på moduluppbyggnad, kravdriven utveckling och tydlig struktur i både frontend och backend. Alla kärnfunktioner är implementerade och testade, men utvecklingen av projektet kommer att fortsätta med fokus på förbättring av användarupplevelsen och ytterligare funktionalitet som bilduppladdning i forum och även möjlighet att kommentera inlägg. 

Kodrefaktorering har genomförts löpande, framför allt i samband med testning, vilket bidragit till förbättrad struktur, återanvändbarhet och tydlighet i systemets olika komponenter.

## **Teststatus**

Många manuella tester genomfördes samtidigt som utvecklingen pågick, vilket gjorde att testfall ibland dokumenterades i efterhand. Detta minskade deras användbarhet som utvecklingsstöd. Den metod som fungerade bäst var när testfall och implementation skedde om vartannat. 

Samtliga funktioner har testats enligt definierade användarfall.

### Genomförda tester:

| Funktion | Testtyp | Status |
|----------|---------|--------|
| Slumpa lek/pyssel/utmaning | Manuell + enhetstest | ✅ |
| Väderfunktion | Manuell + enhetstest | ✅ |
| Karta (lekplatser/badplatser) | Manuell | ✅ |
| Användarhantering | Integrationstest + manuell | ✅ |
| Forumfunktion | Manuell test | ✅ |
| Responsiv design | Manuell  | ✅ |

