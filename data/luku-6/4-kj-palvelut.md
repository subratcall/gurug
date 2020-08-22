---
path: '/luku-6/4-kj-palvelut'
title: 'Käyttöjärjestelmäpalvelujen käyttö'
---

<div><lead>
Tässä osiossa esitellään käyttöjärjestelmäpalvelujen käyttö ja kuinka se eroaa tavallisten aliohjelmien käyttämisestä.
</lead></div>

## Käyttöjärjestelmäpalvelut kutsuttavina rutiineina
Käyttöjärjestelmä tarjoaa suorituksessa oleville ohjelmille erilaisia palveluja, kuten esimerkiksi oheislaitteiden käyttämisen. Näitä palveluja käytetään periaatteessa kahdella tavalla.

Palvelut voivat olla suoraan kutsuttavissa tavallisina aliohjelmina tai etuoikeutettuina aliohjelmina. Kaikki käyttöjärjestelmän osat eivät tarvitse etuoikeutettua suoritustilaa ja on turvallisempaa pitää mahdollisimman suuri osa koodista tavallisessa suoritustilassa suoritettavana. Esimerkkinä tällaisesta palvelusta voisi olla joku yleinen tulostuspalvelu. Palveluja kutsutaan tavallisilla call-aliohjelmakutsuillla.

Osa palveluista (esimerkiksi jotkut laiteajurit) vaativat kuitenkin etuoikeutettua suoritustilaa ja niitä kutsutaan tällöin svc-käskyillä. Svc-käsky vaihtaa suoritustilan etuoikeutetuksi samalla kun se siirtää kontrollin kutsutulle rutiinille. Etuoikeutetut palvelurutiinit ovat etukäteen kaikki tiedossa ja ne on usein nimetty pelkästään palvelun numeron mukaisesti. Esimerkiksi, ttk-91'ssä palvelurutiinin Halt (ohjelman suoritus päättyy) numero on 11, mikä on myös symbolin "halt" arvo.

```
     ...
     svc sp, =halt
```

Parametrien välitys käyttöjärjestelmärutiineille voi olla erilaista kuin tavallisille aliohjelmille ja tapauskohtaista. Joissakin tapauksissa KJ-palvelupyynnön yhteydessä ei haluta muodostaa tavanomaista aktivaatiotietuetta ja parametrit välitetään yksinkertaisesti sovittujen rekistereiden avulla. Toisaalta taas, usein on ihan järkevää noudattaa samaa aktivaatiotietuerakennetta kuin tavallisten aliohjelmien yhteydessä.

```
;
; laiteajurin DiskDriver=33 kutsu proseduraalisesti
;
      push  sp, =0             ; paluuarvo
      push  sp, =FileBuffer    ; datapuskuri tiedon siirtoa varten
      push  sp, ByteCnt        ; luettavien tavujen lukumäärä
      push  sp, ptrFile        ; luettava tiedosto

      svc   sp, =DiskDriver    ; lue laitteelta pyydetty määrä tavuja puskuriin
      pop   sp, r1
      jnzer r1, FileTrouble    ; käsittele virhetilanteet
```

Jos palvelu on suoritettu etuoikeutetussa tilassa, alkuperäinen suorittimen suoritustila (yleensä tavallinen suoritustila) täytyy palauttaa palvelusta paluun yhteydessä. Tätä varten on olemassa yleensä jokin etuoikeutettu konekäsky (esim. iret eli interrupt return). Aikaisemmin vallinnut suoritustila täytyy tietenkin tallettaa johonkin, esimerkiksi pinoon vanhan PC:n ja vanhan FP:n yhteyteen.

## Käyttöjärjestelmäpalvelut prosesseina
Osa käyttöjärjestelmäpalveluista on toteutettu omina suoritettavina ohjelmina eli prosesseina. Niitä ei voi kutsua, mutta niille voi lähettää palvelupyyntöviestejä ja sitten jäädä odottamaan vastausviestiä. Viestien lähetys ja vastaanotto taas ovat normaaleja etuoikeutettuja palveluita, joita kutsutaan proseduraalisesti. Esimerkiksi, joidenkin laitteiden laiteajurit voi olla toteutettu näin.

Viestienvälitykseen liittyvän palvelun toteutus on monimutkaisempaa, koska siihen yleensä liittyy prosessin vaihtoja. Esimerkiksi, kun otetaan vastaan viesti joltain toiselta prosessilta, niin tyypillisesti vastaanottava prosessi odottaa odotustilassa, kunnes viesti on saapunut.

