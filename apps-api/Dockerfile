FROM node:20-alpine as base

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY prisma ./prisma/ 

RUN yarn install

COPY . .

RUN rm -rf dist

EXPOSE 3001

FROM base as prod

RUN yarn build
RUN rm -rf node_modules
RUN rm -rf config
RUN rm -rf v1
RUN rm tsconfig.json
RUN mv ./dist/config ./config
RUN yarn install --production

CMD ["yarn", "start"]

