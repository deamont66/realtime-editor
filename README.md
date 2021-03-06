# Realtime editor

Online text editor based on [operational-transformation-text](https://github.com/deamont66/operational-transformation-text) library.

## Demo version
Demo version is publicly available at [https://editor.simecekjiri.cz](https://editor.simecekjiri.cz).

### Screenshot
[![Demo screen](https://i.imgur.com/tVEYL1T.png)](https://imgur.com/tVEYL1T)

## Production image
You will need docker and docker compose.

```bash
docker-compose up -d app_prod
```

This command will create docker image including all project files (after compilation and minification), all project dependencies and it'll start it.
The image is ready for distribution (without any source code) ie. on docker hub.

```bash
docker-compose up -d --build app_prod
```

This command will rebuild docker image when already exists. This could be used for version updates.

## Development
You will need docker and docker compose.

```bash
docker-compose up app_dev
```
This command will create and run docker image with developer utilities and all project dependencies.
This includes real-time compilation on code change, proxy settings for create-react-app and more. 

## Stop all running containers
```bash
docker-compose down
```

Developer container can be closed by pressing `ctrl + c`. 

## Database
This project uses [MongoDB](https://docs.mongodb.com) as a persistent storage and the database container is already included in docker-compose.yml.

## Licence
MIT
