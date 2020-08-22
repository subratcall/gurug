---
path: '/luku-8/1-muistihierarkia'
title: 'Muistihierarkia ja virtuaalimuisti'
hidden: false
---

<div>
<lead>Tässä aliluvussa kertaamme ensin muistihierarkian käsitteen. Useat järjestelmän laitteisto- ja ohjelmistoratkaisut ovat ratkaisuja muistihierarkiasta. Esittelemme sitten keskusmuistin ja levymuistin suuria koko- ja nopeuseroja tasoittavan virtuaalimuistin perustoiminnon.</lead>
</div>

## Muistihierarkia
Tietoa talletetaan tietokonejärjestelmiin hyvin monella eri tasolla. Lähtökohta eri tasojen käytölle on periaate, että pienempi muisti on nopeampaa ja suurempi muisti on halvempi toteuttaa. Tämä on johtanut muistihierarkiaan, jonka olennaisia osia illustroitiin Juustokakkuesimerkillä (ks. luku 1).


<!-- kuva: ch-1-3-muistihierarkia    -->

![Kolme sisäkkäistä aluetta. Sisimpänä on laitteisto, jossa on rekisterit, muisti ja niiden välissä välimuistit. Nuoli menee muistista välimuistien läpi rekistereihin. Keskellä on järjestelmätaso, jolla on laitteisto, massamuisti ja niiden välissä käyttöjärjestelmän ylläpitämä virtuaalimuisti ja levyvälimuisti. Nuoli menee massamuistista virtuaalimuistin ja levyvälimuistin läpi muistiin. Uloin alue on internet, jossa on tämä järjestelmän, pilvipalvelu/www ja niiden välissä välityspalvelin eli proxy. Nuoli pilvipalvelusta proxyn kautta massamuistiin. Laitteiston nopeus on ns-luokkaa, järjestelmän massamuistin nopeus ms-luokkaa. Pilvipalveluiden ja muun internetin nopeus on sekuntien luokkaa.](./ch-1-3-muistihierarkia.svg)
<div>
<illustrations motive="ch-1-3-muistihierarkia" frombottom="0" totalheight="100%"></illustrations>
</div>

Muistihierarkiassa on kolme selkeää tasoa. Sisimpänä ovat suorittimen kanssa samalla piirikortilla toteutetut muistit, keskimmäisellä tasolla yhdessä järjestelmässä (samassa kotelossa?) olevat nopeahkot muistit. Uloimpana verkossa olevat tai samassa järjestelmässä olevat hyvin hitaat laitteet. 

Kaikkien sisimpänä samalla mikropiirillä suorittimen laiterekistereiden kanssa ovat nopeimmat välimuistit. Esimerkiksi, nopeimmat tason L1 ja L2 välimuistit voivat olla toteutettuna samalla mikropiirillä suorittimen kanssa, mutta vähän hitaammat tason L3 ja L4 välimuistit voivat sijaita omilla mikropiireillään välittömästi suorittimen vieressä.

