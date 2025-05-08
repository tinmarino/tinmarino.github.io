---
title: CTF creación
description: Tutorial para crear un template de CTF que se pueda utilisar como base
keywords: php, docker, ctf, pentest, web
author: Tinmarino
---


# Introdución

Esta página detalla los pasos para crear un desafío CTF de Pentest web mediante un servicio PHP en un contenedor Docker.

Los archivos están en el template que utilizo para copiar pegar antes de crear un nuevo desafio. El contenido de todo los archivos se ha extraido mediante el siguiente comando para enviarselas en texto claro mientras que mediante un tarball.
 
```bash
find . -type f -exec tail -n +1 {} +
```

Posteriormente a eso, es posible crear servidores en la nube con IP pública mediante [AWS](https://us-east-1.console.aws.amazon.com/console/home?region=us-east-1#) y, opcionalmente, asignar un nombre de dominio público a través de [GoDaddy](https://dcc.godaddy.com/).

Además, se recomienda utilizar el programa [CTFd](https://github.com/CTFd/CTFd) de código fuente abierto para servir la interfase de monitoreo de los puntajes.

# Archivos


### web/index.php

Empezar con la creación del servicio. Por ejemplo este código PHP remplazá la flag de una página de template en HTML.


```php
<?php
// Declare flag (target)
$flag = "CTF{flag-TODO}";

// Read page template
$page = file_get_contents("template.html");

// Replace the placeholder with the actual flag content
$page = str_replace('$flag', $flag, $page);

// Show the content to user
echo $page;
?>
```

Servir este PHP mediante el siguiente comando después de haber copiado la página de template descrita en la siguiente sesión.

```bash
php -S localhost:8000  # S like «Serve»
```


### web/template.html

La pagina del template utilizada por PHP.

```html
&lt;!DOCTYPE html&gt;
&lt;html lang='es'&gt;
&lt;head&gt;
    &lt;meta charset='UTF-8'&gt;
    &lt;meta name='viewport' content='width=device-width, initial-scale=1.0'&gt;
    &lt;title&gt;Desafío CTF&lt;/title&gt;
    &lt;style&gt;
        body { font-family: Arial, sans-serif; }
        .flag { display: none; }  /* Eso es lo que hace que no se vea en en la pantalla por defecto del navedador */
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Bienvenido al desafío CTF&lt;/h1&gt;
    &lt;p&gt;Para completar este desafío, necesitas encontrar la flag oculta en el código fuente de esta página.&lt;/p&gt;
    &lt;p&gt;Para ver el código fuente, se pueden seguir estos pasos:&lt;/p&gt;
    &lt;ol&gt;
        &lt;li&gt;Hacer clic derecho en cualquier parte de la página.&lt;/li&gt;
        &lt;li&gt;Seleccionar "Ver código fuente" o "Inspeccionar" (dependiendo del navegador).&lt;/li&gt;
        &lt;li&gt;Buscar la flag en el código fuente.&lt;/li&gt;
    &lt;/ol&gt;
    &lt;p class='flag'&gt;Felicitación la flag es la siguiente (sin la comillas): «$flag»&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
```


### Dockerfile

El dockerfile declara el servicio que se ejecutará en el contenedor, aquí PHP con Apache para una versatilidad máxima.

```dockerfile
FROM php:8.1-apache

EXPOSE 80
CMD ["apache2-foreground"]
```

### docker-compose.yml

Para facilitar el mantenimiendo de la instanciación del contenedor Docker, es recomendable especificar los parámetros en una archivo docker-compose mientras que en la linea de comando.

La ventaja que ofrece este formato son relacionadas a la utilización de un lenguage declarativo, Yaml mientras que un lenguaje imperativo Bash.

```yaml
---
version: '3'
services:
  web:
    build: .
    volumes:
      - ./web:/var/www/html
      - ./flag.txt:/var/www/flag.txt
    ports:
      - "8000:80"
```


### run.sh

Ahora, para levantar el servicio Docker, un script minimo `run.sh` está descrito a continuación.

```bash
#!/usr/bin/env bash
sudo docker-compose up -d
```

### challenge.yml

Para beneficiarse de la herramienta [CTFCLI](https://github.com/CTFd/ctfcli) y poder capitalizar sus descripciones, es posible utilizar este modelo.

```yaml
---
name: "Template-TODO"
author: Tinmarino
category: Web
description: "TODO\r\n\r\n* La _flag_ será revelada en la página web para a los que saben inspectar el código fuente HTML y tiene el siguiente formato: «CTF{flag-XXXXXX}», donde «XXXXXX» es una cadena de caracteres arbitraria.\r\n\r\n![](https://github.com/TODO/static/blob/main/512/TODO.jpg?raw=true)"
value: 1
type: standard
connection_info: http://localhost:TODO

flags:
    - CTF{flag-TODO}

tags:
    - name-TODO
    - web

state: visible

version: "0.1"
```
