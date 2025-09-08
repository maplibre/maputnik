FROM golang:1.23-alpine AS builder
WORKDIR /maputnik

RUN apk add --no-cache nodejs npm make git

# Build maputnik
COPY . .
RUN npm ci
RUN go install github.com/GeertJohan/go.rice/rice@latest
RUN CGO_ENABLED=1 GOOS=linux npm run build-linux

FROM alpine:latest
WORKDIR /app
COPY --from=builder /maputnik/desktop/bin/linux ./
ENTRYPOINT ["/app/maputnik"]
