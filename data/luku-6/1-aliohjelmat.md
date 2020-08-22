---
path: '/luku-6/1-aliohjelmat'
title: 'Aliohjelmat, parametrityypit, aktivaatiotietue (AT)'
---

<div>
<lead>Aliohjelmat ovat yleisin tapa toteuttaa uudelleenkäytettävää koodia. Aliohjelmien tarkkaa käyttäytymistä kussakin kutsutilanteessa säädellään parametreilla. Esittelemme tässä luvussa aliohjelmien toteutuksen ja käytön esimerkkikoneessa ttk-91.</lead>
</div>

## Aliohjelmat, funktiot, metodit
[Aliohjelma](https://fi.wikipedia.org/wiki/Aliohjelma) on koodia, jota voidaan _kutsumalla_ käyttää mistä tahansa ohjelmiston osasta. Aliohjelmista käytetään eri ohjelmointikielissä myös muita nimiä (proseduuri, funktio, metodi, rutiini), mutta periaate on kaikilla sama. Aliohjelman käyttäytymistä yhdessä kutsutilanteessa säädellään yleensä ainoastaan sen [parametrien](https://www.wikiwand.com/fi/Parametri_(tietotekniikka)) avulla, mutta useiden korkean tason kielten ohjelmissa myös aliohjelman suorituksen aikana voidaan viitata globaaleihin (kaikkialla käytössä oleviin) muuttujiin. Aliohjelmat voivat antaa _paluuarvon_, jolloin niitä voidaan kutsua yleisesti funktioiksi.

Oliokielissä aliohjelmasta käytetään usein nimeä _metodi_. Metodeilla voi olla paluuarvo tai sitten ei.

Aliohjelmille on tyypillistä, että niihin sisältyy oma suoritusympäristö. Suoritusympäristöllä tarkoitetaan sitä, että mitkä tunnukset ovat käytettävissä tietyn aliohjelman suorituksen aikana. Yleensä käytettävä korkean tason ohjelmointikieli määrittelee _tunnusten näkyvyysalueet_.

Esimerkiksi, C-kielessä jonkin aliohjelman suorituksen aikana voi viitata ainoastaan sen aliohjelman omiin tietorakenteisiin ja kaikkiin globaaleihin tietorakenteisiin. Jos pääohjelmasta on kutsuttu aliohjelmaa A, sieltä aliohjelmaa B ja sieltä aliohjelmaa C, niin C:n suorituksen aikana ei voi viitata aliohjelmien A tai B tietorakenteisiin. B:n suorituksen aikana ei voi viitata C:n tietorakenteisiin, eikä niitä ole edes olemassa ennen kuin kontrolli (suoritettavien käskyjen virta) on siirtynyt C:lle.

Jossain ohjelmointikielessä em. esimerkin tapauksessa aliohjelmaa C suoritettaessa myös B:n ja C:n tietorakenteet ovat viitattavissa, kun taas jossain toisessa kielessä tunnusten näkyvyysalueet määräytyvät sen mukaan, miten missä järjestyksessä aliohjelmat sijaitsevat alkuperäisessä koodissa. Emme käsittele näitä tapauksia enempää tällä kurssilla.

## Parametrien tyypit
Aliohjelmien parametreja on kolmen tyyppisiä: arvo-, viite- ja nimiparametrit. Näistä arvo- ja viiteparametrit ovat yleisiä ohjelmointikielissä, mutta nimiparametreja käytetään yleensä vain [komentokielissä](https://fi.wikipedia.org/wiki/Komentosarjakieli) (skriptikielissä).

_Arvoparametri_ tarkoittaa, että aliohjelmalle annetaan jonkin lausekkeen _arvon kopio_ parametrina. Lauseke voi olla mikä tahansa sopivan tyyppinen aritmeettis-looginen lauseke tai vaikkapa muuttujan arvo. Aliohjelman suorituksen aikana tällaisen parametrin arvoa voi muuttaa, mutta muutos koskee vain parametrina välitettyä lausekkeen (tai muuttujan) arvon kopioita, joten arvoparametrin kautta ei voida muuttaa mitään aliohjelman ulkopuolisia tietoja. Jos muuttuja X välitetään arvoparametrina, niin sen arvo on varmasti ennallaan aliohjelmasta palatessa.

_Viiteparametria_ käytettäessä parametrina välitetään jokin _tiedon osoite_. Se voi olla yksittäisen muuttujan osoite, tai rakenteisen tiedon osoite. Se voi olla myös koodin osoite, kuten esimerkiksi aliohjelman tai metodin osoite. Emme kuitenkaan käsittele tätä mahdollisuutta enää jatkossa. Kutsuva ohjelman osa (pääohjelma tai toinen aliohjelma) välittää hallussaan olevan tiedon osoitteen aliohjelmalle. Tämän osoitteen avulla aliohjelma voi lukea annettua tietoa, mutta se voi myös muuttaa sitä! Aliohjelman paluuarvon lisäksi se voi siis palauttaa arvoja kutsuvalle rutiinille viiteparametrien kautta. Tällaisissa parametreja kutsutaan myös _ulostuloparametreiksi_. Jos muuttuja X välitetään viiteparametrina, niin sen arvo voi siis olla muuttunut aliohjelmasta palatessa.

Toisena esimerkkinä viiteparametrin käytöstä on 16MB kuva, joka on ilmaistu 4096x4096 taulukkona Sue. Taulukon Sue osoite annetaan kuvan käsittelyrutiinille ColorMe, joka kirkastaa annetun kuvan värejä halutulla tavalla. Jos Sue haluttaisiin antaa arvoparametrina, niin se pitäisi kutsun yhteydessä kopioida ColorMe'lle ja kuvan käsittelyn lopuksi uusi kuva (funktion paluuarvona) pitäisi jälleen kopioida kutsuvalle rutiinille. On paljon helpompaa antaa ColorMe'n suoraan lukea ja muuttaa alkuperäistä viiteparametrina annettua kuvaa Sue. Toisaalta tässä on pieni riski, että muut parametrit on valittu huonosti ja ColorMe antaa Sue'lle liian punaiset posket. Sitä varten kuvankäsittelyjärjestelmät ottavat Sue'sta varmuuskopion ennen ColorMe-kutsua, jotta epäonnistunut värikäsittely voidaan tarvittaessa perua.

_Nimiparametri_ on aivan erilainen parametrityyppi. Kun arvoparametrillä välitetään tiedon arvo ja viiteparametrillä tiedon osoite, niin nimiparametrilla välitetään itse tieto merkkijonona. Tämä tarkoittaa sitä, että kutsuhetkellä aliohjelmassa käytetyn parametrin nimi (merkkijono) korvataan todellisen parametrilla (toinen merkkijono). Yleisesti ottaen symbolien (esim. parametrin nimi) käsittely tapahtuu ennen suoritusta, kun taas tiedon arvolla ja osoitteella on merkitys vain ovat ohjelman suoritusaikana.

Useimmat ohjelmointikielet eivät salli nimiparametreja, koska aliohjelman koodi pitäisi kääntää (tai tulkita) uudelleen aliohjelman kutsuhetkellä ja se on todettu liian hankalaksi.

[Skriptikielet](https://fi.wikipedia.org/wiki/Komentosarjakieli) ja [makrot](https://fi.wikipedia.org/wiki/Makro) sen sijaan käsitellään aina tulkitsemalla ja niissä nimiparametrit ovatkin yleisiä. Makrot ovat aliohjelman tapaisia usein toistuvan koodin määrittelyvälineitä, mutta ne laajennetaan koodiksi jo ennen varsinaista käännöstä. Makroilla ei ole omaa suoritusympäristöä, koska niitä ei ole olemassa enää suoritusaikana. Samasta syystä niiden parametreilla ei voi olla suoritusaikaisia ominaisuuksia kuten arvo tai osoite. Ainoaksi parametrityypiksi jää nimiparametri.

Makro Swap(i, j) on mielenkiintoinen esimerkki makroista ja nimiparametrien käytöstä.

```
macro Swap (i, j)  -- vaihda i:n ja j:n arvot keskenään
tmp = i;
i = j;
j = tmp;
```

Tämä näyttää ihan järkevältä ja sitä se onkin, kunhan vain parametrit on valittu sopivasti. Esimerkiksi makro Swap(x,y) laajenee koodiksi

```
tmp = x;
x = y;
y = tmp;
```

mikä on juuri se mitä varmaankin haluttiinkin. Jos taas haluttaisiin vaihtaa muuttujan k ja taulukon alkion T[k] arvot keskenään, niin makro Swap(k, T[k]) laajenee koodiksi

```
tmp = k;
k = T[k];
T[k] = tmp;
```

jolloin jälkimmäinen T[k] viittaa väärään paikkaan, koska k:n arvo on jo ehtinyt muuttua. Nimiparametrit ovat erilaisia!

Tällä kurssilla emme käsittele nimiparametreja tämän enempää, mutta on tärkeä olla tietoinen tästäkin parametrityypistä. Ttk-91:ssä on ainoastaan arvo- ja viiteparametreja.

## Aliohjelman toteutuksen osat
Aliohjelman toteutuksessa täytyy löytää ratkaisu seuraaviin osaongelmiin.

Aliohjelmille on ominaista, että niitä voidaan kutsua lähes mistä päin tahansa koodia ja että aliohjelman suorituksen jälkeen kontrolli palaa kutsukohdan jälkeiseen konekäskyyn. Tämän toteuttamiseksi joka kutsukerralla _paluuosoite_ täytyy tallettaa johonkin. Kaikkia aliohjelmia ei kuitenkaan voi kutsua ihan joka paikasta. Esimerkiksi olio-ohjelmoinnissa olion sisäisiä metodeja voi kutsua vain kyseisen olion muista (julkisista tai sisäisistä) metodeista, koska sisäisten metodien nimet eivät näy olion ulkopuolelle. 

Aliohjelmissa voi olla eri tyyppisiä parametreja ja ne täytyy välittää kutsuvalta rutiinilta aliohjelmalle. _Parametrien välityksen_ pitää tapahtua korkean tason kielen semantiikan mukaisesti. Käytännössä yleensä riittää toteuttaa arvo- ja viiteparametrien välitys oikein. Kutsuva rutiini antaa parametreille alkuarvon ja aliohjelma voi lukea (tai kirjoittaa) niitä. Viiteparametrien kautta aliohjelma pääsee myös lukemaan ja kirjoittamaan muita kutsuvan rutiinin tietoja.

Jos aliohjelma (funktio) palauttaa jonkin arvon, meillä täytyy olla tätä _paluuarvoa_ varten oma muistialue. Funktio kirjoittaa paluuarvon sinne ja kutsuva rutiini voi funktiosta paluun jälkeen lukea paluuarvon. Tilanne on hyvin samanlainen kuin arvoparametrin käsittely, mutta tätä tietoa funktio kirjoittaa ja kutsuva rutiini lukee.

Usein aliohjelmassa on omia _paikallisia tietorakenteita_, jotka ovat olemassa ja viitattavissa ainoastaan aliohjelman suorituksen aikana. Tällaiset tiedoille pitää dynaamisesti varata muistitilaa joka kutsukerran yhteydessä ja vapauttaa tila aliohjelmasta paluun yhteydessä. Tila ei voi olla staattinen, koska samasta aliohjelmasta voi olla yhtä aikaa usea instanssi (suorituskerta) meneillään. Esimerkiksi [rekursiivisessa aliohjelmassa](https://fi.wikipedia.org/wiki/Rekursio) kaikki aliohjelman omat tietorakenteet täytyy varata joka kutsukertaa varten erikseen. Yleensä ohjelmointikielen semantiikka vaatii, että aliohjelman (metodin) tietorakenteet eivät ole viitattavissa muutoin kuin aliohjelman omassa koodissa. Joissakin ohjelmointikielissä aliohjelman paikalliset tietorakenteet (tai osa niistä) talletetaan aliohjelman koodin yhteyteen staattiseen paikkaan. Tuollaisissa kielissä rekursiiviset aliohjelmakutsut eivät ole mahdollisia.

Aliohjelmilla ei saisi olla mitään sivuvaikutuksia. Rekistereiden tasolla tämä tarkoittaa sitä, että kaikkien rekistereiden arvojen täytyy aliohjelmasta paluun yhteydessä olla samat kuin mitä ne olivat kutsuhetkellä. Tämä toteutetaan siten, että aliohjelma _tallettaa_ kaikki käyttämänsä _rekistereiden arvot_ suorituksensa alussa ja _palauttaa arvot_ ennalleen kutsuvaan rutiiniin paluun yhteydessä. Jos esimerkiksi rekisterissä r4 oli muuntelumuuttujan i arvo ennen aliohjelman kutsua, on voitava luottaa siihen, että r4:n arvo on ennallaan aliohjelmasta paluun jälkeen. Kutsuva rutiini voisi tehdä rekistereiden talletuksen tallettamalla kaikki rekisterit ennen aliohjelman kutsua, mutta sen ei kannata tehdä sitä, sillä se ei tiedä mitä rekistereitä kutsuttu aliohjelma käyttää. Lisäksi jos aliohjelma käyttää rekursiota eli kutsuu "itseään", myös aliohjelman pitäisi tallettaa rekisterit ennen rekursiivista kutsua. Tämä on kömpelömpää kuin rekistereiden arvojen talletus aliohjelman suorituksen alussa ja ennalleenpalautus aliohjelmasta poistuttaessa.

## Aktivaatiotietue (AT)
Aliohjelmien toteutusmekanismi on aktivaatiotietue (AT, aktivointitietue), joka on suurehko tietorakenne. Eri ohjelmointikielillä AT voi olla vähän erilainen, mutta ne kaikki antavat jonkinlaisen ratkaisun edellä mainittuihin aliohjelmien toteutuksen osaongelmiin. AT talletetaan yleensä muistissa olevaan pinoon.

Myös ttk-91 järjestelmässä AT on talletettu pinoon. Se sisältää seuraavat tiedot, pienemmästä muistiosoitteesta isompaan (ks. alla oleva kuva ttk-91 funktion F aktivaatiotietueesta). Ensimmäisenä siellä on tila mahdollisille paluuarvoille (jos niitä tarvitaan) ja sitten kaikkien parametrien arvot. Arvoparametreistä talletetaan kokonaislukuarvo (koska ttk-91:ssä ei ole liukulukuja) ja viiteparametreistä muistiosoite (joka sekin on kokonaisluku). Seuraavaksi siellä on paluuosoite ja kutsukohdan hetkellä käytössä olleen AT:n osoite (eli vanha FP:n arvo). Tämän jälkeen siellä on tilanvaraukset kaikille aliohjelman paikallisille muuttujille ja muille tietorakenteille. Viimeisenä siellä on tässä aliohjelmassa käytettävien työrekistereiden (R0-R5) kutsuhetken arvot, jotta ne voidaan palauttaa ennalleen aliohjelmasta paluun yhteydessä.

<!-- kuva: ch-6-1-a-aktivaatiotietue    -->

![Ttk-91 aktivaatiotietue funktiolle F(x,y), F:ssä on paikalliset muuttujat i ja j. F käyttää työrekistereitä r1 ja r2. Kuvassa on pino, joka on kuvattu ylhäältä alaspäin kohti kasvavia muistiosoitteita. Pinossa on päällimmäisenä F:n aktivaatiotietue. Pinon pinnalle osoittaa pinorekisteri SP. Aktivaatiotietueessa on 9 sanaa. Ne ovat paluuarvo, parametrit x ja y, vanha PC ja vanha FP, paikalliset muuttujat i ja j, sekä rekistereiden r1 ja r2 vanhat arvot. Frame pointer FP osoittaa vanhaan FP arvoon. Parametrin y sijainti on FP-2. Paikallisen muuttuja i sijainti on FP+1.](./ch-6-1-a-aktivaatiotietue.svg)
<div>
<illustrations motive="ch-6-1-a-aktivaatiotietue"></illustrations>
</div>

Rekisteri FP (Frame Pointer) osoittaa tällä hetkellä käytössä olevaan AT:hen. Normaalisti monisanaiseen tietoon osoitetaan käyttämällä sen ensimmäisen sanan osoitetta koko rakenteen osoitteena. AT:n kohdalla sen osoite on kuitenkin keskellä tietuetta, osoittaen siihen sanaan, johon on talletettu aikaisemman FP:n arvo. "FP" on vain toinen nimi rekisterille r7, samalla tavalla kuin "SP" on toinen nimi rekisterille r6.

AT:n koko on vaihteleva, koska parametrien ja paikallisten muuttujien (ym. paikallisten tietorakenteiden) määrä vaihtelee. Joissakin ohjelmointikielissä myös kutsuvan rutiinin tietorakenteet voivat olla viitattavissa. Niihin pääsee helposti käsiksi, koska FP osoittaa suoraan aikaisemman FP:n arvoon ja kutsuvan rutiinin tietorakenteet ovat helposti sen kautta viitattavissa.

Parametrien lukumäärä voi vaihdella, mutta niiden suhteellinen sijainti AT:ssä on aina sama. Viimeinen parametri on osoitteessa FP-2, sitä edellinen osoitteessa FP-3, jne. Funktion paluuarvon sijainti on juuri ennen parametreja. Funktion F AT:ssä paluuarvo on osoitteessa FP-4, parametri x on osoitteessa FP-3 ja parametri y on osoitteessa FP-2. Emme tiedä parametrien täsmällisiä muistiosoitteita, mutta niihin pystyy viittaamaan käyttämällä näitä FP-suhteellisia osoitteita. Sitä paitsi eri kutsukerroilla AT:n ja siten myös parametrien sijainti muistissa yleensä vaihtelee.

Paikalliset muuttujat sijaitsevat nekin suhteellisesti aina samassa kohtaa AT:tä, heti FP:n vanhan arvon jälkeen. Esimerkiksi funktiossa F paikallisten muuttujien i ja j osoitteet ovat FP+1 ja FP+2. Emme tiedä täsmällisiä muistiosoitteita myöskään paikallisille tietorakenteille, mutta niihinkin pystyy viittaamaan käyttämällä näitä FP-suhteellisia osoitteita.

```
load r1, -2(fp)  ; lataa rekisteriin r1 viimeisen parametrin arvo
load r2, +2(fp)  ; lataa rekisteriin r2 toisen paikallisen muuttujan arvo
```

Viimeisenä aktivaatiotietueessa on sen käyttämien työrekistereiden vanhat arvot. Funktio F käyttää laskennassa rekistereitä r1 ja r2, joten niiden arvot on talletettu aktivaatiotietueen loppuun. Niihin voisi viitata FP kautta käyttäen suhteellisia osoitteita, mutta yleensä niihin viitataan pinorekisterin SP kautta, koska ne sijaitsevat sopivasti pinon pinnalla.

## Aktivaatiotietuepino
Aktivaatiotietueet varataan ja vapautetaan dynaamisesti suoritusaikana pinosta sitä mukaa, kun aliohjelmia kutsutaan ja niistä palataan. Alla olevassa esimerkissä on tilanne, jossa pääohjelmasta on kutsuttu aliohjelmaa sum, joka puolestaan on kutsunut funktiota funcA. FP osoittaa funcA:n AT:hen. SP osoittaa pinon pinnalle, jossa on nyt funcA:n aktivaatiotietueen viimeinen alkio. Funktion funcA suorituksenaikana sen kutsuun johtaneet aktivaatiotietueet muodostavat _aktivaatiotietuepinon_, joka antaa suorituksessa olevalle ohjelmalle sen hetkisen täydellisen suoritusympäristön. Aktivaatiotietuepino kasvaa yhdellä AT:llä joka aliohjelman kutsukerralla ja vastaavasti pienenee aliohjelmasta palatessa.

<!-- kuva: ch-6-1-b-at-pino  -->

![Aktivaatiotietuepino tilanteessa, jossa pääohjelma on kutsunut ohjelmaa sum, joka on kutsunut funktiota funcA. Pinossa on kolme aktivaatiotietuetta (AT). Alimpana pinossa (kuvassa ylimpänä, koska muistisoitteet kasvavat alaspäin) on pääohjelman AT, sen päällä aliohjelman sum AT, ja ylimpänä funtion funcA AT. SP osoittaa funcA:n AT:n päällimmäiseen alkioon ja FP osoittaa funcA:n AT:hen. FP:n osoittamasta paikasta (funcA:n AT:ssä) on linkki aliohjelman sum AT:hen, josta on linkki pääohjelman AT:hen.](./ch-6-1-b-at-pino.svg)
<div>
<illustrations motive="ch-6-1-b-at-pino"></illustrations>
</div>

Aktivaatiotietue sijaitsee pinossa, joka sijaitsee muistissa. AT:tä rakennetaan ja puretaan tavallisilla konekäskyillä, mutta usein käytetään erityisesti pinon käsittelyyn suunniteltuja konekäskyjä. Joka tapauksessa muistiin viitataan pinorekisterin SP kautta.

Konekäsky push tallettaa pinon pinnalle yhden sanan. Konekäsky pop poistaa sieltä yhden sanan ja tallettaa sen aina rekisteriin.

```
push   sp, X   ; sp=sp+1, talleta X:n arvo sp:n osoittamaan muistipaikkaan
pop    sp, r4  ; kopion sp:n osoittama sana r4:een, sp=sp-1
```

Jos pinosta halutaan poistaa alkioita laittamatta niitä mihinkään, sen voi tehdä vähentämällä SP:n arvoa vastaavasti. Todellisuudessahan myöskään pop-käskyn yhteydessä ei oikeasti poisteta mitään pinosta, vaan ainoastaan kopioidaan sen päällimmäinen arvo johonkin ja vähennetään SP:n arvoa yhdellä.

```
sub sp, =1  ; poista pinon päällimmäinen alkio
sub sp, =5  ; poista pinon 5 päällimmäistä alkiota
```

Pinoa voitaisiin käyttää aliohjelmien toteutuksen lisäksi myös laskennan välitulosten tallentamiseen, jolloin push- ja pop-käskyjä käytettäisiin välitulosten kopiointiin pinon ja muiden tietorakenteiden välillä. Tällaisen laskennan yhteydessä ohjelmassa voitaisiin ottaa käyttöön useita pinoja, jolloin push- ja pop-käskyissä voisi käyttää pinorekisterinä myös muita rekistereitä kuin r6:sta. Tällä kurssilla emme kuitenkaan tee näin ja pinoa käytetään ainoastaan aliohjelmien toteutusvälineenä. Viittaamme pinoon aina pinorekisterin SP (Stack Pointer, r6) kautta.

Rekistereiden talletuksen ja arvojen palautuksen voi hyvin tehdä push- ja pop-käskyillä. Ttk-91:ssä on tätä tarkoitusta varten myös erikoiskäskyt pushr ja popr, jotka yhdellä konekäskyllä tallettavat kaikkien työrekistereiden r0-r5 arvot pinoon tai palauttavat niiden arvot pinosta. Toisaalta, jos aliohjelma käyttää vain yhtä tai kahta työrekisteriä, niin voi olla turhaa tallettaa ja palauttaa kaikkien työrekistereiden arvoja.

```
pushr   sp  ; kopio r0-r5 arvot pinoon, sp=sp+6
popr    sp  ; palauta r0-r5 arvot pinosta, sp=sp-6
```

Todellisissa tietokoneissa on myös muita optimointimenetelmiä, joiden avulla nopeutetaan aliohjelmien käyttöä. Esimerkiksi osa aktivointitietueesta voidaan toteuttaa nopeissa erikoisrekistereissä. Nämä menetelmät eivät kuitenkaan sisälly tämän kurssin oppimistavoitteisiin.

Aliohjelman kutsukäsky call suorittaa varsinaisen kontrollin siirron aliohjelmaan. Se tallettaa samassa yhteydessä paluuosoitteen ja vanhan FP-arvon pinoon. Kontrollin siirron lisäksi call-käsky asettaa FP:lle uuden arvon, joka sitten osoittaa kutsutun aliohjelman AT:hen. Call-käskyn suorittamisen jälkeen suoritetaan aliohjelman käskyjä. 

```
call  sp, funcA ; talleta PC ja FP pinoon, aseta PC=funcA ja FP=SP
```

Aliohjelmasta paluukäsky palauttaa kontrollin kutsukohtaan ja samalla palauttaa FP:n ennalleen. Sen lisäksi se poistaa pinosta kutsussa käytetyt parametrit. Exit-käskyn jälkeen suoritetaan jälleen kutsuvan rutiinin konekäskyjä.

```
exit sp, =2 ; aseta SP=SP-2, PC = vanha PC, FP = vanha FP
```

Suorittimella on yleensä call- ja exit-käskyjen lisäksi käyttöjärjestelmäpalvelujen kutsu- ja paluukäskyt svc ja iret (tms.). Ne toimivat muutoin vastaavalla tavalla, mutta niiden yhteydessä myös suorittimen suoritustila voi vaihtua ja parametrien välitysmenetelmä voi olla erilainen. Käsittelemme käyttöjärjestelmäpalveluiden käyttöä lisää tämän luvun lopussa.

Seuraavassa osiossa näytämme tarkemmin, kuinka näiden käskyjen avulla aktivaatiotietueet täsmällisesti rakennetaan ja puretaan. Se vaatii tarkan protokollan seuraamista sekä kutsuvan rutiinin että aliohjelman osalta.

<!-- quiz 6.1.? -->

<div><quiz id="69f04e22-436d-479b-aa72-362c87170dea"></quiz></div>
<div><quiz id="52f742b0-34ce-4520-8c80-2a6d22555fe9"></quiz></div>
