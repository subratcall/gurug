---
path: '/luku-10/3-java-ohjelmien-suoritustavat'
title: 'Java-ohjelmien suoritustavat'
hidden: false
---

<div>
<lead>Tässä aliluvussa (10.3) esittellään neljä erilaista tapaa toteuttaa Java virtuaalikone (JVM). 
</lead>
</div>

## Java-tulkki
Helpoin tapa suorittaa Java-ohjelmia on rakentaa Java-tulkki, joka emuloi JVM:n toimintaa omien tietorakenteidensa avulla. Java-tulkissa on emuloitu JVM:n rekisterit SP, LV, CPP ja PC. Samoin siellä on suuret taulukot, joiden avulla emuloidaan JVM:n kekoa, pinoja, vakioaltaita ja metodialuetta. 

<!-- Kuva: ch-10-3-suoritus-tulkki -->

![Java-ohjelmien suoritus tulkitsemalla. Keskellä vaakasuora viiva kuvaamassa Java virtuaalikonetta. Viivan yläpuolella on ylhäällä Java-ohjelma, jossa koodinpätkä  k=i+j. Sen alla on sama ohjelma tavukoodiksi käännettynä, sisältäen tavukoodin käskyt iload i, iload j, iadd ja istore k. Viivan alapuolella on Java-tulkki, johon lukee datana tavukoodista ohjelmaa ja joka suorittaa natiiviympäristön Intel Pentium II suorittimella.](./ch-10-3-suoritus-tulkki.svg)
<div>
<illustrations motive="ch-10-3-suoritus-tulkki" frombottom="0" totalheight="40%"></illustrations>
</div>

Java tulkki alustaa ensin JVM:n. Tavukoodin suoritus on yksinkertaista, koska JVM:ssä on tarkalleen määritelty jokaisen tavukoodisen käskyn toiminnot. Tulkki muokkaa emuloituja JVM:n rakenteita yksi tavukoodin käsky kerrallaan. 

Tämä on hyvin joustava tapa suorittaa tavukoodia. Jos koodissa tapahtuu viittaus johonkin muuhun Java-luokkaan, siirrytään suorittamaan sen tavukoodia. Tarvittaessa se voidaan ladata tässä vaiheessa levyltä tai jopa verkosta, koska tavukoodiset tiedostot ovat tavallista dataa tulkille. 

Heikkoutena tässä suoritustavassa on suorituksen hitaus. Koska tavukoodin käskyjä suoritetaan vain yksi kerrallaan, normaalin suorittimen erilaisia suoritusnopeuden optimointimenetelmiä on vaikea käyttää. Toisena heikkoutena on jo aikaisemmin mainittu pinokoneen emuloinnin vaikeus rekisterikoneella, koska lähes kaikki viiteeet kohdistuvat muistissa oleviin tietorakenteisiin. Tottakai tulkki voi säilyttää JVM:n rekistereitä SP, LV, CPP ja PC omissa rekistereissään, mutta se ei paljoa auta.

Java-tulkki on siis hyvin samanlainen kuin ttk-91 tietokoneen tulkki Titokone-ohjelmassa. Titokone lukee datana ttk-91 koneen konekieltä yksi konekäsky kerrallaan ja tekee sen aiheuttamat muutokset emuloituihin ttk-91 rekistereihin ja muistiin. Ttk-91 suorittimen rekisterit ja muisti ovat tavallisia tietorakenteita Titokoneessa.

## Kääntäminen natiivikoneelle
Java-ohjelma voidaan kääntää ja linkittää natiivikoneelle kuten edellisessä luvussa esitettiin. Tämä tarkoittaa, että Java-ohjelmasta tehdään tavallinen käyttöjärjestelmän tunnistama prosessi, joka suorittaa järjestelmän suorittimen konekielistä koodia.

<!-- Kuva: ch-10-3-suoritus-kaannos -->