```
;
; laiteajurin DiskDriver (pid=3254) käyttö viestien avulla
;
pidDriver  equ 3254  ; laiteajuriprosessin tunniste
MsgService equ   52
      ...
      ;  lähetä palvelupyyntöviesti
      push  sp, =0             ; paluuarvo svc-kutsulle
      push  sp, =pidDriver     ; viestin vastaanottajan tunniste (pid)
      push  sp, =Send          ; viestin tyyppi
      push  sp, =FileBuffer    ; datapuskuri tiedon siirtoa varten
      push  sp, ByteCnt        ; luettavien tavujen lukumäärä
      push  sp, ptrFile        ; luettava tiedosto

      svc   sp, =MsgService    ; lähetä viesti DiskDrive-prosessille
      pop   sp, r1
      jnzer r1, SendTrouble    ; käsittele virhetilanteet

      ; vastaanota vastaus palvelupyyntöön laiteajurilta
      push  sp, =0             ; paluuarvo svc-kutsulle
      push  sp, =pidDriver     ; viestin lähettäjän eli laiteajurin tunniste (pid)
      push  sp, =Receive       ; viestin tyyppi
      push  sp, =maxWaitTime   ; maksimiodotusaika viestin vastaanotolle
      push  sp, =MsgBuffer     ; datapuskurin osoite tiedon siirtoa varten
      push  sp, &MsgByteCnt    ; vastaanotettavien tavujen lukumäärä

      svc   sp, =MsgService    ; vastaanota viesti DiskDriver-prosessilta
      pop   sp, r1
      jnzer r1, RecvTrouble    ; käsittele virhetilanteet
```

<!-- quiz 6.4.??  ????? -->

<div><quiz id="3881dfb4-23f7-4359-9e01-1ce56c51345b"></quiz></div>
<div><quiz id="4befdfa3-3055-40ce-9470-26d4fb02a154"></quiz></div>
<div><quiz id="4896697e-2e33-44b8-82dd-251e7ff728e3"></quiz></div>
<div><quiz id="36e2b3d7-22ee-4f63-b56d-1c111ddda9b7"></quiz></div>


<text-box variant="example" name="Historiaa:  Williams Tube -muisti">

Freddie Williams and Tom Kilburn kehittivät vuonna 1946 ensimmäisen RAM-muistin (Random Access Memory), jonka kaikki muistipaikat olivat aina yhtä nopeita käyttää. Sen koko oli aluksi 1024 bittiä. Putki oli kallis ja kesti käytössä vain noin kuukauden. Muisti perustui samanlaisiin katodisädeputkiin (CRT, Cathode Ray Tube) kuin näytötkin. Kun jotain kuvapistettä valaistiin, niin se hehkui varautuneena vähän aikaan ja talletti siten tietoa. Tiedon lukeminen tapahtui yrittämällä kirjoittaa data uudestaan 1-biteillä. Kirjoitusyritys antoi erilaisen tuloksen sen mukaan, olivatko bitit jo ennestään varautuneita tai ei. Kaikkia kuvapisteitä täytyi virkistää vähän väliä, jotta tieto säilyi. Ensimmäisessä yleiskäyttöisessä kaupallisessa tietokoneessa, Ferranti Mark I, oli 10000 bittiä Williams Tube -muistia.

![Katodisädeputki koteloituna metalliseen telineeseen. Kotelot ovat suorakaiteen muotoisia, joten niitä voi helposti asetella vierekkäin tai päällekkäin.](./ch-6-4-williams.svg)
<div>
<illustrations motive="ch-6-4-williams"></illustrations>
</div>

</text-box>



## Yhteenveto
Tämä luku käsitteli aliohjelmien toteutusta. Kävimme läpi arvo- ja viiteparametrityypit ja esittelimme myös yleensä makroissa käytettävät arvoparametrit. Pääpaino oli aliohjelmien toteutuksella aktivointitietueen (AT) ja aktivointitietuepinon avulla. AT:n kautta välitetään parametrit ja sieltä varataan tila aliohjelman paikallisille tietorakenteille. Käyttöjärjestelmän aliohjelmina kutsuttavat palvelut ovat hyvin samankaltaisia kuin aliohjelmat, mutta kuitenkin erilaisia. Niiden kutsurajapinta on omien konekäskyjen (SVC, IRET, tms.) takana ja parametrien välitys voi tapahtua eri tavalla.

Vastaa alla olevaan kyselyyn kun olet valmis tämän luvun tehtävien kanssa.

<div><quiz id="4a9ca037-6fbe-4b31-91d7-4653c4f72f84"></quiz></div>
