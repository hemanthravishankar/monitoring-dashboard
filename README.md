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


Of course. Here is a comprehensive `README.md` file that explains the CI/CD process for both your frontend and backend services. You can copy and paste this directly into the `README.md` file in the root of your GitHub repository.

-----

# Monitoring Dashboard: CI/CD Pipeline

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the services in this repository. The project is structured with separate `frontend`, `backend`, and `k8s` directories.

The entire process is built on **GitOps principles**, where the Git repository is the single source of truth for both application code and infrastructure configuration. The pipeline automates testing, artifact creation, and deployment while ensuring human oversight at critical stages.

## Pipeline Overview

The workflow is designed to be safe, automated, and traceable. Here is a high-level view of the process from a code change to deployment:

```
1. Dev pushes to `feature-branch` ─> [CI Workflow: Test & Lint] 🧐
                                      │
                                      ▼
2. Dev opens PR to `main` ───────────> [CI Workflow: PR Check] ✅
                                      │
                                      ▼
3. Team merges PR into `main` ────────> [Main CI Workflow]
                                            │
                                            ├─ Builds & Pushes Docker Image 📦
                                            │
                                            └─ Opens new PR to update k8s/deployment.yaml 🤖
                                                  │
                                                  ▼
4. Team merges auto-generated PR ───> [CD Workflow]
                                            │
                                            └─ `kubectl apply` deploys to Minikube 🚀
```

-----

## The Four Stages of Our CI/CD Process

### Stage 1: Development & Initial Checks

When a developer pushes code to any branch **other than `main`** (e.g., `feature/add-new-button`), a CI workflow is triggered based on the location of the changed files.

  * **Trigger:** A `push` to a non-`main` branch with changes in either `frontend/` or `backend/`.
  * **Actions:**
    1.  **Code Checkout:** The specific branch's code is checked out.
    2.  **Environment Setup:** The appropriate environment is configured (**Node.js** for frontend, **Go** for backend).
    3.  **Quality Checks:**
          * **Backend:** `go vet` (linting) and `go test` (unit tests) are run.
          * **Frontend:** `npm run lint` and `npm test` are run.
    4.  **Build Verification:** A Docker image is built locally to ensure the application can be containerized. **This image is not pushed anywhere.**
  * **Goal:** To provide developers with immediate feedback on code quality and test coverage before a pull request is even created.

-----

### Stage 2: Merging to `main` & Artifact Creation

Merging a pull request into the `main` branch is the central event that kicks off the release process.

  * **Trigger:** A `push` to the `main` branch (which happens when a PR is merged).

  * **Actions:** This workflow runs a multi-job process:

    1.  **Job 1: `build-and-push`**
          * Re-runs all tests and linting checks to ensure the integrity of the `main` branch.
          * Builds the official Docker image.
          * Tags the image with the service name and the unique commit SHA (e.g., `your-user/project_assignment_frontend:frontend-a1b2c3d4`).
          * Pushes the tagged image to Docker Hub.
    2.  **Job 2: `update-deployment-pr`**
          * This job only runs if the `build-and-push` job succeeds.
          * It checks out the `main` branch.
          * It automatically modifies the Kubernetes manifest file (`k8s/frontend/deployment.yaml` or `k8s/backend/deployment.yaml`) by updating the `image:` tag to the one that was just pushed.
          * Finally, it creates a **new, automated pull request** proposing this change to the `main` branch.

  * **Goal:** To create a versioned, deployable artifact (the Docker image) and formally propose its deployment through a Git pull request. This separates the **build** phase from the **deploy** phase.

-----

### Stage 3: Deployment Approval

The deployment itself is not fully automatic. It requires a final human approval step, which provides safety and control.

  * **Trigger:** A team member reviews the pull request that was automatically generated in the previous stage.

  * **Action:** The team member **merges the automated pull request**. This action serves as a formal, auditable approval to deploy the new version.

  * **Goal:** To ensure a human provides the final "go-ahead" for a deployment, creating a clear audit trail of who approved the release and when.

-----

### Stage 4: Continuous Deployment to the Cluster

Merging the auto-generated PR triggers the final workflow that synchronizes the Kubernetes cluster with our desired state in Git.

  * **Trigger:** A `push` to `main` with changes in the `k8s/` directory.

  * **Actions:**

    1.  This job runs on a **`self-hosted` runner** that has access to our Minikube cluster.
    2.  It checks out the `main` branch, which now contains the updated deployment manifest.
    3.  It runs `kubectl apply -f ./k8s/`.
    4.  `kubectl` intelligently applies the changes, triggering a rolling update for the specific service (frontend or backend) whose manifest was changed.

  * **Goal:** To automatically and reliably deploy the approved application version to the Kubernetes cluster.

-----

## Required Configuration

For the pipeline to function, the following secrets must be configured in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

  * `DOCKER_USERNAME`: Your username for Docker Hub.
  * `DOCKER_PASSWORD`: Your password or access token for Docker Hub.
  * `ACTION_PAT`: A GitHub Personal Access Token (PAT) with `repo` and `workflow` scopes. This is used to create the automated pull requests.
  * `KUBECONFIG_BASE64`: Your `kubeconfig` file, encoded in Base64. This allows the self-hosted runner to authenticate with your Kubernetes cluster. You can generate it with the command: `cat ~/.kube/config | base64`.
