---
path: '/luku-5/2-valinta-ja-toistolauseet'
title: 'Ohjelmoinnin peruskäsitteet sekä valinta- ja toistolauseiden toteutus'
---

<div>
<lead>Normaalitapauksessa seuraavaksi suoritettava konekäsky on muistissa suorituksessa nyt olevan konekäskyn jälkeen. Valintalauseella suorituspolku voi haarautua jonkin ehdon perusteella kahden tai useamman suoritushaaran välillä. Toistolause tarkoittaa sitä, että sama koodinpätkä suoritetaan uudestaan monta kertaa peräkkäin ja suorituskerrat eroavat yleensä vain yhden muuttujan (ns. muuntelumuuttujan) arvon osalta.</lead>
</div>

## Ohjelmoinnin peruskäsitteet
Ohjelmoinnissa voidaan ajatella olevan muutama peruskäsite, jotka pitää jollain tavoin toteuttaa. Varsinainen _laskentatyö_ on pääasia ja se oikeastaan tarkoittaa yksinkertaisten laskutoimitusten tekoa. Aritmeettis-loogisten lausekkeiden toteutus konekielellä on hyvin suoraviivaista, koska yleisimmin käytetyt aritmeettis-loogiset operaatiot voidaan toteuttaa suoraan niitä vastaavilla konekäskyillä. Pienenä ongelma-alueena tässä on, että kaikki laskenta tapahtuu rekistereiden avulla ja pienen rekisterijoukon optimaalinen käyttö suuren datajoukon laskentaan ei ole ihan helppoa.

```
; lausekkeen x = 2x+y toteutus konekielellä
load r1, x
mul r1, =2
add r1, y
store r1, x
```

Ohjelman _kontrolli_ määrittelee, mistä seuraava konekäsky löytyy nyt suorituksessa olevan jälkeen. Oletusarvoisestihan seuraava konekäsky löytyy edellisen jälkeen muistista, mutta usein kontrolli haarautuu muualle ohjelmalogiikan mukaisesti. Tähän liittyy erilaisten koodin suorituspolkujen valinta ja eri tavoin tapahtuva saman koodin suorituksen toisto.

_Aliohjelmat_ (funktiot, metodit) ovat oma kategoriansa kontrollin siirron suhteen. Niissä on helposti käytettävää parametrisoitua koodia, jota voidaan käyttää _kutsumalla_ mistä tahansa. Aliohjelmat voivat olla kyseisen ohjelmiston omien sisäisten rutiinien lisäksi ohjelmointikielen tai käyttöjärjestelmän palvelurutiineja. Nämä käsitellään seuraavassa luvussa 6.

Käsiteltävä tieto voi olla yksittäisiä sanoja, mutta usein tarvitaan laajempia _tietorakenteita_. Yksinkertaisissa tietorakenteissa olevaan tietoon pystytään viittaamaan suoraan konekäskystä sopivan tiedonosoitusmoodin avulla. Monimutkaisessa tietorakenteet ovat sellaisia, joissa viitattavan tiedon osoite pitää laskea usean konekäskyn avulla ennen kuin dataviite voidaan tehdä.

## Valintalauseet korkean tason kielissä
Tyypillisesti kaikissa korkean tason ohjelmointikielissä on ehdollinen "_if&nbsp;...&nbsp;then&nbsp;...&nbsp;else&nbsp;..._" kontrollirakenne, jonka avulla valitaan kumpi mahdollisista koodinpätkistä suoritetaan. Tästä on myös yksinkertaisempi "_if&nbsp;...&nbsp;then_" muoto, jossa then-haaran koodi suoritetaan vain, jos annettu ehto on voimassa. Sen jälkeen suoritus jatkuu normaalisti "_if&nbsp;...&nbsp;then_" lauseen jälkeisessä koodissa joka tapauksessa.

Joissakin ohjelmointikielissä on myös ns. _switch_ tai _case_ lause, jolla mahdollinen suorituspolku valitaan useamman vaihtoehdon väliltä. Esimerkiksi C-kielen switch-lauseella voidaan suoritettava koodinpätkä valita sen mukaan, mikä jonkin lausekkeen arvo tällä hetkellä on. Lisäksi mukana on oletusarvo vaihtoehto, joka valitaan silloin kun mikään erikseen nimetty vaihtoehto ei toteutunut.

```
switch(error-number)  {
    case 1: ... ; break;
    case 2: ... ; break;
    case 8: ... ; break;
    default: ...
    }
```

