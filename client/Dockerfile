FROM node:22

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "start"]
