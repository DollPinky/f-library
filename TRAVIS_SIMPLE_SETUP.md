# 🚀 Hướng dẫn Test Travis CI với GitHub (Đơn giản)

## 📋 Mục tiêu
Test Travis CI pipeline cơ bản với GitHub, không cần Heroku hay Slack.

## 🔧 Bước 1: Setup GitHub Repository

### 1.1. Tạo Repository trên GitHub
1. Vào [GitHub.com](https://github.com)
2. Click "New repository"
3. Đặt tên: `Library-Management`
4. Chọn "Public" hoặc "Private"
5. **KHÔNG** check "Add a README file"
6. Click "Create repository"

### 1.2. Push Code lên GitHub
```bash
# Trong thư mục project
git init
git add .
git commit -m "feat: initial commit with Travis CI setup"

# Add GitHub remote (thay yourusername bằng username thật)
git remote add origin https://github.com/yourusername/Library-Management.git
git branch -M main
git push -u origin main
```

## 🔧 Bước 2: Kết nối Travis CI

### 2.1. Đăng ký Travis CI
1. Truy cập [travis-ci.com](https://travis-ci.com)
2. Click "Sign in with GitHub"
3. Authorize Travis CI truy cập GitHub

### 2.2. Kích hoạt Repository
1. Vào [Travis CI Dashboard](https://app.travis-ci.com/account/repositories)
2. Tìm repository `Library-Management`
3. Toggle ON để kích hoạt CI/CD

## 🧪 Bước 3: Test Build

### 3.1. Trigger Build
```bash
# Thay đổi code để trigger build
echo "# Test Travis CI" >> README.md
git add README.md
git commit -m "test: trigger Travis CI build"
git push
```

### 3.2. Monitor Build
1. Vào [Travis CI Dashboard](https://app.travis-ci.com)
2. Click vào repository `Library-Management`
3. Xem build logs real-time

## 📊 Build Process

Travis CI sẽ thực hiện:

1. **Setup Environment**
   - Java 21
   - Docker
   - Gradle

2. **Start Docker Services**
   - PostgreSQL
   - Redis
   - Kafka + Zookeeper

3. **Run Tests**
   - Unit tests
   - Integration tests
   - Build application

4. **Generate Reports**
   - Test results
   - Build artifacts

## ✅ Expected Results

### Build Success (Green)
```
✓ Build completed successfully!
✓ All tests passed
✓ Application built successfully
```

### Build Failure (Red)
- Check build logs
- Fix issues
- Push again

## 🔍 Troubleshooting

### Common Issues

#### 1. Repository not found
```bash
# Check remote URL
git remote -v

# Fix if wrong
git remote set-url origin https://github.com/yourusername/Library-Management.git
```

#### 2. Build fails - Docker
```bash
# Test locally first
docker-compose -f docker-compose.travis.yml up -d
./gradlew clean build -Dspring.profiles.active=travis
docker-compose -f docker-compose.travis.yml down
```

#### 3. Build fails - Gradle
```bash
# Test locally
./gradlew clean build
./gradlew --version
```

## 📈 Next Steps (Khi sẵn sàng)

### 1. Add Heroku Deployment
```yaml
# Uncomment in .travis.yml
deploy:
  provider: heroku
  api_key: $HEROKU_API_KEY
  app: university-library
  on:
    branch: main
```

### 2. Add Slack Notifications
```yaml
# Add in .travis.yml
notifications:
  slack:
    secure: $SLACK_WEBHOOK_URL
```

### 3. Add Environment Variables
- `HEROKU_API_KEY`
- `SLACK_WEBHOOK_URL`

## 🎯 Success Criteria

✅ **Repository created trên GitHub**
✅ **Code pushed thành công**
✅ **Travis CI kích hoạt**
✅ **Build chạy thành công (Green)**
✅ **Tests pass**
✅ **Build logs hiển thị đầy đủ**

## 📞 Support

Nếu gặp vấn đề:
1. Check [Travis CI Documentation](https://docs.travis-ci.com/)
2. Review build logs
3. Test locally với Docker
4. Create issue trên GitHub

---

**Happy Testing! 🚀** 