---
path: '/luku-9/4-lataus'
title: 'Lataus'
hidden: false
---

<div>
<lead>Tässä aliluvussa kuvaamme, kuinka latausmoduulista saadaan järjestelmässä suorituskelpoinen prosessi. 
</lead>
</div>

## Latausmoduuli
Oletamme nyt, että latausmoduuli on staattisesti linkitetty moduuli, jonka voi sellaisenaan suorittaa. Esittelimme edellisessä aliluvussa dynaamisen linkityksen, emmekä käsittele sitä tässä sen enempää. 

Latausmoduulissa on ohjelman koodi konekielisessä esitysmuodossa ja mistä konekäskystä pääohjelman suoritus alkaa. Siellä on määritelty tilanvaraukset kaikille globaaleille (pääohjelmatasolla) määritellyille tietorakenteille mahdollisine alkuarvoineen. Siellä on myös kerrottu, kuinka suuri pino tälle ohjelmalle tulee varata ja mitä tiedostoja täytyy avata ohjelman käynnistämisen yhteydessä. 

## Lataus, prosessin luonti
Käyttöjärjestelmä (KJ) luo uuden prosessin valitsemalla ensin sille uuden prosessin tunnisteen (PID, process identifier). Prosessille varataan muistitilaa keskusmuistista sen koodia ja hallintotietoja varten. Jos käytössä on virtuaalimuisti, niin prosessille varataan muistitilaa virtuaalimuistin sivutauluille ja massamuistitilaa prosessin koko muistiavaruuden tallettamiseksi virtuaalimuistin tukimuistiin (ks. Luku 8).

