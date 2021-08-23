# getcourse-ru-web-scraper
Web scraper for getcourse.ru

## Конфигурация
### Создание файла конфигурации
Необходимо создать файл конфигурации ```.env``` на основе примера:
```bash
cp .env.sample .env
```
Основные настройки в файле ```.env```, пример:
```
SCRAPPER_BASE_URL=https://myyestoday.ru
SCRAPPER_TRAINING_CONFIG_DIR=myyestoday.ru

SCRAPPER_AUTH_COOKIE_NAME=PHPSESSID5
SCRAPPER_AUTH_COOKIE_VALUE=7b20ba0b0ebb95b7728e966daa3b5024
SCRAPPER_AUTH_COOKIE_DOMAIN=.myyestoday.ru

SCRAPPER_DOWNLOAD_PATH="/home/andrey/Рабочий стол/Курсы/Английский/myyestoday.ru"
```

### Настройка браузера phantomjs (менять не обязательно)
Базовые настройки headless браузера заданы в файле ```config/config.json```.

### Urls для веб-скрапинга
Адреса для веб-скрапинга задаются в файлах ```trainings.json```, создаваемых в директориях ```/config/trainings/{директория-конфига-для-сайта}```, где ```{директория-конфига-для-сайта}``` - значение из параметра ```SCRAPPER_TRAINING_CONFIG_DIR``` из файла ```.env```.

Пример файла конфига: ```config/trainings/anatomystudy.ru/trainings.json```:
```json
[
  {
    "title": "Тренинги. Бонусные курсы №2. Тело человека Мышцы. Голова и шея",
    "paths": [
      "/teach/control/lesson/view/id/157209236",
      "/teach/control/lesson/view/id/157209275"
    ]
  },
  {
    "title": "Тренинги. Бонусные курсы №2. Тело человека. Мышцы плечевого пояса",
    "paths":[
      "/teach/control/lesson/view/id/157209372",
      "/teach/control/lesson/view/id/157215322"
    ]
  }
]
```
## Логирование 
Подробные логи см. в директории ```logs```

## Запуск скачивания видео
```bash
./сmd/run.sh
```
