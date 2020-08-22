---
path: '/luku-7/2-tiedon-muuttumattomuus'
title: 'Tiedon muuttumattomuuden turvaaminen'
hidden: false
---


<div>
<lead>Tässä osiossa tarkastelemme perusmenetelmiä, joilla voidaan valvoa tiedon muuttumattomuutta tietokonejärjestelmissä. Järjestelmään tallennettu tai siellä siirrettävä tieto voi muuttua esimerkiksi laitteistovian, satunnaisen avaruudesta tulleen hiukkasen tai tahallisen tietoturvahyökkäyksen vuoksi. Syystä tai toisesta, järjestelmässä oleva tieto on muuttunut virheelliseksi. Haluaisimme havaita kaikki tällaiset virheet ja mahdollisuuksien mukaan myös korjata ne.</lead>
</div>

## Tiedon muuttumattomuuden turvaamisen pääperiaatteet
Lähtökohta riittävän hyvän tiedon muuttumattomuuden takaamiselle on hyväksyä se, että virheitä tapahtuu. Perusidea virheiden havaitsemiselle on ottaa mukaan ylimääräisiä bittejä, joiden avulla virhe voidaan havaita ja ehkä jopa korjata. Käytännössä tämä tarkoittaa sitä, että rekistereihin ja muistipiireihin laitetaan ylimääräisiä bittejä ja tiedonsiirtoväyliin ylimääräisiä johtimia. Näiden lisäksi virheen havaitseva koodi pitää myöskin toteuttaa ja sen voi tehdä joko suoraan laitteistolla tai erillisillä suoritettavilla ohjelmilla. Jos ajatellaan esimerkiksi muistiväylän suojaamista, niin nopeusvaatimusten vuoksi kaikki tarkistukset tulee tehdä laitteistototeutuksina.

Ylimääräiset bitit ja johtimet vaativat ylimääräistä tilaa ja tarkistusten tekeminen vaatii aikaa. Tiedon muuttumattomuuden suojaamisen kustannus maksetaan siten sekä tilassa että ajassa.

