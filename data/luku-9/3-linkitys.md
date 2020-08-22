---
path: '/luku-9/3-linkitys'
title: 'Linkitys'
hidden: false
---

<div>
<lead>Tässä aliluvussa annamme yleiskuvan linkityksen toteuttamisesta. Se voidaan tehdä heti kääntämisen jälkeen, latauksen yhteydessä tai suoritusaikana.  
</lead>
</div>

## Staattinen linkitys
Normaalitapaus linkityksestä on staattinen linkitys, jossa ohjelman kaikki objektimoduulit yhdistetään yhdeksi ajomoduuliksi ennen suoritusta. Kaikilla tunnuksilla on tunnettu arvo, eikä mitään ohjelman osia puutu.

Tämän pääluvun alussa ensimmäisessä aliluvussa esiteltiin linkityksen perusidea. Täsmennämme nyt sitä tässä esimerkin avulla.

Meillä on kolme käännettyä moduulia, jotka ovat GameX, Stats ja Math. Math-moduuli on kirjastomoduuli, vaikka sillä ei ole tässä merkitystä. Pääohjelma on moduulissa GameX, jonka osoiteavaruus on 0-7999. Siellä on määritelty ainakin yksi muuttuja X (osoitteessa 0), johon viitataan ainakin osoitteessa 234 olevassa konekäskyssä. Konekäskyssä osoitteessa 3333 kutsutaan moduulin Stats tilastorutiinia Report. GameX'n uudelleensijoitustaulusta löytyy paikallisen symbolin X arvo 0 ja sen viittauskohdat.  GameX'n EXPORT-hakemisto on tyhjä, koska siinä moduulissa ei ole muiden moduulien viitattavissa olevia rakenteita. Sen IMPORT-hakemistossa on moduulin Stats tilastorutiini Stats.Report, johon on viitattu (ainakin) käskyssä 3333.

Moduulin Stats osoiteavaruus on 0-5999. Siellä on (ainakin) muuttuja A, joka on osoitteessa 0 ja johon on viitattu ainakin osoitteissa 302 ja 850. EXPORT-hakemistossa on moduulin palvelurutiini Report, jonka osoite on 800. IMPORT-hakemistossa on moduulin Math matematiikkarutiini Math.Aver, johon on viitattu osoitteessa 840.

Moduulin Math osoiteavaruus on 0-4999. Siellä on (ainakin) muuttuja Sum, joka on osoitteessa 0 ja johon on viitattu ainakin osoitteissa 5 ja 2450. EXPORT-hakemistossa on keskiarvon laskentarutiini Aver, jonka osoite on 2400. Sen IMPORT-hakemisto on tyhjä, koska moduuli Math ei käytä mitään moduulin ulkopuolisia rakenteita.

<!-- kuva: ch-9-3-moduulit-ennen-linkitysta  -->

![Kolmen moduulin tiedot. Otsake GameX moduulit ennen linkitystä. Ylhäällä on pääohjelman moduuli GameX, jossa on muuttuja x osoitteessa 0, x:ään tallennuskäsky osoitteessa 234 ja Stats.Report rutiiniun kutsu osoitteesa 3333. Moduulin koko on 8000 sanaa. GameX:n uudelleensijoitustaulussa on symbolin x arvobna 0 ja sen viittauspaikkana 234. Export-taulu on tyhjä, mutta Import-taulussa Stats.Report viite osoitteessa 3333.    Keskellä on moduuli Stats, jossa on muuttuja a osoitteessa 0 ja siihen viitataan osoitteissa 302 ja 850. Moduulin koko on 6000 sanaa. Osoitteessa 800 on määritelty rutiini Report, joka osoitteessa 840 kutsuu rutiinia Math.Aver. Stats'in uudelleensijoitustaulussa on symboli a, jonka arvo on 0 ja johon on viitattu osoitteista 302 ja 850. Export-taulussa on Report-rutiinin osoite 800 ja Import-taulussa rutiinin Math.Aver osoite 840.     Alimpana on kirjastomoduuli Math, jossa on muuttuja sum osoitteessa 0 ja siihen viitataan osoitteissa 5 ja 2450. Moduulin koko on 5000 sanaa. Osoitteessa 2400  on määritelty rutiini Aver. Math'in uudelleensijoitustaulussa on symboli sum, jonka rvoon 0 ja johon on viitattu osoitteissa 5 ja 2450. Export-taulussa on palvelurutiinin Aver osoite 2400 ja Import-taulu on tyhjä.](./ch-9-3-moduulit-ennen-linkitysta.svg)
<div>
<illustrations motive="ch-9-3-moduulit-ennen-linkitysta"></illustrations>
</div>

