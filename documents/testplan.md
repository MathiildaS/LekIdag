# Testplan
Denna testplan beskriver strategier, resurser, metoder och testtyper som används för att verifiera funktionalitet och kvalitet i projektet "LekIdag". Syftet är att säkerställa att applikationens alla kärnfunktioner fungerar som avsett enligt projektets vision och kravspecifikation, samt att applikationen är stabil, användbar och underhållbar över tid.

## Vad testas och hur?

| Funktionalitet | Testmetod |
|----------------|-----------|
| Slumpa en lek, pyssel och utmaning baserat på ålder och plats | Manuella tester + enhetstester |
| Visa lokal väderprognos | Manuella tester + enhetstest |
| Visa karta över lokala lekparker | Manuella tester |
| Visa karta över lokala badplatser | Manuella tester |
| Användarhantering som registrering av användare, inloggning, uppdatering av konto | Manuella tester + integrationstester |
| Forumfunktionalitet | Manuella tester |
| Design och responsivitet | Manuella tester |

Alla funktioner testas med hänsyn till projektets organisationskrav K-0.1 – K-0.7.
Testningen utgår från definierade användarfall (use cases) och en kravspecifikation som hålls uppdaterad i projektets dokumentation.

### Teststrategi

**Manuella tester** används för alla visuella funktioner i frontend såsom att slumpa lekar, pyssel, visa väder, användarhantering samt foruminteraktion och kartfunktionalitet. Dessa genomförs i flera webbläsare och på olika skärmstorlekar för att säkerställa att funktioner fungerar för alla användare.

**Enhetstester** används för att testa bland annat funktioner som hanterar tom databas, API-anrop och för att verifiera felmeddelanden.

**Integrationstester** används för att validera användarhanteringens alla flöden som registrering, inloggning, JWT-hantering (access/refresh), uppdatering av lösenord och e-post, utloggning och verifiering att token inte längre är giltig efter utloggning.

Responsivitet kommer att testas löpande manuellt och genom Lighthouse-analys.

| Testtyp | Metod | Verktyg/Ramverk | Beskrivning |
|---------|-------|-----------------|-------------|
| Manuell testning | Testfall baserade på "Use Cases" och krav | Postman, via webbsidan/frontend | Säkerställer kravens funktionalitet främst via frontend |
| Enhetstestning | Testar isolerade delar av applikationen. | Jest | Testar och säkerställer att enskilda funktioner/metoder fungerar som tänkt, bland annat controller-funktionerna i backend. |
| Integrationstestning | Testar interaktionen mellan flera komponenter | Jest + Supertest | Validerar korrekt användarflöde i backend |

## Testfall & Rapporter
Alla testfall, testscenarier och resultat dokumenteras under testspecifikation. Rapporteringen sker löpande.

Testfallen är organiserade utifrån användarfall och kopplade till definierade krav.

## Tidsplan och arbetsinsats

| Testtyp | Beskrivning | Skattad tid (h) | Verklig tid (h) |
|---------|-------------|-----------------|-----------------|
| Skapa manuella tester från UC | Skapa testfall baserade på användarfall och Product Backlog | 3 | 11,5 |
| Skapa och implementera automatiserade tester från UC | Skapa enhetstester och integrationstester med Jest och Supertest | 8 | 9 |
| Utföra Användartester | Feedback från användare som testat ett antal testfall. | 1 | 3 |
| Utföra tester och skriva testrapport | Följ testfall och dokumentera genomförda tester. | 4 | 14,5 |

### **Analys**

Den verkliga tiden blev betydligt längre än planerat, framför allt för att skapa manuella tester och skriva testrapporter. Det blev tydligt hur mycket tid testning och dokumentation faktiskt tar, något som underskattades i början av projektet.

Jag implementerade mycket kod åt gången och testade tidigt, men utan att dokumentera allting. Detta gjorde att många testfall skrevs ner först i efterhand.
