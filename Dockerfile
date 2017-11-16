FROM mhart/alpine-node:8
ENV NPM_CONFIG_LOGLEVEL warn

ARG app_env
ENV APP_ENV $app_env
ENV NODE_ENV $app_env

RUN mkdir -p /app
WORKDIR /app
COPY ./app ./

RUN yarn install

WORKDIR /app/client
RUN yarn install

WORKDIR /app

CMD if [ ${APP_ENV} = production ]; \
	then \
	yarn run build && \
	yarn run server; \
	else \
	yarn install && cd client && yarn install && cd .. && \
	yarn run start; \
	fi

EXPOSE 3000
