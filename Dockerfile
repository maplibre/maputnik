FROM node:10

EXPOSE 8888

ENV HOME /maputnik
RUN mkdir ${HOME}

COPY . ${HOME}/

WORKDIR ${HOME}

RUN npm install -d --dev
RUN npm run build

WORKDIR ${HOME}/build/build
CMD python -m SimpleHTTPServer 8888