Keskusmuisti sijaitsee samalla piirikortilla ([emolevyllä](https://fi.wikipedia.org/wiki/Emolevy)) suorittimen kanssa ja on yhteydessä siihen väylän kautta. Keskusmuistin käyttö on huomattavasti (esim. 50x) hitaampaa kuin rekistereiden, mutta keskusmuisti on kooltaan huomattavasti suurempi (esim. 1 GB) kuin rekisterijoukko (esim. 0.5 MB). Välimuistiteknologian avulla keskusmuisti saadaan tuntumaan lähes yhtä nopealta kuin rekisterit.

Massamuistilaitteet (esim. kovalevy, SSD-levy, CD-levy, DVD-levy, Blu-ray-levy, USB-muistitikku) sijaitsevat samassa järjestelmässä ja niitä voi käyttää järjestelmän väylähierarkian kautta. Eri nopeuksiset väylät muodostavat hierarkian ja kullekin laitetyypille on sille sopivan nopeuksinen väylä. Hitaammat väylät liitetään erityisen sovittimen kautta nopeampiin, jotta ne eivät hidastaisi nopeampien väylien toimintaa. Massamuistit toimivat ms-aikaskaalassa eli ne ovat suuruusluokkaa 10<sup>6</sup> hitaampia kuin suoritin.

<!-- Kuva: ch-1-1-vaylahierarkia -->

![Nopein väylä on sisäinen väylä suorittimen ja välimuistin välillä. Seuraavaksi nopein muistiväylä yhdistää välimuistin muistiin. Muistiväylässä on myös sovitin vähän hitaammalle PCI-väylälle, jossa on kiinni kovalevy. PCI-väylässä on myös sovitin vielä hitaammalle USB-väylälle, jossa on kiinni USB-muistitikku ja näppäimistö.](./ch-1-1-vaylahierarkia.svg)
<div>
<illustrations motive="ch-1-1-vaylahierarkia" frombottom="0" totalheight="40%"></illustrations>
</div>

Uusi flash-teknologiaan perustuva [SSD](https://fi.wikipedia.org/wiki/SSD) (Solid State Disk) -massamuisti on usein vielä toteutettu kovalevyn lailla ulkoisena massamuistina, mutta se voi sijaita myös valmiiksi asennettuna emolevyllä. SSD-massamuisti on yleensä toteutettu niin, että se näyttää samalta kuin pyörivä kovalevy, vaikka onkin selvästi nopeampi (esim. 10x). Samasta teknologiasta on myös nopeampi versio, [NVMe](https://en.wikipedia.org/wiki/NVM_Express) (NVM Express, Non-Volatile Memory). SSD:ssä (ja NVMe:ssä) on nopeuden lisäksi suurena etuna kovalevyyn verrattuna se, että siinä ei ole helposti vikaantuvia liikkuvia osia.

Ihmisen kanssa kommunikointiin tarkoitetut laitteet (esim. näppäimistö tai hiiri) kuuluvat myös järjestelmän "sisäisiin" laitteisiin, mutta ne ovat yleensä vielä monta kertaluokkaa hitaampia kuin massamuistit. Yleensä ihminen toimii sekunnin aikaskaalassa, mutta joiden graafisten käyttöliittymien kautta toiminta voi olla huomattavasti nopeampaa. 

Järjestelmän ulkopuoliset muistit toimivat nekin sekunnin aikaskaalassa, koska tiedon siirtoon verkon läpi kuluu niin paljon aikaa. Tällaisia muistijärjestelmiä ovat organisaatioiden omat levypalvelimet ja erilaiset internetin pilvipalvelimet. Teoriassa tiedon hakeminen maapallon toiselta puolelta kestää tietenkin aika kauan aikaa, mutta käytännössä tieto haetaan useimmiten lähempänä olevasta www-välimuistista.

Jotkut järjestelmän laitteet (esim. magneettinauha) ovat yhtä hitaita kuin järjestelmän ulkopuoliset muistit ja niitä käsitellään myös samalla tavalla. Jako järjestelmän sisäisiin ja ulkoisiin laitteisiin on keinotekoinen - parempi tapa olisi luokitella laitteita niiden sijainnin mukaan väylähierarkiassa.

## Virtuaalimuisti
Käytännössä ohjelman suorituksen aikana tiedot tulee säilyttää joko keskusmuistissa tai massamuistissa. Massamuisti on voi olla tuhat kertaa niin suuri kuin keskusmuisti, kun taas keskusmuisti voi olla miljoona kertaa niin nopea kuin massamuisti. Käyttöjärjestelmän [virtuaalimuistiteknologia](https://fi.wikipedia.org/wiki/N%C3%A4enn%C3%A4ismuisti) antaa ohjelman käyttöön näennäisen muistialueen, joka on lähes yhtä nopea kuin keskusmuisti, mutta yhtä suuri kuin massamuisti.

Virtuaalimuisti on toteutettu kaikissa nykyisissä yleiskäyttöisissä käyttöjärjestelmissä (esim. Windows, Linux ja MacOS). Ratkaisu on kaksitasoinen. Kaikki ohjelman tiedot pidetään massamuistissa (virtuaalimuistin _tukimuistissa_) ja vain kulloinkin tarvittavat muistialueet pidetään keskusmuistissa. Tietoja kopioidaan aina tarvittaessa keskusmuistin ja tukimuistin välillä sillä tavoin, että lähes aina viitatut muistialueet löytyvät keskusmuistista. Ei tietenkään ole mitenkään yksinkertaista ennustaa etukäteen, mitä muistialueita kukin ohjelma tarvitsee keskusmuistiin lähitulevaisuudessa.

Jos ohjelma suoritusaikana viittaa muistipaikkaan, joka ei ole keskusmuistissa, tapahtuu _sivunpuutoskeskeytys_. Se on yksi etukäteen määritellyistä keskeytystyypeistä. Sivunpuutoskeskeytyksen yhteydessä sen aiheuttanut prosessi siirretään odotustilaan ja viitattu muistialue (ja sen lähialueita) kopioidaan tukimuistista keskusmuistiin, minkä jälkeen kyseinen prosessi pääsee takaisin suoritukseen. Tällöin se suorittaa saman konekäskyn uudelleen, mutta tällä kertaa viitattu tieto löytyy keskusmuistista. Tähän kaikkeen kuluu suhteellisesti ottaen hyvin paljon aikaa, mutta toivottavasti sivunpuutoskeskeytyksiä ei tapahdu kovin usein.

Jokaisen muistiviitteen kohdalla täytyy siis tarkistaa, onko viitattu muistialue keskusmuistissa ja missä siellä se mahdollisesti sijaitsee. Tällaista osoitteenmuunnosta ei voi tehdä yleensä ohjelmallisesti (usealla konekäskyllä), koska se hidastaisi suoritusta liikaa. Osoitteenmuunnosten tekemiseen nopeasti suorittimella (sen [MMU](https://en.wikipedia.org/wiki/Memory_management_unit):ssa) on oma erityislaitteistonsa, [TLB](https://en.wikipedia.org/wiki/Translation_lookaside_buffer) (Translation Lookaside Buffer), joka toimii välimuistin tavoin. Useimmiten osoitteenmuunnos löytyy TLB:stä, mikä tekee virtuaalimuistijärjestelmien toiminnan mahdolliseksi. _TLB-hudin_ yhteydessä osoitteenmuunnos täytyy tehdä tavallisilla konekäskyillä muistissa olevia osoitteenmuunnostaulukoita (_sivutaulu_ tai _segmenttitaulu_) käyttäen. Samalla tietenkin kopioidaan tehty osoitteenmuunnos TLB:hen. 

Virtuaalimuistin toteutuksessa on muutamia eri tapoja. Yleensä tukimuistista kopioidaan vakiokokoisia muistilohkoja (_sivuja_) kerrallaan ja muistilohkojen koko (sivun koko) sopii hyvin yhteen käytössä olevan tukimuistin toteutukseen. Toinen vaihtoehto on tehdä kerralla kopioitavista muistilohkoista vaihtelevan kokoisia _segmenttejä_, jolloin ne taas sopivat paremmin yhteen prosessien hallinnoimien eri kokoisten muistialueiden (esim. _koodisegmentti_, _datasegmentti_ tai _pino_) kanssa. Osoitteenmuunnos voidaan toteuttaa monitasoisena, jolloin siinä voi olla sekaisin _segmentointia_ ja _sivutusta_. Lisäksi osoitteenmuutokseen voi liittyä aikaisemmin esitetty kanta- ja rajarekistereiden käyttö.

Virtuaalimuistin toteutukseen liittyy huomattava määrä käyttöjärjestelmän ohjelmistoa, mutta emme käsittele sitä tällä kurssilla tämän enempää. Virtuaalimuistijärjestelmän toiminta esitellään tarkemmin yliopiston käyttöjärjestelmäkurssilla.




## Quizit 8.1
<!-- Quiz 8.1.?? -->
<div><quiz id="a49e7f40-8317-4500-8162-d99c53124eb2"></quiz></div>
<div><quiz id="4790b5a0-6b2e-4a19-8270-4374a3cc75f7"></quiz></div>
