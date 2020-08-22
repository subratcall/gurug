---
path: '/luku-8/3-io-toteutus'
title: 'I/O:n toteutus'
hidden: false
---

<div>
<lead>Pääoppimistavoitteena tässä aliluvussa on esitellä I/O:n erilaiset toteutustavat ja mitä ne vaativat I/O-laitteen laiteohjaimelta. Esittelemme myös erilaiset tavat suorittimelle tunnistaa, viittaako jokin konekäsky keskusmuistiin vai laiteohjaimen muistiin (laiterekisteriin). 
</lead>
</div>

## Laiteohjain ja laiteajuri
I/O:n toteutus on monimutkainen, koska siinä suoritetaan oikeasti täysin samanaikaisesti kahta eri prosessia, joiden tulee koordinoida toimintaansa keskenään. Työnjako on jaettu kahteen eri prosessiin: suorittimella suorittavaan laiteajuriin (DD, device driver) ja laiteohjaimella suorittavaan laiteohjainprosessiin (DCP, device controller process). Laiteajuri on osa käyttöjärjestelmää ja jokaista laiteohjainta (ja laitetta) varten on siihen sopiva laiteajuri. 

Laiteajuri pääsee suorittimelle suorittamaan aika ajoin, mutta DCP on periaatteessa suorituksessa koko ajan, koska laiteohjaimella ei ole mitään muuta tekemistä. Laiteajuri voi olla itsenäinen prosessi, jolloin käyttäjätason prosessin kutsuvat sitä viestein. Laiteajuri voi olla toteutettuna myös aliohjelmana, jolloin käyttäjäprosessit kutsuvat sitä aliohjelmien kutsukäskyillä tai SVC:llä. Tällöin laiteajuri suoritetaan osana käyttäjäprosessia. Joka tapauksessa laiteajuri (tai ainakin sen tärkeimmät osat) suoritetaan etuoikeutetussa tilassa.

Laiteohjaimella on kaksi rajapintaa, toinen järjestelmään päin ja toinen sen kontrolloimiin laitteisiin. Emme käsittele varsinaisten laitteiden (esim. kovalevy, näyttö, näppäimistö) ohjauslogiikkaa sen tarkemmin.  Rajapinta järjestelmään tapahtuu väylän kautta ja siihen liittyy kolme muistialuetta, joita yleensä kutsutaan kontrolli-, status- ja datarekistereiksi. Näitä voidaan kutsua myös kyseisen laitteen _portiksi_. Suorittimella suorituksessa oleva laiteajuri voi viitata laiteohjaimen rekistereihin samalla tavalla kuin keskusmuistiinkin. 

<!-- kuva: ch-8-3-laiteohjain    -->

![Kaavakuva järjestelmästä, jossa on muisti, suoritin ja väylä. Muistissa on puskuri. Suorittimella on käyttäjäprosessi ja laiteajuri. Väylään on liitetty myös laiteohjain. Laiteohjaimen rajapinta väylälle koostuu data, kontrolli- ja statusrekistereistä. Laiteohjaimen ulkoiasten laitteiden rajapinnassa on kahden laittee ohjauslogiikat ja kumpaankin niistä on liitetty kovalevy. Laiteohjaimen toimintaa ohjaa siellä suorituksessa oleva laiteohjainprosssi.](./ch-8-3-laiteohjain.svg)
<div>
<illustrations motive="ch-8-3-laiteohjain"></illustrations>
</div>

Laiteohjaimen rekisterit ovat myös DCP:n viitattavissa, mistä voisi aiheutua samanaikaisuusongelmia. Esimerkiksi, jos sekä DD että DCP kirjoittaisivat täsmälleen yhtä aikaa samaan rekisteriin, niin lopputulos voisi olla sekava tai ainakin epämääräinen. Tämä mahdollisuus on vältetty ovelasti esimerkiksi sillä tavoin, että ainoastaan DD kirjoittaa kontrollirekisteriin ja ainoastaan DCP kirjoittaa status-rekisteriin. DD viestii DCP:lle kontrollirekisterin kautta ja DCP viestii laiteajurille statusrekisterin kautta. 

Datarekisteri voi itse asiassa olla laitteesta riippuen hyvinkin suuri. Esimerkiksi levyohjaimien laiterekisterissä voi sijaita usea monen megatavun puskuri. Laiterekisteriä voivat lukea ja kirjoittaa sekä DD että DCP. Datarekisterin kirjoittamista ja lukemista synkronoidaan kontrolli- ja statusrekistereiden avulla, joten sen käyttö on mahdollista ilman samanaikaisuusongelmia.

