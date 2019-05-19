FROM node:10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python \
 && rm -rf /var/lib/apt/lists/*

EXPOSE 8888

ENV HOME /maputnik
RUN mkdir ${HOME}

COPY . ${HOME}/

WORKDIR ${HOME}

RUN npm install -d
RUN npm run build

WORKDIR ${HOME}/build/build
CMD python -m SimpleHTTPServer 8888
