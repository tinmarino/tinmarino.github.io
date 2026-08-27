---
title: Git para operaciones — el script de clase
---

# Git para operaciones: el script `gg`

Compañero de las dos clases de Git. Imprime una ficha por comando (Brief / Desc / Ex / Mission) y genera cambios aleatorios en un repositorio de prueba, para poder mostrar `status`, `diff`, `add` y `commit` sobre un diff real en vez de uno inventado.

```bash
alias gg='python3 /ruta/a/git_para_operaciones.py'

gg              # ayuda + el alias que hay que poner en ~/.bashrc
gg list         # el índice de las dos clases (alias: gg ll)
gg ll 2         # sólo la clase 2
gg 101          # la ficha de git help, por número
gg help         # la misma ficha, por nombre
gg merge        # 207, la ficha de git merge
gg cc -n 5      # cinco cambios al azar en el repo actual
gg cc --commit  # y commitearlos
```

La clase 1 está numerada `1xx` (101 `help`, 102 `init`, … 116 `clean`) y la clase 2 `2xx` (201 `clone`, 202 `remote`, … 217 `cat-file`). Todo el contenido vive en un `OrderedDict` al principio del archivo: agregar un comando es agregar una entrada, y queda invocable por número y por nombre sin tocar nada más.

El subcomando `cc` trabaja sobre `$GG_DEMO_REPO`, si no sobre el repositorio del directorio actual, y si no sobre el que encuentre en `./demo/` o `./safedev/`. Nunca toca el repositorio donde vive el script. Si el repo está recién iniciado y no tiene nada versionado, usa los archivos sin seguimiento; y si está vacío del todo, crea uno, para que siempre haya algo que mostrar.

```embed
/res/code/git_para_operaciones/git_para_operaciones.py
```