![Java-ohjelmien suoritus kääntämällä ja linkittämällä. Keskellä vaakasuora viiva kuvaamassa Java virtuaalikonetta. Viivan yläpuolella on ylhäällä Java-ohjelma, jossa koodinpätkä  k=i+j. Sen alla on sama ohjelma tavukoodiksi käännettynä, sisältäen tavukoodin käskyt iload i, iload j, iadd ja istore k. Viivan alapuolella on kaksi tapaa tehdä käännös ja linkitys natiiviympäristön Pentium II suorittimelle. Vasemmalla puolella on normaalikäännös tavukoodista objekstimoduulikis, joka sitten linkitetään latausmoduuliksi. Oikealla on on ensin käännös vastaavaksi C-kielen koodiksi, jossa on lauseet \*(++SP) = \*(LV+i); \*(++SP) = \*(LV+j); tmp= \*(SP) + \*(--SP); \*(SP) = tmp; \*(LV+k) = \*(SP--); C-kielinen koodi käännetään normaalisti ja linkitetään latausmoduuksi.](./ch-10-3-suoritus-kaannos.svg)
<div>
<illustrations motive="ch-10-3-suoritus-kaannos" frombottom="0" totalheight="40%"></illustrations>
</div>

Kääntäminen järjestelmän omalle konekielelle tehdään tavukoodisesta esitysmuodosta eikä Java-koodista, kuten normaalikäännöksessä tehtäisiin. Edellisen luvun terminologian mukaisesti kääntämisessä suoritetaan nyt ainoastaan kääntäjän _back end_. Etuna konekielelle kääntämisestä on ohjelman suorituksen nopeus, koska kääntäjä voi tehokkaasti optimoida koodin juuri tämän natiiviympäristön suorittimelle. 

Käännöksen natiivikoneen konekielelle voi tehdä myös "kiertotietä" hyödyntäen C-kielen (tai C++ kielen) kääntäjää. Näin tehdään sen vuoksi, että todella hyvin optimoidun koodin tekeminen on vaikeata ja kuitenkin liki jokaisesta käyttöjärjestelmästä löytyy hyvin optimoitua koodia tuottava C-kielen kääntäjä jo valmiina eri suorittimille. Tässä tapauksessa tavukoodi käännetään ensin C-kielelle, mikä on suhteellisen helppoa. C-kielinen esitysmuoto annetaan sitten C-kääntäjälle, joka tuottaa hyvin optimoitua koodia halutulle suorittimelle.

Huonona puolena natiivikoneelle kääntämisestä on joustamattomuus, koska koko ohjelma täytyy kokonaisuudessaan kääntää ja linkittää valmiiksi latausmoduuliksi. Dynaamista linkitystä ei voi käyttää. 

Yleensä Java-ohjelmia ei suoriteta tällä tavoin. 

