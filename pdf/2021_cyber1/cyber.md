---
title: "Introducción a la cyberseguridad"
subtitle: "Pentest / Retro-Ingeniería / RCE (ejecución de código a distancia)"
author: "Martin Tourneboeuf"
date: "April 13, 2021"
institute: "ALMA: Atacama Large Millimeter/submillimeter Array"
fonttheme: "professionalfonts"
mainfont: "Hack Nerd Font"
fontsize: "13pt"
aspectratio: "169"
header-includes: |
  \metroset{background=light, sectionpage=none}
  \usepackage{setspace}
  \renewcommand{\baselinestretch}{1.5} 

comment: |
  \definecolor{mDarkBrown}{HTML}{604c38}
  \definecolor{mDarkTeal}{HTML}{23373b}
  \definecolor{mLightBrown}{HTML}{EB811B}
  \definecolor{mLightGreen}{HTML}{14B03D}

---


## Contenido

::: columns

:::: {.column width=40%}

#### Indice

1. Paisaje cyber-seguridad
2. Buscar vulnerabilidades
3. Explotar vulnerabilidades

::::

\pause
:::: {.column width=60%}

#### Descargo

Esta presentacion __no__ es sobre:

###### Criminales

* Ver __Metasploit__: CLI

###### Antivirus

* Ver __Yara__: signaturas (estatico)
* Ver comportamental: serie de tiempo de io (dynamico)
* Protegen solo de ataques conocidos

::::
:::

# 1/ Paisaje cyber-seguridad

## Chronologia: Cyber, el terreno digital

| Fecha | Terreno   | Ejemplo            | Lugar |
| ---   | ---       | ---                | --- |
| -8000 | Tierra    | masa, baston       | Africa, China |
| -2200 | Mar       | botes de papiro    | Egipto |
| 1911  | Aire      | avión de hélice    | Francía |
| 1957  | Espacio   | satélite espía     | Russia, USA |
| 2011  | __Cyber__ | gusano informático | Bielorrusia |

