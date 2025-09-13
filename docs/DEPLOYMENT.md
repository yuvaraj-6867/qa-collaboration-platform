# Deployment Guide

## AWS Infrastructure Setup

### Prerequisites
- AWS CLI configured
- Docker installed
- Domain name (optional)

### Backend Deployment (Rails API)

1. **Create RDS PostgreSQL Database**
```bash
aws rds create-db-instance \
  --db-instance-identifier qa-platform-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username qaadmin \
  --master-user-password your-secure-password \
  --allocated-storage 20
```

2. **Deploy to EC2 with Kamal**
```bash
cd backend
kamal setup
kamal deploy
```

3. **Environment Variables**
```bash
# .kamal/secrets
DATABASE_URL=postgresql://username:password@host:5432/database
SECRET_KEY_BASE=your-secret-key
RAILS_ENV=production
```

### Frontend Deployment

1. **Build for Production**
```bash
cd frontend
npm run build
```

2. **Deploy to S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Environment Configuration

#### Production Environment Variables
```bash
# Backend
DATABASE_URL=postgresql://...
SECRET_KEY_BASE=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=qa-platform-files

# Frontend
VITE_API_URL=https://api.qaplatform.com
```

### Security Checklist
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up WAF rules
- [ ] Enable CloudTrail logging
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts