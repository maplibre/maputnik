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

# Create a clean python-based image with just the build results
FROM python:3-slim
WORKDIR /maputnik

COPY --from=builder /maputnik/build/build .

EXPOSE 8888
CMD python -m http.server 8888
