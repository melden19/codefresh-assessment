FROM node:12

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

ARG environment
ENV NODE_ENV $environment

RUN if [ "$environment" = "prod" ] ; then yarn --production --frozen-lockfile ; else yarn ; fi

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "yarn start:${NODE_ENV}"]