__[StuxNet](https://es.wikipedia.org/wiki/Stuxnet):__ aputa los sistemas SCADA, particularmente en el sector nuclear: (Israel + Usa -> Irán), 4 zero-day

## Seguridad: humanos Vs humanos

|             | __Safety__                   | __Security__ |
| ---         | ---                          | --- |
| Adversario  | __Natural__                  | __Humano__ |
| Definicion  | Incontrolado / __aleatorio__ | Un culpable __malicioso__ |
| Herramienta | Guantes, Chaleco salvavidas  | Cerradura, Cuenta en el extranjero |
| Digital     | Linter, Tests, Watcher, Log  | Review, Fuzz, Watcher, Reverse |

## Un terreno Asymetrico

::: columns
:::: {.column width=40%}
#### Securidad

| Attaquantes | Defensores |
| ---         | --- |
| ratas       | leviathan |
| 5 ladrones  | 10.000 vecinos |
| 1 virus     | 10e10 globulos blancos |

::::

:::: {.column width=60%}
#### Cyber
* __Nuevo terreno__, __barato__, al que llega primero __reclama__
* Se puede __apuntar lejos__
* Se puede __esconder__
* La __copia es gratis__ => Se puede crecer rapido, 

::::

:::

El attaquante puede probar su cargar sobre los AV => esta adelantado

El defensor debe comprobar que __toda__ las entredas son segura



## Mapa del los actores

* !!! Tu !!!

* Antivirus (servicios de seguridad)
* Empresa (admin sys ! no son cyberdefensores)
* Estado (cuida computadores mas essenciales que los tuyos, basicamente los suyos)

[Vea aquí: el mapeo de los actores estatales del cyber en francía](https://www.spacesecurity.info/cartographie-des-acteurs-etatiques-du-cyber-en-france/)

[Chile](https://atlas.cid.harvard.edu/countries/42/export-basket), [Francia](https://atlas.cid.harvard.edu/countries/77/export-basket), [USA](https://atlas.cid.harvard.edu/countries/231/export-basket), [Japan](https://atlas.cid.harvard.edu/countries/114/export-basket)

[Diplomatie](https://www.diplomatie.gouv.fr/local/cache-vignettes/L1280xH887/20210402_fcvregional_monde_cle4814ce-3734d.jpg?1617358259)

# 2/ Buscar vulnerabilidades

## Que es una vulnerabilidad informatica ?

\begin{center}
\textcolor{mDarkTeal}{
\Large
\href{https://en.wikipedia.org/wiki/Vulnerability_(computing)}{Lo que permite}\\
que un programa haga\\
algo que sus usarios no habian contemplado\\
}
\end{center}

\pause

"Un cyber-ataque se hace mediante la explotación de una vulnerabilidad"

Si es explotable pasamos de la safety a la security

## Tipos 

## Algunas vulnerabilidades conocidas

* __Indefinido:__ comportamiento ([spec](https://en.cppreference.com/w/cpp/language/ub))
* __Tipo:__ confusión
  * imediato | pointer
  * con signo | sin signo
* __Entero:__ Desbordamiento de enteros
* __Limite:__ Fuera (out-of-bound)
* __Dato:__ corupto o mal normalisado: Sql, Regex, Unicode
* __Característica:__ secreta

## Cyclo V: del pentest a la retroingeneria

El pentest, para ser realista, contempla:

::: columns
:::: {.column width=40%}
0. (__Analisys__ de riesgo: quien es el atacante)
1. __Anonimisación__
2. __Reconocimiento__ de la superficie de exposición (alias: superficie de ataque) ex: puertos abiertos

::::
:::: {.column width=40%}
4. __Pruebas__
5. __Explotacion__ (producion)
6. __Instalación__ (persistir, esconderse, communicar, explorar, reproducirse, ....)

::::
:::

3. __Retro-ingeneria__ (analisys en laboratorio)

Es solo question de tiempo para cada etapa del ciclo en V


## Demo: buscar vulnerabilidades

Shell, Firefox, Fuzz, IDA, Gdb

* El Fuzz (dynamic):
  * $+$ puede usar el codigo como caja negra (barato)
  * $-$ no encuentra todo
  * $-$ encuentra siempre lo mismo: falta diversidad, 2 no valen mas que 1
* No olvides de donde vienes,
* Hypothesis, validacion y sus ventajas (yes no question)
* Si podia ejecutar codigo y ahora puedo ejecutar codigo, no gane nada !

## Demo: Diagrama de un CPU

\small
\setstretch{0.0}

```
+------+---------------------+-----+---+------+------+
| RAM  | mov rax, [rbx+0x10] | nop | . | 0x42 | ...  |
+------+---------------------+-----+---+------+------+
          |                               ^
          |                               |
+---------|-------------------------------|----------+
| CPU     |                               |          |
|         |    Registers                  |          |
|  +----+ |  +-----+-----+-----+-----+    |          |
|  | PC | |  | RAX | RBX | ... | R15 |    |          |
|  +----+ |  +-----+-----+-----+-----+    |          |
|    |    |                      ^        |          |
|    v    v                      |        |          |
|  +---------+          +----------------------+     |
|  |         |          |                      |     |
|  |         |          |   Arithmetic and     |     |
|  | Decoder |--------->|   Logic              |     |
|  |         |          |   Unit               |     |
|  |         |          |                      |     |
|  +---------+          +----------------------+     |
|                                                    |
+----------------------------------------------------+
```


# 3/ Explotar vulnerabilidades

## [ROP: Return-oriented programming](https://en.wikipedia.org/wiki/Return-oriented_programming)

Un tipo de baile en la RAM

\tiny
Ver [la emboscada 1999](https://es.wikipedia.org/wiki/Entrapment_(pel%C3%ADcula_de_1999)) (Sean Connery, Catherine Zeta-Jones)

## Mitigation (Hagan la lista en casa)

* __Canary:__ [Stack-Cookie](https://en.wikipedia.org/wiki/Buffer_overflow_protection#Canaries)
* __DEP:__ [Data Exceution Prevention (NX for Linux)](https://en.wikipedia.org/wiki/Executable_space_protection#Windows)
* __ASLR:__ [Address space layout randomization](https://en.wikipedia.org/wiki/Address_space_layout_randomization)
* __CFI:__ [Control Flow Integrity](https://en.wikipedia.org/wiki/Control-flow_integrity)
* Higher levels: backup, isolation, trap

# +/ Referencias

## Y Alma ? Preguntas para el nuevo equipo de cyberdefensores

0. Attacantes potenciales, la carga final asociada
1. Superficie de exposición (servidores __y__ servicios)
2. Como el atacante comunicara, se escondera, se anonimisara ...
3. Quien o que lo detectara
4. Hasta donde puede herir la empresa (ver mitigaciones)

\tiny
Ver [pentest@wikipedia](https://en.wikipedia.org/wiki/Penetration_test)

## Links

* [Intel software developer manual](https://software.intel.com/content/www/us/en/develop/articles/intel-sdm.html)
* [Simple CPU](http://www.simplecpudesign.com/simple_cpu_v1/index.html)

## Optimisaciones

::: columns
:::: {.column}
![Debug](./res/not_optimized.png "Debug")
::::
:::: {.column}

![Release](./res/optimized.png "Release")
::::
:::


## Calling conventions Intel 64 bits

| N   | Windows  | Linux |
| --- | ---      | --- |
| 1   | RCX      | RDI |
| 2   | RDX      | RSI |
| 3   | R8       | RDX |
| 4   | R9       | RCX |
| 5   | [rsp+8]  | R8 |
| 6   | [rsp+10] | R9 |
