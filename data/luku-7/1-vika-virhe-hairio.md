---
path: '/luku-7/1-vika-virhe-hairio'
title: 'Vika, virhe ja häiriö'
hidden: false
---

<div>
<lead>Kaikki tieto koostuu biteistä, jotka talletetaan fyysisesti erilaisiin muisteihin tai rekistereihin ja joita siirretään väylien johtimia pitkin järjestelmässä paikasta toiseen. Joissakin tapauksissa talletettu tai siirrettävä bitti voi vaihtua virheelliseksi jo laitteistovian vuoksi tai esimerkiksi satunnaisen alkeishiukkasen kulkiessa piirin läpi. Niin tai näin, niin haluaisimme ainakin havaita syntyneen virhetilanteen. Vielä parempaa olisi, jos pystyisimme myös paikallistamaan virheellisen bitin talletetussa tai siirrettävässä sanassa ja korjaamaan sen.</lead>
</div>

## Virheen käsite
Olisi tietenkin mukavaa, jos voisimme aina luottaa tietokoneisiin. Tämä tarkoittaa, että kaikki ohjelmat toimisivat aina oikein ja että tietokoneet antaisivat aina oikean tuloksen käyttäjälle. Valitettavasti emme ole lähelläkään tällaista ideaalitilaa. Vaikka pääsisimme yhteysymmärrykseen filosofisista käsitteistä "toimii oikein" ja "tulos on totta", tietokonejärjestelmien on silti vaikea aina tuottaa oikea lopputulos.

Suurten ohjelmistojen tekeminen on vaikeata, eikä meillä yleensä ole tarvittavia resursseja kaikkien ohjelmointivirheiden välttämiseksi. Useassa tapauksessa se ole edes tarkoituksenmukaista, koska järjestelmien täytyy valmistua järkevissä aikarajoissa ja budjeteissa. Joissakin tapauksissa ohjelmia voi suunnitella toimimaan oikein annettujen speksien mukaisesti, tai voimme jopa todistaa, että ne toimivat oikein annettujen speksien mukaisesti. Emme kuitenkaan käsittele tällä kurssilla ohjelmien testaamista tai niiden toimivuuden oikeaksi todistamista.

Yleisesti ottaen tiedon oikeellisuutta ei voida tarkistaa. Jos muuttujassa X on talletettu Villen syntymävuodeksi 1973, niin ohjelma vain uskoo sen eikä yritäkään tarkistaa sitä mitenkään. Toisaalta, jos jokin virhe muuttaa rekisterin tai muistipaikan X oikean arvon 1973 arvoksi 1975, niin se voidaan ehkä havaita ja virhe voidaan ehkä jopa korjata! Tällaisen virheen voisi aiheuttaa esimerkiksi viallinen muistipiiri, johon bitti nro 1 (toinen bitti oikealta) tallentuu aina bittinä 1. Toinen syy virheeseen voisi olla, että avaruudesta on saapunut jokin alkeishiukkanen, joka on flipannut (kääntänyt) tuon saman bitin toisin päin. Tämä viimeksi mainittu ongelma on täysin realistinen ja siihen tulisi varautua. Keskitymme jatkossa järjestelmään talletetun tiedon integriteetin turvaamiseen, emmekä puutu tiedon filosofiseen oikeellisuuteen sen enempää.

Muistipiissä oleva vika on pysyvää tyyppiä ja sen voi korjata vaihtamalla muistipiiri, mikä käytännössä ei välttämättä ole aina ihan helppoa. Laitehan voi vaikka olla satelliitissa maata kiertämässä. Toisaalta, joissakin muistipiireissä on varabittejä auton vararenkaan tavoin, jolloin järjestelmä pystyy vian havaitessaan ottamaan jatkossa tuon varabitin käyttöön bitin numero 1 asemesta. Kuten autonkin renkaiden laita on, vikaantunut muistipiiri olisi hyvä vaihtaa eheään mahdollisimman pian.

Avaruudesta tulleen alkeishiukkasen aiheuttama virhe on ohimenevää (transienttia) tyyppiä, eikä järjestelmää pidä sen vuoksi korjata millään tavalla. Olisi tietenkin mukavaa, jos satunnaisesti syntynyt virhe havaittaisiin ja ehkä jopa korjattaisiin.

