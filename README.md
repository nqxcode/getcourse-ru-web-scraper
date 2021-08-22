# getcourse-ru-web-scraper
Web scraper for getcourse.ru

## Конфигурация
Изменить настройки можно в файле ```config/config.json```. 

Основные настройки:
```
scrapper.baseUrl
scrapper.phantomjs.auth.cookie.name
scrapper.phantomjs.auth.cookie.value
scrapper.phantomjs.auth.cookie.domain
scrapper.parser.pattern
scrapper.downloader.outVideo.rootPath
```
## Логирование 
Подробные логи см. в директории ```logs```

## Запуск скачивания видео
```bash
./run
```
