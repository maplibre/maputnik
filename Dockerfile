FROM node:10 as builder
WORKDIR /maputnik

# Only copy package.json to prevent npm install from running on every build
COPY package.json package-lock.json ./
RUN npm install

# Build maputnik
# TODO:  we should also do a   npm run test   here (needs more dependencies)
COPY . .
RUN npm run build

#---------------------------------------------------------------------------

# Create a clean nginx-alpine image with just the build results

FROM nginx:alpine

COPY --from=builder /maputnik/build/build /usr/share/nginx/html/
