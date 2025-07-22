# Kích hoạt Travis CI cho Repository

## Bước 1: Đăng nhập Travis CI
1. Truy cập https://travis-ci.com
2. Đăng nhập bằng GitHub account
3. Authorize Travis CI truy cập GitHub repositories

## Bước 2: Kích hoạt Repository
1. Trong Travis CI dashboard, click "Activate a repository"
2. Tìm repository "Library-Management" 
3. Toggle switch để activate
4. Đảm bảo repository hiển thị trong "Active repositories"

## Bước 3: Kiểm tra Settings
1. Vào repository settings trong Travis CI
2. Đảm bảo:
   - Build pushes: ✅ Enabled
   - Build pull requests: ✅ Enabled
   - Limit concurrent jobs: 1-2

## Bước 4: Trigger Build
1. Push một commit mới để trigger build:
```bash
git commit --allow-empty -m "Trigger Travis CI build"
git push origin main
```

## Bước 5: Kiểm tra Build
1. Vào https://travis-ci.com/github/YOUR_USERNAME/Library-Management
2. Xem build status và logs

## Troubleshooting

### Nếu repository không hiển thị:
- Kiểm tra repository visibility (public/private)
- Đảm bảo có file `.travis.yml` trong root
- Sync Travis CI với GitHub

### Nếu build không trigger:
- Kiểm tra branch name (phải là `main` hoặc `develop`)
- Đảm bảo file `.travis.yml` có syntax đúng
- Kiểm tra Travis CI logs

### Nếu build fail:
- Xem logs để debug
- Kiểm tra Java version compatibility
- Đảm bảo Docker services start đúng 