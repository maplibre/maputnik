FROM golang:1.23-alpine AS builder
WORKDIR /maputnik

RUN apk add --no-cache nodejs npm make git gcc g++ libc-dev

# Build maputnik
COPY . .
RUN npm ci
RUN CGO_ENABLED=1 GOOS=linux npm run build-linux

FROM alpine:latest
WORKDIR /app
COPY --from=builder /maputnik/desktop/bin/linux ./
ENTRYPOINT ["/app/maputnik"]