### Laiterekistereihin osoittaminen laiteajurista
Laiteajuri voi siis viitata laiteohjaimen rekistereihin samalla tavalla kuin keskusmuistiinkin. Tästä seuraa, että konekäskyissä pitää jollain tavoin määritellä, kumpaan muistiin (keskusmuistiin vai laiteohjaimen rekistereihin) ollaan viittaamassa. 

#### I/O-konekäskyt
Yksi tapa on käyttää erityiskonekäskyjä, jolloin näiden käskyjen yhteydessä viittaus tapahtuu aina laiteohjaimen rekistereihin. Ttk-91 koneessa in- ja out-käskyt toimivat juuri näin. Esimerkiksi out-käsky kirjoittaa aina näytön datarekisteriin sen sijaan, että kirjoitettaisiin johonkin päin muistia. 

```
in  r1, =kbd
out r2, =crt
```

Intelin x86 arkkitehtuurissa on aivan vastaavat IN ja OUT käskyt. Esimerkiksi IN-käskyllä luetaan valitulta laitteelta 1, 2 tai neljä tavua dataa johonkin rekisteriin. Näitä käskyjä käyttämällä siis päätellään operaatiokoodin perusteella, mille laitteelle (keskusmuistiin vai laiteohjaimien rekistereihin) muistiviittaukset kohdistuvat.

I/O-konekäskyjen huonona puolena on niiden staattisuus. Ne on täytynyt suunnitella konekielen käskykannan suunnitteluaikana ja ne on toteutettu kiinteästi suorittimelle. Niitä ei voi myöhemmin muokata, eikä niitä voi tehdä lisää mahdollisia uusia I/O-laitteita varten.

#### Muistiinkuvattu I/O
Toinen tapa on käyttää _muistiinkuvattua I/O:ta_, jossa normaali ohjelman käyttämä muistiavaruus (muistiosoitteiden joukko) on jaettu kahteen osaan.  Esimerkiksi, jos 32-bittisen muistiosoitteen vasemmanpuolimmainen bitti on nolla (osoitteet 0x0000&nbsp;0000-0x7FFF&nbsp;FFFF), niin kyseessä on keskusmuistiosoite, ja muutoin (osoitteet 0x8000&nbsp;0000-0xFFFF&nbsp;FFFF) kyseessä on viittaus jonkin I/O-laitteen laiteohjaimelle. Jos bitit 24-30 (oikealta lukien) käytetään laitteen valitsemiseen, niin laitteita voisi olla 64 erilaista ja jokaiselle laitteelle jää vielä 24-bittiset osoitteet laiteohjaimen oman muistialueen (laiterekistereiden) viittaamiseen. 

Huonona piirteenä tässä on, että suuri osa ohjelman muistiavaruudesta (edellisessä esimerkissä 50%) on nyt varattu I/O-laitteille. Etuna on, että I/O-laitteita kontrolloidaan tavallisilla muistiviitekäskyillä (load, store). Uuden tyyppisiä laitteita on helppo lisätä järjestelmään, kunhan niille vain kirjoitetaan sopiva laiteajuri. Tämä on yleisin tapa ohjata laitteita.

```
# uuden kirjoittimen 0x4 laiterekistereiden osoitteet
PrinterControl  dc 0x84000001  # kontrollirekisterin osoite
PrinterStatus   dc 0x84000002  # statusrekisterin osoite
PrinterData     dc 0x84000003  # datarekisterin osoite

CmdPrint  equ 1    # tulostuskomento

...
# tulosta luku 53 kirjoittimella 0x4
     load r1, =53            ; kirjoita luku 53 datarekisteriin
     store r1, (PrinterData)   ; kirjoittaa laiteohjaimen datarekisteriin
     load r1, =CmdPrint
     store r1, (PrinterControl)   ; anna tulostuskäsky laiteohjaimelle 
```

### I/O-tyypit
I/O-laitteet voidaan luokitella kolmeen eri tyyppiin sen mukaan, miten niiden laiteohjaimet on liitetty järjestelmään. Kaikki laiteohjaimet liitetään samaan väylähierarkiaan, mutta laitteiden funktionaalisuudessa on eroja. 

