---
path: '/luku-10/1-tulkitseminen-ohjelman-suoritustapana'
title: 'Tulkitseminen ohjelman suoritustapana'
hidden: false
---

<div>
<lead>Tässä aliluvussa esittellään, mitä tarkoittaa ohjelmien suorittaminen tulkitsemalla. Siinä käsittellään myös, mitä tarkoittavat käsitteet suorittimen emulointi ja simulointi.</lead>
</div>

## Tulkitseminen ja tulkki
Tulkitseminen (tietokonejärjestelmissä) tarkoittaa sitä, että käyttäjän ohjelma (P) on kuvattu jollain säännöllisellä kuvauskielellä ja että käytössä on tuota kuvauskieltä ymmärtävä tulkki-ohjelma (T). Tulkki pystyy tulkitsemaan ohjelman P toiminnot ja suorittamaan ne järjestelmässä. Tulkki voi olla kirjoitettu millä tahansa ohjelmointikielellä ja se on normaali järjestelmässä suorittava prosessi, jonka esitysmuoto on järjestelmän oma konekieli. 

Tulkki T voisi tietenkin olla myös kirjoitettu jollain toisella säännöllisellä kuvauskielellä, jonka käskyjä tulkitsee joku toinen tulkki T2, jne. Tätä vaihtoehtoa ei käsitellä tämän enempää, vaikka se onkin ihan realistinen.

Suoritusaikana tulkille annetaan syötteenä ohjelma P. Ohjelman P tulkitsemisen aikana järjestelmä käyttäytyy hyvin samoin kuin ohjelma P olisi itse prosessina suorituksessa, mikä tässä on tarkoituskin. Käyttäjälle (ohjelman P suorittajalle) ei ole juurikaan eroa, suoritetaanko P sen kuvausta tulkitsemalla tai sen konekielistä esitysmuotoa suorittamalla.

Käytännössä näillä eri suoritustavoilla on kuitenkin merkittäviä eroja. Tulkittavaa ohjelmaa P ei tarvitse kääntää konekielelle, joten se on hyvin helposti siirrettävissä uuteen järjestelmään. Tämä tietenkin edellyttää, että tulkki T on toteutettu myös uudessa järjestelmässä.  

