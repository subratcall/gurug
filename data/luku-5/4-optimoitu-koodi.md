---
path: "/luku-5/4-optimoitu-koodi"
title: "Optimoitu koodi"
---

<div>
<lead> Optimoitu koodi on nopeampi suorittaa kuin optimoimaton koodi. Miksi emme siis aina käyttäisi optimoitua koodia? </lead>
</div>

## Optimoidun koodin tarkoitus
Tietokoneohjelmien suoritusnopeus on monissa sovelluksissa hyvin tärkeää. Esimerkiksi sääennustemallin ratkaisu pitäisi pystyä laskemaan muutamassa tunnissa, jotta sääennuste on valmis ajoissa ennen mahdollisen myrskyn saapumista. Toinen hyvä esimerkki on tietokonepelit, joissa vaaditaan huima määrä laskentaa reaaliaikaisen pelitilanteen ylläpitämiseksi ja sen näyttämiseen pelaajalle.

Ohjelman koodi voidaan toteuttaa hyvin monella eri tavalla ja joidenkin suoritusaika on pienempi kuin toisilla. Koodin optimoinnilla tarkoitetaan juuri tätä. Yleisesti ottaen, koodin optimointi on vaikeaa ja korkean tason kielten kääntäjät voivat helposti käyttää yli puolet ajastaan koodin optimointiin. Nykyisten suorittimien monimutkaisuuden vuoksi optimointiin ei riitä, että optimointi tapahtuu konekäskyjen tasolla. Optimointi perustuu usein myös käytössä olevan suorittimen erityispiirteisiin, kuten kuinka konekäskyt on toteutettu suorittimessa, kuinka useaa konekäskyä voidaan suorittaa rinnakkain ja kuinka nopeasti muistinviittaukset tapahtuvat. Ongelmakenttä on monimuotoinen ja käsittelemme sitä tässä vain pintapuolisesti.

Optimoinnin vaatiman käännösajan vuoksi useissa suurissa ohjelmistoprojekteissa koodi käännetään ohjelmiston kehitysaikana ilman optimointia. Ohjelmiston valmistuttua se käännetään sitten hyvin optimoiduksi koodiksi, jotta lopputuote toimisi mahdollisimman nopeasti.

## Optimoidun koodin toteutus
Koodin optimointia tehdään usealla eri tasolla. Tavoite koodin optimoinnilla on aina tuottaa koodia, jonka suoritusaika olisi mahdollisimman pieni. Tämän takia yleensä pyritään suorittamaan mahdollisimman vähän konekäskyjä ja mahdollisimman vähän muistiviitteitä. Viimeksi mainittuun tavoitteeseen sisältyy sellainen koodi, joka ottaa täyden hyödyn irti välimuistista.