#### Suora I/O (Direct I/O, Programmed I/O)
Kaikkein yksinkertaisin toteutus on suora I/O, jota käyttävät laitteet tarvitsevat väyläliittymän ainoastaan sen _dataväylän_ osalta. Kuten luvussa 2 kerrottiin, niin väylän voi jakaa kolmeen komponenttiin: dataväylässä siirtyy data, osoiteväylässä muistiosoitteet ja kontrolliväylässä väylänhallintaan (ja I/O-laitekeskeytyksiin) liittyvät signaalit.

Suorassa I/O:ssa laiteajuri (DD) ohjaa koko toimintaa ja pysyy suorituksessa koko I/O-toiminnan ajan. Laiteajuri antaa laitteelle (sen laiteohjainprosessille, DCP:lle) komennon kirjoittamalla kyseinen komento laiteohjaimen kontrollirekisteriin. Sen jälkeen DD aktiivisesti pollaa (lukee) tilarekisterin arvoa, kunnes DCP on ilmoittanut annetun komennon tulleen suoritetuksi.

Laiteohjain ei siis käytä väylää lainkaan itse, vaan se kirjoittaa ja lukee omassa muistissaan olevia laiterekistereitä I/O:n toteuttamiseksi. Kun DCP on valmis uuteen I/O-tapahtumaan, se ensin nollaa (resetoi) tilarekisterin ja sitten pollaa (ikuisessa loopissa) kunnes tämän laitteen ajuri DD antaa sille uuden komennon.

Oletetaan esimerkiksi, että uusi näppäimistö olisi toteutettu näin. Käytämme muistiinkuvattua I/O:ta ja näppäimistön laiterekisterien osoitteet laiteajurissa ovat KBControl (kontrollirekisteri), KBStatus (statusrekisteri) ja KBData (data rekisteri). Laiteohjaimen muistissa laiterekisterit ovat tavallisia muistipaikkoja Status, Control ja Data.

Näppäimistöltä voisi nyt lukea yhden merkin (yksinkertaistetun koodin avulla) seuraavanlaisesti:

```
Laiteajuri (DD) -- suora I/O
----------------------------
    
     load r1, =1          ; komento "Lue"
     store r1, (KBControl)

loop load r1, (KBStatus)  ; odota näppäintä, 1 = OK, negat. arvo = vika
     jneg r1, KBError     ; näppäimistö rikki, ei kytketty, tms.
     jzer r1, loop

     load r1, (KBData)    ; lue merkki laitteelta datarekisteristä
     store r1, Buffer     ; vie merkki keskusmuistiin puskuriin
     
     
Laiteohjainprosessi (DCP) 
-------------------------
    
     load r1, =0          ; resetoi status
     store r1, Status     
     
wait load r1, Control    ; odota kunnes uusi pyyntö
     jnzer r1, wait
     
     ...    ; odota, kunnes jotain näppäintä painettu.
            ; painetun näppäimen koodi on r2:ssa 
     store r2, Data
     
     load r1, =1         ; ilmoita ajurille
     store r1, Status
```

Esimerkin DCP suorittaa siis laiteohjaimella. Laiteohjaimen suoritin ei yleensä ole lainkaan samantyyppinen keskusyksikön suorittimen (CPU) kanssa eikä se käytä samanlaisia konekäskyjä. Yksinkertaisen laitteen laiteohjain voi olla suoraan toteutettuna mikropiireillä, jolloin mitään suoritinta tai laiteohjain_prosessia_ ei edes ole. Laitteen toimintaa voi silti hyvin kuvata DCP:n kaltaiseksi. Tässä esimerkissä laiteohjaimella on suoritin, jonka rakenne ja käskykanta ovat (pedagogista syistä) samanlaisia CPU:n kanssa. DCP voi viitata laiteohjaimen laiterekistereihin (sen muistiin) suoraan tavallisilla muistiosoitteilla. Esimerkistä on tahallaan jätetty pois yksityiskohdat, joilla merkki siirretään puskurista (Buffer) käyttäjätason prosessille ja joilla DCP pääsee seuraavan merkin lukemiseen. Samoin siitä on jätetty pois erilaisten virheiden käsittelyrutiinit.

Suorassa I/O:ssa etuna on, että se on hyvin yksinkertainen toteuttaa. Huonona puolena on se, että kaikki odotus tapahtuu suorittamalla tiukkaa silmukkaa, kunnes luettu tieto on halutun mukainen. DCP:llä tämä ei haittaa, koska se on muusta järjestelmästä irrallinen laite. Sillä ole mitään muutakaan tekemistä sillä aikaa, kun se odottaa jonkin prosessin haluavan käyttää sitä (esim. näppäimistöä).

