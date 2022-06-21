# getcourse-ru-web-scraper
Web scraper для видеокурсов с getcourse.ru

## Docker
Настройку вебскрапера на работу в docker-контейнере для архитектуры armv7 смотреть здесь:

https://hub.docker.com/repository/docker/nqxcode/getcourse-ru-webscraper

## Установка зависимостей 
Для работы веб-скрапера необходимо установить **nodejs**, **ffmpeg**, **yt-dlp** 

```bash
$ sudo apt install nodejs
$ sudo apt install ffmpeg
$ python3 -m pip install -U yt-dlp
```

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

SCRAPPER_PHANTOMJS_BIN=/path/to/deps/amd64/bin/phantomjs
SCRAPPER_PHANTOMJS_MAX_BUFFER=2048
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

## Troubleshooting 
Для исправления проблемы с зависимостью libpng12 для phantomjs читать статью 
*["Fix libpng12-0 Missing In Ubuntu 18.04, 19.10, 20.04 Or 20.10"](https://www.linuxuprising.com/2018/05/fix-libpng12-0-missing-in-ubuntu-1804.html)*

Или можно сразу выполнить следующие шаги: 
```bash
sudo add-apt-repository ppa:linuxuprising/libpng12
sudo apt update
sudo apt install libpng12-0
```
