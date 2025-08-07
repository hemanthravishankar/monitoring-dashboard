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
git clone https://github.com/hemanthravishankar/monitoring-dashboard.git
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

## 🔁 CI/CD Pipeline


## 🔎 Accessing Services

Frontend: http://localhost:3000 (Docker) or via minikube service

Backend API: /metrics exposed on http://localhost:5000 (or internal via K8s)

## 📜 Viewing Logs

### Docker
```bash
docker logs backend
docker logs frontend
```

### Kubernetes
```bash
kubectl logs -n monitoring-app deployment/backend
kubectl logs -n monitoring-app deployment/frontend
```

## 🧯 Troubleshooting

- Ensure Docker is running
- Ensure Minikube cluster is started
- Check logs using the commands above
- Rebuild with docker-compose build --no-cache if issues persist
