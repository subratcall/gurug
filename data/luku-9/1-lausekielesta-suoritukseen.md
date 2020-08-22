---
path: '/luku-9/1-lausekielesta-suoritukseen'
title: 'Lausekielestä suoritukseen'
hidden: false
---

<div>
<lead>Tässä aliluvussa 9 annamme yleiskuvan, kuinka korkean tason kielellä (esim. Fortran, C tai C++) kirjoitetusta ohjelmasta saadaan järjestelmän suorittimella suoritettava prosessi. Muunnos tapahtuu kolmessa selkeässä vaiheessa. Kääntämisellä generoidaan konekielistä koodia ohjelman osista (moduuleista), linkityksessä ne kootaan suorituskelpoiseksi ohjelmaksi ja latauksessa ohjelmasta luodaan järjestelmän tuntema prosessi. 
</lead>
</div>

## Lausekielisestä ohjelmasta prosessiksi
Tavanomainen tapa suorittaa ohjelmia on tehdä niistä käyttöjärjestelmän tunnistama prosessi, jonka konekielisiä käskyjä suoritin suorittaa. Ohjelmien kirjoittaminen konekielellä on jonkin verran työlästä, minkä vuoksi on kehitetty ensin symbolisia konekieliä (ttk-91 on hyvä esimerkki) ja sitten korkean tason kieliä. On paljon mukavampaa kirjoittaa koneen läheistä koodia käyttäen symbolista konekieltä kuin puhdasta numeerista konekieltä. Ennen suoritusta symbolinen konekieli pitää kuitenkin kääntää konekielelle ja palaamme tähän käännökseen vähän myöhemmin.

