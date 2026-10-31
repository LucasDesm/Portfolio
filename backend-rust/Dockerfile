# Étape 1 : compilation en mode release (versions figées par Cargo.lock)
FROM rust:1-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src src
RUN cargo build --release --locked

# Étape 2 : image minimale avec le seul binaire
FROM debian:bookworm-slim
RUN useradd --system --uid 10001 app
COPY --from=build /app/target/release/signal-api /usr/local/bin/signal-api
USER app
ENV PORT=8082
EXPOSE 8082
CMD ["signal-api"]