## Vika, virhe ja häiriö
Tietokonejärjestelmissä erilaisten virhetilanteiden käsittely perustuu käsitteisiin _vika_, _virhe_ ja _häiriö_. "Vika" on joko ohjelmistossa tai laitteistossa oleva rakenteellinen vika, joka voi suoritusaikana aiheuttaa "virheen" ohjelman suorituksessa tai sen käyttämässä datassa. Joissakin tapauksissa tämä virhe voi sitten aiheuttaa "häiriön" järjestelmään.


<!-- Note: Rillit huurussa -->

<text-box variant="example" name="Vika, virhe häiriö Rillit huurussa -sarjassa">

Tv-sarjassa [Rillit huurussa](https://fi.wikipedia.org/wiki/Rillit_huurussa) Penny liukastuu ammeessa ja pyytää Sheldonia viemään hänet ensiapuun. Kun lääkäri kysyy Pennyltä, että mikä on vialla, Penny vastaa "liukastuneensa ammeessa". Sheldon kuitenkin ymmärtää asiat "paremmin" ja kertoo lääkärille, että varsinainen vika on siinä, että Pennyllä ei ole liukuestenauhoja ammeessaan. Pennyn liukastuminen oli tästä viasta aiheutunut virhe ja olkapään sijoiltaan meno liukastumisvirheen aiheuttama häiriö.  Sheldonin selitys ei oikeastaan auttanut tässä tilanteessa paljoakaan, vaikka olikin ehkä teknisesti oikein.

</text-box>

Kaikki viat eivät ole vaarallisia. Jossakin koodinpätkässä voi olla vika, mutta kyseistä koodia ei tulla koskaan suorittamaan. Ja vaikka viallinen koodi suoritettaisiinkin, niin kaikki virheetkään eivät ole merkittäviä. Jos esimerkiksi tietokonepelin Mörri-ötökkä jää piirtämättä näytölle vähäksi aikaa, niin pelaajan hahmo voi kuolla Mörrin yllätyshyökkäyksessä. Toisaalta, joskus pelitkin voivat olla hyvinkin tärkeitä, koska esimerkiksi peliturnauksissa voi olla kyse hyvinkin suurista palkintorahoista.

Jotkut virheet taas ovat hyvin vaarallisia. On tapauksia, jossa ohjelmointivirheen vuoksi [sädehoitolaite](https://en.wikipedia.org/wiki/Therac-25) on antanut potilaille liian paljon säteilyä tai Marsiin laskeutuva luotain [tuhoutunut](https://en.wikipedia.org/wiki/Mars_Polar_Lander).

Olisi hyvä, jos kaikki ihmishenkiä uhkaavat tai suuria taloudellisia tappioita aiheuttavat häiriöt saataisiin kuriin. NASA:lla oli [avaruussukkulan](https://fi.wikipedia.org/wiki/Avaruussukkula) ohjelmiston kehittämisessä selkeä prosessi vakavien häiriöiden minimoimiseksi. Joka kerta, kun jokin järjestelmähäiriö ilmeni, paikallistettiin ensin sen aiheuttanut virhe järjestelmässä ja sitten virheen aiheuttanut vika.

Useimmissa tapauksissa virhe löytyi ohjelmakoodista. Kaikki virheet luokiteltiin niiden mahdollisesti aiheuttaman häiriön perusteella luokkiin 1-5. Luokan 1 virheet olivat merkityksettömiä, eivätkä aiheuttaneet mitään lisätoimia. Luokan 5 virheet olivat sellaisia, että  kyseisen koodinpätkän suoritus avaruuslennon aikana olisi johtanut sukkulan menetykseen. Luokan 5 virheitä löytyi joka vuosi. Ne kaikki kuitenkin löydettiin ja korjattiin ennen kuin ne ehtivät aiheuttaa kategorian 5 häiriön.

Yleisin varsinainen vika oli ohjelmoijien puutteellinen koulutus. Esimerkiksi, ohjelmoija ei ollut hoksannut, että koodissa olisi samanaikaisuudesta aiheutuvia ongelmia. Häiriön aiheuttaneen virheen lisäksi koko koodi käytiin läpi, josko sieltä löytyisi saman tyyppisiä virheitä. Yleensä löytyi ja myös nämä ohjelmistotuotantotiimit pääsivät lisäkoulutukseen.


## Quizit 7.1
<!-- Quiz 7.1.?? -->
<div><quiz id="ac73f9aa-8954-4558-95ff-e3f75fa383f9"></quiz></div>
<div><quiz id="a36fd969-8226-44e2-8ce6-d80c40cc97b5"></quiz></div>
