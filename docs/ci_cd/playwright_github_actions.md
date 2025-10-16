# 🧩 Automatyzacja testów Playwright z GitHub Actions

## 1. Wprowadzenie
GitHub Actions automatyzuje procesy w repozytorium (np. testy, wdrożenia).  
Pliki workflow umieszcza się w folderze `.github/workflows/`, a konfiguracja jest zapisana w formacie `.yml` (YAML).  
Każdy plik definiuje, kiedy i jak mają uruchamiać się zadania (jobs i steps).

---

## 2. Struktura `playwright.yml`

```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  workflow_dispatch:
```

Workflow uruchamia się po wypchnięciu zmian do gałęzi `main` lub ręcznie z poziomu GitHub.

---

## 3. Zadanie i środowisko

```yaml
jobs:
  playwrighttests:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.54.2-jammy
```

- `runs-on` – system, na którym działa workflow (tu: Ubuntu).  
- `container` – wskazuje obraz Dockera z preinstalowanym środowiskiem.  
  - `image:` określa wersję i system (Playwright 1.54.2, Ubuntu Jammy 22.04).  
  - Zapewnia powtarzalność testów i niezależność od lokalnej konfiguracji.

---

## 4. Zmienne i sekrety

```yaml
env:
  ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
  ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

- `env` – definiuje zmienne środowiskowe.  
- `secrets.*` – przechowują zaszyfrowane dane (np. hasła, tokeny) w repozytorium GitHub, niedostępne w logach.

---

## 5. Kroki wykonywania

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v2
  - name: Run tests
    run: |
      chmod +x ./shopping-store/shopping-store-linux-amd64 && ./shopping-store/shopping-store-linux-amd64 &
      npm ci
      npm run test:ci
```

- `checkout` – pobiera kod z repozytorium.  
- `chmod +x` – nadaje uprawnienia do uruchomienia aplikacji.  
- `npm ci` – instaluje zależności z lockfile.  
- `npm run test:ci` – uruchamia testy Playwrighta w trybie CI.

---

## 6. Podsumowanie

| Element | Opis |
|----------|------|
| **.github/workflows/** | Lokalizacja plików workflow |
| **.yml** | Format konfiguracyjny YAML |
| **image** | Obraz kontenera z Playwrightem |
| **secrets.ADMIN_PASSWORD** | Bezpiecznie przechowywane hasło |
| **Playwright** | Narzędzie do testów end-to-end |
