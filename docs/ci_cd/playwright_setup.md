# 🎭 Playwright + Docker + GitHub Actions Setup

## 📄 Overview

This document describes how to run **Playwright tests** using **Docker** both locally and in **GitHub Actions**, with support for multiple environments (`.env`, `.env.staging`, `.env.production`).

The setup ensures your tests run in identical conditions locally and in CI/CD pipelines.

---

## 🧱 Project Structure

```

Cypress_2025_RS_JS/
├── Dockerfile
├── docker-compose.yml
├── .env
├── .env.staging
├── .env.production
└── .github/
  └── workflows/
    ├── playwright.yml
    └── playwright-staging.yml

````

---

## 🐋 Docker Configuration

### `Dockerfile`

```dockerfile
FROM mcr.microsoft.com/playwright:v1.54.2-jammy
WORKDIR /app
COPY . /app
RUN npm ci
RUN chmod +x ./shopping-store/shopping-store-linux-amd64
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["./shopping-store/shopping-store-linux-amd64 & npm run test:ci"]
````

### `docker-compose.yml`

```yaml
services:
  playwright-tests:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./playwright-report:/app/playwright-report
    tty: true
    restart: "no"
    container_name: playwright-tests-runner
```

---

## 🌍 Environment Files

### `.env`

```
ADMIN_USERNAME=local_admin
ADMIN_PASSWORD=local_password
API_URL=http://localhost:3000
```

### `.env.staging`

```
ADMIN_USERNAME=staging_admin
ADMIN_PASSWORD=staging_password
API_URL=https://staging.api.example.com
```

### `.env.production`

```
ADMIN_USERNAME=prod_admin
ADMIN_PASSWORD=prod_password
API_URL=https://api.example.com
```

---

## 🧰 Local Usage

Run Playwright tests locally using Docker:

```bash
# Local environment
docker compose --env-file .env up --build

# Staging environment
docker compose --env-file .env.staging up --build

# Production environment
docker compose --env-file .env.production up --build
```

---

## 🚀 GitHub Actions

### `.github/workflows/playwright-staging.yml`

```yaml
name: Playwright Staging Tests

on:
  workflow_dispatch:
  push:
    branches: [staging]

jobs:
  playwright-staging-tests:
    runs-on: ubuntu-latest
    env:
      ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME_STAGING }}
      ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD_STAGING }}
      API_URL: ${{ secrets.API_URL_STAGING }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run Docker Compose (staging)
        run: |
          echo "Running staging Playwright tests..."
          docker compose --env-file .env.staging up --build --abort-on-container-exit
          
      - name: Cleanup
        if: always()
        run: docker compose down --remove-orphans
```

---

## 🔑 GitHub Secrets

Define secrets in your repository:

| Secret                 | Example Value                     |
| ---------------------- | --------------------------------- |
| ADMIN_USERNAME_STAGING | `staging_admin`                   |
| ADMIN_PASSWORD_STAGING | `staging_pass`                    |
| API_URL_STAGING        | `https://staging.api.example.com` |

Path: **Settings → Secrets and variables → Actions → New repository secret**

---

## ✅ Summary

| Environment | Source                      | Command / Trigger                      |
| ----------- | --------------------------- | -------------------------------------- |
| Local       | `.env`                      | `docker compose --env-file .env up`    |
| Staging     | `.env.staging` / Secrets    | `workflow_dispatch` or `push: staging` |
| Production  | `.env.production` / Secrets | `workflow_dispatch` or `push: main`    |

---

## 🧰 Local Usage with Docker

You can run Playwright tests locally using Docker Compose to ensure your environment matches CI/CD pipelines.

---

### 🔨 1. Build the Image

Rebuild the Docker image if you've made changes to the `Dockerfile` or `package.json`.