Linkityksessä moduulit täytyy laittaa muistiin johonkin järjestykseen ja samalla niiden osoiteavaruudet täytyy yhdistää. Tällä kertaa laitamme ne edellä esitetyssä järjestyksessä, jolloin GameX tulee ensimmäisenä ja Math viimeisenä. Koska GameX on ensimmäisenä, niin sen osoitteet eivät muutu ja sen uudelleensijoitusvakio on nolla (0). 

Seuraavaksi tulee moduuli Stats. Sitä edeltää moduuli GameX, jonka koko on 8000 sanaa, joten uudelleensijoitusvakio on 8000. Moduulin Stats kaikkiin sisäisiin viitteisiin täytyy lisätä tuo 8000, joten kaikki muuttujan a viittaukset täytyy päivittää osoitteeseen 8000 (=0+8000). Palvelurutiinin Report osoite oli 800, mutta nyt se päivittyy osoitteeksi 8800 (=800+8000). Tämä sijoitetaan myös moduulin GameX rutiinin Stats.Report kutsuosoitteeksi.

Kirjastomoduuli Math on viimeisenä. Sitä edeltävät moduulit GameX ja Stats, joiden yhteinen koko 14000 on siten moduulin Math uudelleensijoitusvakio.  Kaikki viitteet muuttujaan Sum kohdistuvatkin nyt osoitteeseen 14000 (=0+14000) ja keskiarvon laskentarutiinin Aver osoite päivittyy arvoon 16400 (=2400+14000). Se laitetaan paikalleen kyseisen rutiinin kutsukohtaan moduulissa Stats.

<!-- kuva: ch-9-3-moduulit-jalkeen-linkityksen  -->

![Otsake Staattisesti linkitetty GameX latausmoduuli. Moduulin koko on 19000 sanaa. latausmoduuli koostuu 3 moduulista gameX, Stats ja Math. Uudelleensijoitusvakiot ovat 0 (GameX), 8000 (Stats) ja 14000 (Math). Symbolin x arvo 0 on ennallaan.    Moduulissa Stats symbolin a uusi arvo on 8000 ja se on päivitetty muuttujan a viitekohtiin. Rutiinin Report uusi osoite on 8800 ja se on päivitetty rutiinin Stats.Report kutsukohtaan moduulissa GameX.    Moduulissa Math symbolin sum arvo on 14000 ja se on päivitetty muuttujan sum viitekohtiin. Rutiinin Aver uusi osoite on 16400 ja se on päivitetty rutiinin Math.Aver kutsukohtaan moduulissa Stats.   Symboolitaulussa kaikilla symboleilla on tunnettu arvoo ja niiden viittauskohdat on päivitetty tähän uuteen isoon yhtenäiseen osoiteavaruuteen 0-18999. Export-taulussa on Stats.Report (osoite 8800) ja Math.Aver (osoite 16400). Niidenkin osoitteet on päivitetty tähän uuteen isoon yhtenäiseen osoiteavaruuteen 0-18999.](./ch-9-3-moduulit-jalkeen-linkityksen.svg)
<div>
<illustrations motive="ch-9-3-moduulit-jalkeen-linkityksen"></illustrations>
</div>

Linkitetyssä latausmoduulissa kaikilla symboleilla on nyt arvo. Sen EXPORT-hakemistossa on uuden linkitetyn moduulin osoitteet kaikille palvelurutiineille ja IMPORT-hakemisto on tyhjä, koska kaikki viitteet muihin moduuleihin on ratkaistu. 

