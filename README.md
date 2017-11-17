# Realtime editor

## Ukázka (demo)
Aktuálně není k dispozici žádné demo.

[![Ukázka](https://i.imgur.com/vP61Bn1.png "Click for video")](https://i.imgur.com/vP61Bn1.gifv)

## Production
Ke spuštění je potřeba nainstalovaný docker a docker-compose.

```bash
docker-compose up -d mongodb app_prod
```

Docker compose vytvoří docker image projektu (po kompilaci) a ten poté spustí. Image je dále možné šířit (například nahrát na hub) bez nutnosti kopírování zdrojových kódů.

## Development
Ke spuštění je potřeba nainstalovaný docker a docker-compose.

```bash
docker-compose up -d mongodb
docker-compose up app_dev
```

Po spuštění je vytvořen docker image s nainstavanými technologiemi a závislostmi.
Zárověň jsou vytvořeny docker volumes pro většinu složek projektu a projekt samotný
běží uvnitř containeru pomocí příkazů nodemon a react-scripts start
(kód je kompilován při každé změně zdrojových kódů).

## Ukončení
```bash
docker-compose down
```

Pro ukončení dev containeru 2x `ctrl + c`.
