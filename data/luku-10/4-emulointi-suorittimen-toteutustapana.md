---
path: '/luku-10/4-emulointi-suorittimen-toteutustapana'
title: 'Emulointi suorittimen toteutustapana'
hidden: false
---

<div>
<lead>Tässä aliluvussa esittelemme, kuinka tulkintaan perustuva suoritus voi olla järkevää myös ohjelman konekieliselle esitysmuodolle.
</lead>
</div>

## Ttk-91 emulaattori
Jos varsinaista suoritinta ei aiotakaan toteuttaa fyysisesti, niin ainoa tapa suorittaa sen konekielelle käännettyjä ohjelmia on rakentaa sille emulaattori tai simulaattori. Myös uuden suorittimen suunnittelussa on tapana toteuttaa sille hyvin laitteistoläheinen emulaattori, jonka avulla uutta suoritinta voi testata oikeilla ohjelmilla jo suunnitteluvaiheessa. Nykyisissä suorittimissa on hyvin vähän virheitä, koska suunnitelmaan jääneet virheet on yleensä löydetty testausvaiheessa emulaattorin avulla ennen piirien valmistamista.

Ttk-91 suorittimen määrittely on puutteellinen, eikä sen pohjalta voisi mitenkään toteuttaa todellista suoritinta. Määrittely on kuitenkin riittävän hyvä, jotta sille voidaan rakentaa konekäskytason emulaattori määrittelyssä mukana oleville käskyille.