Suorittimella suorituksessa oleva DD on eri asia. Koska oheislaite (esim. näppäimistö) voi olla hyvinkin hidas, niin odotusaika silmukassa voi olla suorittimen nopeuteen nähden hyvinkin pitkä, miljardeja looppeja. Esimerkiksi artikkelin kirjoittaja voi vaikka lähteä lounaalle tai nukkumaan välillä. Olisi järkevää, jos odotusaikana voisi tehdä jotain hyödyllistä. Hyödyllisiä tehtäviä voisi olla vaikkapa käyttöjärjestelmän hallinto tai kissavideon näyttäminen. Tähän ongelmaan vastauksena on seuraavaksi esiteltävä keskeyttävä I/O.

#### Keskeyttävä I/O (epäsuora I/O, indirect I/O, interrupt-driven I/O)
Keskeyttävää I/O:ta käyttävä laiteohjain on kytketty dataväylän lisäksi myös _kontrolliväylään_. Siellä on erityisesti yksi johdin varattu I/O-laitekeskeytykselle. Kun DCP kirjoittaa tuolle johtimelle (eli aiheuttaa I/O-laitekeskeytyksen), niin keskusyksikön suoritin havaitsee tämän heti nykyisen konekäskyn suorituksen jälkeen ja siirtyy suorittamaan siihen liittyvää keskeytyskäsittelijää.

DD voi nyt I/O-komennon annettuaan siirtyä odotustilaan ja järjestelmä voi suorittaa muita prosesseja odotusaikana. Kun DCP on lopulta saanut tehtävänsä tehtyä, niin se ensin kertoo siitä tilarekisterissä ja sitten aiheuttaa I/O-laitekeskeytyksen. Suorittimella suorituksessa oleva ohjelma suorittaa (etuoikeutetussa tilassa) nyt heti I/O-laitekeskeytyksen keskeytyskäsittelijän, joka siirtää DD:n odotustilasta Valmis suoritukseen -tilaan (Ready-tilaan). Käyttöjärjestelmän vuoronantopolitiikasta riippuen DD pääsee suoritukseen heti paikalla tai sitten vasta vähän ajan päästä. Sitten DD lukee statusrekisterin arvon ja päättää jatkotoimista tämän I/O-tapahtuman suhteen.

Aikaisempi esimerkin näppäimistö toimisi nyt seuraavanlaisesti:

```
Laiteajuri (DD) -- keskeyttävä I/O
----------------------------------
    
     load r1, =1           ; komento "Lue"
     store r1, (KBControl) ; kirjoita komento kontrollirekisteriin

     svc sp, =SLEEP        ; mene odotustilaan
     
     ... ; herää henkiin sitten joskus, kun käyttöjärjestelmä päättää
     
     load r1, (KBStatus)   ; lue status, 1 = OK, negat. arvo = vika
     jneg r1, KBError      ; oliko jotain vialla?

     load r1, (KBData)     ; lue merkki laitteelta
     store r1, Buffer      ; vie se keskusmuistiin
     
     
Laiteohjainprosessi (DCP)
-------------------------
    
     load r1, =0          ; resetoi status
     store r1, Status     
     
wait load r1, Control    ; odota kunnes uusi pyyntö
     jnzer r1, wait
     
     ...    ; odota, kunnes jotain näppäintä painettu.
            ; painetun näppäimen koodi on r2:ssa 
     store r2, Data      ; kirjoita merkki datarekisteriin
     
     load r1, =1         ; ilmoita merkistä ajurille
     store r1, Status    
     
     load r1, =1         ; aiheuta I/O-laitekeskeytys, jotta 
     store r1, IOInt     ; ajuri pääsee joskus suoritukseen
```

Keskeyttävän I/O:n yksi heikkous on sen suoraa I/O:ta hitaampi reagointinopeus. Suorassa I/O:ssa DD jatkaa suoritusta muutaman konekäskyä myöhemmin sen jälkeen, kun DCP on ilmoittanut sille annetun tehtävän valmistumisesta. Keskeyttävässä I/O:ssa pitää ensin suorittaa keskeytyskäsittelijä, joka siirtää DD:n Valmis suoritukseen -jonoon, josta se lopulta pääsee suoritukseen. Aikaa tähän kuluu vähintää yhden prosessin vaihdon verran. Lisäksi aikaa on kulunut yhden prosessin vaihdon verran, kun DD meni odotustilaan aikoinaan.