```bash
docker compose --env-file .env build
````

If you need to force a full rebuild (ignoring cache):

```bash
docker compose --env-file .env build --no-cache
```

---

### ▶️ 2. Run Tests (Start Containers)

Run Playwright tests for your selected environment:

```bash
# Local
docker compose --env-file .env up --build

# Staging
docker compose --env-file .env.staging up --build

# Production
docker compose --env-file .env.production up --build
```

✅ **Tip:**
Add `--abort-on-container-exit` to automatically stop all containers when tests finish:

```bash
docker compose --env-file .env up --build --abort-on-container-exit
```

---

### 📜 3. View Logs

Follow real-time logs from the running container:

```bash
docker logs -f playwright-tests-runner
```

To view only the last 50 lines:

```bash
docker logs --tail 50 playwright-tests-runner
```

---

### 🧩 4. Run Commands Inside the Container

You can enter the running container to manually execute Playwright commands, inspect files, etc.:

```bash
docker exec -it playwright-tests-runner /bin/bash
```

From there you can run for example:

```bash
npx playwright test
npx playwright show-report
```

---

### 🧹 5. Stop and Remove Containers

After test completion, you can clean up resources:

```bash
docker compose down
```

If you also want to remove volumes and networks:

```bash
docker compose down --volumes --remove-orphans
```

---

### 🧼 6. Remove Old Images and Containers (Optional)

If your Docker environment becomes cluttered:

```bash
docker system prune -a
```

⚠️ **Warning:** This removes **all stopped containers, unused images, and networks**.

---

### ✅ Quick Command Summary

| Action          | Command                                             |
| --------------- | --------------------------------------------------- |
| Build image     | `docker compose build`                              |
| Run tests       | `docker compose up --build`                         |
| View logs       | `docker logs -f playwright-tests-runner`            |
| Open shell      | `docker exec -it playwright-tests-runner /bin/bash` |
| Stop containers | `docker compose down`                               |
| Clean system    | `docker system prune -a`                            |



## 🐞 Debugging Playwright Tests in Docker

When running Playwright tests inside Docker, you can debug them in several ways:
- Enable verbose Playwright logging
- Run tests in headed mode (visible browser)
- Attach to a running container and manually re-run specific tests

---

### 🔧 1. Enable Debug Logging

You can enable Playwright's internal debug logs by setting the `DEBUG` variable:

```bash
docker compose run --rm -e DEBUG=pw:api playwright-tests
````

You can also log all browser actions:

```bash
docker compose run --rm -e DEBUG=pw:browser* playwright-tests
```

This prints detailed interaction logs (navigation, click, input, etc.) to the terminal.

---

### 🧠 2. Run Specific Test or Folder

To only run one test file or folder:

```bash
docker exec -it playwright-tests-runner npx playwright test tests/example.spec.ts
```

Or by using the `--grep` flag to match a test title:

```bash
docker exec -it playwright-tests-runner npx playwright test --grep "login"
```

---

### 🪟 3. Run Headed Mode (Visible Browser)

Playwright supports "headed" mode for Chrome, Firefox, and WebKit.
It’s useful when you want to **see what’s happening in real time** during local debugging.

To run in headed mode (requires Docker Desktop with GUI support or X11 forwarding):

```bash
docker run -it \
  --env DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  playwright-tests-runner \
  npx playwright test --headed
```

✅ **Tip:** You can use `--debug` to open the Playwright Inspector:

```bash
npx playwright test --debug
```

---

### 🔍 4. Access Playwright Report

After running tests, Playwright generates an HTML report.
You can open it directly from your local machine:

```bash
docker cp playwright-tests-runner:/app/playwright-report ./playwright-report
npx playwright show-report ./playwright-report
```

---

### 🧩 5. Inspect Test Artifacts

Playwright stores traces, videos, and screenshots (if configured).
To inspect them:

```bash
docker exec -it playwright-tests-runner /bin/bash
cd test-results/
ls
```

You can also copy results to your host:

```bash
docker cp playwright-tests-runner:/app/test-results ./test-results
```
