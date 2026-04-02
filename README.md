# 🚀 todoapp — Smart Task Manager (DevOps End-to-End Project)

[![Todoapp Demo Cover](https://drive.google.com/uc?export=view&id=1CW3IOR1npbMt8wfLMWvNDvzcm8lANBz6)](https://drive.google.com/file/d/1a99YHdNjTIIhB1gOcUlNc8Q6qpnmFFrK/view?usp=drivesdk)

<p align="center">
  <a href="https://drive.google.com/file/d/1a99YHdNjTIIhB1gOcUlNc8Q6qpnmFFrK/view?usp=drivesdk">
    <img src="https://img.shields.io/badge/▶-Watch%20Demo%20Video-success?style=for-the-badge" alt="Watch Demo Video" />
  </a>
</p>

A production-style full-stack application built to demonstrate real-world Cloud & DevOps skills:

- Start simple (JSON)
- Containerize with Docker
- Provision AWS infrastructure using Terraform
- Deploy to Kubernetes (Amazon EKS)
- Store images in Amazon ECR
- Automate with CI/CD (GitHub Actions)
- Upgrade storage to PostgreSQL (Amazon RDS)

---

## 🔥 What This Project Proves

- End-to-end application deployment  
- Infrastructure as Code (Terraform)  
- Kubernetes production-style deployment  
- CI/CD automation  
- Migration from demo → production system  

---

## 🧩 Architecture Overview

User → ALB → EKS → Services → Pods  
Backend → RDS PostgreSQL  
Images → ECR  
Infrastructure → Terraform  
CI/CD → GitHub Actions  

---

## ⚙️ Tech Stack

**Backend:** Node.js, Express  
**Frontend:** HTML, CSS, JavaScript, NGINX  
**DevOps:** Docker, Kubernetes (EKS), Terraform, GitHub Actions  

**AWS:** VPC, EKS, ECR, RDS, S3, DynamoDB, ALB  

---

## 📁 Project Structure

```
todoapp/
├── infra/terraform/
├── app/
│   ├── backend/
│   └── frontend/
├── docker/
├── k8s/
├── db/
├── .github/workflows/
├── scripts/
└── README.md
```

---

## 🚀 Local Development

### Backend (JSON mode)

```powershell
cd .\app\backend
npm install
npm start
```

Test:

```powershell
Invoke-RestMethod http://localhost:5000/health
Invoke-RestMethod http://localhost:5000/api/storage-mode
```

Expected:

```
json
```

---

### Docker

```powershell
cd .\docker
docker compose up --build
```

Open:

```
http://localhost:8080
```

Test:

```powershell
Invoke-RestMethod http://localhost:8080/api/storage-mode
```

---

## ☁️ AWS Deployment

### Configure AWS

```powershell
aws configure
aws sts get-caller-identity
```

---

### Terraform

```powershell
cd .\infra\terraform

terraform fmt -recursive
terraform init
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

---

### Connect to EKS

```powershell
aws eks update-kubeconfig --region eu-west-1 --name todoapp-prod-eks
kubectl get nodes
```

---

### Install AWS Load Balancer Controller

Create:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: aws-load-balancer-controller
  namespace: kube-system
  annotations:
    eks.amazonaws.com/role-arn: <IAM_ROLE_ARN>
```

Apply and install:

```powershell
kubectl apply -f aws-load-balancer-controller-sa.yaml

helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller `
  -n kube-system `
  --set clusterName=todoapp-prod-eks `
  --set serviceAccount.create=false `
  --set serviceAccount.name=aws-load-balancer-controller `
  --set region=eu-west-1 `
  --set vpcId=<VPC_ID>
```

---

### Build & Push Images

```powershell
docker build -t todoapp-backend -f docker/Dockerfile.backend .
docker build -t todoapp-frontend -f docker/Dockerfile.frontend .

aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com

docker tag todoapp-backend <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com/todoapp-prod-backend:latest
docker tag todoapp-frontend <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com/todoapp-prod-frontend:latest

docker push <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com/todoapp-prod-backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.eu-west-1.amazonaws.com/todoapp-prod-frontend:latest
```

---

### Deploy to Kubernetes

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
```

Check:

```powershell
kubectl get pods -n todoapp
kubectl get ingress -n todoapp
```

---

### Access App

```powershell
kubectl get ingress -n todoapp
```

Open the ALB DNS in your browser.

---

## 🧪 Storage Modes

### JSON (Demo)
- Simple  
- Not persistent  

### PostgreSQL (Production)

```powershell
terraform output database_endpoint
```

Set:

```
STORAGE_DRIVER=postgres
```

Redeploy:

```powershell
kubectl apply -f k8s/
kubectl rollout restart deployment/todoapp-backend -n todoapp
```

Verify:

```powershell
Invoke-RestMethod http://localhost:5000/api/storage-mode
```

Expected:

```
postgres
```

---

## 🔁 CI/CD

GitHub Actions:

- Builds Docker images  
- Pushes images to ECR  
- Automates delivery  

---

## ⚠️ Important

Replace:

- `<ACCOUNT_ID>`  
- `<REGION>`  
- `<IAM_ROLE_ARN>`  

Align image tags between CI/CD and Kubernetes.  

JSON mode is not production-safe.  

---

## 🎥 Demo

https://drive.google.com/file/d/1a99YHdNjTIIhB1gOcUlNc8Q6qpnmFFrK/view?usp=drivesdk

---

## 🔥 Final

> I didn’t just learn DevOps… I deployed it.
