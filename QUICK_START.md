# ⚡ Quick Start - Test Travis CI

## 🎯 Mục tiêu
Test Travis CI pipeline cơ bản trong 5 phút.

## 🚀 5 Bước Nhanh

### 1️⃣ Tạo GitHub Repository
```bash
# Tạo repo trên GitHub.com
# Tên: Library-Management
# Public/Private: Tùy chọn
```

### 2️⃣ Push Code
```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Library-Management.git
git branch -M main
git push -u origin main
```

### 3️⃣ Kích hoạt Travis CI
1. Vào [travis-ci.com](https://travis-ci.com)
2. Sign in với GitHub
3. Toggle ON repository `Library-Management`

### 4️⃣ Test Build
```bash
# Trigger build
echo "Test Travis CI" >> README.md
git add README.md
git commit -m "test: trigger build"
git push
```

### 5️⃣ Check Results
- Vào [Travis CI Dashboard](https://app.travis-ci.com)
- Click repository `Library-Management`
- Xem build status: ✅ Green = Success

## ✅ Expected Output

```
✓ Build completed successfully!
✓ All tests passed
✓ Application built successfully
```

## 🔧 Troubleshooting

### Build Fails?
```bash
# Test locally first
docker-compose -f docker-compose.travis.yml up -d
./gradlew clean build -Dspring.profiles.active=travis
docker-compose -f docker-compose.travis.yml down
```

### Repository not found?
```bash
git remote -v
git remote set-url origin https://github.com/YOUR_USERNAME/Library-Management.git
```

## 📞 Need Help?

1. Check build logs trên Travis CI
2. Test locally với Docker
3. Create issue trên GitHub

---

**That's it! 🎉** 