Symbolien viittauskohdat on päivitetty linkitetyn moduulin uudelleensijoitustauluun siltä varalta, että linkitys vielä jostain syystä jatkuisi eteenpäin. Jos linkitystä ei enää tarvitse tehdä, niin uudelleensijoitustaulu ja symbolitaulu voidaan jättää pois.

## Quizit 9.3 staattinen linkitys
<!--  quizit 9.3.???  -->
<div><quiz id="aec1b502-8b29-4f47-a0a8-e702f13cbda7"></quiz></div>

## Dynaaminen linkitys
Useissa tapauksissa on järkevää tehdä linkitys dynaamisesti vasta suoritusaikana ([run-time dynamic linking](https://en.wikipedia.org/wiki/Dynamic_linker)). Oletetaan esimerkiksi, että edellisen esimerkin GameX kirjastomoduuli Math olisi dynaamisesti linkitettävä moduuli. Nyt latausmoduulista puuttuu moduuli Math ja rutiini Math.Aver on merkitty puuttuvaksi latausmoduulin IMPORT-hakemistoon. Rutiinin Math.Aver kutsukohtaan on jollain tavoin koodattu, että viite kohdistuu dynaamiseksi linkitettävään moduuliin. Koodaus voi olla esimerkiksi epäkelpo muistiosoite, jonka avulla käyttöjärjestelmälle annetaan suoritusvuoro tarpeen tullen.

Jos nyt suoritusaikana tulee kutsu rutiiniin Math.Aver, niin epäkelvon muistiosoitteen kautta kontrolli siirtyy keskeytyskäsittelijälle, joka (a) huomaa, että kysymyksessä on dynaamisen linkityksen tarve ja (b) huomaa, että kyseessä on moduuli Math. Keskeytyskäsittelijä laittaa prosessin GameX odotustilaan, etsii moduulin Math (sen uusimman version) ja käynnistää dynaamisen linkittäjän. Kun linkitys on valmis, prosessi GameX voi taas jatkaa suoritusta (samasta konekäskystä). Tällä kertaa rutiinin Math.Aver kutsukäskyssä (osoitteessa 8840) on toimiva osoite ja rutiinin Math.Aver kutsu voidaan suorittaa normaalisti.

<!-- kuva: ch-9-3-ajomoduuli-ennen-dyn-linkitysta  -->

![Otsake Dynaamisesti linkitetty GameX latausmoduuli. Moduulin koko on 14000 sanaa. Latausmoduuli koostuu 2 moduulista GameX ja Stats. Uudelleensijoitusvakiot ovat 0 (GameX) ja 8000 (Stats). Symbolin x arvo 0.    Moduulissa Stats symbolin a arvo on 8000 ja se on päivitetty muuttujan a viitekohtiin moduulissa Stats. Rutiinin Report uusi osoite on 8800 ja se on päivitetty moduulin GameX rutiinin Stats.Report kutsukohtaan. Rutiinissa Report on Math.Aver kutsu ja siinä osoitekentäksi on laitettu epäkelpo muistisoite -23.    Export-taulussa on Stats.Report (osoite 8800) ja Import-taulussa Math.Aver (arvo -23, viitekohta 8840). ](./ch-9-3-ajomoduuli-ennen-dyn-linkitysta.svg)
<div>
<illustrations motive="ch-9-3-ajomoduuli-ennen-dyn-linkitysta"></illustrations>
</div>

Dynaamisen linkityksen käytöstä ohjelman GameX yhteydessä on useita etuja. Sen latausmoduuli on pienempi, koska siitä puuttuu moduuli Math. Jos tietyllä suorituskerralla moduulin Math palveluja ei tarvita lainkaan, niin sitä ei tarvitse linkittää paikalleen missään vaiheessa. Lisäksi dynaamisesti linkitettävästä moduulista Math voidaan helposti ottaa aina uusin versio käyttöön ilman, että sitä käyttäviä ohjelmia tarvitsee kääntää uudelleen. Tämä on erityisen kätevää esimerkiksi verkosta ladatun pelin GameX yhteydessä, koska alkuperäisen korkean tason kielellä kirjoitetun ohjelman objektimoduuleja (tai korkean tason kielellä kirjoitettuja käännösyksiköitä) ei ole edes saatavilla pelaajan omalla koneella.

Dynaaminen linkitys ei sovi kaikkialle. Esimerkiksi, jos kyseessä on lentokoneen ohjausjärjestelmä, niin siinä ei välttämättä ole aikaa ruveta linkittämään lennon aikana. Usein myös halutaan, että latausmoduulissa on nimenomaan kaikki mahdolliset osat valmiina. Tällöin riittää latausmoduulin kopiointi toiseen (saman arkkitehtuurin) järjestelmään. Jos dynaamista linkitystä käytetään, niin sitten kaikki mahdollisesti dynaamisesti linkitettävät moduulit täytyy olla myös saaavutettavissa. Lisäksi järjestelmään täytyy tietenkin kuulua käyttöjärjestelmän osana dynaaminen linkittäjä, mikä tekee käyttöjärjestelmästä suuremman ja monimutkaisemman.

Toinen esimerkki dynaamisen linkityksen tarpeesta on useat tietokonepelit. Niissä erityisesti halutaan pieniä latausmoduuleja, jotta pelit käynnistyvät nopeasti. Lisäksi niissä voi olla monta kymmentä erilaista tasoa, joista pelin yhdellä suorituskerralla voi olla käytössä vain yksi tai muutama. On turhaa pitää latausmoduulissa mukana tasoja, joita ei luultavasti tarvita. Peliä käynnistettäessä ladataan vain tämän pelaajan heti alkuun tarvitsemat moduulit. Toisenlaisen käyttömahdollisuuden dynaamiselle linkitykselle antavat pelin erilaiset lisäosat, joita voi pelin pelaamisen aikanakin (ostamalla?) ladata verkon kautta ja sitten dynaamisesti linkittää paikalleen. Tällainen lisämoduuli voisi olla vaikkapa jokin uusi pelialue, joka on toteutettu vasta pelin valmistumisen jälkeen.

Dynaamista linkitystä voidaan tehdä myös pelkästään latausaikana (load-time dynamic linking). Tämä tarkoittaa, että kaikki mahdollisesti suoritusaikana tarvittavat moduulit linkitetään dynaamisesti paikalleen latauksen yhteydessä. Tällöin joka suorituskerta saadaan automaattisesti käyttöön uusimmat versiot kyseisistä moduuleista. Huonona puolena tässä lähestymistavassa on tietenkin ohjelman käynnistymisajan pidentyminen. Lopputulos on sama kuin staattista linkitystä käytettäessä, mutta linkitys tehdään joka latauskerta uudelleen. Joustavuudesta ja ajan tasalla olemisesta ollaan valmis maksamaan korkea hinta, mutta esimerkiksi tietoturvapäivitysten yhteydessä tämä voi tuntua kohtuulliselta.

Dynaaminen linkitys voidaan tehdä myös yhdistelemällä edellä esitettyjä menetelmiä. Tällöin jonkin prosessin dynaaminen linkitys latausaikana määritellyille moduuleille aloitetaan välittömästi, mutta prosessin suoritus voi alkaa samanaikaisesti. Kyseinen prosessi jää odottamaan dynaamisen linkityksen valmistumista vain silloin, jos se viittaa sellaiseen dynaamisesti linkitettävään moduuliin, jonka linkitys ei ole vielä valmistunut. Tällä tavoin menetellään esimerkiksi järjestelmän käynnistämisen yhteydessä, kun usea käyttöjärjestelmäprosessi pitää käynnistää ja niillä voi olla paljon latausaikana dynaamisesti linkitettäviä moduuleja. Näin käyttöjärjestelmä pysyy helposti ajan tasalla, mutta järjestelmä on käytettävissä silti nopeasti. Tosin alussa järjestelmä tuntuu vähän hitaalta, koska meneillään oleva dynaaminen linkitys vaatii paljon suoritinaikaa tai käyttäjä on viitannut vielä linkittämättömiin moduuleihin.

<!--  quizit 9.3. dynamic linking  -->
<div><quiz id="9565e624-76f8-4563-8f24-c57d65a09fca"></quiz></div>
