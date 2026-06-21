# 🧩 CI/CD Comparison — GitHub Actions + Docker vs Jenkins + Docker vs GitLab CI + Docker

Porównanie trzech najczęściej używanych środowisk CI/CD w kontekście testów automatycznych (Playwright, Cypress, API, Backend) opartych o Docker.

---

## ⚙️ Overview

| 🔧 Kryterium | 🧠 **GitHub Actions + Docker** | 🏗️ **Jenkins + Docker** | 🚀 **GitLab CI + Docker** |
|:-------------|:-------------------------------|:------------------------|:--------------------------|
| **Setup (konfiguracja)** | ✅ Bardzo prosty – pliki `.github/workflows/*.yml` | ⚙️ Średnio trudny – instalacja serwera, agentów, uprawnień | ⚙️ Średni – konfiguracja w `.gitlab-ci.yml` |
| **Pierwszy start** | ⏱️ 5–10 minut (działa natychmiast) | ⏱️ 1–2 godziny (konfiguracja serwera i pluginów) | ⏱️ 15–30 minut (jeśli repozytorium w GitLab) |
| **Środowisko uruchomieniowe** | ☁️ Cloud (GitHub-hosted runners) | 💻 Lokalne / on-premise agenty | ☁️ / 💻 GitLab runners |
| **Integracja z Dockerem** | 🔹 Wbudowana (`docker build`, `compose up`) | 🔹 Bardzo dobra (plugin Docker Pipeline) | 🔹 Bardzo dobra (Docker Executor) |
| **Zarządzanie zmiennymi** | 🔐 GitHub Secrets + Environments | 🔐 Jenkins Credentials Store | 🔐 GitLab Variables (Masked/Protected) |
| **Integracje (Jira, Slack, SonarQube, itp.)** | ⚙️ Dobre (Actions Marketplace) | 💪 Bardzo bogate (pluginy, REST API) | 💪 Rozbudowane (Slack, Jira, Kubernetes) |
| **Raporty testów / dashboard** | 📊 Podstawowy (artefakty, logi) | 📊 Pełny (pluginy, HTML reports) | 📊 Dobry (merge request integration, HTML reports) |
| **Równoległość / matrix builds** | ✅ Tak (łatwa konfiguracja w YAML) | ✅ Tak (parallel stages, agents) | ✅ Tak (parallel jobs) |
| **Maintenance (utrzymanie)** | 🟢 Minimalne – GitHub hostuje CI | 🔴 Wysokie – admin, pluginy, aktualizacje | 🟡 Średnie – utrzymanie runnerów |
| **Skalowanie** | ⚡ Automatyczne w chmurze | 🧱 Manualne – dodawanie agentów | ⚙️ Shared lub autoscaling runners |
| **Bezpieczeństwo** | 🔒 RBAC + Secrets | 🔒 Zależne od konfiguracji | 🔒 Wbudowane RBAC |
| **Koszt** | 💰 Darmowe (public), limity minut (private) | 💰 Darmowy, ale koszt infrastruktury | 💰 Darmowy Community / płatny Premium |
| **Szybkość buildów** | ⚡ Bardzo szybka (SSD, preinstalowane środowisko) | ⚙️ Zależna od hosta | ⚡ Szybka (cache + shared runners) |
| **Stabilność CI/CD** | 🟢 Wysoka | 🟡 Średnia (pluginy, serwer) | 🟢 Wysoka |
| **Integracja z repozytorium GitHub** | 🧩 Natychmiastowa | 🔌 Webhook wymagany | 🔌 Integracja lub migracja kodu |
| **Najlepsze zastosowanie** | ✅ Testy E2E, CI smoke tests | 🏭 Pełne pipeline’y staging / regresje | 🧰 CI/CD z deploymentami (backend + testy) |
| **Przykład uruchomienia testów** | `docker compose up --build` | `sh 'docker compose run tests'` | `docker-compose up --build` |
| **Typowe ograniczenia** | 🚫 Brak rozbudowanego dashboardu testów | ⚠️ Admin i pluginy wymagają opieki | ⚠️ Wymaga runnerów GitLaba |
| **Poziom trudności utrzymania** | 🟢 Niski | 🔴 Wysoki | 🟡 Średni |
| **Typowy scenariusz użycia** | PR checks, testy E2E | Nightly builds, regresje | Pełne CI/CD z deployami |

---

## 🏁 Summary

| Kiedy wybrać | Rekomendacja |
|---------------|---------------|
| ✅ Chcesz szybki, prosty CI/CD dla testów w Dockerze | **GitHub Actions + Docker** |
| 🧱 Potrzebujesz zaawansowanego zarządzania i raportów | **Jenkins + Docker** |
| ☁️ Masz repozytoria w GitLab i chcesz CI/CD all-in-one | **GitLab CI + Docker** |

---

## 💡 Wnioski

- **GitHub Actions** pokrywa 80–90% potrzeb automatyzacji testów (Playwright, Cypress, API).  
  ✅ Idealny do prostych scenariuszy: budowanie, testowanie, raporty, PR checks.  
- **Jenkins** sprawdza się przy dużych, korporacyjnych projektach, gdzie wymagane są:
  - nocne regresje,  
  - testy wielu środowisk (QA / Staging / Prod),  
  - centralne raportowanie i orkiestracja pipeline’ów.  
- **GitLab CI** jest świetny, jeśli używasz GitLaba jako głównego repozytorium kodu i potrzebujesz zintegrowanego środowiska CI/CD.

---

## 🧰 Advanced Notes

- Wszystkie trzy systemy obsługują **Docker Compose** i **BuildKit caching**, co przyspiesza testy.  
- W każdym z nich można ustawić **równoległe uruchamianie testów** lub **dynamiczne buildy** (np. matrix builds).  
- Warto użyć **artifact upload** (np. raporty HTML Playwright/Cypress) – w Actions:  
  ```yaml
  - name: Upload Playwright report
    uses: actions/upload-artifact@v4
    with:
      name: playwright-report
      path: playwright-report/
  ```
- Dla Jenkins i GitLab można użyć podobnych funkcji (`archiveArtifacts`, `artifacts:`).

---

📄 **Autor:** AI Assistant  
🕓 **Ostatnia aktualizacja:** 2025-10-19
