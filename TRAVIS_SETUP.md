# 🚀 Hướng dẫn Setup Travis CI với GitHub

## 📋 Prerequisites

1. **GitHub Repository** đã được tạo
2. **Travis CI Account** (free tier)
3. **Heroku Account** (cho deployment)

## 🔧 Bước 1: Kết nối GitHub với Travis CI

### 1.1. Đăng ký Travis CI
1. Truy cập [travis-ci.com](https://travis-ci.com)
2. Click "Sign in with GitHub"
3. Authorize Travis CI truy cập GitHub

### 1.2. Kích hoạt Repository
1. Vào [Travis CI Dashboard](https://app.travis-ci.com/account/repositories)
2. Tìm repository `Library-Management`
3. Toggle ON để kích hoạt CI/CD

## 🔑 Bước 2: Setup Environment Variables

### 2.1. Vào Repository Settings
1. Vào repository trên Travis CI
2. Click tab "Settings"
3. Scroll xuống phần "Environment Variables"

### 2.2. Thêm các biến môi trường

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `HEROKU_API_KEY` | Heroku API Key | `your-heroku-api-key` |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) | `https://hooks.slack.com/...` |

### 2.3. Lấy Heroku API Key
```bash
# Login to Heroku CLI
heroku login

# Get API key
heroku auth:token
```

## 🏗️ Bước 3: Push Code lên GitHub

### 3.1. Initialize Git Repository
```bash
# Nếu chưa có git repository
git init
git add .
git commit -m "Initial commit: Library Management System"

# Add GitHub remote
git remote add origin https://github.com/yourusername/Library-Management.git
git branch -M main
git push -u origin main
```

### 3.2. Verify Travis CI
1. Push code lên GitHub
2. Vào [Travis CI Dashboard](https://app.travis-ci.com)
3. Kiểm tra build status

## 📊 Bước 4: Kiểm tra CI/CD Pipeline

### 4.1. Build Process
Travis CI sẽ thực hiện:
1. **Setup Environment**: Java 21, Docker, Gradle
2. **Start Services**: PostgreSQL, Redis, Kafka
3. **Run Tests**: Unit tests + Integration tests
4. **Build Application**: Gradle build
5. **Generate Reports**: JaCoCo coverage

### 4.2. Build Logs
- ✅ **Green**: Build thành công
- ❌ **Red**: Build thất bại
- 🟡 **Yellow**: Build đang chạy

## 🚀 Bước 5: Setup Deployment (Optional)

### 5.1. Uncomment Heroku Deployment
Trong file `.travis.yml`, uncomment phần deploy:

```yaml
deploy:
  provider: heroku
  api_key: $HEROKU_API_KEY
  app: university-library
  on:
    branch: main
```

### 5.2. Manual Deployment Script
Hoặc sử dụng script tự động:

```yaml
after_success:
  - chmod +x scripts/deploy-heroku.sh
  - ./scripts/deploy-heroku.sh
```

## 🔍 Bước 6: Monitoring & Notifications

### 6.1. Build Status Badge
Thêm badge vào README.md:

```markdown
[![Build Status](https://travis-ci.com/yourusername/Library-Management.svg?branch=main)](https://travis-ci.com/yourusername/Library-Management)
```

### 6.2. Slack Notifications
Setup Slack webhook để nhận thông báo build status.

## 📁 File Structure cho Travis CI

```
Library-Management/
├── .travis.yml                    # Travis CI configuration
├── docker-compose.travis.yml      # Docker services for CI
├── scripts/
│   └── deploy-heroku.sh          # Deployment script
├── src/main/resources/
│   └── application-travis.yml    # Travis CI profile
└── TRAVIS_SETUP.md               # This file
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails - Docker Services
```bash
# Check Docker services
docker-compose -f docker-compose.travis.yml ps

# Check logs
docker-compose -f docker-compose.travis.yml logs
```

#### 2. Build Fails - Gradle
```bash
# Clean and rebuild locally
./gradlew clean build

# Check Gradle wrapper
./gradlew --version
```

#### 3. Build Fails - Database Connection
```bash
# Check PostgreSQL connection
docker exec -it travis-postgres psql -U postgres -d library

# Check sample data
docker exec -it travis-postgres psql -U postgres -d library -c "SELECT COUNT(*) FROM campuses;"
```

### Debug Commands
```bash
# Check Travis CI environment
echo "Java version: $(java -version)"
echo "Docker version: $(docker --version)"
echo "Gradle version: $(./gradlew --version)"

# Check services
netstat -tulpn | grep -E ':(5432|6379|9092)'
```

## 📈 Best Practices

### 1. Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches

### 2. Commit Messages
```
feat: add book management API
fix: resolve database connection issue
docs: update README with Travis setup
test: add integration tests for borrowing
```

### 3. Environment Variables
- ✅ Use Travis CI environment variables
- ❌ Never commit secrets to Git
- 🔒 Use encrypted variables for sensitive data

### 4. Build Optimization
- Cache Gradle dependencies
- Use parallel builds
- Optimize Docker images

## 🎯 Next Steps

1. **Setup Repository**: Push code lên GitHub
2. **Enable Travis CI**: Kích hoạt CI/CD
3. **Add Environment Variables**: Setup secrets
4. **Test Build**: Verify pipeline hoạt động
5. **Setup Deployment**: Configure Heroku deployment
6. **Add Notifications**: Setup Slack/Email alerts

## 📞 Support

Nếu gặp vấn đề:
1. Check [Travis CI Documentation](https://docs.travis-ci.com/)
2. Review build logs
3. Test locally với Docker
4. Create issue trên GitHub

---

**Happy CI/CD! 🚀** 