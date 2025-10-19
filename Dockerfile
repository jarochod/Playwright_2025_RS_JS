# 1. Bazowy obraz
FROM mcr.microsoft.com/playwright:v1.54.2-noble

# 2. Ustawienie katalogu roboczego
WORKDIR /app

# 3. Kopiowanie projektu
# UWAGA: Upewnij się, że Twoje pliki .env są skopiowane
COPY . /app

# 4. Instalacja zależności
RUN echo "Installing dependencies..." && \
    npm ci

# 5. Nadanie uprawnień wykonania
RUN chmod +x ./shopping-store/shopping-store-linux-amd64

# 6. Nadpisanie ENTRYPOINT aby używać bash
ENTRYPOINT ["/bin/bash", "-c"]

# 7. Uruchomienie sklepu i testów
CMD ["./shopping-store/shopping-store-linux-amd64 & npm run test:ci"]