### Skriptikielet ja niiden tulkit
Tietokonejärjestelmissä on (ehkä mukana olevan graafisen käyttöliittymän lisäksi) aina olemassa komentotulkki-käyttöliittymä. Linux-järjestelmissä komentotulkkeja on useita ja käyttäjä pystyy valitsemaan, mitä niistä hän haluaa käyttää. Tällainen on esimerkiksi [Bourne shell](https://en.wikipedia.org/wiki/Bourne_shell), joka alkuaan kehitettiin Unix-käyttöjärjestelmälle jo 1976. Muita esimerkkejä ovat [C shell](https://en.wikipedia.org/wiki/C_Shell) ja [Bash](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29).

Windows-järjestelmissä on vain yksi komentotulkki ([Cmd](https://en.wikipedia.org/wiki/Command_Prompt)), joka on ollut käytössä vuodesta 1987.

Jos käyttöjärjestelmässä ei ole graafista käyttöliittymää, sitä käytetään suoraan komentotulkin kautta. Jos siinä on graafinen käyttöliittymä, niin komentotulkin voi käynnistää omaan ikkunaan, jossa sille voi antaa komentoja yksi kerrallaan. Esimerkiksi Windows-10 järjestelmässä komentotulkin Cmd voi käynnistää sovelluksena _Komentokehote_ (Command Prompt). Alla olevassa esimerkissä Windows-10 komentotulkin [nykyhakemisto](https://en.wikipedia.org/wiki/Current_directory) on alkuaan Z-partition [juurihakemisto](https://en.wikipedia.org/wiki/Root_directory) \\. Tämä ilmenee uuden komennon kehotteena "Z:\\>". Komentotulkille  on annettu kaksi komentoa. Komento "C:" vaihtoi nykyhakemiston tiedostojärjestelmän C-partition juureen ja komento "dir" tulosti nykyhakemiston tiedot oletusarvoisilla parametreilla. Lopuksi jäljellä on seuraavan komennon kehote nykyhakemistossa "C:\\>".

```
Microsoft Windows [Version 10.0.17763.737]
(c) 2018 Microsoft Corporation. All rights reserved.

Z:\>C:

C:\>dir
 Volume in drive C is OSDisk
 Volume Serial Number is 82E7-F226

 Directory of C:\

05.02.2019  18.42    <DIR>          Intel
08.02.2019  11.41    <DIR>          LocalData
15.09.2018  10.33    <DIR>          PerfLogs
25.09.2019  12.03    <DIR>          Program Files
24.09.2019  04.43    <DIR>          Program Files (x86)
23.09.2019  17.45    <DIR>          Users
26.09.2019  18.01    <DIR>          Windows
23.09.2019  17.51    <DIR>          Windows.old
               0 File(s)              0 bytes
               8 Dir(s)  401 707 028 480 bytes free

C:\>
``` 

Komentotulkkien skriptikielet ovat normaali käyttöliittymä järjestelmien ylläpitäjille. Ne antavat suoran käyttöliittymän järjestelmän hallintaan ja uusien skriptien (eli komentotulkin käskyillä muodostettujen ohjelmien) tekeminen erilaisiin hallintotehtäviin on hyvin helppoa. Skriptejä tulkitsee aina sen oman skriptikielen tulkki, jonka oikeudet määräytyvät tulkin käynnistämisen yhteydessä. Windows-10:n graafisessa käyttöliittymässä klikkaamalla hiiren oikealla napilla sovellusta Komentokehote (Command Prompt) voidaan pyytää suorittamaan komentotulkki pääkäyttäjän (admin) oikeuksin. Sen jälkeen komentotulkissa voi tehdä ihan mitä tahansa käyttöjärjestelmän toimintoja. Tehokkailla skripteillä saa paljon hyvää ja pahaa aikaiseksi hyvin kätevästi. 

Komentotulkille voi syöttää komentoja tai skriptejä rivi kerrallaan, kuten edellä olevassa esimerkissä tehtiin. Usein skriptit talletetaan omiin tiedostoihinsa, jotka suoritetaan sellaisenaan komentotulkissa. Linux-järjestelmissä skriptitiedostojen alussa on rivi, joka kertoo mikä skriptikieli siinä on käytössä. Näin skriptejä voi myös "suorittaa", kun käyttöjärjestelmä osaa käynnistää oikean tulkin kullekin skriptille. Käyttäjän näkökulmasta ne tuolloin tuntuvat suoritettavilta ohjelmilta. Suoritettavissa skripteissä voi käyttää myös muita skriptejä, jotka voi olla kirjoitetu samalla tai eri skriptikielellä. Allaolevalla _C shell_ skriptillä _edit-all_ voidaan yhdellä komennolla kertaa tehdä samat editoinnit vaikka miten monelle tiedostolle, kunhan rivieditorin [ed](https://en.wikipedia.org/wiki/Ed_(text_editor)) komennot on vain ensin tallennettu tiedostoon nimeltä _edfile_. Esimerkiksi, nykyhakemiston 3000 tiedostossa kaikki merkkijonot "vanha" voisi vaihtaa merkkijonoon "uusi" komennolla _edit-all_, jos _ed_-komennot "1,$s/vanha/uusi/g" ja "w" on ensin talletettu tiedostoon _edfile_. 


```
#! /bin/csh -f
# edit-all -- run ed for all source files
# create first "edfile"  for editing commands

foreach par ( $*  )
    cat  edfile | ed $par 
end
``` 

Jos edellisen esimerkin rivieditorille _ed_ annetaan vain muutama komento, ne voi antaa _komentoriviparametreina_ ilman syötetiedostoa. Toisaalta, syötetiedosto voi olla hyvinkin pitkä. Tällöin rivieditorin voi mieltää komentotulkkina ja sen syötteen skripteinä. Rivieditorin syötetiedoston taas voisi hyvin luoda jokin muu skripti. Skriptit antavat siis mahdollisuuden hyvin tehokkaaseen ohjelmointiin.

## Emulointi
[Emulaattori](https://en.wikipedia.org/wiki/Emulator) tarkoittaa ohjelmaa (tai laitteistoa), jonka kautta käytössä oleva järjestelmä saadaan tuntumaan samalta kuin jokin muu järjestelmä. Esimerkiksi Titokone on ohjelma, joka emuloi ttk-91 suoritinta (ja sen käyttöjärjestelmää) missä tahansa järjestelmässä, missä Titokoneen voi suorittaa. Titokoneessa on ohjelman sisäisinä tietorakenteina kaikki hypoteettisen ttk-91 suorittimen rekisterit ja muisti. Kaikki ttk-91 ohjelmat voidaan suorittaa Titokoneessa ja ne käyttäytyvät (suoritusaikaa lukuunottamatta) samalla tavalla kuin jos ne olisi suoritettu todellisella ttk-91 suorittimella. 

Intelin hyvin kauan käytössä olleelle x86 suoritinarkkitehtuurille toimivia ohjelmia on valtava määrä ja Intel haluaa, että niiden latausmoduuleja voi suorittaa sellaisenaan (joskus muinoin käännetyssä ja linkitetyssä x86-konekielisessä muodossa) nykyisissä Intelin suorittimissa. Tällaisia vanhoja ohjelmia kutsutaan joskus nimellä "dusty deck", koska osa niistä voi olla kirjoitettu [reikäkorttiaikaan](https://fi.wikipedia.org/wiki/Reik%C3%A4kortti). Uusissa suorittimissa voi laitteistolla olla samalla mikropiirillä toteutettu x86-emulaattori. Toinen vaihtoehto on ohjelmana toteutettu x86-emulaattori, jolle vanhat x86-ohjelmat voi antaa suoritettavaksi. Tai sitten uuden suorittimen konekieli on suoraan x86-konekielen laajennus, jolloin x86-käskyt toimivat sellaisenaan. Joka tapauksessa näin voidaan saada pelaajille vanhat x86-pelit edelleen suorituskelpoisiksi.

## Simulointi
[Simulointi](https://en.wikipedia.org/wiki/Simulation) on sukua tulkitsemiselle ja emuloinnille, mutta tarkoittaa vähän eri asiaa. Tulkitsemisessa annetaan täsmällisiä komentoja järjestelmälle ja emuloinnissa imitoidaan yhden laitteen tai järjestelmän toimintaa toisella laitteella tai järjestelmällä. Simulointi on lähempänä emulointia, koska siinäkin jäljitellään jonkin toisen laitteen tai systeemin toimintaa joiltakin osin. 

Tietokoneopelit ovat simulaattoreita. Niissä mallinnetaan todellista tai kuviteltua maailmaa pelin suunnittelijan määräämällä tarkkuudella. Kun pelaajan hahmot liikkuvat pelissä, simulaattori laskee koko ajan muuttuvan pelitilanteen, joka näkyy (ja tuntuu?) pelaajalle joko realiaikaisesti tai simuloidun ajan mukaan. Ammuntapeleissä aika liikkuu usein näennäisen realiaikaisesti kun taas esimerkiksi laivastopeleissä aika voi edetä paljon nopeammin kuin todellisuudessa tapahtuisi. Pelaajan mielenkiinto lopsahtaisi, jos pelin aikana pitäisi odottaa viikko, kun laivasto liikkuu uuteen paikkaan.

Lentokonesimulaattori jäljittelee todellisen lentokoneen ohjaamista sillä tarkkuudella kuin on kussakin käyttökohteessa järkevää. Tietokonepelissä riittää jäljitellä yksinkertaisimmat toiminnot, jolloin käyttöliittymäksi voi riittää tietokoneen näppäimistö, hiiri ja näyttö. Lentäjien koulutuksessa halutaan mahdollisimman paljon realismia simulointiin, jolloin käyttöliittymä voisi olla täsmälleen oikean lentokoneen ohjaimisto ja jokaisen säätimen toiminta täsmälleen sama kuin mitä se olisi oikeassa koneessa. Ohjaamon ikkunoiden kohdalla voi olla tehokas näyttö, joka näyttää simuloidun näkymän siihen suuntaan. Lisäksi lentäjien koulutuksessa simuloitu aika etenee tarvittaessa samaa tahtia kuin todellisuudessa. Simulaattorit ovat niin hyviä, että ensi kertaa oikealla koneella lennettäessä kyydissä on jo matkustajatkin.

Tietokoneen ohjelman toiminnan simuloinnissa voitaisiin sen suorituskykyarvioinnin yhteydessä keskittyä laskennan käyttämään aikaan. Tällöin esimerkiksi sovelluksen _UhkaArvio_ aliohjelman _LaskeOhjuksenSijainti_ suorituksen simuloinnissa ei suoritetakaan itse koodia, vaan ainoastaan kulutetaan simuloitua aikaa sen verran kuin koodin suoritus oikealla _ensi vuonna käyttöön tulevalla suorittimella_ kestäisi. Simuloinnin lopputulos voi olla, että sovelluksen _UhkaArvio_ suorittamiseen kuluu 0.84 sekuntia. Jos tämä on liikaa, niin ehkä esimerkiksi aliohjelman _LaskeOhjuksenSijainti_ koodia pitää vielä optimoida lisää.

Tavallaan Titokone on myöskin oikeastaan vain simulaattori, koska se ei emuloi ihan kaikkia ttk-91 suorittimen toimintoja täsmällisesti. Ttk-91 suorittimen ja sen käyttöjärjestelmän määrittely ei ole täydellinen, joten täsmällistä toimintaa ei ole edes määritelty kunnolla. Ttk-91 suoritin on kuitenkin riittävän hyvin määritelty, jotta Titokone voi simuloida sen toimintaa tärkeiden komponenttien osalta funktionaalisesti oikein ja riittävällä tarkkuudella tämän kurssin tavoitteisiin nähden. 


## Quizit 10.1
<!-- Quiz 10.1.?? -->
<div><quiz id="a15e1f66-8080-477e-b987-d550017610f8"></quiz></div>
<div><quiz id="9c555a84-7c7e-42f0-9d45-cea8608b7497"></quiz></div>
<div><quiz id="42571b0e-635b-452d-8533-3e87d91f423b"></quiz></div>
