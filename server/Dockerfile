### -------- Build Stage --------
FROM node:22 AS build
WORKDIR /app

# Install all dependencies (dev + prod) for build
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build the NestJS project
RUN npm run build

### -------- Production Stage --------
FROM node:22-slim AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy only package manifests and install production deps
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled output from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]

