FROM arm32v7/debian:buster

USER root

ARG TZ=UTC
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV DEBIAN_FRONTEND=noninteractive

ENV PACKAGES="bash \
    bash-completion \
    wget \
    git \
    nano \
    vim \
    curl \
    net-tools \
    coreutils \
    sudo \
    build-essential \
    ca-certificates \
    "
RUN apt-get update
RUN apt-get install -y --no-install-recommends ${PACKAGES}
RUN apt-get install -y --no-install-recommends ffmpeg python3 screen dialog
RUN apt-get install -y --no-install-recommends htop

ADD ./deps /tmp/deps

RUN dpkg -i /tmp/deps/armhf/lib/libssl1.0.2_1.0.2u-1~deb9u1_armhf.deb
RUN dpkg -i /tmp/deps/armhf/lib/libicu57_57.1-6+deb9u4_armhf.deb

COPY ./deps/armhf/bin/yt-dlp /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

COPY ./deps/armhf/bin/phantomjs /usr/local/bin/phantomjs
RUN chmod a+rx /usr/local/bin/phantomjs

ARG USER_GID=1000
ARG USER_UID=1000

RUN addgroup --gid ${USER_GID} webscraper \
    && adduser --gecos "First Last,RoomNumber,WorkPhone,HomePhone" --disabled-password --shell=/bin/bash --ingroup=webscraper --uid=${USER_UID} webscraper \
    && chown -R webscraper:webscraper /opt \
    && echo 'webscraper ALL=NOPASSWD: ALL' > /etc/sudoers.d/webscraper \
    && chmod 0440 /etc/sudoers.d/webscraper \
    && visudo --check

COPY ./deps/node_modules.tar.gz /home/webscraper/app/node_modules.tar.gz

RUN apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/deps

RUN chown -R webscraper:webscraper /home/webscraper

USER webscraper

ENV NVM_DIR /home/webscraper/.nvm
ENV NODE_VERSION=16.8.0
ENV NPM_FETCH_RETRIES=2
ENV NPM_FETCH_RETRY_FACTOR=10
ENV NPM_FETCH_RETRY_MINTIMEOUT=10000
ENV NPM_FETCH_RETRY_MAXTIMEOUT=60000

RUN mkdir -p $NVM_DIR && \
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install ${NODE_VERSION} \
    && nvm use ${NODE_VERSION} \
    && nvm alias ${NODE_VERSION} \
    && npm config set fetch-retries ${NPM_FETCH_RETRIES} \
    && npm config set fetch-retry-factor ${NPM_FETCH_RETRY_FACTOR} \
    && npm config set fetch-retry-mintimeout ${NPM_FETCH_RETRY_MINTIMEOUT} \
    && npm config set fetch-retry-maxtimeout ${NPM_FETCH_RETRY_MAXTIMEOUT} \
    && ln -s `npm bin --global` /home/webscraper/.node-bin

RUN echo "" >> ~/.bashrc && \
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> ~/.bashrc

USER root

ENV PATH $PATH:/home/webscraper/.node-bin

COPY ./.npmrc /root/.npmrc
COPY ./.npmrc /home/webscraper/.npmrc
RUN chown webscraper:webscraper /home/webscraper/.npmrc

WORKDIR /home/webscraper/app

ADD ./cmd cmd
RUN chmod a+rx cmd/run.sh
ADD ./config config
ADD ./lib lib
ADD ./scraper scraper
COPY ./main.js main.js
COPY ./start.sh start.sh
RUN chmod a+rx start.sh

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json

RUN chown -R webscraper:webscraper /home/webscraper/app

USER webscraper

RUN tar xzf /home/webscraper/app/node_modules.tar.gz -C /home/webscraper/app/
RUN rm /home/webscraper/app/node_modules.tar.gz
RUN rm -f /home/webscraper/app/scraper.log

ENTRYPOINT /home/webscraper/app/start.sh ; tail -F /home/webscraper/app/scraper.log