### -------- Build Stage --------
FROM node:22 AS build
WORKDIR /app

# Install all dependencies (dev + prod) for build
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build the NestJS project (ensure compilation happens with dev deps)
RUN npm run build:ci

### -------- Production Stage --------
FROM node:22 AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy only package manifests and install production deps
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled output from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))" || exit 1

CMD ["node", "dist/main.js"]