Se, paljonko olemme valmiita maksamaan järjestelmässä olevan tiedon muuttumattomuudesta, riippuu järjestelmästä. Esimerkiksi kotikoneessa on usein tavallista muistia eikä virheen korjaavaa ([ECC-muistia](https://en.wikipedia.org/wiki/ECC_memory)), koska tavallinen muisti on halvempaa. Lääketieteellisen sädehoitolaitteen muisti taas on ainakin yhden virheen havaitsevaa ja korjaavaa muistia, koska kukaan ei halua virheellistä määrää säteilyä satunnaisen avaruushiukkasen vuoksi.

## Tiedon muuttumattomuuden turvausmenetelmien ominaisuudet
Luokittelemme tiedon muuttumattomuuden turvausmenetelmiä useiden ominaisuuksien perusteella. Yleensä kuhunkin käyttöön sopivan menetelmän valinta tapahtuu usean ominaisuuden yhdistelmänä, ottaen huomioon riskien hallinta hyväksytyllä tasolla.

<p>Kuinka monen bitin muuttuminen havaitaan? Menetelmä, joka havaitsee kahden bitin muuttumisen, on parempi kuin sellainen, joka havaitsee vain yhden bitin muuttumisen, mutta se on myös kalliimpi toteuttaa. Esimerkiksi, jos virheet ovat satunnaisia ja yhden virheen esiintymistodennäköisyys on P(virhe)&nbsp;=&nbsp;1:1&nbsp;000&nbsp;000, niin kahden virheen yhtä aikaa tapahtumisen todennäköisyys on sama kuin yhden virheen todennäköisyys potenssiin 2 eli P(2&nbsp;virhettä)&nbsp;= (P(virhe))<sup>2</sup>&nbsp;= 1:1&nbsp;000&nbsp;000&nbsp;000&nbsp;000. Pienlentokoneen järjestelmän suunnittelijat voivat hyvin päättää, että riittää varautua yhteen virheeseen kerrallaan, koska kahden samanaikaisen virheen todennäköisyys on niin pieni. Toisaalta, jos kyseessä on suuri matkustajalentokone, niin olisiko parempi varautua myös kahteen samanaikaiseen virheeseen?</p>

Kuinka monta viallista bittiä voidaan korjata? Joissakin tapauksissa riittää, että virhe havaitaan ja raportoidaan, jonka jälkeen jokin ulkopuolinen taho korjaa tilanteen. Esimerkiksi verkkoliikenteessä on tyypillistä, että tietoliikennepaketteja katoaa tai menee rikki matkalla. Jos paketissa on viallisia bittejä, niin niitä on helposti niin monta, että niiden korjaaminen ei kuitenkaan onnistu. On helpompi pyytää lähettäjää lähettämään kyseinen paketti uudelleen ja toivoa parasta. Toisaalta, jos muistipiiri on ECC-tyyppinen, niin sitä voi hyvin käyttää ainakin vähän aikaa, vaikka jokin bitti olisikin rikki. Rikkinäisen bitin tieto voidaan lennossa laskea ylimääräisten virheen korjaavien bittien avulla.

Mikä on virheen kustannus muistitilan tai piirin pinta-alan suhteen? Tämä tarkoittaa yksinkertaisesti sitä, että kuinka paljon ylimääräisiä bittejä tai johtimia tarvitaan (esimerkiksi) 64-bittistä sanaa kohden. Johtimien vetäminen mikropiirin pinnalla voi viedä yllättävän paljon arvokasta pinta-alaa, jolle voisi löytyä muutakin käyttöä - esimerkiksi isompana välimuistina.

Mikä on virheen kustannus ajassa ja tehdäänkö virheiden havaitsemis/korjauslaskelmat laitteistolla vai ohjelmistolla? Tarkistuskoodin suorittamismenetelmä määräytyy yleensä suoraan siitä, minkä tason tiedosta on kyse. Suorittimen sisäisen väylän tai muistiväylän tiedonsiirron turvaaminen täytyy tapahtua laitteistototeutuksena, koska tarkistus pitää tehdä huomattavasti nopeammin kuin yhden konekäskyn suoritusajassa. Massamuistin, tietoliikenteen ja pilvipalvelimien tiedon tarkistus voidaan hyvin tehdä ohjelmallisesti, koska niiden käyttö on joka tapauksessa hidasta.

Esimerkkinä tiedot muuttamattomuuden tarkistamisesta voidaan käyttää [henkilötunnusta](https://fi.wikipedia.org/wiki/Henkil%C3%B6tunnus), vaikka tietoa siinä käsitelläänkin merkkikohtaisesti eikä bitteinä. Henkilötunnus on muotoa 120364-121K, jossa alkuosa "120364" on syntymäaika ilman vuosisataa, välimerkki ´-´ ilmaisee syntymäajan vuosisadan 1900-luku ('+' on 1800-luku ja 'A' on 2000-luku), "121" ilmaisee parittomana lukuna sukupuoleksi miehen ja muutoin uniikin arkistointinumeron tälle henkilölle. Viimeinen merkki ´K´ on tarkistusmerkki, jonka arvo saadaan jakamalla edellä oleva 9-numeroinen luku 120364121 luvulla 31 ja koodaamalla jakojäännös sopivasti. Merkki ´K´ kertoo, että jakojäännös on 18. Matemaattisesti voidaan osoittaa, että tämän tarkistusmerkin avulla löydetään ainakin kaikki yhden merkin virheet ja kaikki kahden merkit vaihtumiset. Rakenteellisena puutteena järjestelmässä on, että välimerkin muuttumattomuutta ei valvota lainkaan. Tämän vuoksi kaikkien käytössä olevien henkilötunnusten on pakko erota toisistaan myös muutoin kuin välimerkin osalta. Tästä taas on seurauksena arkistointinumeroiden loppuminen piakkoin, joten uuden henkilötunnuksen käyttöönotolla alkaa olla kiire. Henkilötunnuksessa havaitaan yhden merkin muuttuminen (ei välimerkissä), mutta virhettä ei voi paikallistaa eikä korjata. Tarkistusmerkin tilakustannus on 9%, koska 11 merkistä yksi on tarkistusmerkki. Tarkistus vaatii jonkin verran laskentaa ja tehdään aina ohjelmallisesti.

Toinen esimerkki tarkistusmerkeistä on Suomessa käytetty [IBAN](https://fi.wikipedia.org/wiki/IBAN) tilinumero. Siinä olevien kahden tarkistusmerkin (numeron) avulla havaitaan kaikki yhden merkin virheet ja useimmat kahden merkin virheet. Kaikki kahden merkin vaihtumiset huomataan samoin kuin useimmat muutkin virheet. Virheitä ei voi korjata lainkaan.

```
500015-123                  vanhan muotoinen pankkitilin numero
5000 1500 0001 23           laajenna pankkiosa 14-numeroiseksi
5000 1500 0001 23 FI00      lisää loppuun FI00
5000 1500 0001 23 15 18 00                  muuta  F="15", I="18"
5000 1500 0001 23 15 18 00 mod 97 = 61      laske modulo 97
5000 1500 0001 23 FI37      laske 98-61=37 ja aseta 37 FI-merkkien jälkeen
FI37 5000 1500 0001 23      Siirrä FI-osa alkuun, uusi IBAN-numero
```

Tarkistusmerkkien kustannus on 2 merkkiä 18:sta eli yli 10%. Tarkistusmerkkien oikeellisuuden laskenta tehdään ohjelmallisesti.

## Pariteettibitti
Bittitasolla yksinkertaisin ja yleinen tarkistusmenetelmä on pariteettibitti. Se on ylimääräinen bitti, jonka avulla tiedon 1-bittien lukumäärästä tehdään parillinen tai pariton. Käytössä sanotaan tuolloin olevan joko _parillinen_ tai _pariton pariteetti_. Esimerkiksi, 32-bittisessä sanassa voidaan varata 31 bittiä datalle ja 1 bitti pariteettibitille. Tietoa talletettaessa pariteettibitin arvo lasketaan ja talletetaan paikalleen. Joka kerta tietoa luettaessa tarkistetaan, että pariteetti on oikein. Jos se ei ole, niin virhe käsitellään esimerkiksi kutsumalla jotain aliohjelmaa tai aiheuttamalla sopiva keskeytys.

```
Esimerkki 15-bittisen datan suojaamisesta parillisella pariteettibitillä,
kun tietoalkio on 16-bittinen. Pariteettibitti on oikeanpuoleisin bitti
eli bitti numero 0.

0111 0001 1110 0100   - pariteettibitti on 0
1010 1111 0010 1101   - pariteettibitti on 1
```

Pariteettibitin kustannus tietoalkiota kohden on 1 bitti, joten suuremmilla tietoalkioilla sen suhteellinen osuus on pienempi.
Pariteettibitin avulla voidaan havaita kaikki yhden bitin virheet, mutta kaikki kahden bitin virheet jäävät havaitsematta.

```
0111 0001 1110 0000   - bitti nro 2 muuttunut, virheellinen pariteetti
1010 1111 0010 1011   - bitit nro 2 ja 3 muuttuneet, oikea pariteetti
```

Pariteettibitin avulla ei voida mitenkään paikallistaa virhettä, joten virheen mahdollinen korjaus täytyy tehdä ylemmällä tasolla ohjelmistoa jollain muulla tavalla. Pariteettibitti kuitenkin sopii hyvin tilanteisiin, joissa yhden bitin virhe on aika pieni, mutta kahden bitin samanaikainen vikaantuminen on hyvin epätodennäköistä. Tällaisissa tilanteissa kolmen bitin yhtäaikaisen vikaantumisen todennäköisyys on vielä paljon pienempi.

```
P(1 bitin virhe) = 1:1000 0000                 = 1E-6
P(2 bitin virhe) = 1:1000 0000 000 000         = 1E-12
P(1 bitin virhe) = 1:1000 0000 000 000 000 000 = 1E-18
```

## Quizit 7.2.1-2  - pariteetti
<!-- Quiz 7.2.1-2 pariteetti etc -->
<div><quiz id="b9cb891a-93f4-43ed-bd9d-f59a6a603207"></quiz></div>
<div><quiz id="aae8aca4-8819-48b5-bd69-e1ecd2eeb96d"></quiz></div>

<text-box variant="example" name="Richard Hamming">

[Richard Hamming](https://en.wikipedia.org/wiki/Richard_Hamming) oli tietojenkäsittelytieteen pioneereja. Ennen tietojenkäsittelyyn liittyvää uraansa hän mm. osallistui Manhattan-projektissa atomipommin kehitystyöhön. Vuonna 1945 hän mm. tarkasti laskelmia siitä, tuhoaisiko atomipommi maapallon koko ilmakehän vai ei. Laskelmat oli tehty oikein, mutta hän ollut varma kaikkien oletusten paikkansapitävyydestä. Sodan jälkeen Hamming siirtyi [Bell Labs](https://en.wikipedia.org/wiki/Bell_Labs)'ille ja työskenteli osan aikaa samassa työhuoneessa informaatiotieteen isäksi kutsutun [Claude Shannonin](https://en.wikipedia.org/wiki/Claude_Shannon) kanssa.

</text-box>

## Hamming-etäisyys
Richard Hamming tutki 1950-luvulla koodatun tiedon muuttumattomuutta eri koodijärjestelmissä. [Hamming-etäisyys](https://en.wikipedia.org/wiki/Hamming_distance) on niiden bittien lukumäärän jonka mukaisen määrän bittejä täytyy muuttua, jotta jokin laillinen merkki muuttuu toiseksi saman koodijärjestelmän toiseksi lailliseksi merkiksi. Mitä isompi Hamming-etäisyys tietyssä koodausjärjestelmässä on, sitä parempi. Jos virheitä (bittien muuttumisia) tapahtuu vähemmän kuin Hamming-etäisyyden verran, niin tuloksena on aina virheelliseksi havaittavissa oleva tietoalkio.

```
7-bittinen ASCII-merkistö

'A' = 0x41 =  100 0001
'B' = 0x42 =  100 0010   Hamming-etäisyys (A,B) = 2
'C' = 0x43 =  100 0011   Hamming-etäisyys (B,C) = 1
```

Koodijärjestelmän Hamming-etäisyys on pienin Hamming-etäisyys kyseisen järjestelmän merkkien välillä. Edellisen esimerkin ASCII-koodiston Hamming-etäisyys on siten yksi. Tämä tarkoittaa, että yhden bitin virheitä ei voi havaita. Esimerkiksi, merkin 'B' viimeisen bitti muuttuminen nollasta ykköseksi muuttaa sen merkiksi 'C', eikä virhe ole mitenkään havaittavissa.

Jos 7-bittiseen ASCII-koodistoon lisätään pariteetti-bitti, niin koodijärjestelmän Hamming-etäisyys kasvaa kahteen. Nyt kaikki yhden bitin virheet havaitaan ja järjestelmä on paljon turvallisempi. Jos merkin 'B' bitti 0 muuttuu nyt ykkösestä nollaksi, niin virhe havaittaisiin nyt siitä, että pariteettibitti on väärin.

```
7-bittinen ASCII-merkistö + pariteettibitti (bitti 7)
Parillinen pariteetti

'A' = 0x41 = 0100 0001
'B' = 0x42 = 0100 0010   Hamming-etäisyys (A,B) = 3
'C' = 0xC3 = 1100 0011   Hamming-etäisyys (B,C) = 2
muuttunut 'B' = 0100 0011   virheellinen data, pariteetti on väärin
```

Pariteeettibitin kanssa kyseessä ei ole enää sama koodijärjestelmä. Esimerkiksi 'C' on ASCII-koodissa 0x43, kun se uudessa koodausjärjestelmässä olisi 0xC3.

## Quizit 7.2.3  - Hamming-etäisyys
<!-- Quiz 7.2.3 Hamming-etäisyys-->
<div><quiz id="a85248db-860a-4105-9c57-de81355c4c43"></quiz></div>

## Hamming-koodi
[Hamming-koodissa](https://en.wikipedia.org/wiki/Hamming_code) data-bittien joukkoon lisätään useita pariteetti-bittejä, joiden avulla yhden bitin virheet voidaan paikallistaa ja sen jälkeen korjata.  Esimerkiksi nyt myytävissä virheenkorjaavissa ECC-muistipiireissä virheenkorjaus useimmiten edelleen perustuu Hamming-koodiin, vaikka myös muita menetelmiä on käytössä.

Hamming-koodin perusidea on järjestää data-bitit erilaisiin joukkoihin (pariteettijoukkoihin) sillä tavoin, että jokainen databitti kuuluu uniikkiin joukkoon näitä ryhmiä. Jokaisella pariteettijoukolla on sitten oma pariteettibittinsä. Jos joku bitti muuttuu, niin virheellisen bitin sijainti voidaan päätellä virheellisistä pariteettibiteistä. Tarkemmin sanoen, virhe paikallistetaan niistä pariteettijoukoista, joihin virheellinen bitti kuuluu.

### Hamming(7,4) esimerkki
[Hamming(7,4)](https://en.wikipedia.org/wiki/Hamming(7,4)) esimerkki kuvaa hyvin Hamming-koodin periaatteen. Siinä seitsemästä tietoalkion bitistä neljä on data-bittejä ja niitä vartioi kolme pariteettibittiä.

<!-- kuva: ch-7-2-Hamming-7-4  -->

![Hamming(7,4) esimerkki, jossa 7 tietobitistä 4 kappaletta on databittejä ja 3 pariteettibittejä. Kuvassa on neljä osaa: (a), (b), (c) ja (d). Osassa (a) on databitit a, b, c ja d, joiden arvot ovat a=0, b=1, c=1 ja d=0. Bitti b on keskellä, bitti a on bitin b vasemmalla puolella, bitti c on bitin b yläpuolella oikealla ja bitti d on bitin b alapuolella oikealla. Bitit a, b ja c kuuluvat (pariteetti) joukkoon A. Bitit a, b ja d kuuluvat joukkoon B. Bitit b, c ja d kuuluvat joukkoon C. Osassa (b) ovat myös joukkojen parilliset pariteettibitit mukana: A=0, B=1 ja C=0. Joukot on piirretty ympyröinä, joihon kuuluvat kunkin joukon data- ja pariteettibitit. Osassa (c) alhaalla oikealla oleva databitti d on vaihtunut virheelliseen arvoon 1, jolloin joukkojen B ja C pariteettibitit B=1 ja C=0 ovat väärin. Osassa (d) databitti d on korjattu oikeaksi arvoon 0 ja kaikki pariteettibitit ovat taas oikein.](./ch-7-2-Hamming-7-4.svg)
<div>
<illustrations motive="ch-7-2-Hamming-7-4"></illustrations>
</div>

Lähtötilanteessa (a) on merkittynä databittien arvot ja pariteettijoukot (A, B ja C). Huomaa, että jokainen databitti kuuluu uniikkiin ryhmään pariteettijoukkoja. Esimerkiksi vasemmanpuolimmainen databitti kuuluu joukkoihin A ja B, mutta ei joukkoon C. Tällainen joukkoihin kuuluminen ei päde millekään muulle bitille.

Jokaiselle joukolle on oma pariteettibittinsä. Tilanne (b) näyttää kunkin pariteettibitin arvon, parillista pariteettia käyttäen.

Ajatellaan nyt, että yksi data-biteistä (oikealla alhaalla oleva) muuttuu syystä tai toisesta virheelliseksi, jolloin tilanne on kohdan (c) mukainen. Kyseinen databitti kuuluu joukkoihin B ja C, joten niiden pariteettibitit ovat nyt virheellisiä.

Virheen korjaus tapahtuu useassa vaiheessa. Ensinnäkin, jokin pariteettibiteistä on väärin, mikä indikoi jonkinlaista virhettä jossain. Seuraavaksi havaitaan virheen olevan joukoissa B ja C, mutta ei joukossa A. Vain yksi bitti täyttää nämä ehdot, joten virheellisen bitin täytyy olla oikealla alhaalla oleva databitti. Lopuksi virheellinen bitti _käännetään_ (flipataan) kohdan (d) mukaisesti toisin päin, jolloin sen arvo tulee korjatuksi. Binäärijärjestelmä on tässä tosi kätevä, kun virheelliselle binääriarvolle on vain yksi oikea vaihtoehto. Jos desimaalinumeron tiedettäisiin olevan väärin, niin silti olisi jäljellä yhdeksän muuta vaihtoehtoa.

Entäpä jo virhe onkin pariteettibitissä eikä databitissä? Ei huolta, Hamming-koodi toimii myös siinä tapauksessa. Esimerkiksi, jos joukon A pariteettibitti (0) vaihtuu ykköseksi, niin silloin joukon A pariteettibitti on väärin ja muiden joukkojen pariteettibitit ovat oikein. Ainoa bitti, joka kuuluu joukkoon A mutta ei joukkoihin B tai C, on joukon A pariteettibitti. Virhe on näin paikallistettu ja voidaan korjata. Tilanne on vähän samanlainen kuin jonkin varoitusvalon rikkoutuminen autossa. Itse auton toiminnoissa ei ole mitään ongelmaa, mutta turvajärjestelmän toimivuuden vuoksi vika pitää silti korjata.

Esimerkin Hamming-koodin kustannus on aika korkea. Lähes puolet (3/7 = 43%) biteistä ovat pariteettibittejä. Lisäksi vaatii aika paljon laskenta-aikaa asettaa pariteettibitit paikalleen ja tarkistaa niiden oikeellisuus. Todellisuudessa käytettävä Hamming-koodi on yksinkertaisuudessaan vielä nerokkaampi ja [skaalautuu](https://en.wikipedia.org/wiki/Scalability) hyvin myös suurempien data-alkioden virheenkorjaukseen. Virheellisen bitin sijainnin päättely tapahtuu yksinkertaisen yhteenlaskun avulla.

### Virheen korjaava Hamming-koodi
Hamming-koodissa pariteettijoukot määritellään ovelasti ja joukot voivat ovat erikokoisia. Ensinnäkin on huomattava, että bitit numeroidaan (esimerkiksi) oikealta päin alkaen ykkösestä (ei nollasta, kuten yleensä bittien numeroinnin kanssa on). Seuraavaksi tarkastellaan bitin numeron binääriesitystä.

```
Tietoalkio (7 bittiä):     100 1100
Bitin numero:              765 4321

Bitin      Bitin numeron
numero     binääriesitys

  1          001
  2          010
  3          011
  4          100
  5          101
  6          110
  7          111
  ...        ...
```

Kukin tietoalkion bitti kuuluu joukkoon _2^(i-1)_, jos bitin numeron binääriesityksessä i:nnes bitti oikealta on 1. Äskeisessä esimerkissä joukkoon 1 kuuluvat siten bitit 1, 3, 5 ja 7. Joukkoon 2 kuuluvat bitit 2, 3, 6 ja 7. Joukkoon 4 kuuluvat bitit 4, 5, 6 ja 7.

Toisin päin katsottuna, se, mihin joukkoihin kukin bitti kuuluu, näkyy suoraan bitin numeroesityksestä. Bitti 1 kuuluu joukkoon 1, mutta ei joukkoihin 2 tai 4. Bitti 3 kuuluu joukkoihin 1 ja 2, mutta ei joukkoon 4. Bitti 7 kuuluu kaikkiin joukkoihin 1, 2 ja 4. Jokainen bitti kuuluu erilaiseen ryhmään joukkoja, koska kunkin bitin numeron binääriesitys on uniikki.

Lopuksi määritellään, että kaikki bitit, joiden numero on kakkosen potenssi, ovat pariteettibittejä. Näin jokaiseen joukkoon saadaan täsmälleen yksi pariteettibitti.

Esimerkiksi, 7-bittisellä tietoalkiolla bitit 1, 2 ja 4 ovat pariteettibittejä, jotka määrittelevät kukin oman pariteettijoukkonsa. Joukot nimetään sen pariteettibitin numeron perusteella. Täten bitti 1 on joukon 1 pariteettibitti, bitti 2 joukon 2 pariteettibitti, jne. Vastaavasti 136-bittisellä tietoalkiolla bitit 1, 2, 4, 8, 16, 32, 64 ja 128 ovat pariteettibittejä. 136-bittisellä tietoalkiolla on näin 128 data-bittiä ja 8 pariteettibittiä.

Jos tarvitsemme 32 databittiä, niin niitä turvaamaan tarvitaan 6 pariteettibittiä (bitit 1, 2, 4, 8, 16 ja 32). Tietoalkiossa pariteettibitit ovat databittien välissä omilla paikoillaan. Yhteensä tarvitaan siis 38 bittiä. Tietoa käsitellessä tietoalkiosta käytetään vain databittejä, mutta tiedon muuttumattomuutta varmistettaessa käytetään kaikkia bittejä.

Yhden virheellisen bitin paikallistaminen tapahtuu vastaavasti kuten aikaisemmin esitettiin. Käytämme tässä esimerkkinä 7-bittistä tietoalkiota 100&nbsp;1100, jossa on neljän bitin data 1001 (bitit 3, 5, 6 ja 7) ja kolme pariteettibittiä (bitit 1, 2 ja 4). Käytössä on parillinen pariteetti.

```
                Alkuperäinen  Virheellinen  Korjattu

Tietoalkio:        100 1100    110 1100     100 1100
Bitin numero:      765 4321    765 4321     765 4321
Pariteettivirhe:                   1 1

```

Esimerkissä bitti numero 6 on kääntynyt virheelliseksi. Bitti 6 kuuluu joukkoihin 2 ja 4, joten pariteettibitit 2 ja 4 ovat nyt väärin. Virheen olemassaolo havaitaan jälleen siitä, että jokin pariteettibitti on väärin. Virhe paikallistetaan yksinkertaisesti laskemalla yhteen virheen indikoivien pariteettibittien numerot, eli tässä tapauksessa 2+4=6. Virhe korjataan kääntämällä bitti 6. Lopuksi tarkistetaan vielä, että kaikki pariteettibitit ovat nyt oikein. Jos ne eivät ole, niin virheitä oli useampi ja peli on menetetty.

Entäpä, jos virhe onkin vain pariteettibitissä? Se ei haittaa, sillä pariteettibitti sisältyy vain yhteen (omaan) pariteettijoukkoon ja virheellisen bitin sijainti identifioituu aivan oikein.

Useamman bitin virheitä ei välttämättä havaita alkuaankaan. Esimerkiksi, jos edellisen esimerkin tietoalkiossa 100&nbsp;1100 kaksi bittiä (bitit 1 ja 6) kääntyvät virheellisiksi (tietoalkioksi 110&nbsp;1101), niin kaikki pariteettibitit ovat väärin. Sen mukaisesti virheelliseksi bitiksi lasketaan 1+2+4=7 eli bitti 7 on muka virheellinen. Kun se käännetään vielä ympäri, saadaan tietoalkioksi 010&nbsp;1101. Siinä ei ole pariteettivirheitä, mutta sen sijaan 3 virheellistä bittiä. Aina ei voi voittaa!

```
                Alkuperäinen   Virheellinen   Korjattu
                 0 virhettä     2 virhettä    3 virhettä

Tietoalkio:      100 1100       100 1101        010 1101
Bitin numero:    765 4321       765 4321        765 4321
Pariteettivirhe:                    1 11

```

Hamming-koodin tilakustannus on sitä pienempi, mitä suuremmasta tietoalkiosta on kyse, koska vain kakkosen potenssin numeroiset bitit (2<sup>i</sup>) ovat pariteettibittejä. Esimerkiksi, 1024 databitin turvaamiseen tarvitaan vain 10 ylimääräistä pariteettibittiä.

Hamming-koodin aikakustannus vaihtelee sen mukaan, toteutetaanko tiedon muuttumattomuuden tarkistus laitteistolla vai ohjelmistolla. Jos Hamming-koodia käytetään muistipiirin tai väylän suojaamiseen, niin toteutus täytyy tehdä laitteistolla, koska toteutuksen täytyy olla paljon nopeampi kuin yhden konekäskyn suoritusaika. Esimerkiksi ECC-muistipiiriä käytettäessä muistipiiri laskee ja sijoittaa pariteettibitit paikalleen jokaisen muistiinkirjoituksen yhdessä. Vastaavasti muistia luettaessa muistipiiri tarkistaa luetun tiedon muuttumattomuuden suoraan laitteistolla, ennen kuin se antaa tiedon väylää pitkin eteenpäin.

Laitteistototeutuksessa ei virheen ilmetessä tarvita edes yhteenlaskua. Riittää, kun virheellisten pariteettibittien sijainnit laitetaan paikalleen johonkin sisäiseen rekisteriin ja tulos _tulkitaan_ kokonaisluvuksi!

```
                          Virheellinen data
                              1 virhe

Tietoalkio:                   110 1100
Bitin numero:                 765 4321
Virheelliset pariteettibitit:     1 1
Virheen sijainti:             000 1010  = 6
```


Hamming-koodin voi toteuttaa myös ohjelmistolla, jolloin se vaatii jonkin verran konekäskyjä bittimanipulaatioiden toteuttamiseksi. Se on työlästä puuhaa, mutta ei kovin monimutkaista.

Käytännössä pelkkä virheen paikallistaminen ja korjaaminen ei tietenkään riitä. Se on vain tilapäinen lääke havaittuun virhetilanteeseen. Virheistä täytyy pitää kirjaa. Jos virhe toistuu saman muistipiirin kohdalla usein, niin ilmeisesti muistipiirissä on vika, joka pitää korjata jollain tavoin. Useimmiten se tarkoittaa muistipiirin vaihtamista uuteen. Jos vika on muistiväylässä, sen korjaaminen on vielä hankalampaa ja voi vaatia koko laitteiston uusimisen.

Hamming-koodista on useita laajennuksia. Esimerkiksi lisäämällä pariteettibitti 0 voidaan havaita kaikki kahden bitin virheet, mutta niitä ei voi korjata. Lisäämällä vielä enemmän pariteettibittejä pystytään korjaamaan myös kaikki kahden bitin virheet, jne. Sopiva tiedon muuttumattomuuden suojaustaso määritellään tapauskohtaisesti sen mukaan, kuinka todennäköisiä virheet ovat ja kuinka suuret kustannukset havaitsemattomista (tai ei-korjattavissa olevista) virheistä aiheutuu.

Mitä lähempänä suoritinta ollaan, sitä tärkeämmäksi tulee suojautuminen (satunnaisilta) virheiltä. Suorittimen sisäisissä rekistereissä oleva ja väylillä liikkuva tieto on tärkeätä suojata muutoksilta. Kotikoneiden keskusmuisti voi usein olla suojaamatonta, mutta ainakin palvelinkoneiden muisti on yleensä ECC-muistia. ECC-muisti ei riitä, ellei myös muistiväylä ole virheiltä suojattu. Muistipiirit voi vaihtaa halutessaan kalliimpiin ECC-muisteihin. Väylää ei voi vaihtaa., koska se on kiinteä osa järjestelmää. Tämän vuoksi väylä on yleensä valmiiksi suojattu Hamming-koodilla.

## Quizit 7.2.4 - Hamming-koodi
<!-- Quiz 7.2. Hamming-koodi -->

<div><quiz id="a62f183f-8456-4520-a408-dbade0442817"></quiz></div>

## Tiedon muuttumattomuus tietoliikenteessä
Hamming-koodi ei sovi tiedon muuttumattomuuden havaitsemiseen sellaisessa tapauksessa, jossa muuttuneiden bittien määrä on todennäköisesti suurempi. Esimerkiksi tietoliikenteessä on tyypillistä, että jos virheitä tulee, niin sitten niitä tulee paljon. Virheiden korjaaminen on siten yleensä käytännössä mahdotonta tai sitten sen kustannus ylimääräisten bittien osalta aivan liian suuri.

Käytännössä tietoliikenteessä riittää, kun tiedon muuttuminen havaitaan jollain tavoin. Sen jälkeen joko pyydetään lähettäjää lähettämään viallinen tietoliikennepaketti uudelleen tai vain jätetään kuittaamatta viallinen paketti. Jälkimmäisessä tapauksessa lähettäjä vähän ajan päästä arvelee paketin kadonneen matkalla ja lähettää sen uudelleen.

Tietoliikennepakettien tiedon muuttumattomuutta suojataan tarkistussummien avulla. Yksinkertainen tapa on tulkita kaikki paketin (esim. 4KB tai 4MB) sanat kokonaisluvuiksi ja laskea niiden summa. Summa voi olla kovinkin suuri (esim. 0x1234567890AB), mutta otetaan talteen siitä vain esimerkiksi 32 viimeistä bittiä tarkistussummaksi (0x567890AB). Tarkistussumma lähetetään paketin databittien mukana vastaanottajalle. Vastaanottaja laskee tarkistussumman uudestaan itse ja vertailee sitä saamaansa. Jos ne ovat erilaisia, jotain on muuttunut matkalla. On hyvin epätodennäköistä, että tarkistussumma olisi oikein satunnaisten virheiden jälkeen. Se on tietenkin mahdollista, mutta silti epätodennäköistä.

Edellä mainittua yksinkertaiseen [modulo-aritmetiikkaan](https://fi.wikipedia.org/wiki/Modulaarinen_aritmetiikka) perustuvan tarkistussumman asemesta käytetään parempia matemaattisesti hyväksi havaittuja tarkistussummia. Niillä on mahdollista myös suojautua tahallista tiedon muuttumattomuuteen kohdistuvaa _hyökkäystä_ vastaan, koska tarkistussumman väärentäminen on matemaattisesti vaikeata.

Yleisesti käytössä oleva tietoliikenteen tarkistussummamenetelmä on Wesley Petersonin 1961 kehittämä  [Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) (CRC), jossa tarkistussumma on esimerkiksi 32-bittinen. CRC:stä on useampi variantti eri käyttötarkoituksiin. Esimerkiksi, 16-bittinen variantti CRC-CCIIT löytää (i) kaikki yhden, kahden ja kolmen bitin virheet, (ii) kaikki virheet, joissa virheellisten bittien lukumäärä on pariton, ja  (iii) kaikki virheet, jotka rajoittuvat 16 peräkkäisen bitin purskeeseen.  Kokonaisuudessaan, CRC-CCITT havaitsee 99.998% kaikista virheistä. Toisin sanoen, 1 virhe 50000:sta voi jäädä havaitsematta ja sen kanssa voi sitten elää.

## Laitteiden monistaminen
Jos halutaan suojautua reaaliaikaisesti mahdollisimman usealta virheeltä, käytetään laitteiden monistamista. Esimerkiksi, kaikki tieto kirjoitetaan kolmelle eri muistipiirille ja tietoa luettaessa tarkistetaan aina, ovatko tiedot edelleen samanlaisia. Jos eivät ole, niin sitten enemmistön kanta voittaa. Jos jokin muistipiiri useamman kerran antaa muista poikkeavan tuloksen, niin se merkitään vialliseksi ja vaihdetaan mahdollisimman pian.

Joissakin järjestelmissä on usea suoritin ja kaikki koodi suoritetaan yhtä aikaa niissä kaikissa. Aina kun laskennan tulosta käytetään johonkin tärkeään, niin eri suorittimien antamia laskentatuloksia vertaillaan keskenään ennen operaation toteuttamista. Jos jokin suoritin useamman kerran antaa muista poikkeavan tuloksen, niin se merkitään vialliseksi ja vaihdetaan mahdollisimman pian.

Äärimmäisessä tapauksessa replikoidaan koko tietokonejärjestelmä. Esimerkiksi lentokoneissa on tyypillistä, että telineessä on usea samanlainen tietokone ja ne kaikkea ajavat samaa ohjelmaa. Kun ohjelma yrittää säätää vaikkapa peräsimen asentoa, niin tietokoneet äänestävät. Jos ne ovat kaikki samaa mieltä, niin operaatio sallitaan. Jos ne ovat eri mieltä, niin "toisinajattelija" jää vähemmistöön ja sen virheellinen toiminto laitetaan muistiin. Jos sama järjestelmä antaa liian usein virheellisen tuloksen, se merkitään vialliseksi ja koneen insinööriä pyydetään vaihtamaan se telineessä olevaan samanlaiseen varakoneeseen.

<text-box variant="example" name="Avaruussukkula Columbia">

Avaruussukkula [Columbian tietokonejärjestelmät](http://www.hq.nasa.gov/office/pao/History/computers/contents.html) oli replikoitu viidellä tietokoneella. Normaalilaskenta tapahtui neljällä samanlaisella tietokoneella, joiden laskennan tuloksia vertailtiin aina ennen sukkulaoperaation suorittamista. Jos jokin näistä neljästä tietokoneesta vikaantui, niin jäljellä oli silti vielä kolme tietokonetta tekemään enemmistöpäätöksiä. Jos miehistö jollain tavoin totesi kaikkien neljän tietokoneen antavan virheellisiä tuloksia, niin ilmeisesti kyseessä oli näitä tietokoneita haittaava ohjelmistovirhe. Äänestäminenhän ei tällaista virhettä voi mitenkään löytää, koska kaikki suorittavat samaa virheellistä ohjelmaa. Tältä varalta mukana oli viides (samanlainen) tietokone, joka suoritti eri versiota ohjelmistosta. Tämän ohjelmiston oli toteuttanut samojen vaatimusmäärittelyjen mukaisesti toinen ohjelmointitiimi, joten saman virheen todennäköisyys oli toivottavasti pieni.

</text-box>

Massamuistin monistaminen on aivan yleistä, myös ihan kotikoneissa. Kaupasta voi ostaa valmiina esimerkiksi kahden kiintolevyn järjestelmiä, joissa kaikki tiedostot tallennetaan aina kahdelle levylle. Jos yksi levy vikaantuu, niin tiedot ovat vielä tallessa toisella levyllä. Tiedostopalvelimissa käytetään yleensä mutkaisempia mutta kustannuksiltaan halvempia pariteettibitteihin perustuvia ratkaisuja. Tällaiset [RAID](https://en.wikipedia.org/wiki/RAID)-teknologiaan perustuvat ratkaisut sietävät yhden tai jopa kahden kiintolevyn rikkoutumisen ilman että tietoa häviää.

[Pilvipalveluissa](https://en.wikipedia.org/wiki/Cloud_computing) tiedostot talletetaan yhteen tai useampaan palvelinkeskukseen, joista ne ovat helposti käytettävissä verkon kautta yhdessä tai useammassa tietokonejärjestelmässä. Tiedot replikoidaan useaan palvelinkeskukseen ja kussakin niissä tieto suojataan virheiltä esim. RAID-teknologialla. Tietojen täydellinen katoaminen on hyvin epätodennäköistä.

Laitteiden monistaminen tiedon muuttumattomuuden turvaamiseksi on siis varsin yleistä. Se, millä tasolla virheiltä suojaaminen tapahtuu, riippuu tietenkin järjestelmän käyttötarkoituksesta. Kotikoneille voi riittää tärkeiden kuvatiedostojen replikointi kahdelle kovalevylle. Toisaalta, ydinvoimalan ohjausjärjestelmän täytyy toimia aina virheettömästi ja olemme valmiita maksamaan siitä aiheutuvat ehkä valtavatkin lisäkustannukset.

## Quizit 7.2.5  - Tiedon suojausmenetelmät
<!-- Quiz 7.2.5 Tiedon suojausmenetelmät -->
<div><quiz id="a55e63d0-83b0-41f6-a4d1-da99fd0a25e4"></quiz></div>

