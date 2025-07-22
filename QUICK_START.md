# ⚡ Quick Start - Test GitHub Actions

## 🎯 Mục tiêu
Test GitHub Actions pipeline cơ bản trong 5 phút.

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

### 3️⃣ Kiểm tra GitHub Actions
1. Vào repository trên GitHub
2. Click tab "Actions"
3. Verify workflow `CI/CD Pipeline` exists

### 4️⃣ Test Build
```bash
# Trigger build
echo "Test GitHub Actions" >> README.md
git add README.md
git commit -m "test: trigger build"
git push
```

### 5️⃣ Check Results
- Vào GitHub repository
- Click tab "Actions"
- Xem workflow status: ✅ Green = Success

## ✅ Expected Output

```
✓ Build completed successfully!
✓ All tests passed
✓ Application built successfully
✓ Test reports generated
```

## 🔧 Troubleshooting

### Build Fails?
```bash
# Test locally first
docker-compose up -d
./gradlew clean build -Dspring.profiles.active=docker
docker-compose down
```

### Repository not found?
```bash
git remote -v
git remote set-url origin https://github.com/YOUR_USERNAME/Library-Management.git
```

### Workflow not triggering?
- Check file `.github/workflows/ci.yml` exists
- Verify branch name is `main`
- Check workflow syntax

## 📞 Need Help?

1. Check workflow logs trên GitHub Actions
2. Test locally với Docker
3. Create issue trên GitHub

## 🎉 Benefits

- **Free:** Không giới hạn build cho public repos
- **Fast:** Runners tối ưu và caching
- **Reliable:** Tích hợp native với GitHub
- **Powerful:** Workflow capabilities nâng cao

---

**That's it! 🎉** 