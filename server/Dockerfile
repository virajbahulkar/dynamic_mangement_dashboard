FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

# Build TypeScript and start NestJS server
RUN npm run build
CMD ["npm", "run", "start:prod"]