KJ luo prosessille sen kuvaajan (kontrollilohko, [PCB](https://en.wikipedia.org/wiki/Process_control_block), [Process Control Block](https://en.wikipedia.org/wiki/Process_control_block)). Kuvaajassa on tallessa kaikki prosessin käyttämät resurssit (ks. Luku 4). Prosessille avataan sen tarvitsemat tiedostot, laitteet ja verkkoyhteydet joko tässä yhteydessä etukäteen tai vasta prosessin suorituksen aikana. Tiedot kaikista aukiolevista tiedostoista, laitteista ja verkkoyhteyksistä ovat myös kuvaajassa. Kuvaajat ovat usein vakiokokoisia ja KJ tallettaa ne omalle muistialueelleen. Kuvaajalle ei siten yleensä tarvitse varata muistitilaa, vaan ainoastaan otetaan joku vapaana oleva kuvaaja uusiokäyttöön. Kuvaaja on (tietenkin) KJ:n omalla muistialueelle ja siihen voi viitata ainoastaan etuoikeutetussa suoritustilassa.

Prosessille varataan muistitilaa pinolle, keolle ja muiden prosessien kanssa yhteisille muistialueille sen latausmoduulissa annettujen määrittelyjen mukaisesti. Kaikki tiedot talletetaan kuvaajaan. 

<!-- kuva: ch-9-4-prosessi-pcb  -->
![Otsake Prosessi ja sen kuvaaja (PCB). Oikealla on iso laatikko, joka kuvaa muistia. Siinä on prosessin muistialueet PC, koodi ja pino. Vasemmalla on PCB suurennettuna ja siinä ensin kentät PID ja suoritinympäristö (PC, etc). Sitten varatut muistialueet (pcp, koodi, pino), joista kustakin on nuoli oikealla olevaan muistin vastaavaan alueeseen. Lopuksi PCB.ssä on kentät tiedostot, laitteet, verkkoyhteydet, CPU-prioriteetti, jne.  Alla on väylän takana massamuistina kovalevy, josta on varattu tietty määrä tilaa virtuaalimuistin tukimuistille.](./ch-9-4-prosessi-pcb.svg)
<div>
<illustrations motive="ch-9-4-prosessi-pcb"></illustrations>
</div>

Perusidea on, että _kaikki_ yhteen prosessiin liittyvät tiedot löytyvät sen kuvaajasta (ja siihen linkitetyistä muista tietorakenteista). Sitten kun prosessi aikanaan poistetaan järjestelmästä, käyttöjärjestelmä voi kuvaajan tietojen perusteella vapauttaa kaikki prosessin käyttämät resurssit ja lopulta vapauttaa sen tunnisteen (PID) ja kuvaajan uusiokäyttöön.

Prosessin _suoritinympäristössä_ (processor context) on arvot kaikille laiterekistereille, jotka pitää ladata, kun tämä prosessi aikanaan pääsee suoritukseen. Kun (jos) prosessi joutuu myöhemmin odottamaan mistä tahansa syystä, suoritinympäristö kopioidaan suorittimelta tänne sitä varten, että suoritus voisi joskus jatkua samasta kohtaa (samasta konekäskystä sen alusta pitäen) täsmälleen samassa ympäristössä kuin mitä se oli suorituksen keskeytyessä. Suoritinympäristöön kuuluvat kaikki rekisterit ja prosessin hallintaan liittyvät rekisterit em. tarkoitusta varten. Siihen sisältyvät esimerkiksi kaikki laskentaan tarvittavat työ- ja indeksirekisterit sekä erilaiset suorittimen kontrolliin liittyvät rekisterit, kuten paikanlaskuri PC, pinorekisteri SP, kekorekisteri HP, tilarekisteri SR, vertailujen tulosrekisterit CR, muistialueiden rajarekisterit BASE ja LIMIT, virtuaalimuistin sivutaulujen osoiterekisterit PT, jne.

Nyt prosessi on valmis ja järjestelmä tunnistaa sen uniikista PID:stä. Jos prosessin kaikki tarvittavat resurssit (esim. riittävä määrä keskusmuistia) on heti saatu käyttöön, prosessi voidaan siirtää R-to-R jonoon (valmis suoritukseen -jono, Ready-jono, Ready-to-Run-jono) odottamaan suoritusta suorittimella. Muussa tapauksessa prosessi laitetaan odotustilaan (esim. keskusmuistia odottavien prosessien jonoon), josta se sitten joskus myöhemmin resurssien vapauduttua pääsee R-to-R-jonoon odottamaan suoritusvuoroaan.

Prosessin kuvaajan tietoja ja prosessien hallintaa yleensä käsitellään tarkemmin yliopistojen käyttöjärjestelmäkursseilla.

<!--  quizit 9.4.???  -->
<div><quiz id="98478074-7943-4b62-a2f3-c94c6fd5b260"></quiz></div>

<text-box variant="example" name="Historiaa: Ensimmäinen korkean tason kielen kääntäjä">
Ensimmäinen korkean tason kielen kääntäjä valmistui 1957 IBM:llä John Backuksen ryhmässä Fortran-kielelle IBM 704 -järjestelmälle. Fortrania on koko ajan kehitetty ajan mukaiseksi ja sitä voi nykyään käyttää niin lohkoperustaiseen ohjelmointiin kuin rinnakkaislaskentaa vaativiin tehtäviin. Ensimmäisen kääntäjän tekeminen kesti neljä vuotta. Kääntäjällä pystyi alusta pitäen tuottamaan optimoitua koodia, koska asiakkaat olivat tottuneet assemblerilla käsin koodattuun hyvin optimoituun koodiin.

![IBM 704 NACAn konesalissa 1957. NACA oli NASAn edeltäjä ja siitä tuli NASA 1958. Edessä on naispuolinen operaattori syöttämässä ohjelmaa reikäkortinlukijaan ja takana on miespuolinen insinööri tutkailemassa usean metrin mittaista ja puolitoista metriä korkeaa tietokonetta, josta etupaneelit on poistettu. Tietokoneen sisäinen langoitus on näkyvillä ja oikealla puolella on suuri noin 1m x 1m ohjauspaneeli.](./ch-9-4-ibm-704.svg)
<div>
<illustrations motive="ch-9-4-ibm-704"></illustrations>
</div>

</text-box>

## Yhteenveto
Tässä luvussa annoimme yleiskuvan siitä, kuinka ns. "tavallisella" korkean tason kielellä kirjoitetusta ohjelmasta saadaan järjestelmässä suoritettava prosessi. Ohjelman esitysmuotona on järjestelmän suorittimen ymmärtämä konekieli, joka annetaan suorittimelle koodina. Käännösmoduuleista saadaan eri ohjelmointikielistä _kääntämällä_ kohdearkkitehtuurin konekielisiä objektimoduuleita. Niissä on kussakin uudelleensijoitustaulu, jonka avulla on määritelty liitokset kaikkiin muihin objektimoduuleihin. Objektimoduulit _linkitetään_ yhteen osoiteavaruuteen latausmoduuliksi, josta _lataaja_ sitten muodostaa käyttöjärjestelmän tunteman suorituskelpoisen prosessin. Eri ohjelmointikielten kääntäjät, staattiset ja dynaamiset linkittäjät sekä lataaja ovat normaaleja käyttöjärjestelmään sisältyviä peruspalikoita.

On myös olemassa toisen tyyppinen ohjelmien suoritustapa. Siinä suoritettava ohjelma annetaan datana (syötteenä) jollekin käyttöjärjestelmän tunnistamalle prosessille, joka voi olla esimerkiksi tulkki, emulaattori tai simulaattori. Suoritettavan ohjelman esitysmuoto voi olla esimerkiksi jotain skriptikieltä, jonkin toisen koneen konekieltä tai korkean tason kielen kääntäjän välikieltä. Tällaista ohjelmien suoritustapaa käsitellään seuraavassa luvussa 10.

Vastaa alla olevaan kyselyyn, kun olet valmis tämän luvun tehtävien kanssa.

<!-- ### summary quizit lukuun 9 ??? -->

<div><quiz id="9dadff01-7d90-4a1f-b3cc-d06ff6151d0a"></quiz></div>