## Valintalauseet konekielessä
Konekielessä valintalauseet toteutetaan yksinkertaisesti ehdollisilla hyppykäskyillä.

```
      load r1, X
      jnzer r1, xnzer       ; jos r1 != 0, hyppää kohtaan xnzer 
      ...                   ; then-haara
      jump done
xnzer ...                   ; else-haara
done  nop
```

Monivalinta tehdään tyypillisesti vain vertailemalla lausekkeen arvoa eri vaihtoehtoihin

```
     load r1, X
     comp r1, =1
     jnequ not1
     ...           ; vaihtoehto X=1
     jump done
not1 comp r1, =2
     jnequ not2
     ...           ; vaihtoehto X=2
     jump done
not2 comp r1, =3
     jnequ not3
     ...           ; vaihtoehto X=3
     jump done
not3 ...           ; oletus vaihtoehto (default)
done nop
```

Tämä on tietenkin aika hidasta, kun keskimäärin pitää puolet vaihtoehdoista käydä läpi ennen oikean löytämistä. Oikean vaihtoedon löytämistä voi nopeuttaa, jos laittaa todennäköisimmät vaihtoehdot ensin, mutta tämä ei useinkaan ole mahdollista. Hyvin kätevä korkean tason kielen rakenne muuttuu siis aika kömpelöksi konekieliseksi toteutukseksi.


Joissakin tapauksissa monivalinta voidaan toteuttaa ns. _hyppytaulun_ (jump table) avulla. Hyppytaulussa on talletettuna eri vaihtoehtojen _hyppyosoitteet_, joista yksi valitaan haarautumisehdon perusteella. Hyppytaulun huonona puolena on, että sen pitää kattaa kaikki ehtolausekkeen mahdolliset arvot.

```
JumpT  ds 10   ; oleta arvoalue 0-9

; --- eri vaihtoehtoihin liittyvät koodit
case1   ...      ; vaihtoehto X=1
        jump done
case2   ...      ; vaihtoehto X=2
        jump done
case8   ...      ; vaihtoehto X=8
        jump done
caseD   ...      ; oletus vaihtoehto (default)
        jump done

; --- hyppytaulun JumpT alustus
        ...     ; alusta kaikkiin arvo caseD

        load r1, =case1   ; muuta vaihtoon 1 liittyvä osoite
        load r2, =1
        store r1, JumpT(r2)

        load r1, =case2
        load r2, =2
        store r1, JumpT(r2)

        load r1, =case8
        load r2, =8
        store r1, JumpT(r2)

; --- halutun vaihtoehdon valinta
        ; tässä pitäisi ehkä tarkistaa, onko X:n arvo ok!
        load r1, X
        load r2, Jump(r1)   ; oikean vaihtoehdon osoite
        jump 0(r2)
done    nop
```

Toinen vaihtoehto on, että hyppytaulussa onkin eri vaihtoehtoihin johtavat _hyppykäskyt_, joista yksi valitaan suoritukseen haarautumisehdon perusteella. Taulun alustus ja vaihtoehdon valinta tapahtuvat nyt tietenkin vähän eri tavalla.

```
; --- halutun vaihtoehdon valinta
        load r1, X
        jump r2, JumpT(r1) ; hyppää oikeaan vaihtoehtoon hyppäävään käskyyn
done    nop
```

## Toistolauseet korkean tason kielissä
Korkean tason kielissä on tyypillisesti muutama erityyppinen toistolause. Toistolauseiden tyyppejä on useanlaisia, koska joihinkin tapauksiin ongelman ratkaisu on helpompaa tietyn tyyppisellä toistolauseella kuin jollakin toisella.

For-silmukassa muuntelumuuttujalle annetaan alkuarvo, sen muutoksen ilmaisema lauseke ja silmukan lopetusehto. Joissakin kielissä sallitaan myös usean muuntelumuuttujan käyttö.

```
for (i=0; i++; i<30) {    /* i++ on sama kuin i=i+1, C tai Java */
    A[i] = 4*i;
    }
```

Useimmissa kielissä ehtolauseke tarkistetaan ennen silmukan koodin suorittamista ja tällöin on mahdollista, että silmukan koodia (_runkoa_) ei suoriteta lainkaan. Joissakin kielissä ehtolauseke tarkistetaan vasta silmukan koodin suorittamisen jälkeen. Tuolloin silmukan koodi suoritetaan aina vähintään yhden kerran.

