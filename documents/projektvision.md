# LekIdag

|  |  |
|--|--|
| Skapad av | Mathilda Segerlund |
| Projektnamn | LekIdag |
| Tekniker och APIer | Javascript, Nginx, Node.js, Express, HTML/CSS, Webbkomponenter, MongoDB Atlas, Geolocation API, Leaflet + OpenStreetMap, Overpass API, OpenWeatherMap API, Nominatim API, Jest, Supertest |

## Bakgrund och problembeskrivning

Som förälder kan det vara svårt att hitta en kreativ, rolig och framförallt ny aktivitet att erbjuda sitt barn – särskilt när tiden är knapp, energin låg och vädret växlar från sol till regn på fem minuter. Fantasin tryter och det är lätt att känna sig stressad när idéerna tar slut, samtidigt som önskan finns där att kunna engagera sitt barn och inspirera till lek och kreativitet istället för ännu en stund framför skärmen. Det är inte ovanligt att man sparar tips, pysselidéer eller roliga lekar på olika platser på internet och i appar – bara för att senare inte hitta tillbaka dit eller upptäcka att de inte alls passar varken barnets ålder eller dagens väderförhållande.

LekIdag kommer därför att vara en webbapplikation skapad av en förälder för andra föräldrar, barnvakter eller pedagoger. Syftet är främst att bidra till att minimera den tiden som går åt till att leta efter lämpliga lekar och pyssel och istället maximera den tid som kan användas till att leka, skapa och umgås. För även om det redan finns mängder av tips på nätet idag är informationen ofta utspridd över bloggar, sociala medier och forum. Det saknas en plats där man på ett roligt sätt kan få tips på varierande, åldersanpassade både lek- och pysselidéer samlade på ett och samma ställe.

LekIdag kommer att erbjuda alternativ till lekar och pyssel utifrån ålder och om man önskar utföra detta inomhus eller utomhus. Därför kommer även en lokal väderprognos att presenteras för att underlätta planering och val av aktivitet. Förslagen av lek eller pyssel kommer att genereras slumpmässigt, vilket kommer att bidra till en spännande upplevelse varje gång. Medan förberedelse av lek eller pyssel sker, kan barnet i sin tur anta en utmaning. Även denna kommer att vara anpassad efter barnets ålder och innehålla ett pedagogiskt lösningsförslag. Det kommer även finnas möjlighet att registrera sig som användare för att kunna delta i ett forum där användaren kan dela tips kring bl.a. utförda lekar i ett forum. Här finns möjlighet att bli inspirerad och bidra till inspiration till andra användare. Dessutom ska det finnas lättillgänglig information om vart de närmsta lekparkerna och badplatserna finns lokalt. Detta genom interaktiva kartor som utgår från användarens nuvarande position.

Allt man behöver för en rolig dag – samlat på ett och samma ställe!

## Användar-/målgrupper

Föräldrar, barnvakter och pedagoger som söker inspiration till nya lekar och pyssel för och tillsammans med barn, anpassade utifrån olika åldrar. För de som som önskar finna en lämplig aktivitet utifrån dagens väder samt de som vill dela idéer och aktiviteter med andra genom ett gemensamt forum.

Tjänsten passar även för alla som snabbt önskar finna de närmsta lekparkerna eller badplatserna i sitt närområde.

## Marknad

Det finns idag redan ett brett utbud av webbsidor som erbjuder tips på lekar, pyssel och aktiviteter för barn. Många av dessa tips och förslag återfinns på bloggar, i forum men även på kommersiella sidor som bland annat Coolstuff.

Exempel på befintliga lösningar:

**Lekarkivet** - En webbsida med många olika lekar presenterade utifrån typ av lek som till exempel “Bollekar” eller “Kluriga lekar”. Där finns ett väldigt omfattande innehåll av lekförslag, men saknar möjlighet att välja utifrån barnets ålder. Sidan kan dessutom upplevas som rörig med mycket övrigt innehåll som presenteras samtidigt. Den är dessutom inriktad på att ge förslag på lekar och saknar förslag på pyssel helt.

**Folkhälsans lekdatabas** - En inspirerande sida som erbjuder förslag på många lekar utifrån typ av lek, var den ska genomföras (inomhus eller utomhus) samt för vilken ålder leken lämpar sig. Även här saknas dock förslag på pyssel.

**Panduro** - Här kan man finna förslag på pyssel för både de allra yngsta och äldre barn. Fokus ligger dock på de produkter man kan köpa för att genomföra pysslet.

Utifrån detta kan man konstatera att det redan finns många bra webbsidor som erbjuder förslag på lekar och pyssel, men att dessa är utspridda och begränsade. Hittar man ett lekförslag på en av webbsidorna, behöver man sedan besöka en annan för att även få tillgång till ett pysselförslag. Önskar man dessutom istället att snabbt och smidigt hitta en lekpark eller en badplats att besöka, krävs ytterligare en annan webbsida för att finna denna informationen.

LekIdag kommer att erbjuda en kombination av det som redan finns idag, men på ett ännu mer lättillgängligt och användarvänligt sätt.

## Baskrav/Egenskaper/Features/Unique Selling Points

* Användarregistrering.
* Inloggning för att kunna skapa, uppdatera och radera egna inlägg i forumet.
* Slumpa fram lekar utifrån ålder och föredragen plats.
* Slumpa fram pyssel utifrån ålder och föredragen plats.
* Slumpa fram en utmaning utifrån ålder.
* Karta över lokala badplatser.
* Karta över lokala lekparker.
* Lokal väderrapport.

**Eventuell vidareutveckling:**

* Låta användare recensera lekplatser och badplatser utifrån åldersanpassning.
* Filtrera lekplatser och badplatser utifrån åldersanpassning.
* Låta andra användare kommentera ett foruminlägg.
* Bilduppladdning i forum.
* Pagenering i forum.
* Filtrering utifrån kategori i forum.
* WebSocket för omedelbara uppdateringar utan sidladdning av forum.

## Teknikstack

* MongoDB Atlas: För molnlagring av lekar, pyssel och utmaningar, registrerade användare och forumtrådar.
* Node.js / Express: Backend
* Webbkomponenter med HTML/CSS/JavaScript: Frontend
* OpenWeatherMap API: För hämtning och visning av aktuell väderprognos.
* Geolocation API: För hämtning av aktuell användarposition.
* OpenStreetMap API: För hämtning av karta.
* Leaflet: För rendering av karta tillsammans med OpenStreetMap.
* Overpass API: För att hämta data kring lekplatser och badplatser från OpenStreetMap
* Nominatim API: För att omvandla koordinater till adresser
* NGINX: Vid driftsättning som reverse proxy/hantering av HTTPS.
* Docker och Docker Compose: För containerbaserad utveckling och driftsättning i både lokal och produktionsmiljö.
* CI/CD via GitHub Actions: För automatisk testning, bygg och driftsättning