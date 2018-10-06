FROM node:10

EXPOSE 8888

ENV HOME /maputnik
RUN mkdir ${HOME}

COPY . ${HOME}/

WORKDIR ${HOME}

RUN npm install -d --dev
RUN npm run build

CMD npm run start -- --host 0.0.0.0
