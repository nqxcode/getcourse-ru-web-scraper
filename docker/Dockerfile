FROM arm32v7/ubuntu:xenial

ENV NVM_DIR /home/webscraper/.nvm
ENV NODE_VERSION=12.22.1
ENV NPM_FETCH_RETRIES=2
ENV NPM_FETCH_RETRY_FACTOR=10
ENV NPM_FETCH_RETRY_MINTIMEOUT=10000
ENV NPM_FETCH_RETRY_MAXTIMEOUT=60000

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
    libssl1.0.0 \
    libpng12-0 \
    libicu55 \
    ca-certificates \
    "

RUN apt-get update && apt-get install -y --no-install-recommends ${PACKAGES}


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
    && ln -s `npm bin --global` /home/webscraper/.node-bin \


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
    && rm -rf /var/lib/apt/lists/*


COPY ./package.json /home/webscraper/package.json
COPY ./package-lock.json /home/webscraper/package-lock.json
COPY ./.env.sample /home/webscraper/.env
ADD ./scrapers /home/webscraper/scrapers
ADD ./lib /home/webscraper/lib
ADD ./config /home/webscraper/config
ADD ./cmd /home/webscraper/cmd
ADD ./bin /home/webscraper/bin
ADD ./main.js /home/webscraper/main.js

RUN chown -R webscraper:webscraper /home/webscraper/

USER webscraper
WORKDIR /home/webscraper
RUN mkdir log

RUN npm install

ENTRYPOINT [ "tail", "-f", "/dev/null" ]