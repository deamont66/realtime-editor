FROM mhart/alpine-node:8
ENV NPM_CONFIG_LOGLEVEL warn

ARG app_env
ENV APP_ENV $app_env
ENV NODE_ENV $app_env

# Copy project files to /app
RUN mkdir -p /app
WORKDIR /app
COPY ./app ./

# Install yarn dependencies
RUN yarn install
WORKDIR /app/client
RUN yarn install

WORKDIR /app

# Build react app for production
RUN if [ ${APP_ENV} = production ]; \
    then \
    yarn run build; \
    fi

# Start server
CMD if [ ${APP_ENV} = production ]; \
	then \
	yarn run server; \
	else \
	yarn install && cd client && yarn install && cd .. && \
	yarn run start; \
	fi

EXPOSE 3000