Korkean tason kielet on kehitetty ohjelmoijan näkökulmasta. Kukin korkean tason kieli antaa vähän erilaisen ajattelun välineen ohjelmointiongelman ratkaisemiseksi. Ohjelmoinnin ammattilaiset osaavat useita ohjelmointikieliä ja yleensä ensimmäinen vaihe ohjelmointiprojektissa on valita ongelmaan sopiva ohjelmointikieli. Puhtaan numeerisen laskennan määrittelyyn paras ohjelmointikieli voisi olla [Fortran](https://fi.wikipedia.org/wiki/Fortran) tai [C](https://fi.wikipedia.org/wiki/C_(ohjelmointikieli)), tietokannan toiminnan kuvaamiseen [SQL](https://fi.wikipedia.org/wiki/SQL), monimutkaisen sumean logiikan kuvaamiseen [Prolog](https://fi.wikipedia.org/wiki/Prolog) tai [Lisp](https://fi.wikipedia.org/wiki/Lisp), jne. Usein kielen valintaan vaikuttaa myös oman organisaation muut tavoitteet, jolloin esimerkiksi standardoinnin tarve voi olla tärkeämpää kuin projektin toteutus siihen parhaiten sopivalla kielellä.

Isossa ohjelmointiprojektissa voi olla useita eri osia, joista kukin voidaan ratkaista siihen sopivimmalla ohjelmointikielellä.
Lisäksi ohjelmoinnissa pyritään hyödyntämään aikaisemmin tehtyä työtä. Käytännössä tämä tarkoittaa esimerkiksi ikivanhan suuren Fortranilla kirjoitetun ohjelmistopaketin käyttöä, koska se on edelleen joiltakin osin hyvin käyttökelpoinen eikä organisaatio halua sijoittaa resursseja sen uudelleenohjelmointiin.

Hyvin tyypillistä ohjelmoinnissa on käyttää valmiita kirjastomoduuleja. Niistä on useita hyötyjä. Ennen kaikkea ne on (yleensä) hyvin ohjelmoitu, joten niiden testaamiseen ei tarvitse käyttää kovin paljoa aikaa. Ne sisältävät hyvin optimoitua kooodia, joten ne suorittavat nopeasti. Kirjastomoduulit voivat olla käyttöjärjestelmän antamia palveluja tai ne voivat liittyä johonkin tiettyyn ohjelmointikieleen. Käyttöjärjestelmän kirjastomoduulit voivat ehkä suorittaa etuoikeutetussa tilassa ja käyttää suoraan laitteistoa. 

<!-- Kuva: ch-9-1-lausek-suoritukseen -->

![Neljä laatikkoa päällekkäin. Ylimmässä on käännösyksikkö, joka on lausekielinen ohjelma tai moduuli ja jossa viittaukset dataan tai koodiin tehdään symboleilla. Esimerkkinä käännösyksiköstä on oikealla oleva ohjelma prog.c. Seuraava laatikko on objektimoduuli, joka konekielinen ohjelman osa ja jossa viittaukset koodiin ja dataan tehdään moduulin omaan pienehkoon osoitevaruuteen 0-N. Se saadaan kääntämällä käännösyksiköstä, mitä kuvaa vasemmalla oleva kaareva nuoli. Esimerkkeinä objektimoduuleista ovat Linux-tiedosto prog.c ja vastaava Windows-tiedosto prog.obj. Objektimoduuleja ovat myös Linuxin kirjastomoduuli math.l ja vastaava Windowsin moduuli math.sll. Kolmas laatikko on Ajomoduuli, joka on kokonainen ohjelma ja jonka data- ja muistiviitteet kohdistuvat yhteen suureen osoiteavaruuteen 0-isoN. Se saadaan linkittämällä halutut objektimoduulit yhteen, mitä kuvaa vasemmalla oleva kaareva nuoli. Esimerkkeinä ajomoduuleista ovat Linux-tiedosto prog ja windows-tiedosto prog.exe. Alimmainen laatikko on prosessi, joka on järjestelmässä (muistissa) oleva suorituskelpoinen ohjelma ja jonka muistiavaruus on yhtenäinen 0-isoN. Muistiosoitteet voivat olla virtuaalisia. Prosessi saadaan lataamalla ajoduuli, mitä kuvaa vasemmalla oleva kaareva nuoli. Esimerkkeinä ajomoduuleista ovat Linuxin prosessi 1236 ja Windows-prosessi 1034.](./ch-9-1-lausek-suoritukseen.svg)
<div>
<illustrations motive="ch-9-1-lausek-suoritukseen" frombottom="0" totalheight="40%"></illustrations>
</div>

### Käännösyksikkö
Korkean tason kielellä (kielillä) toteutetussa ohjelmassa perusyksikkö on _käännösyksikkö_. Ohjelma koostuu useasta käännösyksiköstä, jotka voidaan kääntää yksi kerrallaan. Tämä helpottaa suuren ohjelmiston kehitystyötä, kun ohjelmisto koostuu pienemmistä käännösyksiköistä, jotka kukin ratkaisevat jonkin pienemmän osaongelman. Esimerkiksi käyttöliittymä voisi olla oma käännösyksikkönsä, samoin kuin matriisien kertolasku tai lineaarisen yhtälöryhmän ratkaisija.

Käännösyksikössä ei ole käytössä mitään (muisti)osoitteita, vaan kaikki viittaukset muuttujiin, tietorakenteisiin ja ohjelman osoitteisiin tehdään kyseisen korkean tason ohjelmointikielen symbolien avulla.  Mitä pienempiä käännösyksiköt ovat, sitä nopeammin niiden kääntäminen tapahtuu. Toisaalta, pieniä käännösyksiköitä tarvitaan enemmän, joten niiden linkittämiseen toisiinsa voi kulua paljon aikaa.

Käännösyksikössä täytyy määritellä yhteydet muihin käännösyksiköihin. Esimerkiksi täytyy jollain tavoin kuvata, minne kaikkialle muihin käännösyksiköihin viitataan ja mitkä tämän käännösyksikön aliohjelmista tai metodeista ovat kutsuttavissa muista käännösyksiköistä. 

Linux- ja window-järjestelmissä C-kieliset käännösyksiköt (tiedostot) nimetään _.c_ loppuliitteellä. Pieni ohjelma voi koostua vain yhdestä käännösyksiköstä, mutta yleensä tarvitaan useita. Kääntäjä kääntää käännösyksiköt yksi kerrallaan _objektimoduuleiksi_.


### Objektimoduuli
Objektimoduulissa koodi on jonkin tietyn suorittimen konekieltä. Käännösyksikön muistiosoitteita vastaavat symbolit on nyt muutettu muistiosoitteiksi tämän käännösyksikön omaan [osoiteavaruuteen](https://fi.wikipedia.org/wiki/Osoiteavaruus). Kukin objektimoduuli on suhteellisen pieni, joten sen osoiteavaruuskin on suhteellisen pieni, esim. 0-4765, 0-234567 tai 0-7654321. Kaikki on suhteellista. Jokaisella objektimoduulilla on oma nollasta alkava osoiteavaruutensa, johon koodi- ja data muistiviitteet kohdistuvat.

Linuxissa tavallisen käännetyn objektimoduulin nimen loppuliite on _.o_, mutta kirjastojen objektimoduulien loppuliite on _.l_. Kirjastojen objektimoduulit ovat ihan tavallisia objektimoduuleja ja ne on käännetty (suoritusaikaa optimoiden) samalla tavalla käännösyksiköistä. Windows-järjestelmissä objektimoduulien loppuliite tavallisilla objektimoduuleilla on _.obj_ ja kirjastomoduuleilla _.sll_ (statically linked library). 

Eri ohjelmointikielillä kirjoitettujen käännösyksiköiden objektimoduuleilla on sama rakenne. Tämä on hyvin käyttökelpoista, koska se tekee helpoksi eri ohjelmointikielien käytön saman ohjelman toteutuksessa. Esimerkiksi, Java-ohjelma saattaa käyttää helpommin optimoitavalla C-kielellä kirjoitettua matematiikkakirjastoa tai tekoälykielellä kirjoitettua puheentunnistuskirjastoa.

Käännösyksikkö voi olla kirjoitettu myös kyseessä olevan suorittimen symbolisella konekielellä. Kääntäminen on tällöin huomattavasti helpompaa kuin korkean tason kielten yhteydessä. Huonona puolena symbolisella konekielellä kirjoitetuista käännösyksiköistä on juuri se, että ne toimivat vain tietyn suoritinarkkitehtuurin yhteydessä. Korkean tason kielellä kirjoitetut käännösyksiköt ovat paljon helpommin siirrettävissä eri järjestelmiin.

Esimerkkimme ohjelman _prog.c_ objektimoduuli (tiedosto) Linux-järjestelmässä olisi nimeltään _prog.o_ ja sen käyttämä matematiikkakirjasto (sen objektimoduuli) _math.l_. Windows-järjestelmissä nuo moduulit olisivat vastaavasti _prog.obj_ ja _math.sll_.

### Latausmoduuli
Käännösyksiköistä käännetyt objektimoduulit linkitetään yhteen _latausmoduuliksi_ (ajomoduuli, load module, executable). Latausmoduulissa yksittäisten objektimoduulien osoiteavaruudet täytyy yhdistää _linkittämällä_, mikä on jonkin verran työläs tehtävä. Esimerkiksi, jos muuttujan _X_ osoite objektimoduulissa _prog.o_ oli 0x0A57, niin linkitetyssä latausmoduulissa se voisi olla 0x00045424, jolloin kaikki viittaukset osoitteeseen 0x0A57 (muuttujaan _X_) moduulissa _prog.o_ täytyy päivittää arvoon 0x00045424. Vastaavasti, jos kirjastossa _math.l_ rutiinin _sqrt_ osoite oli 0x006688, niin linkityksen jälkeen osoitteeksi voisi tulla 0x00047654, mikä pitää päivittää kaikkialle moduulin _prog.o_ rutiinin _sqrt_ kutsukohtiin.

Latausmoduulin osoiteavaruuden koko on siihen linkitettyjen objektimoduulien osoiteavaruuksien kokojen summa ja se voi olla aika iso. Kaikki data- ja koodiviittaukset eri moduuleissa kohdistuvat nyt kuitenkin tähän yhteen ja samaan lineaariseen isoon osoiteavaruuteen.

Linkitys on sitä monimutkaisempaa, mitä useampi objektimoduuli linkitetään yhteen. Kun ohjelma jaetaan erillisiin käännösyksiköihin, joiden erikseen käännetyt objektimoduulit yhdistetään linkittämällä, tilanne on aina kompromissi. Jos käännösyksiköt ovat pieniä, ne on nopea kääntää ja ohjelmiston kehitys on nopeata sen käännösyksikön osalta. Toisaalta taas on työlästä linkittää suuri määrä objektimoduuleja. Jos taas käännösyksiköt ovat suuria, niiden kehittäminen on hitaampaa, kun jokaisen pikkumuutoksen jälkeen pitää suuri käännösyksikkö kääntää uudelleen. Lopuksi tapahtuva linkitys on kuitenkin tässä tapauksessa helpompaa. Parasta kuitenkin on, että käännösyksikkö on luonteva osakokonaisuus koko ohjelmasta tai ohjelmistosta.

Usein linkitystä tehdään myös vaiheittain. Ensin voidaan esimerkiksi linkittää paljon toisiinsa sidoksissa olevat objektimoduulit toisiinsa ja vasta lopuksi linkitetään yhteen kaikki osittain linkitetyt moduulit. 

Joissakin tapauksissa osa linkityksestä voidaan tehdä vasta suoritusaikana tarvittaessa. Huonona puolena on suorituksen keskeytyminen pitkäksikin aikaa, koska linkitys voi kestää kauan. Windowsissa useat kirjastomoduulit ovat tällaisia suoritusaikana dynaamisesti linkitettäviä moduuuleja ja ne on nimetty _.dll_ (dynamically linked library) loppuliitteellä. Etuna dynaamisesti linkitettävien moduulien käytöstä on, että latausmoduuleista tulee näin pienempiä, jolloin ne on nopeampia ladata muistiin suoritusta varten. Käyttäjästä on mukavaa, kun ohjelma käynnistyy nopeasti. Esimerkiksi tietokonepelissä eri pelitasojen toteutus voi olla omissa dynaamisesti linkitettävissä kirjastomoduuleissaan, jotka linkitetään paikalleen vasta tarvittaessa. Pelaaja huomaa tänä selvänä viiveenä tasolta toiseen siirryttäessä. Useat pelaajat eivät koskaan pääse ylemmille pelitasoille, minkä vuoksi niiden dll-moduuleja ei tarvitse missään vaiheessa linkittää paikalleen.

Linuxissa latausmoduuleilla ei ole tiedoston nimessä mitään erityistä loppuliitettä, mutta Windowsissa nimessä on usein loppuliite _.exe_. Käyttöjärjestelmän lataaja tunnistaa latausmoduulit niiden sisäisestä tiedoista riippumatta siitä, minkä nimisiä ne ovat. Esimerkin ohjelman _prog.c_ latausmoduuli (tiedosto) voisi olla Linuxissa nimeltään _prog_ ja Windowsissa _prog.exe_.

### Prosessi
Prosessi on käyttöjärjestelmän tunnistama jonkin ohjelman järjestelmässä suorituksessa oleva [instanssi](https://fi.wikipedia.org/wiki/Instanssi_(ohjelmointi)) (ilmentymä). Se luodaan latausmoduulista _lataamalla_. Samasta ohjelmasta voi olla monta prosessia samaan aikaan järjestelmässä. Jokaisella prosessilla on oma suurehko osoiteavaruutensa, joka on vielä vähän isompi kuin latausmoduulissa oli. Siinä on nyt mukana myös käyttöjärjestelmän tarvitsemat prosessin hallintaan liittyvät alueet, kuten prosessin kuvaaja (PCB) ja ehkä myös sen pino omana alueenaan.

Prosessit tunnistetaan järjestelmässä niiden yksikäsitteisistä tunnuksista (pid, process id). Esimerkin ohjelmasta _prog.c_ saataisiin lataamisen yhteydessä Linuxissa vaikkapa prosessi 1326 ja Windowsissa prosessi 11034.


## Quizit 9.1  
<!-- Quiz 9.1.?? -->
<div><quiz id="9d362f0d-7d31-438f-b168-cfd194bb3719"></quiz></div>
<div><quiz id="9a5e8c70-7aed-4c90-9148-cc0fb79adcf0"></quiz></div>
<div><quiz id="aa632fda-87af-43e8-90c8-e13c5dc139ef"></quiz></div>
