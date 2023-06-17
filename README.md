# API для управления продуктами

## Версии

- Docker v24.0.2, build cb74dfc
- Docker Compose v2.18.1
- Node.js v18.16.0
- npm v9.5.1
- TypeScript v5.1.3
- Express.js v4.18.2

## Деплой локально

1) Перейти из корня проекта в директорию `./deployment/docker`, 
создать файл `.env` с параметрами из `.env.dist`

```shell
cp .env.dist .env
```

2) В корне проекта заполнить данные коружения аналогично 
п.1

3) В корне проекта воспользоваться `Makefile` для запуска БД из докера 

```shell
make dc_init
```

4) Для проверки работы приложения выполнить `health-check` запроса

```shell
curl --location 'http://localhost:8000/health-check/'
```
