---
path: '/luku-6/2-akt-tiet-rakentaminen'
title: 'Aktivaatiotietueen rakentaminen'
---

<div>
<lead>Tässä osiossa käydään läpi protokolla, joka kutsuvan ja kutsutun rutiinin pitää noudattaa aktivaatiotietueiden rakentamisessa ja purkamisessa.</lead>
</div>


## Aktivaatiotietueen rakentaminen ja purku
Aktivaatiotietueen rakentaminen ja purku tapahtuvat kahdessa vaiheessa. Osan työstä tekee kutsuva rutiini usean konekäskyn avulla ja osan työstä tekee kutsuttu rutiini niin ikään usean konekäskyn avulla.

Kutsuva rutiini aloittaa työn ja laittaa pinoon ensin tilan paluuarvolle (jos kyseessä on funktio) ja sitten kaikki parametrien arvot, oman tyyppinsä mukaisesti.

```
push sp, =0        ; tila paluuarvolle
push sp, x         ; arvoparametri esimerkki
push sp, =x         ; viiteparametri esimerkki
```

Seuraavaksi call-käskyllä pinoon laitetaan PC:n nykyarvo eli paluuosoite ja FP nykyarvo eli kutsuvan rutiinin AT:n osoite. Tässä yhteydessä kontrolli siirtyy kutsutulle rutiinille, joka rakentaa sitten loput AT:stä ennen varsinaista laskentatehtäväänsä.

```
call sp, funcX     ; pinoon vanha PC ja vanha FP
```

Kutsuttu rutiini tekee nyt aluksi hallinnolliset alkutoimet, eli _prologin_. Siinä varataan tilat paikallisille tietorakenteille ja talletetaan tarvittavien työrekisterien arvot.

```
push sp, =0    ; tila ensimmäiselle paikalliselle muuttujalle, alkuarvo 0
pushr sp       ; talleta kaikki työrekisterit
```

Nyt AT on valmis ja itse rutiinin työ voidaan tehdä. Jos kyseessä on funktio, niin lopuksi pitää paluuarvo tallettaa omalle paikalleen AT:hen.

Lopuksi aloitetaan aktivaatiotietueen purku eli _epilogi_. Hyvin usein todellisissa symbolisissa konekielissä on tehokkaat _makrot_ epilogin ja prologin koodien tuottamiseksi. Ensin palautetaan talletettujen työrekistereiden arvot ja vapautetaan paikallisten tietorakenteiden tilanvaraukset. Lopuksi kontrolli ja suoritusympäristö palautetaan kutsuvalle rutiinille exit-käskyllä, joka samalla vapauttaa parametrien tilanvaraukset pinosta.

```
popr sp     ; palauta kaikki työrekisterit
sub sp, =1  ; vapauta paikallisen muuttujan tilanvaraus
exit sp, =2 ; palauta PC ja FP pinosta, vapauta 2 parametrin tila
```

Nyt kontrolli on takaisin kutsuvalla rutiinilla, joka ottaa funktion paluuarvon käyttöönsä pinosta (jos kutsuttu rutiini oli funktio). Näin koko kutsutun rutiinin AT on purettu ja pinon sisältö on täsmälleen sama kuin mitä se oli ennen rutiinin kutsua.

```
pop sp, r1  ; poista funktion arvo pinosta rekisteriin r1
```


## Esimerkki funktion toteutuksesta
Käytetään esimerkkinä kokonaislukuarvoista funktiota fA(x,y), joka käyttää paikallista muuttujaa z (alkuarvo 5) ja palauttaa arvonaan lausekkeen x\*z+y arvon.

```
int fA (int x, y) {  /* x ja y arvoparametreja */
    int z = 5;

    z = x * z + y;
    return(z)
    }
```

Funktiota fA käytetään lauseen t = fA(200, r) toteutukseen, kun r ja t ovat globaaleja muuttujia.

### Kutsuvan rutiinin koodi
Kutsuvassa rutiinissa funktion käyttö tapahtuu konekielellä seuraavanlaisesti.

```
r  dc 24      ; r on globaali muuttuja, alkuarvo 24
t  dc 55      ; t on globaali muuttuja, alkuarvo 55
   ...
;
; toteuta t = fA(200, r)
;
k1    push sp, =0   ; tila paluuarvolle
k2    push sp, =200 ; vakio 200
k3    push sp, r    ; muuttujan r arvo
k4    call sp, fA   ; funktion kutsu
k5    pop sp, r1    ; paluuarvon poisto pinosta
k6    store r1, t

```
Ennen funktion kutsun aloittamista (käsky k1) pinossa on kutsuvan rutiinin AT.

```
    FP  -->   ??    ; kutsuvan rutiinin AT
              ...
    SP -->    ??
```