## Just-In-Time (JIT) kääntäminen
Yleisin tapa suorittaa Java-ohjelmia on [Just-In-Time (JIT) kääntäminen](https://en.wikipedia.org/wiki/Just-in-time_compilation). Se on sekamuoto tulkitsemisesta, kääntämisestä ja dynaamisesta linkittämisestä. 

Ohjelman suoritus alkaa tulkitsemalla tavukoodista pääohjelmaa. Kun ohjelma suoritusaikana kutsuu uutta (Java) luokkaa, niin suoritus pysähtyy, kunnes tämä uusi luokka on käännetty natiivikoodiksi ja linkitetty paikalleen tulkin yhteyteen. Tämä voi viedä paljonkin aikaa ja muistitilaa, koska JIT-kääntäjää ja dynaamista linkittäjää pitää suorittaa aika ajoin.

Käännös ja linkitys tehdään yleensä heti luokan ensimmäisen metodin (aliohjelman) kutsun yhteydessä, mutta sen voi tehdä myöhemminkin. Jos esimerkiksi ison luokan pientä metodia kutsutaan vain kerran, niin voisi olla nopeampaa tulkita se tavukoodina. Tällaisessa tapauksessa suoritusnopeutta voi optimoida tekemällä JIT-käännös esimerkiksi vasta saman metodin toisen (tai kolmannen) kutsukerran yhteydessä. Laskentaa kontrolloivan tulkin pitää joka tapauksessa päättää, milloin tavukoodina esitetty luokka kannattaa kääntää järjestelmän konekielelle.

Hyvin optimoidun koodin tuottaminen JIT-käännöksen yhteydessä keskeyttää ohjelman suorituksen vielä pidemmäksi aikaa. Tämän vuoksi kirjastomoduulit on hyvä olla suoraan käytettävissä natiivikoodisina objektimoduuleina, jolloin suorituksen jatkumiseksi riittää linkittää ne dynaamisesti paikalleen. Kirjastomoduulit on voitu myös kirjoittaa jollakin toisella ohjelmointikielellä (esim. C:llä tai C++:lla), jolloin niiden koodin optimointi on ollut ehkä helpompi toteuttaa.

Kokonaisrakenne on monimutkainen, koska Java-tulkin käyttämien JVM-tietorakenteiden (rekisterit, muistialueet) täytyy olla myös käännettyjen natiivikoodimoduulien käytettävissä.

<!-- Kuva: ch-10-3-suoritus-jit -->

![Java-ohjelmien suoritus JIT-kääntämällä ja dynaamisesti linkittämällä. Keskellä vaakasuora viiva kuvaamassa Java virtuaalikonetta. Viivan yläpuolella on ylhäällä Java-ohjelma, jossa koodinpätkä  k=i+j. Sen alla on sama ohjelma tavukoodiksi käännettynä, sisältäen tavukoodin käskyt iload i, iload j, iadd ja istore k. Viivan alapuolella on iso laatikko, jossa on toisiinsa sidoksissa olevat prosessit Java-tulkki, JIT-kääntäjä, dynaaminen linkittäjä ja suoritettavan ohjelman latausmoduuli. Ne kaikki suorittavat natiiviympäristön Pentium II suorittimella.](./ch-10-3-suoritus-jit.svg)
<div>
<illustrations motive="ch-10-3-suoritus-jit" frombottom="0" totalheight="40%"></illustrations>
</div>


## Java-suoritin
On myös mahdollista toteuttaa JVM ihan oikeana suorittimena. Tämä tarkoittaa sitä, että JVM:n tietorakenteet (esimerkiksi rekisterit SP, LV, jne) on pääosin toteutettu laitteistolla ja että suoritin ymmärtää tavukoodin käskyt tavallisina konekäskyinä. Sun Microsystems'in [picoJava](https://en.wikipedia.org/wiki/PicoJava) on määrittely tällaiselle suoritinarkkitehtuurille. PicoJava suoritinmäärittely on tehty pienille laitteille, joissa kaikki ohjelmat ovat tavukoodia ja joiden järjestelmissä ei tarvita Java-tulkkia, JIT-kääntäjää tai dynaamista linkittäjää.

<!-- Kuva: ch-10-3-suoritus-natiivi -->

![Java-ohjelmien suoritus natiivisuorittimella. Keskellä vaakasuora viiva kuvaamassa Java virtuaalikonetta. Viivan yläpuolella on ylhäällä Java-ohjelma, jossa koodinpätkä  k=i+j. Sen alla on sama ohjelma tavukoodiksi käännettynä, sisältäen tavukoodin käskyt iload i, iload j, iadd ja istore k. Tämän alla on sama ohjelma, mutta nyt latausmoduuliksi muutettuna. Viivan alapuolella on Java-suoritin, jolle latausmoduulin koodi luetaan koodina. Natiiviympäristön suoritin on jokin Java-suoritin.](./ch-10-3-suoritus-natiivi.svg)
<div>
<illustrations motive="ch-10-3-suoritus-natiivi" frombottom="0" totalheight="40%"></illustrations>
</div>

PicoJava suorittimessa välimuisti ja liukulukuaritmetiikka ovat valinnaisina osina, jotka toteutetaan ainostaan, jos niille on oikeasti tarvetta. Esimerkiksi pienet [IoT](https://en.wikipedia.org/wiki/Internet_of_Things)-laitteet (Internet of Things, [esineiden Internet](https://fi.wikipedia.org/wiki/Esineiden_internet) laitteet) voivat hyvinkin olla sellaisia, että niissä ei ole tarvetta välimuistille ja/tai liukuluvuille.

Kaikki tavukoodin 226 käskyä tunnistetaan konekäskyinä, mutta (harvemmin käytettävä tai ei nyt laitteistolla toteutettu) osa niistä voidaan toteuttaa keskeytysmekanismin kautta muiden käskyjen avulla keskeytyskäsittelijässä. Jos esimerkiksi suorittimessa ei ole toteutettu piirejä liukulukukäskyille, niin käskyn _fadd_ suoritus aiheuttaa keskeytyksen (epäkelpo operaatiokoodi). Keskeytyskäsittelijä huomaa operaatiokoodin 62 (_fadd_) ja toteuttaa kokonaislukuaritmetiikan avulla (hyvin monella kokonaislukukäskyllä konekäskyllä) kyseisen liukulukuyhteenlaskuoperaation. Samaa menettelyä käytetään useiden nykyaikaisten suorittimien yhteydessä, koska sillä tavalla saadaan helposti käyttöön suurempi käskykanta kuin nykyisessä suoritinversiossa on toteutettu.

JVM:n käskykanta ei kuitenkaan ole kovin hyvä tehokkaan käyttöjärjestelmän toteuttamiseksi. Tämän vuoksi picoJavassa on lisäksi mukana 115 "tavallisen" rekisteriarkkitehtuurin konekäskyä ja niitä vastaavat rekisterit. Myös muiden ohjelmointikielten toteutus voi hyödyntää näitä lisäkäskyjä tai sitten niillä kirjoitetut ohjelman osat voi kääntää tavukoodiksi. Erityisesti näitä ylimääräisiä käskyjä käytetään C ja/tai C++ kielillä kirjoitetun käyttöjärjestelmän tehokkaaseen toteutukseen. 

JVM-koodin suorituksen hitaus aiheutuu huomattavassa määrin siitä, että kaikki dataviitteet kohdistuvat pinoon. PicoJavassa (versiossa II) tätä ongelmaa on ratkaistu toteuttamalla pinon huippu 64 laiterekisterin avulla. Käytännössä siis useimmat pinoon kohdistuvat viitteet voidaan totuttaa hyvin nopeasti näiden (nimeämättömien) rekistereiden avulla.

PicoJavassa (version II) on määritelty yhteensä 25 kappaletta 32-bittistä rekisteriä. Rekisterit ovat 

    PC, LV, CPP, SP (pino kasvaa alaspäin) 
    OPLIM on alaraja SP:lle; alitus aiheuttaa keskeytyksen
    FRAME osoittaa metodin paluuosoitteeseen
    PSW on tilarekisteri
    rekisteri, joka kertoo pinon välimuistirekistereiden tämänhetkisen käytön
    4 rekisteriä keskeytysten ja break-point’ien käsittelyyn
    4 rekisteriä säikeiden hallintaan
    4 rekisteriä C ja C++ ohjelmien toteutukseen 
    2 rajarekisteriä sallitun muistialueen rajoittamiseen
    suorittimen version numero rekisteri ja konfiguraatiorekisteri
  
Noissa 115 lisäkäskyissä on käskyt mm. ylimääräisten rekistereiden lukemiseen ja kirjoittamiseen. Myös osoittimia (pointtereita) varten on omat käskynsä, ja niiden avulla voidaan helposti lukea tai kirjoittaa ihan mitä tahansa muistialuetta C/C++ kielien tapaan. Samoin C/C++ kielisille aliohjelmille on omat kutsu- ja paluukäskynsä. Parametrien välitys tapahtuu pinon kautta ja käytössä on normaalit arvo- ja viiteparametrit. Lisäkäskyjä on myös mahdollisen välimuistin manipulointiin (tyhjentämiseen) ja erilaisiin virransäästöoperaatioihin.

PicoJavan määrittelyn mukaan toteutettiin todellinen suoritin _Sun microJAVA 701_, joka oli suunnattu edullisiin kannettaviin laitteisiin. 

Myös muita Java-suorittimia on tehty. Esimerkiksi, Sun [MAJC 5200](https://en.wikipedia.org/wiki/MAJC) oli suunniteltu verkon multimediasovelluksiin ja Patrit Scientificin [PSC1000](https://en.wikipedia.org/wiki/Patriot_Scientific_Corporation) oli kehitetty lääketieteellisiä laitteita varten.


<!--  quizit 10.3.???  -->
<div><quiz id="b3490240-8ec5-4241-aa30-ecff6d74fc01"></quiz></div>
<div><quiz id="bbc1c775-9584-4325-a316-f8325548445c"></quiz></div>
<div><quiz id="4efaeccf-7649-48ed-a55d-4a71d99bcf71"></quiz></div>