```
   do 50 i = 0, 30, 1      /* Fortran */
   A[i] = 4*i;
50 continue
```

Toinen tyypillinen toistolause on "_while-do_" silmukka, jossa silmukkaa suoritetaan kunnes jokin ehto tulee voimaan. Muuntelumuuttujia voi tällöin olla silmukassa useitakin, mutta ne täytyy alustaa while-lauseen ulkopuolella.

```
i=0; j= 50;
while (i<j) do {          /* C tai Java */
    x = T[i];
    T[i] = T[j];
    T[j] = x;
    i++; j++;
    }
```

Tästäkin on muoto, jossa silmukan runko suoritetaan ainakin kerran. Siitä käytetään esimerkiksi nimiä "_do-while_", "_do-until_" tai "_repeat-until_" silmukka, ohjelmointikielestä riippuen.

```
i=0; j= 50;
do {                           /* C Sharp */
    x = T[i];
    T[i] = T[j];
    T[j] = x;
    i++; j++;
    }
until i>j;
```

Eri ohjelmointikielissä on vielä paljon muitakin toistolauseen muotoja, mutta yleensä ne ovat näiden neljän muunnoksia. Saman näköisilläkin toistolauseilla voi olla eri ohjelmointikielissä erilainen merkitys (_semantiikka_). Joissakin ohjelmointikielissä silmukan rungosta tai koko silmukasta voi poistua esim. _exit_-lauseella. Joissakin ohjelmointikielissä voi silmukan yhteydessä määritellä uusia muuttujia, jotka ovat olemassa ja viitattavissa vain tuon silmukan sisällä. Emme käsittele näitä silmukoiden erityispiirteitä tässä sen enempää.

## Toistolauseet konekielessä
Konekielessä toistolauseita on vain kahden tyyppisiä. Molemmissa alustetaan ensin mahdolliset muuntelumuuttujat. Ensimmäisessä tapauksessa tarkistetaan heti, josko silmukasta poistutaan tällä hetkellä. Jos ei poistuta, niin silmukan runko suoritetaan ja sen jälkeen tehdään mahdolliset muutokset muuntelumuuttujiin. Toisessa vaihtoehdossa silmukan runko ja muutokset muuuntelumuuttujiin suoritetaan ensin ja sitten vasta testataan silmukan päättymisehtoa. Näillä kahdella vaihtoehdolla voidaan toteuttaa kaikki korkean tason kielten toistolauseet. Totta kai varsinaisessa konekielisessä toteutuksessa pitää huomioida kunkin korkean tason kielen semanttiset erityispiirteet.

Esimerkiksi, edellä oleva C-kielen taulukon alustus for-silmukalla voitaisiin toteuttaa konekielellä seuraavasti:

```
      load r1, =0       ;  muuntelumuuttujan i alustus, arvo r1:ssä
loop  comp r1, =30      ; silmukan lopetustesti
      jequ done
      load r2, r1       ; silmukan runko
      mul  r2, =4
      store r2, A(r1)
      add r1, =1        ; lisätään muuntelumuuttujan i arvoa yhdellä, arvo r1:ssä
      jump loop
done  nop               ; poistu silmukasta
```

Vastaavasti edellä oleva Fortran-kielinen do-silmukka ("do 50") olisi konekielellä:

```
      load r1, =0       ;  muuntelumuuttujan i alustus, arvo r1:ssä
loop  load r2, r1       ; silmukan runko
      mul  r2, =4
      store r2, A(r1)
      add r1, =1        ; lisätään muuntelumuuttujan i arvoa yhdellä, arvo r1:ssä
      comp r1, =30      ; silmukan lopetustesti
      jless loop
```

Vaikka silmukat näyttävät kovin samanlaisilta, niissä on merkittävä semanttinen ero. Ei ole ollenkaan yhdentekevää, testataanko silmukan lopetusehto ennen ensimmäistä silmukan rungon suorituskertaa vai ei.

<!-- quiz 5.2.?? ???? -->

<div><quiz id="4ff4b9ca-32e3-4e45-80a5-28e31af2f6c7"></quiz></div>
<div><quiz id="5b8e3913-3a45-4e95-b6a5-2ed19e75eb1a"></quiz></div>
<div><quiz id="4aca88a5-2f9a-4589-a11d-263ef9a1e69b"></quiz></div>
<div><quiz id="8c5c7cfb-5956-43c3-a229-47c6d1bd1c89"></quiz></div>
