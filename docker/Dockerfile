FROM arm32v7/ubuntu:focal

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

RUN apt-get install -y --no-install-recommends ffmpeg
RUN apt-get install -y --no-install-recommends python3
RUN apt-get install -y --no-install-recommends screen
RUN apt-get install -y --no-install-recommends dialog

ADD ./deps /tmp/deps

RUN dpkg -i /tmp/deps/libssl1.0.0_1.0.2n-1ubuntu5_armhf.deb
RUN dpkg -i /tmp/deps/libicu57_57.1-6+deb9u4_armhf.deb

COPY ./deps/yt-dlp /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

ARG USER_GID=1000
ARG USER_UID=1000

RUN addgroup --gid ${USER_GID} webscraper \
    && adduser --gecos "First Last,RoomNumber,WorkPhone,HomePhone" --disabled-password --shell=/bin/bash --ingroup=webscraper --uid=${USER_UID} webscraper \
    && chown -R webscraper:webscraper /opt \
    && echo 'webscraper ALL=NOPASSWD: ALL' > /etc/sudoers.d/webscraper \
    && chmod 0440 /etc/sudoers.d/webscraper \
    && visudo --check

RUN apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/deps

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

COPY ./package.json /home/webscraper/app/package.json
COPY ./package-lock.json /home/webscraper/app/package-lock.json
ADD ./scrapers /home/webscraper/app/scrapers
ADD ./lib /home/webscraper/app/lib
ADD ./config /home/webscraper/app/config
ADD ./cmd /home/webscraper/app/cmd
ADD ./bin /home/webscraper/app/bin
ADD ./main.js /home/webscraper/app/main.js

RUN chmod a+rx /home/webscraper/app/bin/phantomjs
RUN mkdir -p download

RUN chown -R webscraper:webscraper /home/webscraper/app

USER webscraper
WORKDIR /home/webscraper/app
RUN mkdir logs

RUN npm install

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
