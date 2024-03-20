FROM node:18 as builder
WORKDIR /maputnik

# Only copy package.json to prevent npm install from running on every build
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Build maputnik
COPY . .
RUN npx vite build

#---------------------------------------------------------------------------
# Create a clean nginx-alpine slim image with just the build results
FROM nginx:alpine-slim

COPY --from=builder /maputnik/dist /usr/share/nginx/html/
