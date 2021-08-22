# getcourse-ru-web-scraper
Web scraper for getcourse.ru

## Конфигурация
Базовые настройки можно изменить в файле ```config/config.json```. 

Основные настройки в файле ```.env```, пример:
```
SCRAPPER_BASE_URL=https://myyestoday.ru
SCRAPPER_TRAINING_CONFIG_DIR=myyestoday.ru

SCRAPPER_AUTH_COOKIE_NAME=PHPSESSID5
SCRAPPER_AUTH_COOKIE_VALUE=7b20ba0b0ebb95b7728e966daa3b5024
SCRAPPER_AUTH_COOKIE_DOMAIN=.myyestoday.ru

SCRAPPER_DOWNLOAD_PATH="/home/andrey/Рабочий стол/Курсы/Английский/myyestoday.ru"
```
## Логирование 
Подробные логи см. в директории ```logs```

## Запуск скачивания видео
```bash
./run
```
