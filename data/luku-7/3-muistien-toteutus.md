---
path: '/luku-7/3-muisti-cache-ssd'
title: 'Järjestelmän sisäisten muistien toteutus'
hidden: false
---

<div>
<lead>Tietokonejärjestelmän keskusmuisti on se muistialue, jossa ohjelman koodi ja data pääasiassa sijaitsevat ohjelman suorituksen aikana. Järjestelmän optimointitavoitteiden mukaisesti osa tiedoista voi sijaita myös eri tasoisissa välimuisteissa suorittimen lähellä tai erilaisissa massamuisteissa (ks. seuraava luku) paljon kauempana suorittimelta. Ohjelman suoritus perustuu kuitenkin ajatukseen, että suorituksessa olevat konekäskyt ja niiden käyttämä data ovat keskusmuistissa (tai suorittimen rekistereissä). 
</lead>
</div>

## Keskusmuisti
[Keskusmuisti](https://fi.wikipedia.org/wiki/Keskusmuisti) on nykyään aina ns. haipuvaa muistia, joka tarvitsee sähkövirtaa tiedon säilymiseen. Virran katkettua muisti tyhjenee, eikä sitä voi palauttaa mitenkään. Järjestelmän hibernaatiotilassa joidenkin tietokoneiden (esim. tiettyjen tablettien tai läppärien) muisti säilyy ennallaan, mutta tämäkin vaatii pienen määrän sähkövirtaa koko ajan. Tällainen hibernaatiotila on silti hyödyllinen. Se kuluttaa akkua paljon vähemmän kuin tietokoneen päälläolo ja laitteisto on nopeasti herätettävissä käyntiin, koska tiedot ovat muistissa valmiina.

Tietokoneiden kehityksen alkuaikoina keskusmuisti saatettiin toteuttaa sillä tavoin, että jotkut muistipaikat olivat nopeammin saatavilla kuin toiset (esimerkkinä aiemmin mainittu elohopeaviiveputki). Nykyään kuitenkin keskusmuisti on toteutettu RAM-muistina (Random Access Memory), mikä nimensä mukaisesti tarkoittaa, että kaikki muistipaikat ovat luettavissa tai kirjoitettavissa yhtä nopeasti. Järjestelmää käynnistettäessä (bootatessa) ensin suoritetaan sen alustuskoodi (käynnistyslohko, [BIOS](https://fi.wikipedia.org/wiki/BIOS), Basic Input-Output System) jostain pysyväismuistista. Nykyään BIOS on usein toteutettu [flash](https://fi.wikipedia.org/wiki/Flash-muisti)-muistina tietokoneen [emolevyllä](https://fi.wikipedia.org/wiki/Emolevy). Pysyväismuisti on paljon hitaampaa kuin keskusmuisti, mutta tieto säilyy siellä vuosia ilman sähkövirtaa.

Jotkut useamman suorittimen järjestelmien muisti voi olla nykyään toteutettu [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access)-mallin (Non-Uniform Memory Access) avulla. Niissä kuhunkin suorittimeen on liitetty oma RAM-muistinsa, mutta kaikkeen muistiin pystyy viittaamaan jokaisesta suorittimesta. Tällöin lähellä oleva muisti on nopeampaa, kun muihin pitää viittaus toteuttaa suorittimien välissä olevien väylien ja muiden suorittimien kautta. Emme käsittele NUMA-mallin järjestelmiä tämän enempää tällä kurssilla.

Keskusmuisti voidaan toteuttaa kahdella vähän erilaisella teknologialla. [DRAM](https://fi.wikipedia.org/wiki/DRAM) (Dynamic Random Access Memory) on halvempi ja hitaampi. Sen toiminta perustuu [mikropiirillä](https://fi.wikipedia.org/wiki/Mikropiiri) toteutettuihin kondensaattoreihin, joiden varaus pikkuhiljaa haipuu koko ajan. Niissä olevia tietoja täytyy sen vuoksi vähän väliä (esim. 2 ms) "virkistää", mihin kuluu jonkin verran aikaa. DRAM on kuitenkin yksinkertainen ja halpa toteuttaa, minkä vuoksi niitä on käytetty useimmissa tietokoneissa jo yli 40 vuotta.

Toinen yleinen vaihtoehto keskusmuistin toteutukseen on [SRAM](https://fi.wikipedia.org/wiki/SRAM) (Static Random Access Memory). Siinä tieto on talletettu mikropiiriin samanlaisilla loogisilla porteilla ([gate](https://en.wikipedia.org/wiki/Logic_gate)), kuin millä suoritin on toteutettu. Porteilla kun voidaan toteuttaa myös tiedon säilyttäviä [kiikkuja](https://fi.wikipedia.org/wiki/Kiikku_(digitaalitekniikka)) (flip-flop). Kiikuilla toteutetaan myös kaikki suorittimen rekisterit. Kiikut eivät tarvitse tiedon virkistystä, mutta SRAM-muistin toteutus vaatii paljon enemmän (esim. 8x) tilaa mikropiiriltä ja on sen vuoksi paljon kalliimpaa kuin DRAM-muistin toteutus. SRAM-muistia käytetään yleensä välimuistien toteutukseen, mutta myös paljon nopeutta vaativissa järjestelmissä keskusmuistin toteutukseen.

Keskusmuistiteknologiaa kehitetään kokoa ajan ja molemmista muistiteknologioista on useita erilaisia tyyppejä käytössä. Esimerkiksi [SDRAM](https://fi.wikipedia.org/wiki/SDRAM)issa (Synchronous Dynamic RAM) on sisäinen puskuri, jonka avulla useampi muistipaikan luku voi olla meneillään yhtä aikaa. [DDR SDRAM](https://fi.wikipedia.org/wiki/SDRAM)ssa (Double Data Rate SDRAM) on tuplattu muistipiirin tiedonsiirtonopeus ovelasti hyödyntämällä mikropiirin toiminnan aikaansaavan [kellopulssin](https://en.wikipedia.org/wiki/Clock_cycle) nousevia ja laskevia jännitteitä. Emme käsittele keskusmuistin toteutusteknologioita tämän enempää tällä kurssilla.

## Välimuisti
[Välimuisti](https://fi.wikipedia.org/wiki/V%C3%A4limuisti) (cache) on suorittimen lähellä oleva muisti, joka sisältää kopioita keskusmuistissa olevista muistialueista. Ideana välimuistissa on, että tiedon löytyessä sieltä se on paljon nopeammin käytettävissä kuin jos se pitäisi hakea keskusmuistista. Välimuistin nopeus saadaan aikaan kahdella tavalla. Ensinnäkin, välimuisti on suorittimen puolella väylää, joten väylää eikä keskusmuistia tarvitse käyttää lainkaan tiedon löytyessä välimuistista. Toiseksi, välimuisti on yleensä toteutettu nopealla SRAM-teknologialla. Välimuisti voi olla toteutettu samalla mikropiirillä suorittimen kanssa, tai sitten omalla piirillään ihan suorittimen vieressä.

Välimuistin käyttö ohjelmalle on "tuntumatonta", eli konekäskyn suorituksen aikana ei tiedetä, löytyikö tieto välimuistista vai ei. Jos viitatut tiedot löytyvät usein välimuistista, niin ohjelma suoritus etenee nopeammin.

Välimuistiteknologialle on tyypillistä, että pienempi on nopeampi. Tämän vuoksi välimuisteja on usein monta eri tasoista. Ainakin pienimmät ja nopeimmat on yleensä toteutettu samalla mikropiirillä suorittimen kanssa. Nykyisissä läppäreissä on yleensä 3-4 tasoa välimuisteja. Alemman tason välimuistit on usein toteutettu erikseen koodille ja datalle. Koodi- ja dataviitteet käyttäytyvät vähän eri tavalla, joten on järkevää optimoida niiden välimuistit kullekin viitetyypille parhaiten sopivaksi.

Välimuistissa olevaan tietoon ei siis viitata suoraan, vaan laitteisto tutkii jokaisen muistiviitteen yhteydessä (viitatun keskusmuistiosoitteen perusteella), löytyykö tieto välimuistista vai ei. Tiedon mahdollinen sijainti välimuistissa on tärkeä välimuistin toteutuksen osa. Jos mahdollisia paikkoja on vain yksi tai muutama, tiedon etsiminen sieltä on nopeata. Toisaalta taas tieto voidaan turhaan joutua poistamaan välimuistista, koska joku muu tieto pitää tallettaa juuri samalle alueelle välimuistissa. Toinen tärkeä ominaisuus on välimuistin lohkon ("rivin") koko, joka määrää kuinka monta peräkkäistä muistipaikkaa välimuistiin aina kerrallaan haetaan.

Oletetaan esimerkiksi, että välimuistin rivin pituus on 8 sanaa. Taulukon T alkion T[0] lukeminen aiheuttaa koko välimuistilohkon T[0]-T[7] lukemisen muistista välimuistiin ja loput alkioista T[1]-T[7] löytyvätkin sitten (todennäköisesti) välimuistista, jos T[0] oli välimuistin rivin alussa ja viittaukset niihin tapahtuvat pian. Keskusmuistiteknologiat SDRAM ja DDR SDRAM ovat suunnitellut tukemaan juuri välimuistilohkojen nopeata tiedonsiirtoa. Todellisuudessa keskusmuistia siis luetaan ja kirjoitetaan välimuistin rivi kerrallaan, vaikka ohjelmat viittaavatkin yksittäisiin muistipaikkoihin.

Sanaa "välimuisti" (cache) käytetään tietotekniikassa usealla eri tasolla. Niissä kaikissa pidetään lähempänä suoritinta kopioita kauempana olevista tiedoista. Levyvälimuisti (file cache) pitää keskusmuistissa kopiota levyllä olevista tiedoista, selaimen välimuistissa ([web cache](https://en.wikipedia.org/wiki/Browser_cache)) on kaukanakin olevan verkkopalvelimen verkkosivuja tai muita dokumentteja ja [DNS](https://fi.wikipedia.org/wiki/DNS)-välimuistissa (DNS cache) taas on paikallisia kopioita verkon nimipalvelun tiedoista. Ole siis tarkkana, että termin "välimuisti" nähdessäsi yhdistät sen oikeaan käsitteeseen. Yleensä pelkällä sanalla "välimuisti" (cache) tarkoitetaan juuri edellä esitettyä keskusmuistin välimuistia, mutta ei aina.

## Pysyväismuisti, ROM (Read Only Memory)
Pysyväismuistia tarvitaan ainakin tietokonejärjestelmän käynnistyslohkon (BIOS) tallentamiseen, koska sen täytyy pystyä säilyttämään tiedot myös virran katkettua. Kun järjestelmään kytketään virta, niin ensimmäisenä suoritetaan pysyväismuistissa oleva käynnistyslohko.

Tietokoneiden alkuaikoina [ROM](https://en.wikipedia.org/wiki/Read-only_memory)-muistit toteutettiin samalla mikropiiriteknologialla kuin suorittimetkin, jolloin kaikki tieto talletettiin niihin mikropiirin valmistuksen yhteydessä. Jos käynnistyslohkoa piti päivittää, se tarkoitti uuden ROM-mikropiirin valmistamista ja asentamista paikalleen.

Tästä vähän parempi versio oli käyttäjän (sopivalla laitteistoilla) itse ohjelmoitava PROM ([Programmable Read-Only Memory](https://en.wikipedia.org/wiki/Programmable_read-only_memory)), joita saattoi ostaa tyhjinä ja joihin sitten (yhden kerran) itse pystyi kirjoittamaan uudet tiedot paikalleen. EPROM (Erasable Programmable ROM) oli vähän vielä parempi, koska siinä mikropiiri voitiin tyhjentää erityisessä "uunissa" ja sitten ohjelmoida uudelleen PROM:in lailla. Tästä taas päästiin [EEPROM](https://en.wikipedia.org/wiki/EEPROM):iin (Electronically Erasable Programmable ROM), jossa tietoja voitiin päivittää tavukohtaisesti erityislaitteistossa.

Nykyaikaan päästiin vasta 1980-luvun lopulla, kun EEPROM:ista kehitettiin [flash](https://fi.wikipedia.org/wiki/Flash-muisti)-muisti. Flash-muistin avulla laitteistossa olevia ROM-piirejä voitiin ohjelmallisesti päivittää ilman, että piirejä piti ottaa irti laitteistoista. Aluksi flash-piirit piti kerralla tyhjentää kokonaan, mutta hyvin pian päästiin pienempiin päivitettäviin yksiköihin. Flash-muistin avulla järjestelmän käynnistyslohkoa voi nyt helposti muuttaa normaalin ohjelmistopäivityksen yhteydessä. Toisaalta taas, järjestelmässä etuoikeutetussa tilassa suorittava [haittaohjelma](https://fi.wikipedia.org/wiki/Haittaohjelma) (esim. [käynnistyslohkovirus](https://fi.wikipedia.org/wiki/Tietokonevirus)) voi sekin nyt päivittää käynnistyslohkoa, minkä jälkeen haittaohjelmasta eroon pääsy voi olla mahdotonta tai ainakin hyvin vaikeata.

Sittemmin flash-muistiteknologia kehitettiin tukemaan myös massamuistien toteutusta. Esimerkiksi kännyköiden ja kameroiden muistit perustuvat tähän teknologiaan, samoin kuin muistitikut ja kovalevyjä korvaavat SSD-muistit. Edelleenkin pienenä ongelmana on, että kutakin datalohkoa voi SSD-muisteissa kirjoittaa vain jonkin rajallisen (esim. 100&nbsp;000) määrän kertoja. Tämän vuoksi toteutuksissa on yleensä enemmän muistilohkoja kuin mitä esimerkiksi muistitikun kapasiteetti antaa ymmärtää. Kun jokin muistilohko "happanee", otetaan käyttöön sen tilalle joku "varalohkoista". Halvat muistikortit ja muistitikut eivät myöskään ole ikuisia, joten niitä ei tulisi käyttää esimerkiksi valokuvien arkistointiin.

## Quizit 7.3.1-2 
<!-- Quiz 7.3.1-2 -->
<div><quiz id="a611e851-843f-413e-8a50-db874b191da8"></quiz></div>
<div><quiz id="a5618ecd-83b2-4a53-8a90-da9e2d133e53"></quiz></div>

<text-box variant="example" name="Historiaa:  Ferriittirengasmuisti">

Jay Forrester kehitti MIT:n Whirlwind-projektissa ferriittirengasmuistin (magnetic core memory), joka patentoitiin 1951. Ferriittirengasmuisti syrjäytti Williams Tube -muistit ja elohopeaviiveputkimuistit muutamassa vuodessa keskusmuistin yleisimpänä toteutustapana. Ferriittirengasmuisti perustui pieniin magneettisiin renkaisiin ja bitit talletettiin niihin renkaiden polarisaatiota vaihdellen. Renkaat olivat 2-ulotteisessa matriisissa ja jokainen bitti oli osoitettavissa sen xy-koordinaattijohtimien avulla. Kolmas johdin tarvittiin tiedon luku- ja kirjoitusoperaatioihin. Renkaiden asentaminen ohuine sähköjohtimineen oli tarkkaa käsityötä. Hyvänä puolena ferriittirenkaissa oli, että tieto säilyi niissä ilman sähkövirtaa. Toisena hyvä ominaisuutena oli, että säteily ei aiheuttanut häiriöitä talletettuun tietoon, mikä oli tärkeää sen ajan sotilas- ja avaruusteknologioille. Vielä 1970-luvun lopulla ferriittirengasmuistia käytettiin Apollo-ohjelmassa kuulennoilla. Nyt muistista on jäljellä enää käsitteet "core" ja "core memory", joilla viitataan keskusmuistiin yleensä.

<!-- kuva: ch-7-5-ferriitti    -->

![Vasemmalla valokuva ferriittirengasmuistista ja oikealla sen piirretty skeema. Valokuvassa noin 20x20 hilassa on noin 400 ferriittirengasta. Renkaiden läpi kulkee x-ja y-akselien suuntaisesti koordinaattijohtimet, noin 20 kapppaletta kumpaakin. Lisäksi kaikkien johtimien läpi kulkee yksi yhteinen luku- ja kirjoitusjohdin. Kuvassa mukana mittakaavana 1€ kolikko, joka on noin 1/4 ferriittirengas hilan koosta. Oikealla skeemakuvassa on suurennettuna 4x4 hilan 16 ferriittirengasta, koordinaatti- ja luku/kirjoitusjohtimineen. ](./ch-7-5-ferriitti.svg)
<div>
<illustrations motive="ch-7-5-ferriitti"></illustrations>
</div>

</text-box>

## Yhteenveto
Tämä luku käsitteli aluksi tietokonejärjestelmän sisäisiä virheensyntymekanismeja, kuinka satunnaisia virheitä voi havaita ja kuinka niitä ehkä myös voi korjata. Tarkoituksena on havaita ja mahdollisesti heti samalla korjata yleisimmät 1 bitin virheet, joita voi tapahtua muistipiireissä ja tiedon siirron aikana. Suorittimen sisällä tällaisia virheitä vastaan suojaudutaan yleensä Hamming-koodin avulla. Tämä tarkoittaa käytännössä ylimääräisiä bittejä muistipiireissä ja rekistereissä, samoin kuin ylimääräisiä johtimia tiedonsiirtoväylissä. Tietoliikenneverkoissa ovat todennäköisempiä useamman bitin virheet ja niitä vastaan suojaudutaan tarkistussummilla ja tietoliikennepakettien uudelleenlähetyksillä. Lopuksi esittelimme järjestelmän sisäisten muistien toteutusteknologiat. Niissä kaikissa voidaan käyttää myös Hamming-koodia tiedon suojaamiseen.

Vastaa alla olevaan kyselyyn, kun olet valmis tämän luvun tehtävien kanssa.

<div><quiz id="a820d25a-85e2-4acc-b4c1-de3fd2b91a72"></quiz></div>