Juuri ennen funktion kutsua (käsky k4) pinossa on paikka paluuarvolle ja parametrit.

```
    FP  -->   ??    ; kutsuvan rutiinin AT
              ...
              ??
              0
              200
    SP -->    24
```

Heti funktiosta palattua (ennen käskyn k5 suoritusta) pinossa on kutsutun rutiinin AT:stä jäljellä vain paluuarvo (jos sitä yleensä oli).

```
    FP  -->   ??    ; kutsuvan rutiinin AT
              ...
              ??
    SP -->    1024  ; funktion paluuarvo
```

Lopulta käskyn k5 suorittamisen jälkeen pino on ennallaan ja suoritus jatkuu kutsuvan rutiinin ympäristössä.

```
    FP  -->   ??    ; kutsuvan rutiinin AT
              ...
    SP -->    ??
```

### Kutsutun rutiinin koodi
Funktio fA() voidaan toteuttaa konekielellä seuraavalla tavalla. Määrittelemme aluksi symbolit paluuarvon, parametrien ja paikallisten tietorakenteiden suhteellisille sijainneille AT:ssä. Kaikki viitteet noihin tietorakenteisiin tehdään sitten noiden symbolien avulla käyttäen niitä suhteellisina osoitteina AT:ssa.

```
;
; funktio fA(x,y)    x ja y ovat arvoparametreja
;
retfA equ -4   ; paluuarvon suhteellinen osoite AT:ssa
parX  equ -3   ; parametrien x ja y suhteelliset osoitteet AT:ssa
parY  equ -2
locZ  equ 1    ; paikallisen muuttujan z suhteellinen osoite AT:ssä

fa    push sp, =0  ; tilanvaraus paikalliselle muuttujalle AT:ssä
      push sp, r1  ; talleta r1

      load r1, =5  ; alusta Z
f4    store r1, locZ(fp)  ; viite Z:aan fp:n kautta

      load r1, parX(fp)  ; funktion varsinainen koodi
      mul r1, locZ(fp)
      add r1, parY(fp)
      store r1, locZ(fp)

      store r1, retfA(fp) ; talleta paluuarvo

f10   pop sp, r1   ; palauta r1
      sub sp, =1   ; vapauta Z:n tilanvaraus
f12   exit sp, =2  ; paluu kutsuvaan rutiiniin
```

Kun kontrolli on siirtynyt fA:lle (käsky fa), pinossa on paikka paluuarvolle, parametrit sekä vanha PC ja FP:

```
              ??
vanha FP -->  ...   ; kutsuvan rutiinin AT
              ??
              0
              200
              24
              vanha PC
FP, SP -->    vanha FP
```

Kun prologi ja paikallisen muuttujan z alustus on tehty (käsky f4), uusi AT on valmis ja pinon sisältö on seuraavanlainen:

```
              ??
vanha FP -->  ...  ; kutsuvan rutiinin AT
              ??
              0
              200
              24
              vanha PC
    FP -->    vanha FP
              5
    SP -->    vanha r1
```

Juuri ennen epilogia (f10) funktion työ on tehty ja paluuarvo on paikallaan:

```
              ??
vanha FP -->  ...  ; kutsuvan rutiinin AT
              ??
              1024
              200
              24
              vanha PC
    FP -->    vanha FP
              5
    SP -->    vanha r1
```

Epilogissa palautetaan r1:n vanha arvo ja vapautetaan Z:n tilanvaraus:

```
              ??
vanha FP -->  ...   ; kutsuvan rutiinin AT
              ??
              1024
              200
              24
              vanha PC
FP, SP -->    vanha FP
              5
              vanha r1
```

Lopulta exit-käsky (f12) palauttaa pinosta FP:n ja PC:n arvot ennalleen (ja SP:n arvo vähenee vastaamaan pinosta poistettua määrää eli vähenee kahdella) ja poistaa lisäksi 2 parametria pinosta (tarkemmin ottaen siis vähentää SP:n arvosta 2). Nyt pino-osoitin SP osoittaa funktion paluuarvoon (1024). Tämän jälkeen suoritus siirtyy kutsuvalle rutiinille. Kutsuva rutiini sitten poistaa paluuarvon pinosta (pop sp, r1) ja käyttää haluamallaan tavalla.

```
              ??
      FP -->  ...   ; kutsuvan rutiinin AT
              ??
      SP -->  1024
              200
              24
              vanha PC
              vanha FP
              5
              vanha r1
```

<!-- quiz 6.2.?? ???  -->

<div><quiz id="4a42ed50-2f44-4090-951c-25f9a13cd1d6"></quiz></div>
<div><quiz id="2d892009-1cfb-480b-8dc3-e8db1d66b13b"></quiz></div>
