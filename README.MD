# Whoopah Task

## ENV

Create `.env` file based on `.env.example`.

## Installation
```bash
# Execute this command to setup the app in production env
$ yarn install --frozen-lockfile
```

### Docker

Execute the following command to setup everything that is needed for the application to run over docker.
```bash
# Execute this command to setup the app
$ docker compose up -d
```

Application will run automatically.

### Step-by-step setup

Install the required packages using [yarn](https://yarnpkg.com/getting-started).

```bash
$ yarn install --frozen-lockfile
```

### Running the app locally

```bash
# development
$ yarn start

# production mode
$ yarn build
```

### Running the app over docker

Make sure to adjust the hosts for the database and caching system in the `.env` file.

```
# DB
DATABASE_HOST=db
DATABASE_PORT=5432
...
```

After the `.env` has been adjusted, build the docker containers using the following command:

```bash
$ docker-compose up -d
```