Ttk-91 emulaattori sisältyy [Titokone](https://www.cs.helsinki.fi/group/titokone/) ohjelmistoon sen yhtenä komponenttina. Emulaattori lukee ttk-91 suorittimen konekielisiä käskyjä yksi kerrallaan ja tekee niiden määrittelemät muutokset emuloidun ttk-91 suorittimen rekistereihin ja muistiin. Emulaattorin [koodi](https://www.cs.helsinki.fi/group/nodes/kurssit/tito/2012s/Processor.java) on kirjoitettu Javalla ja se on helposti luettavaa. Koodi on pitkähkö, koska siinä on mukana ohjelmankehitysympäristö ja suorituksen animaattori.

## Transmetan emulointiin perustuva suoritin
Intelin [x86](https://fi.wikipedia.org/wiki/X86)-arkkitehtuuri sisältää eri kokoisia ja hyvin erilaisia konekäskyjä, joiden nopea suoritus on vaikea toteuttaa. [Transmetan](https://fi.wikipedia.org/wiki/Transmeta) perusidea oli rakentaa x86-emulaattori ja sitä tukeva nykyteknologian nopea suoritin, joissa voisi emuloimalla suorittaa Intelin x86-koodia nopeammin kuin mihin Intelin omat suorittimet pystyivät. 

Yleensä konekielen emulaattorien ongelmana on suorituksen hitaus, joka aiheutuu siitä, että konekäskyjä täytyy emuloida yksi kerrallaan. Transmetassa oli kuitenkin hoksattu, että sopivalla laitteistotuella myös emuloinnissa voisi hyödyntää usean konekäskyn suoritusta limittäin ja samanaikaisesti. Idea oli lennossa kääntää (JIT-kääntämällä) x86-konekäskyjen lohkot oman suorittimen konekielelle, jossa oli saman mittaisia yksinkertaisia konekäskyjä. Transmetan oma tätä tarkoitusta varten suunniteltu suoritin sitten pystyi suorittamaan näitä lyhyitä konekäskyjä limittäin ja rinnakkain hyvin nopeasti. 

Transmeta sivuaa suomalaisia, koska se palkkasi [Linux-käyttöjärjestelmän](https://fi.wikipedia.org/wiki/Linux) kehittäneen [Linus Torvaldsin](https://en.wikipedia.org/wiki/Linus_Torvalds) 1997 mm. [porttaamaan](https://en.wikipedia.org/wiki/Porting) Linux-käyttöjärjestelmän Transmetan suorittimille.  Torvalds teki Transmetalla myös Linuxin kehitystyötä kuusi vuotta, jonka jälkeen hän muutti Kaliforniasta Oregoniin ja keskittyi puhtaasti Linuxin kehittämiseen.

Transmetan idea oli hyvä, mutta Intel vastasi siihen uudella suorittimella (ks. alla), joka lennossa muunsi jokaisen x86-konekäskyn rinnakkain suoritettaviin samanmittaisiin konekäskyihin. Näiden rinnakkainen suoritus oli vielä nopeampaa kuin Transmetan suorittimilla. Transmeta siirsi omien suorittimiensa markkinoinnissa painopisteen alhaiseen virrankulutukseen, millä alueella se saattoi vielä kilpailla kannettavissa laitteissa. Lopulta yhtiö lopetti toimintansa 2009. 

## Intel Pentium 4
Intel oli itsekin havainnut, että [x86](https://fi.wikipedia.org/wiki/X86)-arkkitehtuuri on vaikea sellaisenaan tehdä nopeaksi. Intelin x86-arkkitehtuuri juontaa juurensa jo vuoteen 1972. Vaikka se on kehittynyt paljon vuosien saatossa, niin Intel haluaa edelleen pitää uudet suorittimet sen kanssa yhteensopivina. Siitä ei siis haluta kokonaan luopua.

Intelin ratkaisu x86-koodin nopeaan suorittamisen [Pentium 4](https://en.wikipedia.org/wiki/Pentium_4) suorittimessa oli vähän saman kaltainen kuin Transmetalla, mutta kuitenkin merkittävästi erilainen. Kun Transmetan järjestelmässä x86-käskyt käännettiin JIT-kääntäjällä suurina lohkoina ennen suoritusta Transmetan suorittimen konekielelle, niin Pentium 4 suorittimessa kukin x86-konekäsky muunnettiin laitteistossa suoritusaikana käskyn noudon yhteydessä saman kokoisiin _mikrokäskyihin_. 

Suorittimen sisällä varsinainen konekäskyjen suoritus perustui noihin mikrokäskyihin, joita oli helpompi suorittaa useaa limittäin ja samanaikaisesti. Tavallaan Pentium 4 siis emuloi x86-arkkitehtuuria puhtaalla laitteistoteutuksella.

<!--  quizit 10.4  suorittimen emulointi  -->
<div><quiz id="ab83596c-8894-4b77-a550-e2b94a126ac9"></quiz></div>

<text-box variant="example" name="Nykyaikaa: Intel Core i9-9900K (2018)">

Suorittimessa on 8 ydintä (core), jotka ovat kukin tällä kurssilla esitetyn mallin mukaisia suorittimia. Lisäksi kuhunkin ytimeen sisältyy kaksi joukkoa kaikkia laiterekistereitä, joiden avulla kukin ydin voi olla suorittamassa kahta eri prosessia (_säiettä_, thread), mutta yhtä kerrallaan. Idea tässä on, että kun yksi säie tekee muistiviitteen välimuistihudin takia, niin suoritus siirtyy saman ytimen toiselle säikeelle. Jos sekin tarvitsee muistiviitteen, niin sitten vain odotellaan. Tällä tavoin yhdestä ytimestä saadaan kuitenkin esim. 50-70% enemmän laskentatehoa kuin vain yhtä rekisterijoukkoa käytettäessä. Tämä teknologia on nimeltään _suorittimen monisäikeistys_ (hyper threading). Käyttöjärjestelmä näkee suorittimen 16-ytimisenä, vaikka oikeasti niitä on vain kahdeksan.

Kullakin ytimellä on 64 KB L1-välimuisti, 256 KB L2-välimuisti ja 2 MB L3-välimuisti. Muistiosoitteet ovat 64-bittisiä. Allaolevassa kuvassa oikealla on samalle mikropiirille toteutettu näytönohjain. Ytimet ja näytönohjain on yhdistetty toisiinsa rengasmaisesti. 

Joka ytimen säikeellä on 16 kappaletta 64-bittistä yleisrekisteriä. Lisäksi siellä on 16 kappaletta 128-bittistä XMM-rekisteriä (MultiMedia eXtension). Niitä voidaan kutakin käyttää grafiikkasovelluksissa esimerkiksi 16 kappaleena 8-bitin vektorirekisteriä ja XMM-konekäskyt toteuttavat yhdellä kertaa operaatioita kaikille 16 kappaleelle 8-bitin tietoalkioita. Liukulukulaskenta tapahtuu 8 liukulukurekisterin avulla. Nimettyjen rekistereiden asemesta liukulukurekistereitä käsitellään pinona, johon liukulukukonekäskyjen viittaukset kohdistuvat.

![Kuva Intelin i9 9900K suorittimesta, joka on toteutettu Intelin Coffee Lake piirillä. Keskellä on 8 ydintä, oikealla GPU ja vasemmalla ylhäällä muistinhallinnan liittymä väylään. L3-tason välimuistit ovat vielä erikseen näkyvillä kunkin ytimen ympärillä.](./ch-10-4-i9-9900k.svg)
<div>
<illustrations motive="ch-10-4-i9-9900k"></illustrations>
</div>

</text-box>



## Yhteenveto
Tässä kurssin viimeisen luvun viimeisessä aliluvussa esittelimme, kuinka ohjelmia voidaan suorittaa järjestelmässä välillisesti, tulkitsemalla ohjelman koodia jollakin toisella suorituksessa olevalla ohjelmalla (prosessilla). Tällainen prosessi voi olla komentotulkki, jolla suoritetaan käyttöjärjestelmälle annettavia hallintakomentoja. Se voi olla myös Java välikielen tulkki, joka emuloi hypoteettista Java virtuaalikonetta. Se voi olla myös jonkin suorittimen emulaattori, jolloin sen avulla voidaan yhdessä järjestelmässä suorittaa toisen järjestelmän konekielisiä ohjelmia.

<text-box variant="example" name="Mitä seuraavaksi?">

Olet saanut kurssin päätökseen. Onneksi olkoon! 
<br><br>
Tämän kurssin jälkeen voit jatkaa käyttöjärjestelmiin tutustumista esimerkiksi Stallingsin oppikirjalla "Operating Systems - A Quantitative Approach" tai yliopiston kurssilla Käyttöjärjestelmät (Operating Systems). Tietokonearkkitehtuuria voit tarkemmin opiskella esimerkiksi Stallingsin oppikirjasta "Computer Organization and Architecture - Designing for Performance" ja sen jälkeen vielä tarkemmin esimerkiksi Hennessyn ja Pattersonin oppikirjasta "Computer Architecture".

</text-box>

Vastaa vielä alla olevaan kyselyyn, kun olet valmis tämän luvun tehtävien kanssa.

<!-- summary quizit   -->

<div><quiz id="a6120f2c-843f-432d-8598-db877e7a6fda"></quiz></div>