Edellisen esimerkin DD:n kaksi viimeistä riviä näyttävät selkeästi näiden kahden I/O-tyypin yhteisen heikkouden. Kaikki data virtaa sana kerrallaan CPU-rekisterin kautta ja kaiken datan tarvitsee kulkea muistiväylän läpi kaksi kertaa. Jos siirrettävä datamäärä on pieni (muutama tavu tai sana), niin tästä ei ole haittaa. Mutta jos siirrettävänä on 4 KB tai 4 MB virtuaalimuistin sivu tai levylohko, niin tämä hidastaa I/O:ta tekevän prosessin ja koko järjestelmän suoritusta merkittävästi. Ongelman ratkaisu on seuraavaksi esiteltävä DMA-I/O.

#### DMA I/O
DMA I/O:ssa ([Direct Memory Access](https://en.wikipedia.org/wiki/Direct_memory_access)) laiteohjain on vielä aikaisempia laitteita älykkäämpi. DMA-laiteohjain pystyy nyt siirtämään itse dataa keskusmuistin ja laiteohjaimen datarekisterin välillä, joten datan ei tarvitse kiertää CPU-rekisterien kautta. Datarekisteri voi näissä laitteissa olla hyvinkin suuri, sisältäen esimerkiksi 32 kappaletta 4 MB puskureita.

On mahdollista, että DMA-laite voi itse käyttää _osoiteväylää_ ja tehdä itsenäisesti datasiirtoja. Yleensä järjestelmässä on kuitenkin erityinen _DMA-ohjain_, joka tekee tiedon siirron DMA-laitteiden puolesta. DMA-laitteen DCP pyytää tällöin DMA-laiteohjainta datasiirtoihin. Isommissa järjestelmissä tällainen keskitetty DMA-ohjain on parempi DMA:n toteutustapa, koska suurten DMA-datasiirtojen hallinta on vaikeata. Mikään laite ei saisi varata väylää liian pitkäksi aikaa, koska se hidastaa muiden prosessien suoritusta suorittimella. DMA-ohjainta käytettäessä kaikki DMA-laitteet toimivat samalla tavalla väylän käytön suhteen.

Edellinen esimerkki ei ole hyvä DMA-laitteen osalta. Näppäimistöä ei mitenkään kannata toteuttaa DMA-I/O:n avulla, mutta jos näin tehtäisiin, niin esimerkkimme olisi seuraavanlainen.


```
Laiteajuri (DD) -- DMA I/O
--------------------------

     load r1, =Buffer     ; anna DCP:lle puskurin muistiosoite
     store r1, (KBData)

     load r1, =1          ; komento "Lue" kontrollirekisteriin
     store r1, (KBControl)

     svc sp, =SLEEP       ; mene odotustilaan
     
     ... ; herää henkiin sitten joskus, kun käyttöjärjestelmä päättää
     
     load r1, (KBStatus)  ; lue status, 1 = OK, negat. arvo = vika
     jneg r1, KBError     ; oliko jotain vialla?

     
     
Laiteohjainprosessi (DCP)
-------------------------
    
     load r1, =0          ; resetoi status
     store r1, Status     
     
wait load r1, Control    ; odota kunnes uusi pyyntö
     jnzer r1, wait
     
     ...    ; odota, kunnes jotain näppäintä painettu.
            ; painetun näppäimen koodi on r2:ssa 
            
     store r2, &Data     ; talleta näppäinkoodi suoraan muistiin
     
     load r1, =1         ; ilmoita ajurille
     store r1, Status
     
     load r1, =1         ; aiheuta I/O-laitekeskeytys, jotta 
     store r1, IOInt     ; ajuri pääsee joskus suoritukseen
```

Todellisuudessa DMA-I/O:lla kerralla siirrettävä data on yleensä suuri. Esimerkiksi kerralla voisi siirtää koko 4 KB levylohkon. Jos kovalevyn laiteohjain toteutetaan DMA-I/O:lla keskeyttävän I/O:n asemesta, niin DMA-I/O tapahtuu nopeammin kahdesta syystä. Ensinnäkin, tuo 4 KB virtaa väylän läpi vain kerran. Toiseksi, yhdessä I/O tapahtumassa kerralla siirettävä datamäärä on DMA-I/O:ssa suurempi (esim. 4 KB) kuin keskeyttävässä I/O:ssa (esim. 256 B), joten laiteajurin tarvitsee puuttua harvemmin I/O:n johtamiseen. Älykkään DMA-laitteen DCP tekee pääosan työstä itsenäisesti. Jos siirrettävänä on vain yksi levylohko, niin DMA-laitteen laiteajuri aktivoituu vain kaksi kertaa. Ensin se pyytää DMA-laitetta siirtämään datan ja lopuksi se tarkistaa, että datasiirto on onnistunut.

<!--  quizit 8.3.???  -->
<div><quiz id="a5aab3ae-83ec-4e46-a3b5-dafedd922606"></quiz></div>
<div><quiz id="a6471e8c-8469-473b-9e69-dbcda2612f6e"></quiz></div>
<div><quiz id="aa38f3a3-878d-49c7-b93b-e104891a1971"></quiz></div>

<text-box variant="example" name="Historiaa:  Transistori ja mikropiiri">
Transistorin kehittivät W.B. Shockley, J. Bardeen ja W. Brattain Bell Labsin tutkimuskeskuksessa 1948. Se oli 1900-luvun tärkeimpiä teknisiä keksintöjä ja he saivat työstä Nobel-palkinnon vuonna 1956. J. Kilby ja R. Noyce kehittivät siitä integroidun piirin, jossa sekä transistorit että johtimet toteutettiin tasossa puolijohtimien avulla. Transistoreilla pystyttiin toteuttamaan sekä muisti että suorittimen logiikka. Kilbyn piiri oli ensimmäinen transistori (1958) ja hän sai siitä Nobel-palkinnon vuonna 2000. Noyce aloitti uransa Shockleyn yhtiössä ja oli perustamassa sekä Fairchild Semiconductor (1957) että Intel (1968) -yhtiöitä. Intel on edelleenkin maailman johtavia yrityksiä mikropiirien valmistamisessa. Ensimmäinen kaupallinen mikropiiri Intel 4004 julkistettiin 1971. Siinä oli 46 konekäskyä ja 16 kappaletta 4-bittisiä rekistereitä. Se oli suunniteltu japanilaisen Busicom-yhtiön tekemän laskimen toteutukseen.   

<!-- kuva: ch-8-1-ch-8-3-trans-mikropros    -->

![Vasemmalla kuva ensimmäisestä transitorissa. Se on asennettu (nyt) muovitelineeseen, jossa alhaalla on eri metalleja epämäääräisissä kerroksissa. Välissä on jokin eriste. Metallit on kytketty toisiinsa sekavalta näyttävien ohuempien ja paksumpien johtimien avulla. Oikealla on kuva Intel 4004 mikroprosessorista. Se on asennettu keraamisen eristeen päälle ja johtimet 16 alassojottavaan kuparijalkaan kulkevat keramiikan sisällä. ](./ch-8-3-trans-mikropros.svg)
<div>
<illustrations motive="ch-8-3-trans-mikropros"></illustrations>
</div>

</text-box>

## Yhteenveto
Tämä luvussa näytettiin ensin, kuinka virtuaalimuisti toimii ja kuinka se ratkaisee osaltaan keskusmuistin ja kovalevyn välisen suuren nopeuskuilun ongelmaa muistihierarkiassa. Seuraavaksi esiteltiin tiedostojärjestelmän päätoiminnot ja kuinka tiedostot voidaan toteuttaa erilaisilla massamuistilaitteilla. Pääasiassa keskityttiin kuitenkin kovalevyjen toteutukseen. Tässä viimeisessä aliluvussa käytiin läpi eri tavat toteuttaa I/O millä tahansa laitteella. Erityisesti esiteltiin, kuinka I/O:n toteutus tehdään yhteistyöllä keskusyksikön suorittimella suorittavan laiteohjaimen ja oheislaitteen laiteohjaimella suorittavan laiteohjainprosessin avulla. Mitä viisaampi laiteohjain on, sitä suuremman osan työstä se tekee ja sitä enemmän suoritinaikaa jää muille prosesseille keskusyksikön suorittimella.

Vastaa alla olevaan kyselyyn, kun olet valmis tämän luvun tehtävien kanssa.

<div><quiz id="b203bc29-8dc2-41da-9ea6-eb51726af830"></quiz></div>
