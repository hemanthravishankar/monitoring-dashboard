# 📊 Monitoring Dashboard

## 🖼 System Architecture

![System Architecture](diagrams/architecture-diagram.png)

## 🧰 Tech Stack & Reasoning

- **Frontend**: React + Recharts → Lightweight & powerful for dashboards.
- **Backend**: Go → Fast, efficient, and great for lightweight APIs.
- **Containerization**: Docker → Easy portability and consistency.
- **Orchestration**: Kubernetes + Minikube → Simulates production-grade infra.
- **CI/CD**: GitHub Actions → Built-in, integrates well with GitHub PRs and pushes.

## 🚀 Local Deployment Guide

### 1. Clone the repo

```bash
git clone https://github.com/your-username/assignment.git
cd assignment
```

### 2. Via Docker Compose
```bash
docker-compose up --build
```
App accessible at: http://localhost:3000

### 2. Kubernetes (Minikube)
```bash
kubectl apply -f k8s/
```
App accessible via Minikube service:

```bash
minikube service frontend -n monitoring-app
```