[Rekistereiden allokointi](https://en.wikipedia.org/wiki/Register_allocation) on yksi tärkeimmistä optimoinnin osa-alueista. Rekistereiden allokoinnissa päätetään, mihin tarkoitukseen kutakin rekisteriä käytetään milloinkin ohjelman suoritusaikana. Säilytetäänkö esimerkiksi muuttujan X arvoa tietyssä vaiheessa (esimerkiksi silmukan sisällä) vaikkapa rekisterissä r3, vai ainoastaan muistissa? Silmukan muuntelumuuttujan arvo olisi usein kätevää pitää rekisterissä, mutta onko nyt juuri vapaata rekisteriä sitä varten? Allokointiongelman ydin on siinä, että rekistereitä on vähän ja viitattavaa dataa paljon. Kaikki laskentatyö pitää kuitenkin tehdä rekistereiden avulla.

Eräs optimoinnin kohde on indeksitarkistusten poisjättäminen silloin, kun turvallisuus ei siitä kärsi. On helppo havaita, että silmukassa

```
for (i=0 to 99999) {
   ...
   T[i] = ...
   ...
   }
```

taulukkoviite T[i] on turvallinen, jos taulukon T koko on ainakin 100000 ja i:n arvoa ei muuteta muualla silmukassa. Tämän päättelyn tekeminen algoritmisesti on kuitenkin yleisessä tapauksessa vaikeaa. Silmukka voi olla koodimäärältään hyvinkin suuri, siinä voi olla viittauksia muualle koodiin ja viitattavan taulukon koko voi olla vaikea päätellä.

Tarkastellaan yksinkertaista taulukon alustussilmukkaa esimerkkinä optimoinnin toteutuksesta. 

```
for (i=0 to 499)
   T[i] = X;
```

Se voisi ilman optimointia kääntyä konekieliseksi koodiksi

```
      load  r5, =0    ; alusta i
      store r5, i

Loop  load r1, i      ; silmukan runko
      load r2, X
      store r2, T(r1)

      load r3, i       ; kasvata i
      add  r3, =1
      store r3, i

      load r4, i       ; silmukan lopetustesti
      comp r4, =500
      jles  Loop
```
Tämä koodi tuottaa täsmälleen oikean lopputuloksen eli se on virheetön. Kääntäjän tuottama optimoimaton koodi voisi hyvinkin näyttää tältä, koska se on helppo generoida. Siinä on kuitenkin suoritusnopeuden kannalta useita huonoja piirteitä. Koodi käyttää viittä työrekisteriä (r1-r5), joten niillä ei voi olla mitään muuta käyttöä samanaikaisesti. Muuttujan i arvo pidetään koko ajan muistissa, joten siihen kohdistuu valtava määrä muistiviitteitä. Osa muistiviitteistä on ihan turhia, kun tarvittava arvo on jo valmiiksi jossain rekisterissä. Lopetustesti perustuu vertailuun lukuun 500, joten vertailu ja sitä seuraava ehdollinen hyppykäsky vaativat aina kaksi konekäskyä.

Saman taulukon alustuksen voisi toteuttaa optimoidulla koodilla

```
      load  r1,=499   ; i:n viimeinen arvo r1:ssä
      load  r2, X     ; r2 = X (vakio)
Loop  store r2, T(r1)
      sub   r1,=1
      jnneg Loop
      store r1, i  ; jos ohjelmointi kielen semantiikka vaatii tätä
```

Optimoidussa koodissa tarvitaan vain kaksi rekisteriä. Siinä suoritetaan yhteensä 500\*3+3=1503 konekäskyä, kun alkuperäinen koodi tarvitsi 500\*9+3=4503 konekäskyä. Optimoitu koodi teki 502 muistiviitettä, kun alkuperäinen koodi vaati 3001 muistiviitettä.

Edellisessä esimerkissä optimoitu koodi oli huomattavasti lyhyempi kuin optimoimaton koodi (6 konekäskyä vs. 11 konekäskyä). Näin ei aina kuitenkaan ole. Taulukon alustuksen voisi toteuttaa vieläkin nopeammin käyttäen ns. "silmukan purkua", jossa 2 tai useampi silmukan suorituskerta on yhdistetty. Näin silmukan suorituskertojen määrä saada pienemmäksi ja (käsky)välimuistin toiminta tehokkaammaksi.

```
      load  r1, =T   ; r1 = alustettavan alkion osoite
      load  r2, X    ; r2 = X (vakio)
      load r3, =499  ; vielä alustettavien alkioiden lukumäärä
Loop  store r2, 0(r1)
      store r2, 1(r1)
      store r2, 2(r1)
      store r2, 3(r1)
      add   r1, =4    ; seuraavaksi alustettavien neljän alkion osoite
      sub   r3, =4
      jnneg r3, Loop
```

Taulukkoon viittaaminen perustuu osoitinmuuttujaan (pointteriin) jota säilytetään rekisterissä r1, eikä indeksointiin, joten lukumäärää varten tarvitaan yksi ylimääräinen rekisteri (r3). Suoritettavia konekäskyjä on vain 125\*6+3=903, mutta koodin pituus on liki kaksinkertainen eli 10 käskyä. Tällä on jonkin verran merkitystä, koska suurempien ohjelmien lataus kestää pidempään ja ne tarvitsevat enemmän muistia. Toisaalta suoritusaikainen nopeushyöty on merkittävä. Tämä on esimerkki yleisestä tila/aika-optimoinnista, jossa suoritusaikaa on optimoitu tilan (muisti, rekisterit) kustannuksella. Ääritapauksessa silmukan voisi kokonaan purkaa 500 peräkkäiseen store-käskyyn, mutta olisiko se optimaalista? Koodin koko ainakin kasvaisi valtavasti. Entä sitten, jos looppi pitäisikin suorittaa 10000 kertaa?

Optimoinnilla voidaan siis saavuttaa huomattava nopeushyöty. Joissakin sovelluksissa hitaampikin vauhti riittää, kuten esimerkiksi tekstinkäsittelyssä. Suoritusnopeuden tarvitsee olla riittävän nopea sovelluksen tarkoitukseen, mutta ei sen nopeampi. On kuitenkin paljon sovelluksia, joiden kohdalla kannattaa ilman muuta satsata kunnolla suoritusnopeuden optimointiin. Sään ennustemallien käyttökin olisi ihan erilaista, jos malli ratkeaisi viidessä minuutissa kahden tunnin asemesta.

Koodin suoritusnopeuteen liittyy nykyjärjestelmissä myös monen suorittimen (tai "ytimen") käyttö yhden ohjelman suoritukseen. Emme käsittele näitä moniprosessorijärjestelmiä tai niiden ohjelmointia tällä kurssilla lainkaan.

<!-- quiz 5.4 ????????????????? -->

<div><quiz id="9ef6a20c-652d-43c3-b9ca-514a0a5194a1"></quiz></div>
<div><quiz id="82210dd6-52d3-405f-8dc2-428b514a68f1"></quiz></div>

<!-- div><quiz id="4b44871b-2fe7-4fe1-978c-267d5bf8de80"></quiz></div> -->
